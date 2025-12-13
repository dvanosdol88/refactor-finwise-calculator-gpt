import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChartCarouselProps {
  children: React.ReactNode[];
}

const ChartCarousel: React.FC<ChartCarouselProps> = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = React.Children.count(children);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="relative w-full h-full group">
       {/* Carousel Content */}
       <div className="w-full h-full overflow-hidden relative">
         <div 
            className="w-full h-full transition-transform duration-500 ease-in-out flex"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
         >
            {React.Children.map(children, (child, index) => (
                <div className="w-full h-full flex-shrink-0 opacity-100 transition-opacity duration-300 px-2 sm:px-4">
                     {child}
                </div>
            ))}
         </div>
       </div>

      {/* Navigation Buttons */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 z-10 pointer-events-none">
        <Button
            onClick={prevSlide}
            variant="default"
            size="icon"
            className={`pointer-events-auto !absolute hidden md:flex left-2 md:-left-8 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#006044] shadow-lg z-10 h-12 w-12 rounded-full ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={currentIndex === 0}
        >
            <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 right-0 z-10 pointer-events-none">
        <Button
            onClick={nextSlide}
            variant="default"
            size="icon"
            className={`pointer-events-auto !absolute hidden md:flex right-2 md:-right-8 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#006044] shadow-lg z-10 h-12 w-12 rounded-full ${currentIndex === totalSlides - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={currentIndex === totalSlides - 1}
        >
            <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
      
        {/* Pagination Dots */}
        <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 flex space-x-2">
            {React.Children.map(children, (_, index) => (
            <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                index === currentIndex ? 'w-8 bg-[var(--brand-green)]' : 'w-2 bg-slate-300'
                }`}
            />
            ))}
        </div>
    </div>
  );
};

export default ChartCarousel;
