import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SavingsDisplayProps {
  firstYearSavings: number;
  annualFeeDollars: number;
  totalSavings: number;
  years: number;
  annualFeePercent: number;
  portfolioGrowth: number;
  portfolioValue: number;
  viewMode?: 'savings' | 'spending';
  annualSpending?: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function SavingsDisplay({
  firstYearSavings,
  annualFeeDollars,
  totalSavings,
  years,
  annualFeePercent,
  portfolioGrowth,
  portfolioValue,
  viewMode = 'savings',
  annualSpending = 50000
}: SavingsDisplayProps) {
  const fvWithCurrentFee = portfolioValue * Math.pow(1 + (portfolioGrowth - annualFeePercent) / 100, years);
  const fvWithFlatFee = portfolioValue * Math.pow(1 + portfolioGrowth / 100, years) - (1200 * ((Math.pow(1 + portfolioGrowth / 100, years) - 1) / (portfolioGrowth / 100)));

  const spendingPowerYears = annualSpending > 0 ? totalSavings / annualSpending : 0;

  return (
    <div
      data-testid="stat-card-savings-summary"
      className="border-0 p-4 rounded-xl bg-transparent pl-[0px] pr-[0px] pt-[0px] pb-[0px]"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-end justify-center gap-4 flex-wrap">
            <div className="flex flex-col items-center min-w-[100px]">
              <span className="text-xs font-medium text-muted-foreground font-heading whitespace-nowrap">Current Annual Fee</span>
            </div>

            <div className="flex flex-col items-center min-w-[100px]">
              <span className="text-xs font-medium text-muted-foreground font-heading whitespace-nowrap">Our fee</span>
              <span className="text-[10px] text-muted-foreground font-heading">($100/mo.)</span>
            </div>

            <div className="flex flex-col items-center min-w-[100px]">
              <span className="text-xs font-medium text-muted-foreground font-heading whitespace-nowrap">First Year Savings</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span
              data-testid="stat-card-current-fee"
              className="text-2xl font-semibold font-heading text-[#006044] min-w-[100px] text-center"
            >
              {formatCurrency(annualFeeDollars)}
            </span>

            <span className="text-lg font-medium text-foreground">-</span>

            <span className="text-2xl font-semibold font-heading text-[#006044] min-w-[100px] text-center">
              $1,200
            </span>

            <span className="text-lg font-medium text-foreground">=</span>

            <span
              data-testid="stat-card-first-year-savings"
              className="text-2xl font-semibold font-heading text-[#006044] min-w-[100px] text-center"
            >
              {formatCurrency(firstYearSavings)}
            </span>
          </div>
        </div>

        <div className="w-full border-t border-card-border flex flex-col items-center pt-[4px] pb-[4px]">
          <span className="text-xs font-medium text-muted-foreground font-heading">
            Total Savings over {years} Years
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  data-testid="stat-card-total-savings"
                  className="text-3xl mt-1 font-heading text-[#006044] cursor-help font-bold"
                >
                  {formatCurrency(totalSavings)}
                </span>
              </TooltipTrigger>
              <TooltipContent
                className="max-w-md rounded-md shadow-md p-4 bg-white"
              >
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
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {viewMode === 'spending' && (
            <div className="mt-2 text-center animate-fade-in">
              <p className="text-sm font-medium text-muted-foreground">
                That covers <span className="font-bold text-primary">{spendingPowerYears.toFixed(1)} Years</span> of your annual spending!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
