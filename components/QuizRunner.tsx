import React from 'react';
import { Question } from '../types';
import { CheckCircle, ArrowRight, Check } from 'lucide-react';

interface QuizRunnerProps {
  question: Question;
  currentAnswer: string;
  index: number;
  total: number;
  onAnswerChange: (val: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  isLast: boolean;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({
  question,
  currentAnswer,
  index,
  total,
  onAnswerChange,
  onNext,
  onPrevious,
  onSubmit,
  isLast
}) => {
  const progress = ((index + 1) / total) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col min-h-[500px]">
      
      {/* Progress Header */}
      <div className="bg-gray-50 px-8 py-6 border-b border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Question {index + 1} of {total}</span>
          <span className="text-xs font-medium text-gray-400">{Math.round(progress)}% Completed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 p-8 md:p-12 overflow-y-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 leading-tight">
          {question.text}
        </h2>

        <div className="space-y-4">
          {question.type === 'multiple_choice' && question.options ? (
            <div className="grid grid-cols-1 gap-4">
              {question.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => onAnswerChange(option)}
                  className={`relative w-full p-5 text-left rounded-xl border-2 transition-all duration-200 group ${
                    currentAnswer === option 
                      ? 'border-indigo-600 bg-indigo-50 shadow-md' 
                      : 'border-gray-100 hover:border-indigo-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                      currentAnswer === option ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-300 text-gray-400'
                    }`}>
                      {currentAnswer === option ? <Check className="w-4 h-4" /> : <span className="text-sm font-bold">{String.fromCharCode(65 + i)}</span>}
                    </div>
                    <span className={`text-lg ${currentAnswer === option ? 'font-medium text-indigo-900' : 'text-gray-600'}`}>
                      {option}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <textarea
              value={currentAnswer}
              onChange={(e) => onAnswerChange(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full h-64 p-6 text-lg border-2 border-gray-100 rounded-xl focus:border-indigo-500 focus:ring-0 resize-none bg-gray-50 transition-all placeholder-gray-400 text-gray-800"
            />
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="bg-white p-6 border-t border-gray-100 flex justify-between items-center">
        <button
          onClick={onPrevious}
          disabled={index === 0}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Previous
        </button>

        {isLast ? (
          <button
            onClick={onSubmit}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-lg shadow-green-200 transition-all hover:-translate-y-0.5 flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Submit & Grade
          </button>
        ) : (
          <button
            onClick={onNext}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 flex items-center gap-2"
          >
            Next Question
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
