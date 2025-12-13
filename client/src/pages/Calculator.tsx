import { useState, useMemo } from 'react';
import CalculatorControls from '@/components/CalculatorControls';
import SavingsChart from '@/components/SavingsChart';
import SurveySection from '@/components/SurveySection';
import type { ChartDataPoint } from '@shared/schema';
import { Share2 } from 'lucide-react';
import { CarouselSection } from '@/components/CarouselSection';
import ChartCarousel from '@/components/ChartCarousel';
import DonutChart from '@/components/DonutChart';
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import SectionReveal from "@/components/motion/SectionReveal";
import { MotionConfig } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

type CalculatorViewProps = {
  portfolioValue: number;
  setPortfolioValue: (value: number) => void;
  annualFeePercent: number;
  setAnnualFeePercent: (value: number) => void;
  years: number;
  setYears: (value: number) => void;
  portfolioGrowth: number;
  setPortfolioGrowth: (value: number) => void;
  viewMode: 'savings' | 'spending';
  setViewMode: (mode: 'savings' | 'spending') => void;
  annualSpending: number;
  setAnnualSpending: (value: number) => void;
  chartData: ChartDataPoint[];
  totalSavings: number;
  firstYearSavings: number;
  spendingPowerYears: number;
  handleReset: () => void;
};

export default function Calculator() {
  const [portfolioValue, setPortfolioValue] = useState<number>(1000000);
  const [annualFeePercent, setAnnualFeePercent] = useState<number>(1.00);
  const [years, setYears] = useState<number>(5);
  const [portfolioGrowth, setPortfolioGrowth] = useState<number>(8.0);
  const [viewMode, setViewMode] = useState<'savings' | 'spending'>('savings');
  const [annualSpending, setAnnualSpending] = useState<number>(40000);

  const { chartData, totalSavings, firstYearSavings, annualFeeDollars } = useMemo(() => {
    const growthRate = portfolioGrowth / 100;
    const feeRate = annualFeePercent / 100;
    const flatFee = 1200;

    let percentFeePortfolio = portfolioValue;
    let flatFeePortfolio = portfolioValue;
    const data: ChartDataPoint[] = [];

    if (portfolioValue > 0 && years > 0) {
      // Add Year 0 anchor point with both portfolios at initial value
      data.push({
        year: 0,
        savings: 0,
        flatFeePortfolio: portfolioValue,
        percentFeePortfolio: portfolioValue,
      });

      for (let i = 1; i <= years; i++) {
        if (viewMode === 'spending') {
          // SPEND Mode: User's specific logic

          // Dataset A (Current Advisor):
          // Formula: Balance * (1 + Growth - Fee%) - Spend
          percentFeePortfolio = (percentFeePortfolio * (1 + growthRate - feeRate)) - annualSpending;

          // Dataset B (Flat Fee Optimization):
          // Formula: Balance * (1 + Growth) - $1,200 - Spend
          flatFeePortfolio = (flatFeePortfolio * (1 + growthRate)) - flatFee - annualSpending;

          // Clamp at zero
          percentFeePortfolio = Math.max(0, Math.round(percentFeePortfolio));
          flatFeePortfolio = Math.max(0, Math.round(flatFeePortfolio));

        } else {
          // SAVE Mode: Standard Calculation
          percentFeePortfolio = percentFeePortfolio * (1 + growthRate - feeRate);
          flatFeePortfolio = (flatFeePortfolio * (1 + growthRate)) - flatFee;
        }

        // Allow negative savings to show when flat fee loses
        const savingsThisYear = flatFeePortfolio - percentFeePortfolio;

        data.push({
          year: i,
          savings: savingsThisYear,
          flatFeePortfolio: flatFeePortfolio,
          percentFeePortfolio: percentFeePortfolio,
        });
      }
    }

    const calculatedTotalSavings = data.length > 0 ? data[data.length - 1].savings : 0;
    const calculatedAnnualFeeDollars = portfolioValue * feeRate;
    // Allow negative first year savings to show accurate comparison
    const calculatedFirstYearSavings = calculatedAnnualFeeDollars - flatFee;

    return {
      chartData: data,
      totalSavings: calculatedTotalSavings,
      firstYearSavings: calculatedFirstYearSavings,
      annualFeeDollars: calculatedAnnualFeeDollars
    };
  }, [portfolioValue, annualFeePercent, years, portfolioGrowth, viewMode, annualSpending]);

  const handleReset = () => {
    setPortfolioValue(1000000);
    setAnnualFeePercent(1.00);
    setYears(5);
    setPortfolioGrowth(8.0);
    setViewMode('savings');
    setAnnualSpending(40000);
  };

  const spendingPowerYears = annualSpending > 0 ? totalSavings / annualSpending : 0;

  const isFinwise =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("ui") === "finwise";

  const viewProps: CalculatorViewProps = {
    portfolioValue,
    setPortfolioValue,
    annualFeePercent,
    setAnnualFeePercent,
    years,
    setYears,
    portfolioGrowth,
    setPortfolioGrowth,
    viewMode,
    setViewMode,
    annualSpending,
    setAnnualSpending,
    chartData,
    totalSavings,
    firstYearSavings,
    spendingPowerYears,
    handleReset,
  };

  return isFinwise ? (
    <CalculatorFinwiseView {...viewProps} />
  ) : (
    <CalculatorLegacyView {...viewProps} />
  );
}

