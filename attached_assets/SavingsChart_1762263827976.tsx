import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '../types';

interface SavingsChartProps {
  data: ChartDataPoint[];
}

const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
};

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 backdrop-blur-sm p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="label text-gray-600">{`Year ${label}`}</p>
        <p className="intro text-green-600 font-semibold">{`Savings: ${new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(payload[0].value)}`}</p>
      </div>
    );
  }

  return null;
};

const CustomLegend: React.FC<any> = ({ payload }) => {
  if (!payload || !payload.length) {
    return null;
  }
  const { value, color } = payload[0];
  return (
    <div className="flex justify-center mt-2">
      <div className="inline-flex items-center gap-x-2 border border-blue-200 rounded px-3 py-1 bg-white shadow-sm">
        <svg height="10" width="20">
          <line x1="0" y1="5" x2="20" y2="5" style={{stroke: color, strokeWidth: 3}} />
        </svg>
        <span className="text-sm text-gray-700">{value}</span>
      </div>
    </div>
  );
};


const SavingsChart: React.FC<SavingsChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      {data.length > 0 ? (
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: 20,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#48BB78" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#48BB78" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
          <XAxis 
            dataKey="year" 
            stroke="#9ca3af" 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#9ca3af' }}
            tickLine={{ stroke: '#9ca3af' }}
          />
          <YAxis 
            stroke="#9ca3af" 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickFormatter={formatCurrency}
            label={{ value: 'Total Savings', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
            width={80}
            axisLine={{ stroke: '#9ca3af' }}
            tickLine={{ stroke: '#9ca3af' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
          <Area 
            type="monotone" 
            dataKey="savings" 
            stroke="#48BB78" 
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorSavings)"
            dot={false}
            activeDot={{ r: 8, fill: '#48BB78', stroke: '#ffffff', strokeWidth: 2 }}
            name="Total Savings vs Fee"
          />
        </AreaChart>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>Adjust the controls to see your potential savings.</p>
        </div>
      )}
    </ResponsiveContainer>
  );
};

export default SavingsChart;