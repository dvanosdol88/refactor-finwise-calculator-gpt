import React from 'react';

interface CalculatorControlsProps {
  portfolioValue: number;
  setPortfolioValue: (value: number) => void;
  annualFeePercent: number;
  setAnnualFeePercent: (value: number) => void;
  years: number;
  setYears: (value: number) => void;
  portfolioGrowth: number;
  setPortfolioGrowth: (value: number) => void;
  onReset: () => void;
}

const InputField: React.FC<{
  label: string;
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  prefix?: string;
  suffix?: string;
  min?: number;
  step?: number;
  size: number;
}> = ({ label, value, onChange, type = 'number', prefix, suffix, size, ...props }) => {
  const valueLength = String(value).length;
  const inputWidth = Math.max(size, valueLength);

  return (
    <div className="flex flex-col items-start space-y-1">
      <label className="text-sm font-medium text-muted">{label}</label>
      <div className="inline-flex items-center bg-white border border-[var(--border)] rounded-md shadow-sm py-2 px-3 text-[var(--text)] focus-within:ring-1 focus-within:ring-[var(--brand-primary)] focus-within:border-[var(--brand-primary)] transition-all">
        {prefix && <span className="text-muted mr-1.5 font-montserrat font-semibold">{prefix}</span>}
        <input
          type={type}
          value={value}
          onChange={onChange}
          className="font-montserrat font-semibold bg-transparent border-none outline-none p-0 text-[var(--text)]"
          style={{ width: `${inputWidth}ch` }}
          {...props}
        />
        {suffix && <span className="text-muted ml-1.5 font-montserrat font-semibold">{suffix}</span>}
      </div>
    </div>
  );
};

const SelectField: React.FC<{
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}> = ({ label, value, onChange, children }) => {
  // text-muted color is #4a4a4a, url encoded is %234a4a4a
  const customArrow = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%234a4a4a' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`;
  
  return (
    <div className="flex flex-col items-start space-y-1">
      <label className="text-sm font-medium text-muted">{label}</label>
      <div className="inline-flex items-center bg-white border border-[var(--border)] rounded-md shadow-sm py-2 pr-2 pl-3 text-[var(--text)] focus-within:ring-1 focus-within:ring-[var(--brand-primary)] focus-within:border-[var(--brand-primary)] transition-all">
        <select
          value={value}
          onChange={onChange}
          className="font-montserrat font-semibold bg-transparent border-none outline-none p-0 pr-6 appearance-none text-[var(--text)]"
          style={{
            backgroundImage: customArrow,
            backgroundPosition: 'right 0rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
          }}
        >
          {children}
        </select>
      </div>
    </div>
  );
};


const CalculatorControls: React.FC<CalculatorControlsProps> = ({
  portfolioValue,
  setPortfolioValue,
  annualFeePercent,
  setAnnualFeePercent,
  years,
  setYears,
  portfolioGrowth,
  setPortfolioGrowth,
  onReset,
}) => {
  
  const growthOptions = [];
  for (let i = 4.0; i <= 12.0; i += 0.5) {
    growthOptions.push(i);
  }

  return (
    <div className="flex flex-wrap items-end justify-center gap-4">
      <InputField
        label="Portfolio Value"
        value={portfolioValue}
        onChange={(e) => setPortfolioValue(Number(e.target.value))}
        prefix="$"
        min={0}
        size={7}
      />
      <InputField
        label="Annual Fee %"
        value={annualFeePercent}
        onChange={(e) => setAnnualFeePercent(Number(e.target.value))}
        suffix="%"
        step={0.01}
        min={0}
        size={4}
      />
      <InputField
        label="Years"
        value={years}
        onChange={(e) => setYears(Number(e.target.value))}
        min={1}
        size={2}
      />
      <SelectField
        label="Annual Portfolio Growth"
        value={portfolioGrowth}
        onChange={(e) => setPortfolioGrowth(Number(e.target.value))}
      >
        {growthOptions.map(option => (
            <option key={option} value={option}>
                {option.toFixed(2)}%
            </option>
        ))}
      </SelectField>
      <button
        onClick={onReset}
        aria-label="Reset to default values"
        className="h-10 w-10 flex items-center justify-center rounded-full bg-white border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--brand-primary)]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default CalculatorControls;