import React from 'react';

interface CalculationDetailsCardProps {
  portfolioValue: number;
  annualFeePercent: number;
  portfolioGrowth: number;
  years: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function CalculationDetailsCard({
  portfolioValue,
  annualFeePercent,
  portfolioGrowth,
  years,
}: CalculationDetailsCardProps) {
  const fvWithCurrentFee = portfolioValue * Math.pow(1 + (portfolioGrowth - annualFeePercent) / 100, years);
  const fvWithFlatFee = portfolioValue * Math.pow(1 + portfolioGrowth / 100, years) - (1200 * ((Math.pow(1 + portfolioGrowth / 100, years) - 1) / (portfolioGrowth / 100)));
  const totalSavings = fvWithFlatFee - fvWithCurrentFee;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full max-w-[720px] bg-white rounded-xl shadow-md border border-card-border p-4 sm:p-6">
        <div className="text-sm space-y-3">
          <div>
            <p className="font-semibold text-foreground mb-1">Total Savings Calculation</p>
            <p className="text-xs text-muted-foreground">This amount represents the difference in your total portfolio value after {years} years, comparing your current asset-based fee to our flat monthly fee.</p>
          </div>

          <div className="border-t border-border pt-3">
            <p className="font-semibold text-foreground mb-1">1. Future Value with Current {annualFeePercent.toFixed(2)}% Fee</p>
            <p className="text-xs text-muted-foreground mb-1">Your portfolio grows at a net rate of {(portfolioGrowth - annualFeePercent).toFixed(2)}% ({portfolioGrowth.toFixed(2)}% growth - {annualFeePercent.toFixed(2)}% fee).</p>
            <p className="text-xs text-muted-foreground mb-1">Formula: <span className="font-mono">FV = PV × (1 + i)^n</span></p>
            <div className="bg-muted/50 px-2 py-1 rounded font-mono text-xs">
              <div>FV = ${portfolioValue.toLocaleString()} × (1.{((portfolioGrowth - annualFeePercent) / 100).toFixed(4).slice(2)})^{years}</div>
              <div className="mt-1">FV = {formatCurrency(fvWithCurrentFee)}</div>
            </div>
          </div>

          <div className="border-t border-border pt-3">
            <p className="font-semibold text-foreground mb-1">2. Future Value with Our $1,200 Annual Fee</p>
            <p className="text-xs text-muted-foreground mb-1">Your portfolio grows at the full {portfolioGrowth.toFixed(2)}%, while accounting for the $1,200 annual fee.</p>
            <p className="text-xs text-muted-foreground mb-1">Formula: <span className="font-mono">FV = (PV Growth) - (Future Value of Fee Payments)</span></p>
            <div className="bg-muted/50 px-2 py-1 rounded font-mono text-xs break-all">
              <div>FV = [${portfolioValue.toLocaleString()} × (1.{(portfolioGrowth / 100).toFixed(4).slice(2)})^{years}] - [$1,200 × (((1.{(portfolioGrowth / 100).toFixed(4).slice(2)})^{years} - 1) / {(portfolioGrowth / 100).toFixed(2)})]</div>
              <div className="mt-1">FV = {formatCurrency(fvWithFlatFee)}</div>
            </div>
          </div>

          <div className="border-t border-border pt-3">
            <p className="font-semibold text-foreground mb-1">3. Total Savings (The Difference)</p>
            <div className="bg-primary/10 px-2 py-1.5 rounded font-mono text-sm font-semibold text-foreground">
              <div>{formatCurrency(fvWithFlatFee)} - {formatCurrency(fvWithCurrentFee)} =</div>
              <div className="mt-1 text-primary">{formatCurrency(totalSavings)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

