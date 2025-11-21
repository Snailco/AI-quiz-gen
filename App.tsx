import React, { useState, useCallback } from 'react';
import { SetupForm } from './components/SetupForm';
import { QuizRunner } from './components/QuizRunner';
import { ResultsView } from './components/ResultsView';
import { generateQuiz, gradeQuiz } from './services/geminiService';
import { QuizConfig, QuizState } from './types';
import { BrainCircuit } from 'lucide-react';

const INITIAL_STATE: QuizState = {
  questions: [],
  answers: {},
  results: null,
  currentQuestionIndex: 0,
  isGenerating: false,
  isGrading: false,
  error: null
};

export default function App() {
  const [state, setState] = useState<QuizState>(INITIAL_STATE);
  const [config, setConfig] = useState<QuizConfig | null>(null);

  const handleStartQuiz = useCallback(async (newConfig: QuizConfig) => {
    setConfig(newConfig);
    setState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      const questions = await generateQuiz(newConfig);
      setState(prev => ({
        ...prev,
        questions,
        isGenerating: false,
        currentQuestionIndex: 0,
        answers: {},
        results: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: error instanceof Error ? error.message : "Failed to generate quiz. Please check your API key or connection."
      }));
    }
  }, []);

  const handleAnswerChange = useCallback((answer: string) => {
    setState(prev => {
      const questionId = prev.questions[prev.currentQuestionIndex].id;
      return {
        ...prev,
        answers: { ...prev.answers, [questionId]: answer }
      };
    });
  }, []);

  const handleSubmitQuiz = useCallback(async () => {
    if (!config) return;
    
    setState(prev => ({ ...prev, isGrading: true, error: null }));
    
    try {
      const results = await gradeQuiz(state.questions, state.answers, config.input, config.apiKey);
      setState(prev => ({
        ...prev,
        isGrading: false,
        results
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isGrading: false,
        error: error instanceof Error ? error.message : "Failed to grade quiz. Please try submitting again."
      }));
    }
  }, [config, state.questions, state.answers]);

  const handleReset = () => {
    setState(INITIAL_STATE);
    setConfig(null);
  };

  // --- Render Logic ---

  // 1. Setup Screen
  if (state.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600 text-white mb-4 shadow-lg">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">QuizGen AI</h1>
          <p className="mt-2 text-lg text-gray-600">Powered by Gemini 2.5 Flash Lite</p>
        </div>

        <SetupForm onStart={handleStartQuiz} isLoading={state.isGenerating} />
        
        {state.error && (
          <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 max-w-2xl w-full rounded shadow-sm">
            <p className="font-bold">Error</p>
            <p>{state.error}</p>
          </div>
        )}
      </div>
    );
  }

  // 2. Loading / Grading Screen
  if (state.isGrading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Grading Your Answers</h2>
          <p className="text-gray-500">The AI is analyzing your responses and preparing feedback...</p>
        </div>
      </div>
    );
  }

  // 3. Results Screen
  if (state.results) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6">
        <ResultsView 
          results={state.results} 
          questions={state.questions} 
          onReset={handleReset} 
        />
      </div>
    );
  }

  // 4. Quiz Runner Screen
  const currentQuestion = state.questions[state.currentQuestionIndex];
  const currentAnswer = state.answers[currentQuestion.id] || '';
  const isLast = state.currentQuestionIndex === state.questions.length - 1;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 flex flex-col items-center">
      <div className="w-full max-w-3xl flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-gray-500 hover:text-gray-700 cursor-pointer transition-colors" onClick={handleReset}>
           <span className="text-sm font-medium">← Quit Quiz</span>
        </div>
        <div className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          {config?.mode === 'context' ? 'Context Mode' : config?.input}
        </div>
      </div>

      <QuizRunner
        question={currentQuestion}
        currentAnswer={currentAnswer}
        index={state.currentQuestionIndex}
        total={state.questions.length}
        onAnswerChange={handleAnswerChange}
        onNext={() => setState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 }))}
        onPrevious={() => setState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex - 1 }))}
        onSubmit={handleSubmitQuiz}
        isLast={isLast}
      />
    </div>
  );
}