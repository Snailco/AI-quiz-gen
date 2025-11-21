import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Question, GradingResult, QuizConfig, QuestionType } from "../types";

const MODEL_NAME = 'gemini-flash-lite-latest';

const getGenAI = (apiKey?: string) => {
  const key = apiKey || process.env.API_KEY;
  if (!key) {
    throw new Error("API Key is required. Please enter it in the settings.");
  }
  return new GoogleGenAI({ apiKey: key });
};

export const generateQuiz = async (config: QuizConfig): Promise<Question[]> => {
  const ai = getGenAI(config.apiKey);
  const isMixed = config.type === QuestionType.MIXED;
  
  let typeInstruction = "";
  if (config.type === QuestionType.MULTIPLE_CHOICE) {
    typeInstruction = "All questions must be multiple choice with 4 options.";
  } else if (config.type === QuestionType.OPEN_ENDED) {
    typeInstruction = "All questions must be open-ended textual questions.";
  } else {
    typeInstruction = "Mix multiple choice and open-ended questions evenly.";
  }

  const prompt = `
    Generate a quiz based on the following ${config.mode}:
    "${config.input}"
    
    Configuration:
    - Number of questions: ${config.questionCount}
    - Difficulty: ${config.difficulty}
    - Type: ${typeInstruction}
    
    Return a JSON array of questions.
  `;

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.INTEGER },
        text: { type: Type.STRING, description: "The question text" },
        type: { type: Type.STRING, enum: ["multiple_choice", "open_ended"] },
        options: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "List of options if multiple_choice, empty array if open_ended" 
        }
      },
      required: ["id", "text", "type"],
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are a helpful teacher generating a quiz. Ensure questions are accurate to the provided context or subject."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as Question[];
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
};

export const gradeQuiz = async (
  questions: Question[], 
  answers: Record<number, string>,
  originalContext: string,
  apiKey?: string
): Promise<GradingResult[]> => {
  const ai = getGenAI(apiKey);
  
  const gradingPayload = questions.map(q => ({
    questionId: q.id,
    questionText: q.text,
    userAnswer: answers[q.id] || "(No Answer Provided)",
    type: q.type
  }));

  const prompt = `
    Grade the following quiz answers based on this context/subject: "${originalContext}".
    
    Quiz Data:
    ${JSON.stringify(gradingPayload, null, 2)}
    
    For each question, provide:
    - score (0-100 integer)
    - feedback (explain why it is right or wrong, keep it concise)
    - correct_answer (the ideal answer or the correct option)
  `;

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        questionId: { type: Type.INTEGER },
        score: { type: Type.INTEGER },
        feedback: { type: Type.STRING },
        correctAnswer: { type: Type.STRING }
      },
      required: ["questionId", "score", "feedback", "correctAnswer"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME, // Using Flash Lite for grading as well for speed
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are a strict but fair grader. Provide constructive feedback."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No grading response from AI");

    return JSON.parse(text) as GradingResult[];
  } catch (error) {
    console.error("Error grading quiz:", error);
    throw error;
  }
};