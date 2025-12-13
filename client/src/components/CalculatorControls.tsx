import { RotateCcw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

interface InputFieldProps {
  label: string;
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  type?: string;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  size: number;
  decimals?: number;
  useCommas?: boolean;
  tooltip?: string;
  showSpinners?: boolean;
  onIncrement?: () => void;
  onDecrement?: () => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  onBlur,
  type = 'number',
  prefix,
  suffix,
  size,
  decimals,
  useCommas = false,
  tooltip,
  showSpinners = false,
  onIncrement,
  onDecrement,
  ...props
}) => {
  let displayValue: string | number = value;

  if (typeof value === 'number') {
    if (decimals !== undefined) {
      displayValue = value.toFixed(decimals);
    } else if (useCommas) {
      displayValue = value.toLocaleString('en-US');
    }
  }

  const valueLength = String(displayValue).length;
  const inputWidth = Math.max(size, valueLength);

  const labelContent = (
    <label className="text-sm font-medium text-muted-foreground font-heading w-full text-center">
      {label}
    </label>
  );

  return (
    <div className="flex flex-col items-center space-y-1">
      {tooltip ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {labelContent}
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : labelContent}
      <div className="relative inline-flex items-center bg-transparent border border-card-border rounded-md shadow-none py-2 px-3 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all hover-elevate">
        {prefix && (
          <span className="text-muted-foreground mr-2 font-heading font-bold text-2xl">
            {prefix}
          </span>
        )}
        <input
          type={useCommas ? "text" : type}
          value={displayValue}
          onChange={onChange}
          onBlur={onBlur}
          data-testid={`input-${label.toLowerCase().replace(/\s+/g, '-')}`}
          className="font-heading font-bold text-2xl bg-transparent border-none outline-none p-0 text-blue-600 custom-number-input"
          style={{
            width: `${inputWidth}ch`,
            caretColor: '#2563eb'
          }}
          {...props}
        />
        {suffix && (
          <span className="text-muted-foreground font-heading font-bold text-2xl ml-[8px] mr-[8px]">
            {suffix}
          </span>
        )}
        {showSpinners && onIncrement && onDecrement && (
          <div className="absolute right-1 flex flex-col h-full justify-center pointer-events-auto" style={{ top: 0 }}>
            <button
              type="button"
              onClick={onIncrement}
              data-testid={`button-increment-${label.toLowerCase().replace(/\s+/g, '-')}`}
              className="flex items-center justify-center h-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              style={{ fontSize: '0.7rem', padding: '2px' }}
            >
              ▲
            </button>
            <button
              type="button"
              onClick={onDecrement}
              data-testid={`button-decrement-${label.toLowerCase().replace(/\s+/g, '-')}`}
              className="flex items-center justify-center h-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              style={{ fontSize: '0.7rem', padding: '2px' }}
            >
              ▼
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface SelectFieldProps {
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  tooltip?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({ label, value, onChange, children, tooltip }) => {
  const labelContent = (
    <label className="text-sm font-medium text-muted-foreground font-heading w-full text-center">
      {label}
    </label>
  );

  return (
    <div className="flex flex-col items-center space-y-1">
      {tooltip ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {labelContent}
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : labelContent}
      <div className="inline-flex items-center bg-transparent border border-card-border rounded-md shadow-none py-2 pr-2 pl-3 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all hover-elevate">
        <select
          value={value}
          onChange={onChange}
          data-testid={`select-${label.toLowerCase().replace(/\s+/g, '-').replace(/%/g, 'percent')}`}
          className="font-heading font-bold text-2xl bg-transparent border-none outline-none p-0 pr-6 appearance-none text-blue-600 cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%234a4a4a' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
            caretColor: '#2563eb'
          }}
        >
          {children}
        </select>
      </div>
    </div>
  );
};

export default function CalculatorControls({
  portfolioValue,
  setPortfolioValue,
  annualFeePercent,
  setAnnualFeePercent,
  years,
  setYears,
  portfolioGrowth,
  setPortfolioGrowth,
  onReset,
  viewMode = 'savings',
  setViewMode,
  annualSpending = 50000,
  setAnnualSpending,
}: CalculatorControlsProps & {
  viewMode?: 'savings' | 'spending';
  setViewMode?: (mode: 'savings' | 'spending') => void;
  annualSpending?: number;
  setAnnualSpending?: (value: number) => void;
}) {
  const growthOptions = [];
  for (let i = 0.0; i <= 12.0; i += 0.5) {
    growthOptions.push(i);
  }

  const feeOptions = [];
  for (let i = 10; i <= 150; i += 5) {
    const value = i / 100;
    feeOptions.push(value);
  }

  return (
    <div className="flex flex-col items-center gap-2 mt-[40px] mb-[0px] pt-[10px] pb-[10px]">
      {/* Segmented Control for View Mode */}
      {setViewMode && (
        <div className="bg-muted/30 p-1 rounded-full inline-flex items-center border border-border/50 pt-[0px] pb-[0px] pl-[0px] pr-[0px] text-[15px]">
          <button
            onClick={() => setViewMode('savings')}
            className="px-5 py-1.5 rounded-full font-bold transition-all duration-200 bg-green-600 text-white shadow-md pl-[10px] pr-[10px] pt-[4px] pb-[4px] text-[13px]"
          >
            GROW
          </button>
          <button
            onClick={() => setViewMode('spending')}
            className="px-5 py-1.5 rounded-full font-bold transition-all duration-200 text-muted-foreground hover:text-foreground text-[13px] pl-[10px] pr-[10px] pt-[4px] pb-[4px]"
          >
            SPEND
          </button>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="flex flex-nowrap items-center gap-4">
          <InputField
            label="My Portfolio Value"
            value={portfolioValue}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/,/g, '');
              const parsed = Number(numericValue);
              if (!isNaN(parsed)) {
                setPortfolioValue(Math.min(parsed, 10000000));
              }
            }}
            prefix="$"
            min={0}
            size={7}
            useCommas={true}
            tooltip="Maximum: $10,000,000"
          />

          {/* Animated Annual Spending Input */}
          {setAnnualSpending && (
            <div
              className={`grid transition-all duration-500 ease-in-out ${viewMode === 'spending'
                ? 'grid-cols-[1fr] opacity-100 ml-0 translate-x-0'
                : 'grid-cols-[0fr] opacity-0 -ml-4 -translate-x-2 pointer-events-none'
                }`}
            >
              <div className="overflow-hidden">
                <InputField
                  label="Annual Spending"
                  value={annualSpending}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/,/g, '');
                    const parsed = Number(numericValue);
                    if (!isNaN(parsed)) {
                      setAnnualSpending(Math.min(parsed, 10000000));
                    }
                  }}
                  prefix="$"
                  min={0}
                  size={7}
                  useCommas={true}
                />
              </div>
            </div>
          )}

          <SelectField
            label="Annual Fee %"
            value={annualFeePercent}
            onChange={(e) => setAnnualFeePercent(Number(e.target.value))}
          >
            {feeOptions.map(option => (
              <option key={option} value={option}>
                {option.toFixed(2)}%
              </option>
            ))}
          </SelectField>
        </div>
        <div className="flex flex-nowrap items-center gap-4">
          <SelectField
            label="Growth"
            value={portfolioGrowth}
            onChange={(e) => setPortfolioGrowth(Number(e.target.value))}
          >
            {growthOptions.map(option => (
              <option key={option} value={option}>
                {option.toFixed(2)}%
              </option>
            ))}
          </SelectField>
          <InputField
            label="Years"
            value={years}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                return;
              }
              const parsed = Number(value);
              if (!isNaN(parsed) && Number.isInteger(parsed)) {
                setYears(Math.min(parsed, 50));
              }
            }}
            type="text"
            size={2}
            tooltip="Maximum: 50 years"
            showSpinners={true}
            onIncrement={() => {
              setYears(Math.min(years + 1, 50));
            }}
            onDecrement={() => {
              setYears(Math.max(years - 1, 1));
            }}
          />
        </div>
        <button
          onClick={onReset}
          data-testid="button-reset"
          aria-label="Reset to default values"
          className="h-7 w-7 flex items-center justify-center rounded-full bg-transparent text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary active-elevate-2 ml-[0px] mr-[0px]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
