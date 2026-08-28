"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, ShieldCheck, Droplets, Truck, Award } from "lucide-react";

export interface HeroSlideItem {
  _id?: string;
  title: string;
  subtitle?: string;
  backgroundImage: string;
  buttonText?: string;
  buttonUrl?: string;
}

interface HeroSliderProps {
  slides?: HeroSlideItem[];
}

const DEFAULT_SLIDES: HeroSlideItem[] = [
  {
    _id: "default-1",
    title: "১০০% খাঁটি কাঠের ঘানিভাঙা সরষের তেল",
    subtitle: "মাটির সোঁদা গন্ধ আর দেশি সরিষার আসল ঝাঁঝে তৈরি শতভাগ নির্ভেজাল কাঠের ঘানিভাঙা তেল। কোনো কেমিক্যাল বা কৃত্রিম গন্ধ ছাড়া খাঁটি পুষ্টিগুণে ভরপুর।",
    backgroundImage: "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=1920&q=85",
    buttonText: "তেল সংগ্রহ করুন / Shop Now",
    buttonUrl: "/shop",
  },
  {
    _id: "default-2",
    title: "ঐতিহ্যবাহী কোল্ড-প্রেসড খাঁটি সরিষার তেল",
    subtitle: "সনাতন কাঠের ঘানিতে ধীরগতিতে ভাঙানো তেল—যেখানে তেলের তাপমাত্রা সর্বদা ৪০°C এর নিচে থাকে। ফলে সরিষার প্রতিটি পুষ্টি উপাদান থাকে অক্ষুণ্ণ।",
    backgroundImage: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1920&q=85",
    buttonText: "আমাদের সংগ্রহ দেখুন / View Catalog",
    buttonUrl: "/shop",
  },
];

export default function HeroSlider({ slides }: HeroSliderProps) {
  const activeSlides = slides && slides.length > 0 ? slides : DEFAULT_SLIDES;
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % activeSlides.length);
  }, [activeSlides.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  }, [activeSlides.length]);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [next, activeSlides.length]);

  const slide = activeSlides[current] || activeSlides[0];

  return (
    <section className="relative w-full overflow-hidden bg-[#1D4D4F] border-b border-[#EADFCF]">
      {/* Hero Container: Fixed uniform height across all slides to prevent height jumping */}
      <div className="relative w-full h-[540px] sm:h-[600px] md:h-[640px] lg:h-[700px] flex items-center justify-center overflow-hidden">
        
        {/* Background Image Carousel Layer */}
        {activeSlides.map((s, idx) => (
          <div
            key={s._id || idx}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              idx === current ? "opacity-100 z-0" : "opacity-0 pointer-events-none"
            }`}
          >
            <img
              src={s.backgroundImage}
              alt={s.title}
              className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
            />

            {/* Smart Gradient Overlays: keeps background photo vivid and visible while ensuring crisp text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent lg:w-3/4" />
          </div>
        ))}

        {/* Floating Content Card */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl space-y-6">
            
            {/* Top Quality Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-[#FDE68A]/40 text-[#FDE68A] text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg">
              <Sparkles className="w-4 h-4 text-[#FDE68A] animate-pulse" />
              <span>১০০% খাঁটি কাঠের ঘানিভাঙা তেল • Cold-Pressed Pure Ghani</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-serif text-white tracking-tight leading-[1.15] drop-shadow-lg line-clamp-2">
              {slide.title}
            </h1>

            {/* Subtitle */}
            {slide.subtitle && (
              <p className="text-base sm:text-lg lg:text-xl text-gray-100 font-normal leading-relaxed max-w-2xl drop-shadow-md line-clamp-2 sm:line-clamp-3">
                {slide.subtitle}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={slide.buttonUrl || "/shop"}
                className="px-8 py-4 bg-gradient-to-r from-[#C88A2B] to-[#A46B1E] hover:from-[#A46B1E] hover:to-[#835212] text-white font-extrabold text-xs sm:text-sm uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-amber-950/40 flex items-center gap-2.5 hover:scale-[1.03] active:scale-[0.98]"
              >
                {slide.buttonText || "তেল সংগ্রহ করুন / Shop Now"}
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/about"
                className="px-8 py-4 bg-black/35 hover:bg-black/50 border border-white/30 hover:border-white text-white font-extrabold text-xs sm:text-sm uppercase tracking-widest rounded-xl transition-all backdrop-blur-md flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                আমাদের ঘানি গল্প (Our Story)
              </Link>
            </div>

            {/* Trust Highlights Pills */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-white/20">
              <div className="flex items-center gap-2 text-white/95 text-xs font-semibold backdrop-blur-sm bg-black/25 py-2 px-3 rounded-lg border border-white/10">
                <Droplets className="w-4 h-4 text-[#FDE68A] shrink-0" />
                <span>প্রাকৃতিক ঝাঁঝ</span>
              </div>
              <div className="flex items-center gap-2 text-white/95 text-xs font-semibold backdrop-blur-sm bg-black/25 py-2 px-3 rounded-lg border border-white/10">
                <ShieldCheck className="w-4 h-4 text-[#FDE68A] shrink-0" />
                <span>০% কেমিক্যাল</span>
              </div>
              <div className="flex items-center gap-2 text-white/95 text-xs font-semibold backdrop-blur-sm bg-black/25 py-2 px-3 rounded-lg border border-white/10">
                <Award className="w-4 h-4 text-[#FDE68A] shrink-0" />
                <span>কোল্ড প্রেসড</span>
              </div>
              <div className="flex items-center gap-2 text-white/95 text-xs font-semibold backdrop-blur-sm bg-black/25 py-2 px-3 rounded-lg border border-white/10">
                <Truck className="w-4 h-4 text-[#FDE68A] shrink-0" />
                <span>ক্যাশ অন ডেলিভারি</span>
              </div>
            </div>

          </div>
        </div>

        {/* Carousel Navigation (Arrows & Indicators) */}
        {activeSlides.length > 1 && (
          <>
            {/* Prev Button */}
            <button
              onClick={prev}
              aria-label="Previous Slide"
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/35 hover:bg-[#C88A2B] text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={next}
              aria-label="Next Slide"
              className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/35 hover:bg-[#C88A2B] text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
              {activeSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`transition-all duration-300 rounded-full ${
                    index === current
                      ? "w-8 h-2 bg-[#FDE68A]"
                      : "w-2 h-2 bg-white/40 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}

      </div>
    </section>
  );
}
