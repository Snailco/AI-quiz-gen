import React, { useState, useEffect } from 'react';
import { QuizConfig, Difficulty, QuestionType } from '../types';
import { BookOpen, Type, Sliders, FileText, Layers, List, Hash, Key } from 'lucide-react';

interface SetupFormProps {
  onStart: (config: QuizConfig) => void;
  isLoading: boolean;
}

export const SetupForm: React.FC<SetupFormProps> = ({ onStart, isLoading }) => {
  const [mode, setMode] = useState<'subject' | 'context'>('subject');
  const [input, setInput] = useState('');
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [type, setType] = useState<QuestionType>(QuestionType.MIXED);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const cleanedKey = apiKey.trim();
    if (cleanedKey) {
      localStorage.setItem('gemini_api_key', cleanedKey);
    }

    onStart({ 
      mode, 
      input, 
      questionCount: count, 
      difficulty, 
      type,
      apiKey: cleanedKey
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-indigo-600 p-6 text-white">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          New Quiz Setup
        </h1>
        <p className="text-indigo-100 mt-1 opacity-90">Generate a custom quiz using Gemini AI</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        
        {/* API Key Section */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
            <Key className="w-4 h-4" /> Gemini API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Gemini API Key"
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-gray-50"
          />
          <p className="text-xs text-gray-400">
            Your key is stored locally in your browser. Need a key? Get one at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">Google AI Studio</a>.
          </p>
        </div>

        {/* Mode Selection */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4" /> Source Material
          </label>
          <div className="flex p-1 bg-gray-100 rounded-lg">
            <button
              type="button"
              onClick={() => setMode('subject')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                mode === 'subject' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Subject Topic
            </button>
            <button
              type="button"
              onClick={() => setMode('context')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                mode === 'context' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Paste Text Context
            </button>
          </div>
        </div>

        {/* Input Area */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
            {mode === 'subject' ? <Type className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            {mode === 'subject' ? 'Enter Subject' : 'Paste Context'}
          </label>
          {mode === 'subject' ? (
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., Photosynthesis, The History of Rome, Python Programming"
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-gray-50"
              required
            />
          ) : (
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste article, documentation, or study notes here..."
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-gray-50 h-40 resize-none"
              required
            />
          )}
        </div>

        {/* Configuration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Question Count */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <Hash className="w-4 h-4" /> Count
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="20"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="font-bold text-indigo-600 w-8 text-center">{count}</span>
            </div>
          </div>

          {/* Difficulty */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4" /> Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 outline-none focus:border-indigo-500"
            >
              <option value={Difficulty.EASY}>Easy</option>
              <option value={Difficulty.MEDIUM}>Medium</option>
              <option value={Difficulty.HARD}>Hard</option>
            </select>
          </div>

          {/* Type */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <List className="w-4 h-4" /> Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as QuestionType)}
              className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 outline-none focus:border-indigo-500"
            >
              <option value={QuestionType.MIXED}>Mixed</option>
              <option value={QuestionType.MULTIPLE_CHOICE}>Multiple Choice</option>
              <option value={QuestionType.OPEN_ENDED}>Open Ended</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transform transition-all duration-200 flex justify-center items-center gap-2 ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed opacity-70'
              : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1 text-white shadow-indigo-200'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Quiz...
            </>
          ) : (
            'Generate Quiz'
          )}
        </button>
      </form>
    </div>
  );
};