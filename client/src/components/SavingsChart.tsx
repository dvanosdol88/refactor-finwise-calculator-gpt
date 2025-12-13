import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Text, Customized, ReferenceLine } from 'recharts';
import { useState, useEffect } from 'react';
import type { ChartDataPoint } from '@shared/schema';

interface SavingsChartProps {
  data: ChartDataPoint[];
  firstYearSavings: number;
  totalSavings: number;
  years: number;
  portfolioValue: number;
  viewMode?: 'savings' | 'spending';
  annualFeePercent?: number;
}

const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

const formatCurrency = (value: number) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
};

const formatFullCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Custom overlay component to render text at pixel coordinates
interface CustomChartOverlayProps {
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  firstYearSavings: number;
  totalSavings: number;
  years: number;
  isTablet: boolean;
  isDesktop: boolean;
}

const CustomChartOverlay: React.FC<CustomChartOverlayProps> = ({
  margin,
  width,
  firstYearSavings,
  totalSavings,
  years,
  isTablet,
  isDesktop
}) => {
  if (!margin || !width) return null;

  // Calculate responsive positions based on chart width and breakpoint
  // Mobile: 10%/90% (tight spacing for narrow screens)
  // Tablet: 15%/85% (moderate spacing)
  // Desktop: 18%/82% (comfortable spacing)
  const leftPercent = isDesktop ? 0.18 : isTablet ? 0.15 : 0.1;
  const rightPercent = isDesktop ? 0.82 : isTablet ? 0.85 : 0.9;

  const firstYearSavingsX = margin.left + (width * leftPercent) - 10;
  const firstYearSavingsLabelY = margin.top + 45;
  const firstYearSavingsValueY = margin.top + 70;

  const totalSavingsX = margin.left + (width * rightPercent) - 10;
  const totalSavingsLabelY = margin.top + 45;
  const totalSavingsValueY = margin.top + 70;

  return (
    <g>
      {/* First Year Savings Text */}
      <Text
        x={firstYearSavingsX}
        y={firstYearSavingsLabelY}
        textAnchor="start"
        fill="hsl(var(--muted-foreground))"
        style={{ fontSize: 13 }}
      >
        First Year Savings
      </Text>
      <Text
        x={firstYearSavingsX}
        y={firstYearSavingsValueY}
        textAnchor="start"
        fill="hsl(var(--foreground))"
        style={{ fontSize: 20, fontWeight: 'bold' }}
      >
        {formatFullCurrency(firstYearSavings)}
      </Text>

      {/* Total Savings Text */}
      <Text
        x={totalSavingsX}
        y={totalSavingsLabelY}
        textAnchor="end"
        fill="hsl(var(--muted-foreground))"
        style={{ fontSize: 13 }}
      >
        {`Total Savings over ${years} Years`}
      </Text>
      <Text
        x={totalSavingsX}
        y={totalSavingsValueY}
        textAnchor="end"
        fill="hsl(var(--foreground))"
        style={{ fontSize: 20, fontWeight: 'bold' }}
      >
        {formatFullCurrency(totalSavings)}
      </Text>
    </g>
  );
};

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // Check if we are in Spend Mode (look for specific data keys)
    const isSpendMode = payload.some((p: any) => p.dataKey === 'percentFeePortfolio' || p.dataKey === 'flatFeePortfolio');

    if (isSpendMode) {
      const currentAdvisorValue = payload.find((p: any) => p.dataKey === 'percentFeePortfolio')?.value || 0;
      const flatFeeValue = payload.find((p: any) => p.dataKey === 'flatFeePortfolio')?.value || 0;
      const difference = flatFeeValue - currentAdvisorValue;

      return (
        <div className="bg-background/95 backdrop-blur-sm p-3 border border-border rounded-lg shadow-md">
          <p className="label text-muted-foreground font-heading text-sm mb-2">
            {`Year ${label}`}
          </p>
          <div className="space-y-1">
            <p className="text-[#2563eb] font-semibold font-heading text-sm">
              {`Current Advisor: ${formatFullCurrency(currentAdvisorValue)}`}
            </p>
            <p className="text-[#76a923] font-semibold font-heading text-sm">
              {`Flat Fee: ${formatFullCurrency(flatFeeValue)}`}
            </p>
            <p className="text-red-500 font-semibold font-heading text-sm">
              {`Difference: ${formatFullCurrency(difference)}`}
            </p>
          </div>
        </div>
      );
    }

    // Save Mode - show portfolio values
    const currentAdvisorValue = payload.find((p: any) => p.dataKey === 'percentFeePortfolio')?.value || 0;
    const flatFeeValue = payload.find((p: any) => p.dataKey === 'flatFeePortfolio')?.value || 0;
    const savings = flatFeeValue - currentAdvisorValue;

    return (
      <div className="bg-transparent dark:bg-transparent backdrop-blur-sm p-3 border border-popover-border rounded-lg shadow-md">
        <p className="label text-muted-foreground font-heading text-sm mb-2">
          {`Year ${label}`}
        </p>
        <div className="space-y-1">
          <p className="text-[#2563eb] font-semibold font-heading text-sm">
            {`Current Advisor: ${formatFullCurrency(currentAdvisorValue)}`}
          </p>
          <p className="text-[#76a923] font-semibold font-heading text-sm">
            {`Flat Fee: ${formatFullCurrency(flatFeeValue)}`}
          </p>
          <p className="text-[#76a923] font-semibold font-heading text-sm border-t border-border pt-1 mt-1">
            {`Savings: ${formatFullCurrency(savings)}`}
          </p>
        </div>
      </div>
    );
  }

  return null;
};

