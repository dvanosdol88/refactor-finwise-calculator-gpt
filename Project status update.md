# Project status update (Finwise + RIA-Nov-2025 snapshot)

This document is a curated snapshot of the minimum set of files that gives a developer a fast, accurate view of both apps for the redesign work. Each section below is the full content of the referenced file at the time of export.

---

## Finwise — `src/app/page.tsx`
Source: `D:\anti-gravity-projects\RIA\Finwise\src\app\page.tsx`

```tsx
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing/Pricing";
import FAQ from "@/components/FAQ";
import Logos from "@/components/Logos";
import Benefits from "@/components/Benefits/Benefits";
import Container from "@/components/Container";
import Section from "@/components/Section";
import Stats from "@/components/Stats";
import CTA from "@/components/CTA";

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <Logos />
      <Container>
        <Benefits />

        <Section
          id="pricing"
          title="Pricing"
          description="Simple, transparent pricing. No surprises."
        >
          <Pricing />
        </Section>

        <Section
          id="testimonials"
          title="What Our Clients Say"
          description="Hear from those who have partnered with us."
        >
          <Testimonials />
        </Section>

        <FAQ />

        <Stats />
        
        <CTA />
      </Container>
    </>
  );
};

export default HomePage;
```

---

## Finwise — `src/components/Hero.tsx`
Source: `D:\anti-gravity-projects\RIA\Finwise\src\components\Hero.tsx`

```tsx
import React from 'react';
import Image from 'next/image';

import AppStoreButton from './AppStoreButton';
import PlayStoreButton from './PlayStoreButton';

import { heroDetails } from '@/data/hero';

const Hero: React.FC = () => {
    return (
        <section
            id="hero"
            className="relative flex items-center justify-center pb-0 pt-32 md:pt-40 px-5"
        >
            <div className="absolute left-0 top-0 bottom-0 -z-10 w-full">
                <div className="absolute inset-0 h-full w-full bg-hero-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]">
                </div>
            </div>

            <div className="absolute left-0 right-0 bottom-0 backdrop-blur-[2px] h-40 bg-gradient-to-b from-transparent via-[rgba(233,238,255,0.5)] to-[rgba(202,208,230,0.5)]">
            </div>

            <div className="text-center">
                <h1 className="text-4xl md:text-6xl md:leading-tight font-bold text-[#006044] max-w-lg md:max-w-2xl mx-auto">{heroDetails.heading}</h1>
                <p className="mt-4 text-[#006044] max-w-lg mx-auto">{heroDetails.subheading}</p>
                <div className="mt-6 flex flex-col sm:flex-row items-center sm:gap-4 w-fit mx-auto">
                    <AppStoreButton dark />
                    <PlayStoreButton dark />
                </div>
                <Image
                    src={heroDetails.centerImageSrc}
                    width={384}
                    height={340}
                    quality={100}
                    sizes="(max-width: 768px) 100vw, 384px"
                    priority={true}
                    unoptimized={true}
                    alt="app mockup"
                    className='relative mt-12 md:mt-16 mx-auto z-10'
                />
            </div>
        </section>
    );
};

export default Hero;
```

---

## Finwise — `src/app/globals.css`
Source: `D:\anti-gravity-projects\RIA\Finwise\src\app\globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #ffffff;
  --foreground: #171717;
  --primary: #FED835;
  --secondary: #304fff;

  --primary-accent: #e5c230;
  --foreground-accent: #454545;
  --hero-background: #F3F3F5;
}

html {
  @apply scroll-smooth;
}

body {
  @apply text-lg;
  
  color: var(--foreground);
  background: var(--background);
  font-family: "Source Sans 3", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}

.manrope {
  font-family: "Manrope", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
}

h1, h2, h3, h4, h5, h6 {
  font-family: "Manrope", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
}

#logos svg {
  @apply w-fit h-10 sm:h-12;
}

.benefit-section:last-of-type > div {
  @apply mb-10;
}
```

---

## RIA-Nov-2025 — `client/src/pages/Calculator.tsx`
Source: `D:\anti-gravity-projects\RIA\RIA-Nov-2025\client\src\pages\Calculator.tsx`

