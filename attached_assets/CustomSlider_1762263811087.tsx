
import React from 'react';

interface CustomSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unitPrefix?: string;
  unitSuffix?: string;
}

const CustomSlider: React.FC<CustomSliderProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unitPrefix = '',
  unitSuffix = ''
}) => {
  const formattedValue = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: unitSuffix === '%' ? 2 : 0,
    maximumFractionDigits: unitSuffix === '%' ? 2 : 0,
  }).format(value);

  return (
    <div className="w-full">
      <label className="flex justify-between items-center text-sm font-medium text-gray-300 mb-2">
        <span>{label}</span>
        <span className="px-3 py-1 text-sm font-semibold text-green-300 bg-green-900/50 rounded-full">
          {unitPrefix}{formattedValue}{unitSuffix}
        </span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-green-500"
      />
    </div>
  );
};

export default CustomSlider;