const CustomLegend: React.FC<any> = ({ payload }) => {
  if (!payload || !payload.length) {
    return null;
  }

  // Filter out the savings area from legend (it's just fill, not a line)
  const visiblePayload = payload.filter((entry: any) => entry.dataKey !== 'savings');

  return (
    <div className="flex justify-center gap-8 mt-4 flex-wrap">
      {visiblePayload.map((entry: any, index: number) => (
        <div key={index} className="inline-flex items-center gap-x-4 border border-border rounded px-6 py-2 bg-transparent shadow-none">
          <svg height="20" width="40">
            <line
              x1="0"
              y1="10"
              x2="40"
              y2="10"
              style={{
                stroke: entry.color,
                strokeWidth: 4
              }}
            />
          </svg>
          <span className="text-sm font-medium text-muted-foreground font-heading">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function SavingsChart({
  data,
  firstYearSavings,
  totalSavings,
  years,
  portfolioValue,
  viewMode = 'savings',
  annualFeePercent = 1.0
}: SavingsChartProps) {
  // Detect screen size for responsive chart configuration
  const isTablet = useMediaQuery('(min-width: 768px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // Responsive chart margins
  const chartMargin = {
    top: 5,
    right: isDesktop ? 36 : isTablet ? 24 : 20,
    left: isDesktop ? 32 : isTablet ? 24 : 10,
    bottom: 5,
  };

  // Responsive Y-axis width
  const yAxisWidth = isDesktop ? 80 : isTablet ? 70 : 55;

  // Calculate dynamic Y-axis bounds
  const calculateYAxisDomain = (): [number, number] => {
    if (data.length === 0) return [0, 100000]; // Default range if no data

    if (viewMode === 'spending') {
      // SPEND Mode: Hard-lock minimum at 0, find max from portfolio values
      const allValues = data.flatMap(d => [d.percentFeePortfolio, d.flatFeePortfolio]).filter(v => isFinite(v));
      if (allValues.length === 0) return [0, 100000];

      const maxVal = Math.max(...allValues);
      const padding = maxVal * 0.05; // 5% padding on top only

      return [0, maxVal + padding];
    } else {
      // SAVE Mode: Dynamic Y-axis scaling
      // Min: 95% of input portfolio value
      // Max: 105% of flat fee ending portfolio value
      const portfolioValues = data.flatMap(d => [d.percentFeePortfolio, d.flatFeePortfolio]).filter(v => isFinite(v));
      if (portfolioValues.length === 0) return [0, 100000];

      // Min: 95% of the input portfolio value
      const yAxisMin = portfolioValue * 0.95;

      // Max: 105% of flat fee ending value (top line)
      const finalFlatFeeValue = data[data.length - 1]?.flatFeePortfolio || portfolioValues[portfolioValues.length - 1];
      const yAxisMax = finalFlatFeeValue * 1.05;

      return [yAxisMin, yAxisMax];
    }
  };

  const yAxisDomain = calculateYAxisDomain();

  // Calculate Y-axis ticks dynamically
  const calculateYAxisTicks = (): number[] => {
    const [min, max] = yAxisDomain;
    const range = max - min;
    if (range <= 0) return [min];

    // Target about 6-8 ticks
    const rawInterval = range / 6;

    // Find magnitude (power of 10)
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawInterval)));
    const normalized = rawInterval / magnitude;

    // Round to nice interval (1, 2, 5, 10)
    let niceInterval;
    if (normalized < 1.5) niceInterval = 1;
    else if (normalized < 3) niceInterval = 2;
    else if (normalized < 7) niceInterval = 5;
    else niceInterval = 10;

    const tickInterval = niceInterval * magnitude;

    // Round min down to nearest interval
    const minTick = Math.floor(min / tickInterval) * tickInterval;
    // Round max up to nearest interval
    const maxTick = Math.ceil(max / tickInterval) * tickInterval;

    const ticks: number[] = [];
    for (let tick = minTick; tick <= maxTick + (tickInterval / 100); tick += tickInterval) {
      if (tick >= min * 0.99 && tick <= max * 1.01) { // Only include ticks reasonably within view
        ticks.push(tick);
      }
    }

    // Ensure we at least have the min and max if they are far from generated ticks
    // But usually the grid looks better if ticks are on the interval.

    return ticks;
  };

  const yAxisTicks = calculateYAxisTicks();

  return (
    <ResponsiveContainer width="100%" height="100%">
      {data.length > 0 ? (
        <AreaChart
          data={data}
          margin={chartMargin}
        >
          <defs>
            <linearGradient id="savingsGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#76a923" stopOpacity={0.3} />
              <stop offset="50%" stopColor="#017a3d" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#006044" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="year"
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontFamily: 'Source Sans 3' }}
            label={{
              value: 'Years',
              position: 'insideBottom',
              offset: -5,
              fill: 'hsl(var(--muted-foreground))',
              style: { fontFamily: 'Montserrat', fontWeight: 600 }
            }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={{ stroke: 'hsl(var(--border))' }}
          />
          <YAxis
            type="number"
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontFamily: 'Source Sans 3' }}
            tickFormatter={formatCurrency}
            domain={yAxisDomain}
            ticks={yAxisTicks}
            width={yAxisWidth}
            padding={{ top: 10, bottom: 0 }}
            allowDataOverflow={true}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={{ stroke: 'hsl(var(--border))' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />

          {/* Highlight Zero Line in Spending Mode */}
          {viewMode === 'spending' && (
            <ReferenceLine y={0} stroke="#000000" strokeWidth={3} label="" />
          )}

          {/* 
            Unified Area Components for Smooth Transitions 
            Instead of conditionally rendering different components, we render the same components
            and update their props. This allows Recharts to animate the transition.
          */}

          {/* Bottom Layer: Current Advisor / Percent Fee Portfolio */}
          <Area
            type="monotone"
            dataKey="percentFeePortfolio"
            stroke="#2563eb"
            strokeWidth={3}
            fill="#2563eb"
            fillOpacity={viewMode === 'spending' ? 0.1 : 0}
            stackId={viewMode === 'spending' ? "portfolio" : "savings"}
            name={viewMode === 'spending' ? `Portfolio Value with ${annualFeePercent.toFixed(2)}% fee` : `Current Portfolio @ ${annualFeePercent.toFixed(2)}% Fee`}
            dot={false}
            activeDot={{ r: 6, fill: '#2563eb', stroke: '#ffffff', strokeWidth: 2 }}
            animationDuration={1000}
          />

          {/* Middle Layer: Savings / Difference */}
          <Area
            type="monotone"
            dataKey="savings"
            stroke="none"
            fill={viewMode === 'spending' ? "#ef4444" : "url(#savingsGradient)"}
            fillOpacity={viewMode === 'spending' ? 0.1 : 1}
            stackId={viewMode === 'spending' ? "portfolio" : "savings"}
            name={viewMode === 'spending' ? "Difference" : "Savings"}
            dot={false}
            animationDuration={1000}
          />

          {/* Top Layer: Flat Fee Portfolio */}
          {/* 
            Note: In 'spending' mode, this is stacked on top of the others to show the total.
            In 'savings' mode, this is NOT stacked (stackId=undefined) so it renders as an absolute line on top.
          */}
          <Area
            type="monotone"
            dataKey="flatFeePortfolio"
            stroke="#76a923"
            strokeWidth={3}
            fill="#76a923"
            fillOpacity={viewMode === 'spending' ? 0.1 : 0}
            stackId={viewMode === 'spending' ? undefined : undefined}
            name={viewMode === 'spending' ? "Portfolio Value with Flat $1,200 fee" : "Portfolio @ $1,200 Annual Flat Fee"}
            dot={false}
            activeDot={{ r: viewMode === 'spending' ? 6 : 8, fill: '#76a923', stroke: '#ffffff', strokeWidth: 2 }}
            animationDuration={1000}
          />

          {/* Custom overlay only for Savings Mode */}
          {viewMode === 'savings' && (
            <Customized
              component={(props: any) => (
                <CustomChartOverlay
                  {...props}
                  firstYearSavings={firstYearSavings}
                  totalSavings={totalSavings}
                  years={years}
                  isTablet={isTablet}
                  isDesktop={isDesktop}
                />
              )}
            />
          )}
        </AreaChart>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <p className="font-heading">Adjust the controls to see your potential savings.</p>
        </div>
      )}
    </ResponsiveContainer>
  );
}