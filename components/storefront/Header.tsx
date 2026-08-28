"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Heart, Search, User, Menu, X, ShieldCheck, Sparkles } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import CartDrawer from "./CartDrawer";
import WishlistDrawer from "./WishlistDrawer";
import Image from "next/image";

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { totalWishlist } = useWishlist();

  const navLinks = [
    { label: "হোম (Home)", href: "/" },
    { label: "সকল তেল (All Oils)", href: "/shop" },
    { label: "কাচের বোতল (Glass Bottles)", href: "/shop?category=glass-bottles" },
    { label: "৫ লিটার টিন (5L Tin Pack)", href: "/shop?category=5l-tin" },
    { label: "কাঠের ঘানি তেল (Wood Pressed)", href: "/shop?category=wood-pressed" },
    { label: "উপহার প্যাক (Gift Packs)", href: "/shop?category=gift-packs" },
    { label: "আমাদের গল্প (Our Story)", href: "/about" },
    { label: "ব্লগ (Blog)", href: "/blog" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md text-[#271C16] border-b border-[#EADFCF] shadow-sm">
      {/* Top Announcement Bar */}
      <div className="bg-[#1D4D4F] text-[#FDFBF7] py-2 px-4 text-center text-xs font-semibold tracking-wide flex items-center justify-center gap-2 border-b border-[#163A3C]">
        <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
        <span>১০০% খাঁটি কাঠের ঘানিভাঙা সরষের তেল • সারা বাংলাদেশে ক্যাশ অন ডেলিভারি (Cash on Delivery)</span>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden text-[#271C16] p-2 hover:text-[#C88A2B] transition"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 h-14 w-auto">
          <Image
            src="/assets/images/logo.png"
            alt="Grihinir Bari Logo"
            width={220}
            height={55}
            priority
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation Menu */}
        <nav className="hidden lg:flex items-center space-x-6 text-xs font-bold tracking-wide text-[#271C16]">
          <Link href="/shop" className="hover:text-[#C88A2B] transition flex items-center gap-1">
            <span>সকল পণ্য</span> <span className="text-[10px] text-[#7A4117] font-normal">/ Shop</span>
          </Link>
          <Link href="/shop?category=wood-pressed" className="hover:text-[#C88A2B] transition flex items-center gap-1">
            <span>কাঠের ঘানি</span> <span className="text-[10px] text-[#7A4117] font-normal">/ Ghani</span>
          </Link>
          <Link href="/shop?category=glass-bottles" className="hover:text-[#C88A2B] transition flex items-center gap-1">
            <span>কাচের বোতল</span> <span className="text-[10px] text-[#7A4117] font-normal">/ 1L Glass</span>
          </Link>
          <Link href="/shop?category=5l-tin" className="hover:text-[#C88A2B] transition flex items-center gap-1">
            <span>৫ লিটার টিন</span> <span className="text-[10px] text-[#7A4117] font-normal">/ 5L Tin</span>
          </Link>
          <Link href="/shop?category=gift-packs" className="hover:text-[#C88A2B] transition flex items-center gap-1">
            <span>গিফট প্যাক</span> <span className="text-[10px] text-[#7A4117] font-normal">/ Gift</span>
          </Link>
          <Link href="/about" className="hover:text-[#C88A2B] transition flex items-center gap-1">
            <span>ঘানি গল্প</span> <span className="text-[10px] text-[#7A4117] font-normal">/ Story</span>
          </Link>
        </nav>

        {/* Right Icons */}
        <div className="flex items-center space-x-3">
          <Link href="/shop" className="p-2 text-[#271C16] hover:text-[#C88A2B] transition hidden sm:block" aria-label="Search Products">
            <Search className="w-5 h-5" />
          </Link>

          {/* Wishlist Button — opens drawer */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="p-2 text-[#271C16] hover:text-[#C88A2B] transition relative"
            aria-label="Open wishlist"
          >
            <Heart className="w-5 h-5" />
            {totalWishlist > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#C88A2B] text-white text-[9px] font-black flex items-center justify-center shadow">
                {totalWishlist}
              </span>
            )}
          </button>

          <Link href="/account" className="p-2 text-[#271C16] hover:text-[#C88A2B] transition" aria-label="Account">
            <User className="w-5 h-5" />
          </Link>

          <button
            onClick={() => setIsCartOpen(true)}
            className="p-2 text-white transition relative flex flex-row items-center gap-2 bg-[#C88A2B] hover:bg-[#A46B1E] px-4 py-2 rounded-full border border-[#B87B22] shadow-md group"
            aria-label="Open Cart"
          >
            <ShoppingBag className="w-4 h-4 text-white group-hover:scale-110 transition" />
            <span className="text-xs font-bold text-white tracking-wide">({totalItems})</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#FDFBF7] border-t border-[#EADFCF] px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-bold tracking-wide text-[#271C16] hover:bg-[#F5EFE6] hover:text-[#C88A2B] rounded-xl transition"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Wishlist Drawer */}
      <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </header>
  );
}
