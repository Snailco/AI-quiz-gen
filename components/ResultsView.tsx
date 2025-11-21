import React from 'react';
import { GradingResult, Question } from '../types';
import { AlertCircle, CheckCircle2, XCircle, RefreshCcw } from 'lucide-react';

interface ResultsViewProps {
  results: GradingResult[];
  questions: Question[];
  onReset: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ results, questions, onReset }) => {
  const totalScore = Math.round(results.reduce((acc, curr) => acc + curr.score, 0) / results.length);
  
  let gradeColor = 'text-red-500';
  if (totalScore >= 80) gradeColor = 'text-green-500';
  else if (totalScore >= 60) gradeColor = 'text-yellow-500';

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Header Score Card */}
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-gray-500 font-medium uppercase tracking-wider text-sm mb-2">Final Score</h2>
          <div className={`text-7xl font-black mb-4 ${gradeColor}`}>
            {totalScore}<span className="text-3xl opacity-50">%</span>
          </div>
          <p className="text-gray-600 max-w-md mx-auto">
            {totalScore >= 80 ? "Outstanding work! You've mastered this topic." :
             totalScore >= 60 ? "Good effort. Review the feedback below to improve." :
             "Keep studying. Use the feedback to guide your learning."}
          </p>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-grid-pattern"></div>
      </div>

      {/* Detailed Breakdown */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-800 px-2">Detailed Analysis</h3>
        
        {results.map((result, index) => {
          const question = questions.find(q => q.id === result.questionId);
          if (!question) return null;

          const isPerfect = result.score === 100;
          const isGood = result.score >= 60;

          return (
            <div key={result.questionId} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
              <div className={`h-1.5 w-full ${isPerfect ? 'bg-green-500' : isGood ? 'bg-yellow-400' : 'bg-red-500'}`}></div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h4 className="text-lg font-semibold text-gray-800">{index + 1}. {question.text}</h4>
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
                    isPerfect ? 'bg-green-100 text-green-700' : 
                    isGood ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    {isPerfect ? <CheckCircle2 className="w-4 h-4" /> : isGood ? <AlertCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {result.score}/100
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">AI Feedback</span>
                    <p className="text-gray-700 leading-relaxed">{result.feedback}</p>
                  </div>

                  {!isPerfect && (
                    <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">Correct Answer</span>
                      <p className="text-indigo-900 font-medium">{result.correctAnswer}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={onReset}
          className="px-8 py-3 bg-gray-900 text-white rounded-lg font-bold shadow-lg hover:bg-black transition-all flex items-center gap-2"
        >
          <RefreshCcw className="w-5 h-5" />
          Create New Quiz
        </button>
      </div>
    </div>
  );
};
