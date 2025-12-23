
import React, { useState } from 'react';
import { TestResult } from '../types';
import { MARKS_PER_CORRECT, NEGATIVE_MARKING } from '../constants';

interface ResultViewProps {
  result: TestResult;
  onHome: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ result, onHome }) => {
  const [activeTab, setActiveTab] = useState<'scorecard' | 'review'>('scorecard');

  const getScoreColor = (score: number) => {
    const totalPotential = result.totalQuestions * MARKS_PER_CORRECT;
    const percentage = (score / totalPotential) * 100;
    if (percentage >= 75) return 'text-green-600';
    if (percentage >= 50) return 'text-blue-600';
    if (percentage >= 33) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border border-slate-200">
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-8 text-center text-white">
            <h2 className="text-3xl font-extrabold mb-1">Performance Report</h2>
            <p className="opacity-90 font-medium">Test Completed Successfully</p>
          </div>

          <div className="flex border-b border-slate-100">
            <button 
              onClick={() => setActiveTab('scorecard')}
              className={`flex-1 py-4 font-bold text-sm uppercase tracking-wider transition ${
                activeTab === 'scorecard' ? 'text-orange-600 border-b-4 border-orange-600' : 'text-slate-400'
              }`}
            >
              Scorecard
            </button>
            <button 
              onClick={() => setActiveTab('review')}
              className={`flex-1 py-4 font-bold text-sm uppercase tracking-wider transition ${
                activeTab === 'review' ? 'text-orange-600 border-b-4 border-orange-600' : 'text-slate-400'
              }`}
            >
              Question Review
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'scorecard' ? (
              <div className="space-y-10">
                {/* Score Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-slate-50 rounded-2xl">
                    <p className="text-slate-500 text-sm font-bold uppercase mb-1">Final Score</p>
                    <p className={`text-4xl font-black ${getScoreColor(result.score)}`}>
                      {result.score.toFixed(2)}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Out of {result.totalQuestions * MARKS_PER_CORRECT}</p>
                  </div>
                  <div className="text-center p-6 bg-slate-50 rounded-2xl">
                    <p className="text-slate-500 text-sm font-bold uppercase mb-1">Accuracy</p>
                    <p className="text-4xl font-black text-blue-600">
                      {result.accuracy.toFixed(1)}%
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Attempted: {result.attempted}</p>
                  </div>
                  <div className="text-center p-6 bg-slate-50 rounded-2xl">
                    <p className="text-slate-500 text-sm font-bold uppercase mb-1">Time Spent</p>
                    <p className="text-4xl font-black text-slate-700">
                      {Math.floor(result.timeSpent / 60)}m
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{result.timeSpent % 60} seconds</p>
                  </div>
                </div>

                {/* Detailed Stats */}
                <div className="bg-slate-50 rounded-2xl p-6">
                  <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <i className="fa-solid fa-chart-simple text-orange-600"></i>
                    Response Analysis
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                      <div className="text-2xl font-bold text-green-600">{result.correct}</div>
                      <div className="text-xs font-bold text-slate-400 uppercase">Correct</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                      <div className="text-2xl font-bold text-red-500">{result.wrong}</div>
                      <div className="text-xs font-bold text-slate-400 uppercase">Wrong</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                      <div className="text-2xl font-bold text-slate-400">{result.totalQuestions - result.attempted}</div>
                      <div className="text-xs font-bold text-slate-400 uppercase">Skipped</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                      <div className="text-2xl font-bold text-orange-600">{result.totalQuestions}</div>
                      <div className="text-xs font-bold text-slate-400 uppercase">Total</div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <button 
                    onClick={onHome}
                    className="bg-orange-600 text-white px-10 py-3 rounded-full font-bold shadow-lg hover:shadow-orange-200 hover:-translate-y-1 transition"
                  >
                    Go Back to Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {result.questions.map((q, idx) => {
                  const userResp = result.responses[idx];
                  const isCorrect = userResp.selectedOption === q.correctAnswer;
                  const isUnattempted = userResp.selectedOption === null;

                  return (
                    <div key={q.id} className="border border-slate-200 rounded-xl overflow-hidden">
                      <div className={`p-4 flex gap-4 ${
                        isUnattempted ? 'bg-slate-50' : isCorrect ? 'bg-green-50' : 'bg-red-50'
                      }`}>
                        <span className="shrink-0 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-500">
                          Q{idx + 1}
                        </span>
                        <div className="flex-grow">
                          <p className="text-slate-800 font-medium mb-4">{q.text}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {(Object.keys(q.options) as Array<'A' | 'B' | 'C' | 'D'>).map(key => (
                              <div key={key} className={`text-sm p-2 rounded-lg flex items-center gap-2 border ${
                                key === q.correctAnswer 
                                  ? 'bg-green-600 text-white border-green-600' 
                                  : userResp.selectedOption === key 
                                    ? 'bg-red-500 text-white border-red-500' 
                                    : 'bg-white text-slate-600 border-slate-200'
                              }`}>
                                <span className="font-bold opacity-60">{key}.</span>
                                <span>{q.options[key]}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-4 flex items-center justify-between">
                            <div className="text-xs">
                              {isUnattempted ? (
                                <span className="text-slate-500 italic">Not Attempted</span>
                              ) : (
                                <span className={isCorrect ? 'text-green-700 font-bold' : 'text-red-700 font-bold'}>
                                  {isCorrect ? 'Correct Answer' : 'Incorrect Answer'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultView;
