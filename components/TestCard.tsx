
import React from 'react';
import { TestMetadata } from '../types';

interface TestCardProps {
  test: TestMetadata;
  onStart: (test: TestMetadata) => void;
}

const TestCard: React.FC<TestCardProps> = ({ test, onStart }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded">
            {test.category}
          </span>
          <div className="text-slate-400 text-sm flex items-center gap-1">
            <i className="fa-regular fa-clock"></i>
            {test.durationMinutes}m
          </div>
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-orange-600 transition-colors">
          {test.title}
        </h3>
        <p className="text-slate-500 text-sm mb-4">
          Contains {test.questionCount} high-quality MCQs based on latest exam pattern.
        </p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <i className="fa-solid fa-circle-check text-green-500"></i>
            Negative Marking (0.33)
          </div>
          <button 
            onClick={() => onStart(test)}
            className="bg-orange-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-orange-700 transition transform active:scale-95"
          >
            Start Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestCard;
