
import React, { useState, useMemo } from 'react';
import CalculatorControls from './components/CalculatorControls';
import SavingsDisplay from './components/SavingsDisplay';
import SavingsChart from './components/SavingsChart';
import { ChartDataPoint } from './types';

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

const App: React.FC = () => {
  const [portfolioValue, setPortfolioValue] = useState<number>(1000000);
  const [annualFeePercent, setAnnualFeePercent] = useState<number>(1.0);
  const [years, setYears] = useState<number>(3);
  const [portfolioGrowth, setPortfolioGrowth] = useState<number>(8.0);

  const { chartData, totalSavings, firstYearSavings, annualFeeDollars } = useMemo(() => {
    const growthRate = portfolioGrowth / 100;
    const feeRate = annualFeePercent / 100;
    const flatFee = 1200;

    let percentFeePortfolio = portfolioValue;
    let flatFeePortfolio = portfolioValue;
    const data: ChartDataPoint[] = [];

    if (portfolioValue > 0 && years > 0) {
        for (let i = 1; i <= years; i++) {
            percentFeePortfolio = percentFeePortfolio * (1 + growthRate - feeRate);
            flatFeePortfolio = (flatFeePortfolio * (1 + growthRate)) - flatFee;
            
            const savingsThisYear = Math.max(0, flatFeePortfolio - percentFeePortfolio);

            data.push({
                year: i,
                savings: savingsThisYear,
            });
        }
    }

    const calculatedTotalSavings = data.length > 0 ? data[data.length - 1].savings : 0;
    const calculatedAnnualFeeDollars = portfolioValue * feeRate;
    const calculatedFirstYearSavings = Math.max(0, calculatedAnnualFeeDollars - flatFee);

    return {
      chartData: data,
      totalSavings: calculatedTotalSavings,
      firstYearSavings: calculatedFirstYearSavings,
      annualFeeDollars: calculatedAnnualFeeDollars
    };
  }, [portfolioValue, annualFeePercent, years, portfolioGrowth]);

  const handleReset = () => {
    setPortfolioValue(1000000);
    setAnnualFeePercent(1.0);
    setYears(3);
    setPortfolioGrowth(8.0);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
           <h1 className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600 py-2 flex justify-center items-baseline flex-wrap gap-x-3">
            <span className="text-2xl sm:text-3xl lg:text-4xl tracking-tight">What would you do with an extra</span>
            <span className="text-3xl sm:text-4xl lg:text-5xl">{formatCurrency(totalSavings)}?</span>
          </h1>
          <div className="mt-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm max-w-4xl mx-auto">
             <CalculatorControls
                portfolioValue={portfolioValue}
                setPortfolioValue={setPortfolioValue}
                annualFeePercent={annualFeePercent}
                setAnnualFeePercent={setAnnualFeePercent}
                years={years}
                setYears={setYears}
                portfolioGrowth={portfolioGrowth}
                setPortfolioGrowth={setPortfolioGrowth}
                onReset={handleReset}
              />
          </div>
        </header>

        <main className="flex flex-col gap-8">
            <SavingsDisplay 
              firstYearSavings={firstYearSavings}
              annualFeeDollars={annualFeeDollars}
              totalSavings={totalSavings}
              years={years}
            />
            <div className="bg-white border border-gray-200 p-4 sm:p-6 rounded-2xl shadow-lg h-[400px] sm:h-[500px]">
               <SavingsChart data={chartData} />
            </div>
        </main>
        
        <footer className="text-center mt-12 text-gray-600 text-sm">
            <p>Calculations are for illustrative purposes only and do not constitute financial advice.</p>
            <p>Portfolio growth is not guaranteed. Flat fee is assumed to be $100/month ($1,200/year).</p>
            <p>Cumulative savings amount assumes that the annual savings remain invested in the same portfolio and compound at that growth rate.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