function CalculatorFinwiseView(_: CalculatorViewProps) {
  const share = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Financial Fee Savings Calculator",
          text: "Check out this calculator to see how much you could save!",
          url: window.location.href,
        })
        .catch(() => {});
      return;
    }

    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div data-ui="finwise" className="min-h-screen bg-background text-foreground">
      {/* Developer-only banner (temporary) */}
      <div className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
        <Container className="py-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
            Finwise UI preview (ui=finwise)
          </div>
        </Container>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden pt-16 md:pt-24 pb-10">
        <div className="absolute inset-0 -z-10 fw-hero-grid" />
        <div className="absolute inset-x-0 bottom-0 h-40 -z-10 fw-hero-bottom-blur" />

        <Container>
          <SectionReveal className="grid gap-10">
            <div className="grid gap-4">
              <h1 className="font-fwheading font-extrabold tracking-tight text-3xl sm:text-4xl lg:text-5xl text-primary">
                You pay too much for advice.
              </h1>
              <p className="max-w-2xl text-base sm:text-lg text-muted-foreground">
                Compare your current asset-based fee to a flat annual fee and see how much you could keep invested.
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="max-w-[420px]">
                  <SurveySection />
                </div>
                <button
                  data-testid="button-share"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-white/70 px-4 py-2 text-sm font-semibold text-primary shadow-sm transition-colors hover:bg-white"
                  onClick={share}
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Surface grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-3xl bg-card border border-border shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] p-6">
                <CalculatorControls
                  ui="finwise"
                  portfolioValue={_.portfolioValue}
                  setPortfolioValue={_.setPortfolioValue}
                  annualFeePercent={_.annualFeePercent}
                  setAnnualFeePercent={_.setAnnualFeePercent}
                  years={_.years}
                  setYears={_.setYears}
                  portfolioGrowth={_.portfolioGrowth}
                  setPortfolioGrowth={_.setPortfolioGrowth}
                  onReset={_.handleReset}
                />
              </div>

              <div
                data-testid="chart-container"
                className="rounded-3xl bg-card border border-border shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] p-6 h-[420px] sm:h-[520px]"
              >
                <ChartCarousel>
                  <SavingsChart
                    data={_.chartData}
                    firstYearSavings={_.firstYearSavings}
                    totalSavings={_.totalSavings}
                    years={_.years}
                    portfolioValue={_.portfolioValue}
                    viewMode={_.viewMode}
                    annualFeePercent={_.annualFeePercent}
                  />
                  <DonutChart
                    portfolioValue={_.portfolioValue}
                    annualFeePercent={_.annualFeePercent}
                    portfolioGrowth={_.portfolioGrowth}
                    years={_.years}
                  />
                </ChartCarousel>
              </div>
            </div>

            {/* Finwise-style savings callout (keeps existing testid) */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total savings over {_.years} years</p>
              <p className="mt-1 text-4xl font-fwheading font-extrabold text-primary">
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <span data-testid="text-total-savings" className="cursor-help inline-block">
                        {formatCurrency(_.totalSavings)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-md rounded-md shadow-md p-4 z-50 bg-white" sideOffset={5}>
                      <div className="text-sm space-y-3">
                        <div>
                          <p className="font-semibold text-foreground mb-1">Total Savings Calculation</p>
                          <p className="text-xs text-muted-foreground">
                            This amount represents the difference in your total portfolio value after {_.years} years,
                            comparing your current asset-based fee to our flat monthly fee.
                          </p>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </p>
            </div>
          </SectionReveal>
        </Container>
      </section>

      {/* Supporting section */}
      <Section id="features" alt>
        <SectionReveal>
          <CarouselSection
            portfolioValue={_.portfolioValue}
            annualFeePercent={_.annualFeePercent}
            portfolioGrowth={_.portfolioGrowth}
            years={_.years}
          />
        </SectionReveal>
      </Section>

      {/* Footer */}
      <footer className="py-12">
        <Container>
          <div className="text-center text-muted-foreground text-sm space-y-1">
            <p>Calculations are for illustrative purposes only and do not constitute financial advice.</p>
            <p>Portfolio growth is not guaranteed. Flat fee is assumed to be $100/month ($1,200/year).</p>
            <p>
              Cumulative savings amount assumes that the annual savings remain invested in the same portfolio and
              compound at that growth rate.
            </p>
          </div>
        </Container>
      </footer>
      </div>
    </MotionConfig>
  );
}

