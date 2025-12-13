import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DonutChartCardProps {
  portfolioValue: number;
  portfolioGrowth: number;
  annualFeePercent: number;
}

const COLORS = ['#ef4444', '#006044']; // Red for Fees, Green for Profit

const DonutChartCard: React.FC<DonutChartCardProps> = ({
  portfolioValue,
  portfolioGrowth,
  annualFeePercent
}) => {
  // Calculations
  const totalAnnualReturn = portfolioValue * (portfolioGrowth / 100);
  const lostToFees = portfolioValue * (annualFeePercent / 100);
  const netProfit = totalAnnualReturn - lostToFees;

  // Donut Chart Data
  const data = [
    { name: 'Lost to Fees', value: lostToFees },
    { name: 'Your Net Profit', value: netProfit }
  ];

  // Helper for currency format
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 font-heading" style={{ color: '#01793D' }}>
        Where Your Annual Growth Goes ({annualFeePercent.toFixed(2)}% Fee)
      </h3>

      <div className="relative w-full max-w-[500px] aspect-square max-h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="50%"
              outerRadius="90%"
              fill="#8884d8"
              paddingAngle={2}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip 
                 formatter={(value: number) => formatCurrency(value)}
                 contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                 itemStyle={{ color: '#0f172a', fontWeight: 600 }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-8">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Annual Return</span>
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">{formatCurrency(totalAnnualReturn)}</span>
            <span className="text-xs text-muted-foreground mt-1">({portfolioGrowth}% of {formatCurrency(portfolioValue)})</span>
        </div>
      </div>

       {/* Custom Legend / Callouts */}
       <div className="w-full flex justify-between items-start max-w-[500px] mt-2 px-4 text-sm font-medium">
            <div className="flex flex-col items-center text-center w-1/2 pr-2">
                <span className="w-3 h-3 rounded-full bg-red-500 mb-2"></span>
                <span className="text-red-600 font-bold block mb-1">Lost to Fees</span>
                <span className="text-slate-800 text-lg font-bold">{formatCurrency(lostToFees)}</span>
            </div>
             <div className="flex flex-col items-center text-center w-1/2 pl-2">
                <span className="w-3 h-3 rounded-full bg-[#006044] mb-2"></span>
                <span className="text-[#006044] font-bold block mb-1">Your Net Profit</span>
                <span className="text-slate-800 text-lg font-bold">{formatCurrency(netProfit)}</span>
            </div>
       </div>

      <p className="text-center text-muted-foreground text-sm mt-8 max-w-lg mx-auto italic border-t border-slate-100 pt-4">
        A {annualFeePercent}% fee takes 1 out of every {(totalAnnualReturn / lostToFees).toFixed(0)} dollars of your hard-earned return.
      </p>
    </div>
  );
};

export default DonutChartCard;