```tsx
import { useState, useMemo } from 'react';
import CalculatorControls from '@/components/CalculatorControls';
import SavingsChart from '@/components/SavingsChart';
import SurveySection from '@/components/SurveySection';
import type { ChartDataPoint } from '@shared/schema';
import { Share2 } from 'lucide-react';
import { CarouselSection } from '@/components/CarouselSection';
import ChartCarousel from '@/components/ChartCarousel';
import DonutChart from '@/components/DonutChart';
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
```

---

## RIA-Nov-2025 — `client/src/components/CalculatorControls.tsx`
Source: `D:\anti-gravity-projects\RIA\RIA-Nov-2025\client\src\components\CalculatorControls.tsx`

```tsx
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
```

---

## RIA-Nov-2025 — `client/src/index.css`
Source: `D:\anti-gravity-projects\RIA\RIA-Nov-2025\client\src\index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* LIGHT MODE */
:root {
  /* Brand: Green (#01793D) */
  --brand-green-rgb: 1 121 61; /* #01793D */
  --brand-green: rgb(var(--brand-green-rgb));
  /* Light tints of brand green for subtle surfaces */
  /* Slightly higher alpha so it reads as tinted, not transparent */
  --brand-green-bg: rgb(var(--brand-green-rgb) / 0.10);
  --brand-green-border: rgb(var(--brand-green-rgb) / 0.24);

  /* Solid brand-tinted surfaces (no transparency) */
  --brand-green-bg-solid: hsl(150 60% 92%);
  --brand-green-bg-solid-alt: hsl(150 55% 89%);
  --brand-green-border-strong: hsl(150 35% 70%);
  --button-outline: rgba(0,0,0, .10);
  --badge-outline: rgba(0,0,0, .05);

  /* Automatic computation of border around primary / danger buttons */
  --opaque-button-border-intensity: -8; /* In terms of percentages */

  /* Backgrounds applied on top of other backgrounds when hovered/active */
  --elevate-1: rgba(0,0,0, .03);
  --elevate-2: rgba(0,0,0, .08);

  --background: 0 0% 98%;

  --foreground: 0 0% 10%;

  --border: 40 15% 88%;

  --card: 0 0% 100%;

  --card-foreground: 0 0% 10%;

  --card-border: 0 0% 90%;

  --sidebar: 0 0% 96%;

  --sidebar-foreground: 0 0% 10%;

  --sidebar-border: 0 0% 86%;

  --sidebar-primary: 150 98% 24%;

  --sidebar-primary-foreground: 150 98% 97%;

  --sidebar-accent: 162 6% 88%;

  --sidebar-accent-foreground: 150 98% 12%;

  --sidebar-ring: 150 98% 24%;

  --popover: 0 0% 100%;

  --popover-foreground: 0 0% 10%;

  --popover-border: 0 0% 90%;

  --primary: 150 98% 24%;

  --primary-foreground: 150 98% 97%;

  --secondary: 0 0% 94%;

  --secondary-foreground: 0 0% 10%;

  --muted: 162 4% 92%;

  --muted-foreground: 162 2% 40%;

  --accent: 162 5% 90%;

  --accent-foreground: 162 100% 12%;

  --destructive: 0 84% 35%;

  --destructive-foreground: 0 84% 97%;

  --input: 0 0% 75%;
  --ring: 150 98% 24%;
  --chart-1: 150 98% 24%;
  --chart-2: 75 67% 42%;
  --chart-3: 220 90% 56%;
  --chart-4: 38 45% 48%;
  --chart-5: 280 65% 60%;

  --font-sans: Source Sans 3, sans-serif;
  --font-serif: Georgia, serif;
  --font-mono: Menlo, monospace;
  --radius: .5rem; /* 8px */
  --shadow-2xs: 0px 2px 0px 0px hsl(0 0% 0% / 0.00);
  --shadow-xs: 0px 2px 0px 0px hsl(0 0% 0% / 0.00);
  --shadow-sm: 0px 2px 0px 0px hsl(0 0% 0% / 0.00), 0px 1px 2px -1px hsl(0 0% 0% / 0.00);
  --shadow: 0px 2px 0px 0px hsl(0 0% 0% / 0.00), 0px 1px 2px -1px hsl(0 0% 0% / 0.00);
  --shadow-md: 0px 2px 0px 0px hsl(0 0% 0% / 0.00), 0px 2px 4px -1px hsl(0 0% 0% / 0.00);
  --shadow-lg: 0px 2px 0px 0px hsl(0 0% 0% / 0.00), 0px 4px 6px -1px hsl(0 0% 0% / 0.00);
  --shadow-xl: 0px 2px 0px 0px hsl(0 0% 0% / 0.00), 0px 8px 10px -1px hsl(0 0% 0% / 0.00);
  --shadow-2xl: 0px 2px 0px 0px hsl(0 0% 0% / 0.00);
  --tracking-normal: 0em;
  --spacing: 0.25rem;

  /* Automatically computed borders - intensity can be controlled by the user by the --opaque-button-border-intensity setting */

  /* Fallback for older browsers */
  --sidebar-primary-border: hsl(var(--sidebar-primary));
  --sidebar-primary-border: hsl(from hsl(var(--sidebar-primary)) h s calc(l + var(--opaque-button-border-intensity)) / alpha);

  /* Fallback for older browsers */
  --sidebar-accent-border: hsl(var(--sidebar-accent));
  --sidebar-accent-border: hsl(from hsl(var(--sidebar-accent)) h s calc(l + var(--opaque-button-border-intensity)) / alpha);

  /* Fallback for older browsers */
  --primary-border: hsl(var(--primary));
  --primary-border: hsl(from hsl(var(--primary)) h s calc(l + var(--opaque-button-border-intensity)) / alpha);

  /* Fallback for older browsers */
  --secondary-border: hsl(var(--secondary));
  --secondary-border: hsl(from hsl(var(--secondary)) h s calc(l + var(--opaque-button-border-intensity)) / alpha);

  /* Fallback for older browsers */
  --muted-border: hsl(var(--muted));
  --muted-border: hsl(from hsl(var(--muted)) h s calc(l + var(--opaque-button-border-intensity)) / alpha);

  /* Fallback for older browsers */
  --accent-border: hsl(var(--accent));
  --accent-border: hsl(from hsl(var(--accent)) h s calc(l + var(--opaque-button-border-intensity)) / alpha);

  /* Fallback for older browsers */
  --destructive-border: hsl(var(--destructive));
  --destructive-border: hsl(from hsl(var(--destructive)) h s calc(l + var(--opaque-button-border-intensity)) / alpha);
}

.dark {
  /* Slightly stronger tint in dark mode for contrast */
  --brand-green-bg: rgb(var(--brand-green-rgb) / 0.18);
  --brand-green-border: rgb(var(--brand-green-rgb) / 0.34);

  /* Solid brand surfaces for dark mode (no transparency) */
  --brand-green-bg-solid: hsl(150 16% 18%);
  --brand-green-bg-solid-alt: hsl(150 16% 16%);
  --brand-green-border-strong: hsl(150 20% 30%);
  --button-outline: rgba(255,255,255, .10);
  --badge-outline: rgba(255,255,255, .05);

  --opaque-button-border-intensity: 9;  /* In terms of percentages */

  /* Backgrounds applied on top of other backgrounds when hovered/active */
  --elevate-1: rgba(255,255,255, .04);
  --elevate-2: rgba(255,255,255, .09);

  --background: 162 4% 8%;

  --foreground: 162 4% 90%;

  --border: 162 4% 20%;

  --card: 162 4% 10%;

  --card-foreground: 162 4% 90%;

  --card-border: 162 4% 16%;

  --sidebar: 162 4% 12%;

  --sidebar-foreground: 162 4% 90%;

  --sidebar-border: 162 4% 18%;

  --sidebar-primary: 150 98% 30%;

  --sidebar-primary-foreground: 150 98% 97%;

  --sidebar-accent: 162 8% 20%;

  --sidebar-accent-foreground: 150 98% 85%;

  --sidebar-ring: 150 98% 30%;

  --popover: 162 4% 14%;

  --popover-foreground: 162 4% 90%;

  --popover-border: 162 4% 20%;

  --primary: 150 98% 30%;

  --primary-foreground: 150 98% 97%;

  --secondary: 162 4% 18%;

  --secondary-foreground: 162 4% 90%;

  --muted: 162 6% 16%;

  --muted-foreground: 162 6% 65%;

  --accent: 162 8% 18%;

  --accent-foreground: 162 100% 85%;

  --destructive: 0 84% 30%;

  --destructive-foreground: 0 84% 97%;

  --input: 162 4% 35%;
  --ring: 150 98% 30%;
  --chart-1: 150 98% 70%;
  --chart-2: 75 67% 65%;
  --chart-3: 220 90% 70%;
  --chart-4: 38 75% 65%;
  --chart-5: 280 65% 75%;

  --shadow-2xs: 0px 2px 0px 0px hsl(0 0% 0% / 0.00);
  --shadow-xs: 0px 2px 0px 0px hsl(0 0% 0% / 0.00);
  --shadow-sm: 0px 2px 0px 0px hsl(0 0% 0% / 0.00), 0px 1px 2px -1px hsl(0 0% 0% / 0.00);
  --shadow: 0px 2px 0px 0px hsl(0 0% 0% / 0.00), 0px 1px 2px -1px hsl(0 0% 0% / 0.00);
  --shadow-md: 0px 2px 0px 0px hsl(0 0% 0% / 0.00), 0px 2px 4px -1px hsl(0 0% 0% / 0.00);
  --shadow-lg: 0px 2px 0px 0px hsl(0 0% 0% / 0.00), 0px 4px 6px -1px hsl(0 0% 0% / 0.00);
  --shadow-xl: 0px 2px 0px 0px hsl(0 0% 0% / 0.00), 0px 8px 10px -1px hsl(0 0% 0% / 0.00);
  --shadow-2xl: 0px 2px 0px 0px hsl(0 0% 0% / 0.00);

  /* Fallback for older browsers */
  --sidebar-primary-border: hsl(var(--sidebar-primary));
  --sidebar-primary-border: hsl(from hsl(var(--sidebar-primary)) h s calc(l + var(--opaque-button-border-intensity)) / alpha);

  /* Fallback for older browsers */
  --sidebar-accent-border: hsl(var(--sidebar-accent));
  --sidebar-accent-border: hsl(from hsl(var(--sidebar-accent)) h s calc(l + var(--opaque-button-border-intensity)) / alpha);

  /* Fallback for older browsers */
  --primary-border: hsl(var(--primary));
  --primary-border: hsl(from hsl(var(--primary)) h s calc(l + var(--opaque-button-border-intensity)) / alpha);

  /* Fallback for older browsers */
  --secondary-border: hsl(var(--secondary));
  --secondary-border: hsl(from hsl(var(--secondary)) h s calc(l + var(--opaque-button-border-intensity)) / alpha);

  /* Fallback for older browsers */
  --muted-border: hsl(var(--muted));
  --muted-border: hsl(from hsl(var(--muted)) h s calc(l + var(--opaque-button-border-intensity)) / alpha);

  /* Fallback for older browsers */
  --accent-border: hsl(var(--accent));
  --accent-border: hsl(from hsl(var(--accent)) h s calc(l + var(--opaque-button-border-intensity)) / alpha);

  /* Fallback for older browsers */
  --destructive-border: hsl(var(--destructive));
  --destructive-border: hsl(from hsl(var(--destructive)) h s calc(l + var(--opaque-button-border-intensity)) / alpha);
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply antialiased bg-background text-foreground;
    font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
}

@layer utilities {

  /* Hide ugly search cancel button in Chrome until we can style it properly */
  input[type="search"]::-webkit-search-cancel-button {
    @apply hidden;
  }

  /* Placeholder styling for contentEditable div */
  [contenteditable][data-placeholder]:empty::before {
    content: attr(data-placeholder);
    color: hsl(var(--muted-foreground));
    pointer-events: none;
  }

  .no-default-hover-elevate {}

  .no-default-active-elevate {}

  .toggle-elevate::before,
  .toggle-elevate-2::before {
    content: "";
    pointer-events: none;
    position: absolute;
    inset: 0px;
    border-radius: inherit;
    z-index: -1;
  }

  .toggle-elevate.toggle-elevated::before {
    background-color: var(--elevate-2);
  }

  .border.toggle-elevate::before {
    inset: -1px;
  }

  .hover-elevate:not(.no-default-hover-elevate),
  .active-elevate:not(.no-default-active-elevate),
  .hover-elevate-2:not(.no-default-hover-elevate),
  .active-elevate-2:not(.no-default-active-elevate) {
    position: relative;
    z-index: 0;
  }

  .hover-elevate:not(.no-default-hover-elevate)::after,
  .active-elevate:not(.no-default-active-elevate)::after,
  .hover-elevate-2:not(.no-default-hover-elevate)::after,
  .active-elevate-2:not(.no-default-active-elevate)::after {
    content: "";
    pointer-events: none;
    position: absolute;
    inset: 0px;
    border-radius: inherit;
    z-index: 999;
  }

  .hover-elevate:hover:not(.no-default-hover-elevate)::after,
  .active-elevate:active:not(.no-default-active-elevate)::after {
    background-color: var(--elevate-1);
  }

  .hover-elevate-2:hover:not(.no-default-hover-elevate)::after,
  .active-elevate-2:active:not(.no-default-active-elevate)::after {
    background-color: var(--elevate-2);
  }

  .border.hover-elevate:not(.no-hover-interaction-elevate)::after,
  .border.active-elevate:not(.no-active-interaction-elevate)::after,
  .border.hover-elevate-2:not(.no-hover-interaction-elevate)::after,
  .border.active-elevate-2:not(.no-active-interaction-elevate)::after,
  .border.hover-elevate:not(.no-hover-interaction-elevate)::after {
    inset: -1px;
  }

  /* Hide default number input spinners */
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type=number] {
    -moz-appearance: textfield;
  }

  .custom-number-input::-webkit-inner-spin-button,
  .custom-number-input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}
```