function CalculatorLegacyView({
  portfolioValue,
  setPortfolioValue,
  annualFeePercent,
  setAnnualFeePercent,
  years,
  setYears,
  portfolioGrowth,
  setPortfolioGrowth,
  viewMode,
  annualSpending,
  chartData,
  totalSavings,
  firstYearSavings,
  spendingPowerYears,
  handleReset,
}: CalculatorViewProps) {
  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mt-[8px] mb-[8px]">
          <h1 className="font-bold py-2 text-center font-heading text-2xl sm:text-3xl lg:text-4xl" style={{
            color: '#01793D'
          }}>
            {viewMode === 'savings' ? (
              <>
                What would <span className="relative inline-block" style={{
                  color: '#01793D'
                }}>you<svg
                  className="absolute opacity-90 pointer-events-none"
                  style={{
                    left: '0',
                    bottom: '-4px',
                    width: '100%',
                    height: '12px'
                  }}
                  viewBox="0 0 100 14"
                  preserveAspectRatio="none"
                >
                    <defs>
                      <linearGradient id="brushGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#01793D" />
                        <stop offset="50%" stopColor="#01793D" />
                        <stop offset="100%" stopColor="#01793D" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0,7 Q 50,3 100,8"
                      fill="none"
                      stroke="url(#brushGradient)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 30,7 Q 60,3 100,8"
                      fill="none"
                      stroke="url(#brushGradient)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      opacity="0.8"
                    />
                  </svg></span> do with <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <span data-testid="text-total-savings" className="cursor-help inline-block">{formatCurrency(totalSavings)}</span>
                    </TooltipTrigger>
                    <TooltipContent
                      className="max-w-md rounded-md shadow-md p-4 z-50 bg-white"
                      sideOffset={5}
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
                            <div className="mt-1">FV = {formatCurrency(portfolioValue * Math.pow(1 + (portfolioGrowth - annualFeePercent) / 100, years))}</div>
                          </div>
                        </div>

                        <div className="border-t border-border pt-3">
                          <p className="font-semibold text-foreground mb-1">2. Future Value with Our $1,200 Annual Fee</p>
                          <p className="text-xs text-muted-foreground mb-1">Your portfolio grows at the full {portfolioGrowth.toFixed(2)}%, while accounting for the $1,200 annual fee.</p>
                          <p className="text-xs text-muted-foreground mb-1">Formula: <span className="font-mono">FV = (PV Growth) - (Future Value of Fee Payments)</span></p>
                          <div className="bg-muted/50 px-2 py-1 rounded font-mono text-xs">
                            <div>FV = [${portfolioValue.toLocaleString()} × (1.{(portfolioGrowth / 100).toFixed(4).slice(2)})^{years}] - [$1,200 × (((1.{(portfolioGrowth / 100).toFixed(4).slice(2)})^{years} - 1) / {(portfolioGrowth / 100).toFixed(2)})]</div>
                            <div className="mt-1">FV = {formatCurrency(portfolioValue * Math.pow(1 + portfolioGrowth / 100, years) - (1200 * ((Math.pow(1 + portfolioGrowth / 100, years) - 1) / (portfolioGrowth / 100))))}</div>
                          </div>
                        </div>

                        <div className="border-t border-border pt-3">
                          <p className="font-semibold text-foreground mb-1">3. Total Savings (The Difference)</p>
                          <div className="bg-primary/10 px-2 py-1.5 rounded font-mono text-sm font-semibold text-foreground">
                            <div>{formatCurrency(portfolioValue * Math.pow(1 + portfolioGrowth / 100, years) - (1200 * ((Math.pow(1 + portfolioGrowth / 100, years) - 1) / (portfolioGrowth / 100))))} - {formatCurrency(portfolioValue * Math.pow(1 + (portfolioGrowth - annualFeePercent) / 100, years))} =</div>
                            <div className="mt-1 text-primary">{formatCurrency(totalSavings)}</div>
                          </div>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>?
              </>
            ) : (
              <div className="flex flex-col items-center">
                <span>That covers <span className="text-primary">{spendingPowerYears.toFixed(1)} Years</span></span>
                <span className="text-xl sm:text-2xl mt-2 text-muted-foreground">of your annual spending!</span>
              </div>
            )}
          </h1>
          <div className="flex items-center justify-between mt-[10px] mb-[10px] pl-[100px] pr-[50px]">
            <div className="flex-1 flex justify-center">
              <div style={{ maxWidth: '390px' }}>
                <SurveySection />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                data-testid="button-share"
                className="flex items-center gap-0 text-sm transition-colors hover-elevate active-elevate-2 px-3 py-2 rounded-lg flex-shrink-0"
                style={{ color: '#01793D' }}
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Financial Fee Savings Calculator',
                      text: 'Check out this calculator to see how much you could save!',
                      url: window.location.href,
                    }).catch(() => { });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
            </div>
          </div>

          <div className="bg-transparent p-4 rounded-xl shadow-none max-w-4xl mx-auto ml-[90px] mr-[90px] mt-[12px] mb-[9px] pl-[0px] pr-[0px] pt-[0px] pb-[0px]">
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

        <main className="flex flex-col gap-1">
          <div
            data-testid="chart-container"
            className="relative bg-transparent p-4 sm:p-6 rounded-2xl shadow-none h-[400px] sm:h-[500px] pl-[0px] pr-[0px] mt-[0px] mb-[0px] w-full max-w-[402px] md:max-w-4xl lg:max-w-5xl mx-auto pt-[0px] pb-[0px]"
          >
            <ChartCarousel>
              <SavingsChart
                  data={chartData}
                  firstYearSavings={firstYearSavings}
                  totalSavings={totalSavings}
                  years={years}
                  portfolioValue={portfolioValue}
                  viewMode={viewMode}
                  annualFeePercent={annualFeePercent}
                />
              <DonutChart
                portfolioValue={portfolioValue}
                annualFeePercent={annualFeePercent}
                portfolioGrowth={portfolioGrowth}
                years={years}
              /></ChartCarousel>
          </div>

          <div className="mt-8">
            <CarouselSection
              portfolioValue={portfolioValue}
              annualFeePercent={annualFeePercent}
              portfolioGrowth={portfolioGrowth}
              years={years}
            />
          </div>
        </main>

        <footer className="text-center mt-12 text-muted-foreground text-sm space-y-1">
          <p>Calculations are for illustrative purposes only and do not constitute financial advice.</p>
          <p>Portfolio growth is not guaranteed. Flat fee is assumed to be $100/month ($1,200/year).</p>
          <p>Cumulative savings amount assumes that the annual savings remain invested in the same portfolio and compound at that growth rate.</p>
        </footer>
      </div>
    </div>
  );
}
