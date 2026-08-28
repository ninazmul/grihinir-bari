'use client';

import Link from "next/link";
import { ShieldCheck, Truck, RotateCcw, Headphones, Sparkles, Droplets, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function Footer() {
  const [email, setEmail] = useState('');
  const handleSubscribe = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('সঠিক ইমেইল এড্রেস লিখুন / Please enter a valid email address');
      return;
    }
    await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    toast.success('ধন্যবাদ! সফলভাবে সাবস্ক্রাইব হয়েছে / Subscribed successfully!');
    setEmail('');
  };

  return (
    <footer className="bg-[#1D4D4F] text-[#FDFBF7] border-t border-[#163A3C] pt-16 pb-12 font-sans">
      {/* Purity & Guarantees Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-[#163A3C] p-6 rounded-2xl border border-[#2A6668]">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#C88A2B] text-white rounded-xl shadow">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold tracking-wide text-white">১০০% খাঁটি কাঠের ঘানি</h4>
              <p className="text-[11px] text-[#B8D7D7]">100% Pure Ghani Oil</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#C88A2B] text-white rounded-xl shadow">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold tracking-wide text-white">কোল্ড প্রেসড &lt;৪০°C</h4>
              <p className="text-[11px] text-[#B8D7D7]">Cold Pressed below 40°C</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#C88A2B] text-white rounded-xl shadow">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold tracking-wide text-white">সারা দেশে ডেলিভারি</h4>
              <p className="text-[11px] text-[#B8D7D7]">Cash on Delivery across BD</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#C88A2B] text-white rounded-xl shadow">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold tracking-wide text-white">কাস্টমার কেয়ার</h4>
              <p className="text-[11px] text-[#B8D7D7]">Dedicated Support & Helpline</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-[#2A6668] pb-12">
        {/* Brand Info */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2 h-14 w-auto">
            <Image
              src="/assets/images/logo.png"
              alt="Grihinir Bari Logo"
              width={220}
              height={55}
              className="h-12 w-auto object-contain"
            />
          </Link>
          <p className="text-xs text-[#DBEBEB] leading-relaxed">
            গৃহিণীর বাড়ি (Grihinir Bari) — খাঁটি দেশি সরিষা থেকে সনাতন কাঠের ঘানিতে ভাঙানো শতভাগ নির্ভেজাল সরষের তেল। প্রতিটি রান্নায় অকৃত্রিম স্বাদ ও প্রাকৃতিক ঝাঁঝ।
          </p>
          <div className="text-xs font-bold text-[#FDE68A] tracking-wide">
            ঢাকা • চট্টগ্রাম • সিলেট • সারা বাংলাদেশ
          </div>
        </div>

        {/* Categories Links */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#FDE68A] mb-4 border-b border-[#2A6668] pb-2">
            পণ্য ক্যাটালগ / Products
          </h3>
          <ul className="space-y-2.5 text-xs text-[#DBEBEB] font-medium">
            <li><Link href="/shop?category=wood-pressed" className="hover:text-[#FDE68A] transition">কাঠের ঘানিভাঙা তেল (Cold Pressed)</Link></li>
            <li><Link href="/shop?category=glass-bottles" className="hover:text-[#FDE68A] transition">১ লিটার প্রিমিয়াম কাচের বোতল</Link></li>
            <li><Link href="/shop?category=5l-tin" className="hover:text-[#FDE68A] transition">৫ লিটার পারিবারিক টিন ক্যান</Link></li>
            <li><Link href="/shop?category=gift-packs" className="hover:text-[#FDE68A] transition">স্পেশাল গিফট হ্যাম্পার প্যাক</Link></li>
            <li><Link href="/shop?category=black-mustard" className="hover:text-[#FDE68A] transition">দেশি কালো সরষের তেল</Link></li>
            <li><Link href="/shop?category=yellow-mustard" className="hover:text-[#FDE68A] transition">ফিল্টার্ড হলুদ সরষের তেল</Link></li>
          </ul>
        </div>

        {/* Customer Care Links */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#FDE68A] mb-4 border-b border-[#2A6668] pb-2">
            গ্রাহক সেবা / Customer Care
          </h3>
          <ul className="space-y-2.5 text-xs text-[#DBEBEB] font-medium">
            <li><Link href="/account" className="hover:text-[#FDE68A] transition">অর্ডার ট্র্যাকিং (Track Order)</Link></li>
            <li><Link href="/returns" className="hover:text-[#FDE68A] transition">রিটার্ন ও রিপ্লেসমেন্ট নীতি</Link></li>
            <li><Link href="/privacy" className="hover:text-[#FDE68A] transition">প্রাইভেসি পলিসি (Privacy)</Link></li>
            <li><Link href="/terms" className="hover:text-[#FDE68A] transition">শর্তাবলী (Terms & Conditions)</Link></li>
            <li><Link href="/contact" className="hover:text-[#FDE68A] transition">যোগাযোগ ও হেল্পলাইন</Link></li>
            <li><Link href="/about" className="hover:text-[#FDE68A] transition">আমাদের ঐতিহ্যবাহী ঘানি গল্প</Link></li>
            <li><Link href="/blog" className="hover:text-[#FDE68A] transition">রান্নার রেসিপি ও স্বাস্থ্য পরামর্শ</Link></li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#FDE68A] mb-4 border-b border-[#2A6668] pb-2">
            গৃহিণীর পরিবারে যুক্ত হোন
          </h3>
          <p className="text-xs text-[#DBEBEB] mb-3 leading-relaxed">
            নতুন অফার, খাঁটি পণ্যের খবর ও পুষ্টি বিষয়ক তথ্য সবার আগে পেতে সাবস্ক্রাইব করুন।
          </p>
          <div className="space-y-2">
            <input
              type="email"
              placeholder="আপনার ইমেইল লিখুন..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#163A3C] border border-[#2A6668] text-white placeholder-[#86BABD] rounded-lg focus:outline-none focus:border-[#C88A2B]"
            />
            <button
              type="button"
              onClick={handleSubscribe}
              className="w-full py-2.5 bg-[#C88A2B] hover:bg-[#A46B1E] text-white font-bold text-xs uppercase tracking-widest rounded-lg transition shadow-md"
            >
              সাবস্ক্রাইব করুন (Subscribe)
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-[#B8D7D7] font-medium gap-2">
        <p>
          © {new Date().getFullYear()}{" "}
          <a href="/dashboard" target="_blank" className="hover:underline hover:text-[#FDE68A]">
            Grihinir Bari (গৃহিণীর বাড়ি)
          </a>
          . সর্বস্বত্ব সংরক্ষিত | grihinirbari.com.
          <span className="hidden sm:inline"> | </span>
          <span className="block sm:inline mt-1 sm:mt-0">
            Developed by{" "}
            <a
              href="https://www.artistycode.studio/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-[#FDE68A] font-semibold"
            >
              ArtistyCode Studio
            </a>
          </span>
        </p>
        <div className="flex items-center space-x-4 mt-3 md:mt-0">
          <Link href="/terms" className="hover:text-[#FDE68A] transition">শর্তাবলী</Link>
          <Link href="/privacy" className="hover:text-[#FDE68A] transition">গোপনীয়তা নীতি</Link>
          <Link href="/returns" className="hover:text-[#FDE68A] transition">রিটার্ন পলিসি</Link>
        </div>
      </div>
    </footer>
  );
}
