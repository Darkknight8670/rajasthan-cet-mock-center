
import React, { useState, useEffect } from 'react';
import { TestMetadata } from '../types';
import { CATEGORIES, MOCK_TESTS } from '../constants';
import TestCard from './TestCard';
import { fetchMasterIndex } from '../services/api';

// Replace this with your actual Google Sheet "Publish to Web" CSV Link
const MASTER_INDEX_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-PLACEHOLDER/pub?output=csv';

interface DashboardProps {
  onStartTest: (test: TestMetadata) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStartTest }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [tests, setTests] = useState<TestMetadata[]>(MOCK_TESTS); // Default to mock, then update
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // In a real app, we would fetch the master index here:
    // async function loadData() {
    //   setIsLoading(true);
    //   const liveTests = await fetchMasterIndex(MASTER_INDEX_CSV);
    //   if (liveTests.length > 0) setTests(liveTests);
    //   setIsLoading(false);
    // }
    // loadData();
  }, []);
  
  const filteredTests = activeCategory === 'All' 
    ? tests 
    : tests.filter(t => t.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-10 text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-end gap-4 justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">Welcome, Aspirant!</h2>
            <p className="text-slate-600 mt-2 text-lg">Daily Mock Tests for Rajasthan CET 2024.</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full self-center md:self-auto">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Live Updates Enabled
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <i className="fa-solid fa-filter text-orange-600"></i>
              Filter Subjects
            </h4>
            <div className="flex flex-wrap md:flex-col gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-left px-3 py-2 rounded-lg text-sm transition ${
                    activeCategory === cat 
                      ? 'bg-orange-50 text-orange-700 font-bold border-l-4 border-orange-600' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-blue-600 text-white p-5 rounded-xl shadow-lg hidden md:block">
            <h4 className="font-bold mb-2">Success Tip</h4>
            <p className="text-blue-100 text-sm">
              Practice 1 full mock test every day to improve your speed and accuracy.
            </p>
          </div>
        </div>

        <div className="md:col-span-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
              <p className="text-slate-500 font-medium">Fetching latest tests...</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">Mock Test Center</h3>
                <span className="text-sm text-slate-500">{filteredTests.length} Tests</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredTests.map(test => (
                  <TestCard key={test.id} test={test} onStart={onStartTest} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="mt-12 w-full bg-slate-100 border border-slate-200 h-24 rounded-lg flex flex-col items-center justify-center text-slate-400 font-bold relative overflow-hidden">
        <span className="text-[10px] absolute top-2 right-2 border border-slate-300 px-1 rounded">AD</span>
        <span className="text-xs tracking-widest uppercase">AdMob Banner Space</span>
      </div>
    </div>
  );
};

export default Dashboard;
