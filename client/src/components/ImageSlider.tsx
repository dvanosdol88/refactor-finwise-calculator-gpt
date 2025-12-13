import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import slide1 from '@assets/stock_images/financial_planning_c_16ed895d.jpg';
import slide2 from '@assets/stock_images/financial_planning_c_a59d4349.jpg';
import slide3 from '@assets/stock_images/financial_planning_c_4f746dec.jpg';

const slides = [
  { id: 1, image: slide1, alt: 'Financial planning concept 1' },
  { id: 2, image: slide2, alt: 'Financial planning concept 2' },
  { id: 3, image: slide3, alt: 'Financial planning concept 3' },
];

export default function ImageSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-12 lg:px-16 relative" style={{ minHeight: '300px' }}>
      <div className="relative w-full shadow-lg" style={{ aspectRatio: '16/9' }}>
        <div className="overflow-hidden w-full h-full rounded-2xl">
          <div
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="min-w-full h-full flex-shrink-0"
              >
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="w-full h-full object-cover"
                  data-testid={`img-slide-${slide.id}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === index 
                  ? 'w-8 bg-white' 
                  : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
              data-testid={`button-slide-indicator-${index}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <Button
        size="icon"
        variant="default"
        onClick={goToPrevious}
        className="absolute left-0 md:left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#006044] shadow-lg z-10"
        data-testid="button-previous-slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        size="icon"
        variant="default"
        onClick={goToNext}
        className="absolute right-0 md:right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#006044] shadow-lg z-10"
        data-testid="button-next-slide"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  );
}