---

## RIA-Nov-2025 — `tailwind.config.ts`
Source: `D:\anti-gravity-projects\RIA\RIA-Nov-2025\tailwind.config.ts`

```ts
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: ".5625rem", /* 9px */
        md: ".375rem", /* 6px */
        sm: ".1875rem", /* 3px */
      },
      colors: {
        // Brand colors for Financial Fee Calculator
        'brand-primary': '#017a3d',
        'brand-accent': '#76a923',
        'brand-gold': '#af8a49',
        
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
          border: "hsl(var(--card-border) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
          border: "hsl(var(--popover-border) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
          border: "var(--primary-border)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
          border: "var(--secondary-border)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
          border: "var(--muted-border)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
          border: "var(--accent-border)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
          border: "var(--destructive-border)",
        },
        ring: "hsl(var(--ring) / <alpha-value>)",
        chart: {
          "1": "hsl(var(--chart-1) / <alpha-value>)",
          "2": "hsl(var(--chart-2) / <alpha-value>)",
          "3": "hsl(var(--chart-3) / <alpha-value>)",
          "4": "hsl(var(--chart-4) / <alpha-value>)",
          "5": "hsl(var(--chart-5) / <alpha-value>)",
        },
        sidebar: {
          ring: "hsl(var(--sidebar-ring) / <alpha-value>)",
          DEFAULT: "hsl(var(--sidebar) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-foreground) / <alpha-value>)",
          border: "hsl(var(--sidebar-border) / <alpha-value>)",
        },
        "sidebar-primary": {
          DEFAULT: "hsl(var(--sidebar-primary) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-primary-foreground) / <alpha-value>)",
          border: "var(--sidebar-primary-border)",
        },
        "sidebar-accent": {
          DEFAULT: "hsl(var(--sidebar-accent) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-accent-foreground) / <alpha-value>)",
          border: "var(--sidebar-accent-border)"
        },
        status: {
          online: "rgb(34 197 94)",
          away: "rgb(245 158 11)",
          busy: "rgb(239 68 68)",
          offline: "rgb(156 163 175)",
        },
      },
      fontFamily: {
        sans: ["Source Sans 3", "var(--font-sans)"],
        heading: ["Montserrat", "sans-serif"],
        mono: ["var(--font-mono)"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(-8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "pulse-slow": "pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
```

