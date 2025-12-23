
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import QuizView from './components/QuizView';
import ResultView from './components/ResultView';
import AdInterstitial from './components/AdInterstitial';
import { TestMetadata, AppState, TestResult } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.DASHBOARD);
  const [activeTest, setActiveTest] = useState<TestMetadata | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [showResultAd, setShowResultAd] = useState(false);

  const handleStartTest = (test: TestMetadata) => {
    setActiveTest(test);
    setAppState(AppState.QUIZ);
  };

  const handleFinishTest = (result: TestResult) => {
    setTestResult(result);
    // Show an ad before moving to the result screen
    setShowResultAd(true);
  };

  const handleReturnToDashboard = () => {
    setActiveTest(null);
    setTestResult(null);
    setAppState(AppState.DASHBOARD);
  };

  if (showResultAd) {
    return <AdInterstitial onClose={() => {
      setShowResultAd(false);
      setAppState(AppState.RESULT);
    }} />;
  }

  const renderContent = () => {
    switch (appState) {
      case AppState.DASHBOARD:
        return (
          <Layout>
            <Dashboard onStartTest={handleStartTest} />
          </Layout>
        );
      case AppState.QUIZ:
        return activeTest ? (
          <QuizView 
            test={activeTest} 
            onFinish={handleFinishTest} 
            onExit={handleReturnToDashboard}
          />
        ) : null;
      case AppState.RESULT:
        return testResult ? (
          <Layout showNav={true}>
            <ResultView 
              result={testResult} 
              onHome={handleReturnToDashboard} 
            />
          </Layout>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="antialiased text-slate-900">
      {renderContent()}
    </div>
  );
};

export default App;
