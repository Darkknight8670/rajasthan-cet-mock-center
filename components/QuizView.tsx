
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TestMetadata, Question, UserResponse, TestResult } from '../types';
import { generateQuestions, MARKS_PER_CORRECT, NEGATIVE_MARKING } from '../constants';
import { fetchQuestionsFromCSV } from '../services/api';
import AdInterstitial from './AdInterstitial';

interface QuizViewProps {
  test: TestMetadata;
  onFinish: (result: TestResult) => void;
  onExit: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ test, onFinish, onExit }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [timeLeft, setTimeLeft] = useState(test.durationMinutes * 60);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showStartAd, setShowStartAd] = useState(true);

  // Use refs for values needed in the final calculation to avoid dependency cycles in the timer
  const responsesRef = useRef(responses);
  const questionsRef = useRef<Question[]>([]);
  const timeLeftRef = useRef(timeLeft);

  useEffect(() => {
    async function loadQuestions() {
      setIsLoading(true);
      let loaded: Question[] = [];
      
      if (test.csvUrl) {
        loaded = await fetchQuestionsFromCSV(test.csvUrl);
      }
      
      // Fallback if URL fails or isn't provided (for demo)
      if (loaded.length === 0) {
        loaded = generateQuestions(test.questionCount || 20);
      }
      
      setQuestions(loaded);
      questionsRef.current = loaded;
      const initialResponses = loaded.map(q => ({ 
        questionId: q.id, 
        selectedOption: null, 
        isMarkedForReview: false 
      }));
      setResponses(initialResponses);
      responsesRef.current = initialResponses;
      setIsLoading(false);
    }
    loadQuestions();
  }, [test]);

  useEffect(() => {
    responsesRef.current = responses;
  }, [responses]);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  const calculateResult = useCallback((): TestResult => {
    let attempted = 0;
    let correct = 0;
    let wrong = 0;

    const currentResponses = responsesRef.current;
    const currentQuestions = questionsRef.current;

    currentResponses.forEach((resp, idx) => {
      const q = currentQuestions[idx];
      if (resp.selectedOption !== null) {
        attempted++;
        if (resp.selectedOption === q.correctAnswer) {
          correct++;
        } else {
          wrong++;
        }
      }
    });

    const score = (correct * MARKS_PER_CORRECT) + (wrong * NEGATIVE_MARKING);
    const accuracy = attempted > 0 ? (correct / attempted) * 100 : 0;
    const timeSpent = (test.durationMinutes * 60) - timeLeftRef.current;

    return {
      totalQuestions: currentQuestions.length,
      attempted,
      correct,
      wrong,
      score,
      accuracy,
      timeSpent,
      responses: currentResponses,
      questions: currentQuestions
    };
  }, [test.durationMinutes]);

  const handleSubmit = useCallback(() => {
    const result = calculateResult();
    onFinish(result);
  }, [calculateResult, onFinish]);

  useEffect(() => {
    if (isLoading || showStartAd) return;
    
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, handleSubmit, isLoading, showStartAd]);

  if (showStartAd) {
    return <AdInterstitial onClose={() => setShowStartAd(false)} />;
  }

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-bold text-slate-800">Downloading Test Content</h2>
        <p className="text-slate-500">Connecting to secure question bank...</p>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentIndex];
  const currentResponse = responses[currentIndex];

  const handleOptionSelect = (option: 'A' | 'B' | 'C' | 'D') => {
    setResponses(prev => prev.map((resp, idx) => 
      idx === currentIndex ? { ...resp, selectedOption: option } : resp
    ));
  };

  const handleClearSelection = () => {
    setResponses(prev => prev.map((resp, idx) => 
      idx === currentIndex ? { ...resp, selectedOption: null } : resp
    ));
  };

  const toggleReview = () => {
    setResponses(prev => prev.map((resp, idx) => 
      idx === currentIndex ? { ...resp, isMarkedForReview: !resp.isMarkedForReview } : resp
    ));
  };

  const goToNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const goToPrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      {/* Quiz Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowExitConfirm(true)}
            className="text-slate-500 hover:text-slate-800"
          >
            <i className="fa-solid fa-arrow-left text-lg"></i>
          </button>
          <div>
            <h1 className="font-bold text-slate-800 leading-tight truncate max-w-[120px] md:max-w-none">
              {test.title}
            </h1>
            <p className="text-[10px] md:text-xs text-slate-500">Subject: {currentQuestion?.subject || 'GK'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-sm md:text-lg font-bold ${
            timeLeft < 300 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-700'
          }`}>
            <i className="fa-regular fa-clock text-xs"></i>
            {formatTime(timeLeft)}
          </div>
          <button 
            onClick={() => setShowSubmitConfirm(true)}
            className="bg-green-600 text-white px-3 md:px-5 py-2 rounded-lg text-xs md:text-sm font-bold hover:bg-green-700 transition"
          >
            Submit
          </button>
        </div>
      </header>

      <div className="flex-grow flex overflow-hidden">
        {/* Main Question Area */}
        <div className="flex-grow flex flex-col overflow-auto p-4 md:p-8">
          <div className="max-w-3xl mx-auto w-full">
            <div className="flex items-center justify-between mb-6">
              <span className="text-slate-500 text-xs md:text-sm font-bold">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-blue-600 text-[10px] md:text-xs bg-blue-50 px-2 py-1 rounded font-bold">
                +{MARKS_PER_CORRECT} / {NEGATIVE_MARKING}
              </span>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 min-h-[400px] flex flex-col">
              <h2 className="text-lg md:text-xl font-medium text-slate-800 mb-8 leading-relaxed">
                {currentQuestion?.text}
              </h2>

              <div className="space-y-4">
                {(Object.keys(currentQuestion?.options || {}) as Array<'A' | 'B' | 'C' | 'D'>).map((key) => (
                  <button
                    key={key}
                    onClick={() => handleOptionSelect(key)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition flex items-center gap-4 ${
                      currentResponse?.selectedOption === key
                        ? 'border-orange-500 bg-orange-50 text-orange-900 shadow-sm'
                        : 'border-slate-100 bg-slate-50 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      currentResponse?.selectedOption === key ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {key}
                    </span>
                    <span className="flex-grow">{currentQuestion.options[key]}</span>
                  </button>
                ))}
              </div>

              <div className="mt-auto pt-8 flex items-center justify-between gap-4">
                <button 
                  onClick={handleClearSelection}
                  className="text-slate-400 text-xs font-bold hover:text-slate-600 uppercase tracking-tighter"
                >
                  Clear Selection
                </button>
                <button 
                  onClick={toggleReview}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    currentResponse?.isMarkedForReview 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  <i className="fa-regular fa-bookmark"></i>
                  {currentResponse?.isMarkedForReview ? 'Marked' : 'Mark Review'}
                </button>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <button
                onClick={goToPrev}
                disabled={currentIndex === 0}
                className="flex-1 bg-white border border-slate-200 py-3 rounded-xl font-bold text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition"
              >
                Previous
              </button>
              <button
                onClick={goToNext}
                disabled={currentIndex === questions.length - 1}
                className="flex-1 bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 disabled:opacity-50 transition"
              >
                {currentIndex === questions.length - 1 ? 'End Test' : 'Next'}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Question Palette - Scrollable on Mobile/Small layout */}
        <aside className="hidden md:flex w-72 bg-white border-l border-slate-200 flex-col shrink-0">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm mb-4">Question Grid</h3>
            <div className="grid grid-cols-4 gap-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {responses.map((resp, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-full aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition ${
                    currentIndex === i ? 'ring-2 ring-orange-500 ring-offset-2' : ''
                  } ${
                    resp.isMarkedForReview 
                      ? 'bg-purple-600 text-white' 
                      : resp.selectedOption 
                        ? 'bg-green-600 text-white' 
                        : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-4 space-y-3 bg-slate-50 mt-auto border-t border-slate-200">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
              <span className="w-3 h-3 rounded-sm bg-green-600"></span> Answered
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
              <span className="w-3 h-3 rounded-sm bg-purple-600"></span> Marked
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
              <span className="w-3 h-3 rounded-sm bg-slate-100 border border-slate-200"></span> Not Visited
            </div>
          </div>
        </aside>
      </div>

      {/* Exit Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Abandon Test?</h3>
            <p className="text-slate-600 mb-6 text-sm">You haven't submitted your responses. Are you sure you want to exit now?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowExitConfirm(false)} className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-slate-600">Back</button>
              <button onClick={onExit} className="flex-1 py-3 rounded-xl bg-red-600 font-bold text-white">Exit</button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              <i className="fa-solid fa-flag-checkered"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to Submit?</h3>
            <p className="text-slate-600 mb-6 text-sm">
              Answers Attempted: <b>{responses.filter(r => r.selectedOption !== null).length}</b><br/>
              Questions Skipped: <b>{questions.length - responses.filter(r => r.selectedOption !== null).length}</b>
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowSubmitConfirm(false)} className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-slate-600">Review</button>
              <button onClick={() => { setShowSubmitConfirm(false); handleSubmit(); }} className="flex-1 py-3 rounded-xl bg-green-600 font-bold text-white shadow-lg shadow-green-100">Submit Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizView;
