"use client";

import React, { useCallback, useEffect, useState, useMemo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FlippableCard } from '@/components/FlippableCard';
import brainAiImage from '@assets/brain-plus-AI (3)_1764083318460.png';
import piggyBankImage from '@assets/save_money_piggy_bank_correct_color_1764085668526.png';
import financialAnalysisImage from '@assets/financial-analysis-icon_1764086429828.png';
// financialAnalysisImage no longer needed for card 2 if we use DonutChart

interface CarouselSectionProps {
  portfolioValue: number;
  annualFeePercent: number;
  portfolioGrowth: number;
  years: number;
}

export function CarouselSection({
  portfolioValue,
  annualFeePercent,
  portfolioGrowth,
  years,
}: CarouselSectionProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    slidesToScroll: 1,
  });

  const carouselItems = useMemo(() => [
    {
      title: 'Upgrade Your Advice',
      image: brainAiImage,
      description: (
        <>
          The Process of a <span className="font-bold text-gray-900">CFP® Professional</span>. The Rigor of a <span className="font-bold text-gray-900">CFA Charterholder</span>.
          <br />
          The Power of Artificial Intelligence. The Experience of your personal advisor.
          <br />
          <br />
          <div className="text-sm">
            Other:
            <br />
            The Relationship with your Advisor. The Trust of a Fiduciary.
            <br />
            The Freedom of Independence. The Choice of Independence.
          </div>
        </>
      ),
    },
    {
      title: 'Improve Your Tools',
      image: financialAnalysisImage,
      description: (
        <>
          See exactly where your returns are going.
          <br />
          <br />
          <span className="font-bold text-gray-900">Better Tools = Better Information = Better Decisions.</span>
        </>
      ),
    },
    {
      title: 'Save a TON of Money',
      image: piggyBankImage,
      description: (
        <>
          Keep more of your investment growth with our $100/month flat fee.
        </>
      ),
    },
  ], [portfolioValue, annualFeePercent, portfolioGrowth, years]);

  // --- State and functions for the buttons ---
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );
  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="py-8 md:py-16 bg-white relative">
      <div className="container mx-auto px-4">
        {/* Main Title (spacing reduced) */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800">
          <span className={selectedIndex === 0 ? "text-primary" : ""}>Upgrade</span>.{' '}
          <span className={selectedIndex === 1 ? "text-primary" : ""}>Improve</span>.{' '}
          <span className={selectedIndex === 2 ? "text-primary" : ""}>Save</span>?
        </h2>

        {/* --- Embla Carousel Structure --- */}
        {/* Width reduced by 20% from max-w-4xl (896px -> 717px) */}
        <div className="embla relative max-w-[717px] mx-auto">
          <div className="embla__viewport overflow-hidden" ref={emblaRef}>
            <div className="embla__container flex">
              {carouselItems.map((item, index) => (
                <div
                  className="embla__slide flex-[0_0_100%] min-w-0 p-4 pt-[8px] pb-[8px]"
                  key={index}
                >
                  {/* Height increased (min-h-[420px]) to allow for Donut Chart */}
                  <div className="min-h-[420px]">
                    <FlippableCard item={item} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- Dot Indicators --- */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`h-2 rounded-full transition-all ${selectedIndex === index
                  ? 'w-8 bg-primary' // Active dot
                  : 'w-2 bg-gray-400 hover:bg-gray-500' // Inactive dot
                  }`}
                aria-label={`Go to slide ${index + 1}`}
                data-testid={`button-carousel-indicator-${index}`}
              />
            ))}
          </div>

          {/* --- Navigation Buttons --- */}
          <Button
            size="icon"
            variant="default"
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
            className="!absolute hidden md:flex left-4 md:-left-16 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#006044] shadow-lg z-10 h-12 w-12 rounded-full"
            data-testid="button-carousel-prev"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            size="icon"
            variant="default"
            onClick={scrollNext}
            disabled={nextBtnDisabled}
            className="!absolute hidden md:flex right-4 md:-right-16 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#006044] shadow-lg z-10 h-12 w-12 rounded-full"
            data-testid="button-carousel-next"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </section>
  );
}

export default CarouselSection;