---

## RIA-Nov-2025 — `postcss.config.js`
Source: `D:\anti-gravity-projects\RIA\RIA-Nov-2025\postcss.config.js`

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

---

## RIA-Nov-2025 — `package.json`
Source: `D:\anti-gravity-projects\RIA\RIA-Nov-2025\package.json`

```json
{
  "name": "rest-express",
  "version": "1.0.0",
  "type": "module",
  "license": "MIT",
  "scripts": {
    "dev": "cross-env NODE_ENV=development tsx server/index.ts",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "cross-env NODE_ENV=production node dist/index.js",
    "check": "tsc",
    "db:push": "drizzle-kit push"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.10.0",
    "@jridgewell/trace-mapping": "^0.3.25",
    "@neondatabase/serverless": "^0.10.4",
    "@radix-ui/react-accordion": "^1.2.4",
    "@radix-ui/react-alert-dialog": "^1.1.7",
    "@radix-ui/react-aspect-ratio": "^1.1.3",
    "@radix-ui/react-avatar": "^1.1.4",
    "@radix-ui/react-checkbox": "^1.1.5",
    "@radix-ui/react-collapsible": "^1.1.4",
    "@radix-ui/react-context-menu": "^2.2.7",
    "@radix-ui/react-dialog": "^1.1.7",
    "@radix-ui/react-dropdown-menu": "^2.1.7",
    "@radix-ui/react-hover-card": "^1.1.7",
    "@radix-ui/react-label": "^2.1.3",
    "@radix-ui/react-menubar": "^1.1.7",
    "@radix-ui/react-navigation-menu": "^1.2.6",
    "@radix-ui/react-popover": "^1.1.7",
    "@radix-ui/react-progress": "^1.1.3",
    "@radix-ui/react-radio-group": "^1.2.4",
    "@radix-ui/react-scroll-area": "^1.2.4",
    "@radix-ui/react-select": "^2.1.7",
    "@radix-ui/react-separator": "^1.1.3",
    "@radix-ui/react-slider": "^1.2.4",
    "@radix-ui/react-slot": "^1.2.0",
    "@radix-ui/react-switch": "^1.1.4",
    "@radix-ui/react-tabs": "^1.1.4",
    "@radix-ui/react-toast": "^1.2.7",
    "@radix-ui/react-toggle": "^1.1.3",
    "@radix-ui/react-toggle-group": "^1.1.3",
    "@radix-ui/react-tooltip": "^1.2.0",
    "@tanstack/react-query": "^5.60.5",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "connect-pg-simple": "^10.0.0",
    "date-fns": "^3.6.0",
    "drizzle-orm": "^0.39.1",
    "drizzle-zod": "^0.7.0",
    "embla-carousel-react": "^8.6.0",
    "express": "^4.21.2",
    "express-session": "^1.18.1",
    "firebase": "^12.6.0",
    "framer-motion": "^11.13.1",
    "input-otp": "^1.4.2",
    "lucide-react": "^0.453.0",
    "memorystore": "^1.6.7",
    "next-themes": "^0.4.6",
    "passport": "^0.7.0",
    "passport-local": "^1.0.0",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.55.0",
    "react-icons": "^5.4.0",
    "react-resizable-panels": "^2.1.7",
    "recharts": "^2.15.2",
    "tailwind-merge": "^2.6.0",
    "tailwindcss-animate": "^1.0.7",
    "tw-animate-css": "^1.2.5",
    "vaul": "^1.1.2",
    "wouter": "^3.3.5",
    "ws": "^8.18.0",
    "zod": "^3.24.2",
    "zod-validation-error": "^3.4.0"
  },
  "devDependencies": {
    "@replit/vite-plugin-cartographer": "^0.4.1",
    "@replit/vite-plugin-dev-banner": "^0.1.1",
    "@replit/vite-plugin-runtime-error-modal": "^0.0.3",
    "@tailwindcss/typography": "^0.5.15",
    "@tailwindcss/vite": "^4.1.3",
    "@types/connect-pg-simple": "^7.0.3",
    "@types/express": "4.17.21",
    "@types/express-session": "^1.18.0",
    "@types/node": "20.16.11",
    "@types/passport": "^1.0.16",
    "@types/passport-local": "^1.0.38",
    "@types/react": "^18.3.11",
    "@types/react-dom": "^18.3.1",
    "@types/ws": "^8.5.13",
    "@vitejs/plugin-react": "^4.7.0",
    "autoprefixer": "^10.4.20",
    "cross-env": "^10.1.0",
    "drizzle-kit": "^0.31.4",
    "esbuild": "^0.25.0",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.17",
    "tsx": "^4.20.5",
    "typescript": "5.6.3",
    "vite": "^5.4.20"
  },
  "optionalDependencies": {
    "bufferutil": "^4.0.8"
  }
}
```


