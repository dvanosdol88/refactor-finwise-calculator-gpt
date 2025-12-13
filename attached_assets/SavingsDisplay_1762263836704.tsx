
import React, { useState, useEffect } from 'react';

interface SavingsDisplayProps {
  firstYearSavings: number;
  annualFeeDollars: number;
  totalSavings: number;
  years: number;
}

const surveyOptions = [
    { id: 'cruise', label: 'Take my extended family on a luxurious cruise' },
    { id: 'charity', label: 'Donate to my favorite charity' },
    { id: 'advisor', label: 'Give it to my Financial Advisor' },
    { id: 'home', label: 'Make home improvements' },
    { id: 'retire', label: 'Retire earlier' },
    { id: 'other', label: 'Other' },
];

const STORAGE_KEY = 'savingsSurveyResults';

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

const SavingsDisplay: React.FC<SavingsDisplayProps> = ({ firstYearSavings, annualFeeDollars, totalSavings, years }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [surveyResults, setSurveyResults] = useState<{[key: string]: number}>({});
  const [hasVoted, setHasVoted] = useState(false);
  const [viewIndex, setViewIndex] = useState(0);

  const views = [
    {
      left: { title: 'Current Annual Fee', value: annualFeeDollars, isSavings: false },
      right: { title: 'First Year Savings', value: firstYearSavings, isSavings: true },
    },
    {
      left: { title: 'First Year Savings', value: firstYearSavings, isSavings: true },
      right: { title: `Total Savings over ${years} Years`, value: totalSavings, isSavings: true },
    },
  ];
  
  const totalViews = views.length;
  const currentView = views[viewIndex];


  useEffect(() => {
    try {
      const savedResults = localStorage.getItem(STORAGE_KEY);
      const initialResults = surveyOptions.reduce((acc, option) => ({...acc, [option.id]: 0}), {});
      
      if (savedResults) {
        setSurveyResults({ ...initialResults, ...JSON.parse(savedResults) });
      } else {
        setSurveyResults(initialResults);
      }
    } catch (error) {
      console.error("Failed to parse survey results from localStorage", error);
      const initialResults = surveyOptions.reduce((acc, option) => ({...acc, [option.id]: 0}), {});
      setSurveyResults(initialResults);
    }
  }, []);

  const handleVote = (optionId: string) => {
    if (hasVoted) return;

    setHasVoted(true);

    const newResults = {
      ...surveyResults,
      [optionId]: (surveyResults[optionId] || 0) + 1,
    };
    
    setSurveyResults(newResults);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newResults));
    } catch (error) {
      console.error("Failed to save survey results to localStorage", error);
    }
  };

  const totalVotes = Object.values(surveyResults).reduce((sum, count) => sum + count, 0);

  const handleNext = () => {
    setViewIndex((prevIndex) => (prevIndex + 1) % totalViews);
  };

  const handlePrev = () => {
    setViewIndex((prevIndex) => (prevIndex - 1 + totalViews) % totalViews);
  };

  return (
    <div className="relative max-w-4xl mx-auto px-12">
      <button 
        onClick={handlePrev} 
        aria-label="Previous stat"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 text-blue-500 hover:text-blue-700 transition-colors opacity-60 hover:opacity-100 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="flex items-center justify-center gap-8 flex-wrap">
        <div key={`left-${viewIndex}`} className="bg-white border border-gray-200 p-6 rounded-2xl shadow-lg text-center flex-1 min-w-[280px] animate-fadeIn">
            <h4 className="text-sm font-medium text-gray-500">{currentView.left.title}</h4>
            <p className={`text-3xl font-bold mt-1 ${currentView.left.isSavings ? 'text-[var(--brand-primary)]' : 'text-gray-900'}`}>{formatCurrency(currentView.left.value)}</p>
        </div>

        <div 
          className="relative"
          onMouseEnter={() => setShowPopup(true)}
          onMouseLeave={() => setShowPopup(false)}
        >
          <div className="bg-indigo-100 border border-indigo-200 rounded-2xl w-14 h-14 flex items-center justify-center cursor-pointer animate-pulse-slow transform -rotate-12 shadow-lg">
            <span className="text-indigo-600 text-4xl font-extrabold">?</span>
          </div>
          {showPopup && (
            <div className="absolute top-full mt-3 w-80 -translate-x-1/2 left-1/2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-10 animate-fadeIn">
              <button onClick={() => setShowPopup(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
              </button>
              <p className="font-semibold text-gray-800 mb-3">With these savings, I would...</p>
              <div className="space-y-3">
                {surveyOptions.map(option => {
                  const votes = surveyResults[option.id] || 0;
                  const percentage = totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(0) : 0;
                  
                  return (
                    <div key={option.id} className="flex items-center">
                      <input
                        id={option.id}
                        name="savings-choice"
                        type="radio"
                        className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300"
                        onChange={() => handleVote(option.id)}
                        disabled={hasVoted}
                      />
                      <label htmlFor={option.id} className="ml-3 block text-sm font-medium text-gray-700 select-none">
                        {option.label}
                        <span className="ml-2 font-semibold text-gray-500">({percentage}%)</span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div key={`right-${viewIndex}`} className="bg-white border border-gray-200 p-6 rounded-2xl shadow-lg text-center flex-1 min-w-[280px] animate-fadeIn">
            <h4 className="text-sm font-medium text-gray-500">{currentView.right.title}</h4>
            <p className={`text-3xl font-bold mt-1 ${currentView.right.isSavings ? 'text-[var(--brand-primary)]' : 'text-gray-900'}`}>{formatCurrency(currentView.right.value)}</p>
        </div>
      </div>

      <button 
        onClick={handleNext} 
        aria-label="Next stat"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 text-blue-500 hover:text-blue-700 transition-colors opacity-60 hover:opacity-100 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default SavingsDisplay;
