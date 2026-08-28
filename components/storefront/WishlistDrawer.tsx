"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import { Heart, X, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface WishlistItem {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  slug: string;
}

export default function WishlistDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { wishlistItems, removeFromWishlist, totalWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  // Mount portal target on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Drive CSS transition: open → slide in, close → slide out
  useEffect(() => {
    if (isOpen) {
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleMoveToCart = (item: WishlistItem) => {
    addToCart({
      id: `${item.id}-default`,
      product: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      sku: "GNB",
      quantity: 1,
    });
    removeFromWishlist(item.id);
    toast.success("ব্যাগ-এ যোগ করা হয়েছে! (Moved to Bag)");
  };

  if (!mounted) return null;

  const drawer = (
    <div
      aria-modal="true"
      role="dialog"
      aria-label="Wishlist"
      className={`fixed inset-0 z-[9999] flex justify-end transition-all duration-300 ease-in-out ${
        visible ? "bg-black/60 backdrop-blur-sm" : "bg-transparent backdrop-blur-none pointer-events-none"
      }`}
      onClick={onClose}
      style={{ visibility: isOpen || visible ? "visible" : "hidden" }}
    >
      <div
        className={`bg-[#FDFBF7] text-[#271C16] w-full max-w-md flex flex-col shadow-2xl border-l border-[#EADFCF] transition-transform duration-300 ease-in-out ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ height: "100dvh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#EADFCF] flex items-center justify-between flex-shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#C88A2B] fill-[#C88A2B]" />
            <h2 className="text-base font-bold tracking-wide text-[#271C16]">
              পছন্দের তালিকা / Wishlist ({totalWishlist})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#7A4117] hover:text-[#C88A2B] transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List — scrollable middle */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {wishlistItems.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Heart className="w-12 h-12 text-[#C88A2B]/40 mx-auto" />
              <p className="text-sm text-[#7A4117] font-medium">আপনার পছন্দের তালিকা খালি।</p>
              <p className="text-xs text-[#8C7662]">
                পছন্দের পণ্যের হার্ট আইকনে ক্লিক করে সংরক্ষণ করুন।
              </p>
              <button
                onClick={onClose}
                className="inline-block text-xs font-bold uppercase tracking-widest text-white bg-[#C88A2B] hover:bg-[#A46B1E] px-5 py-2.5 rounded-xl transition shadow"
              >
                পণ্য দেখুন (Explore Catalog)
              </button>
            </div>
          ) : (
            wishlistItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 bg-white p-3.5 rounded-2xl border border-[#EADFCF] shadow-sm"
              >
                <Link href={`/product/${item.slug}`} onClick={onClose}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-20 object-cover rounded-xl border border-[#EADFCF] hover:opacity-90 transition flex-shrink-0"
                  />
                </Link>
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <Link href={`/product/${item.slug}`} onClick={onClose}>
                      <h3 className="text-xs font-bold text-[#271C16] line-clamp-2 hover:text-[#C88A2B] transition">
                        {item.title}
                      </h3>
                    </Link>
                    <div className="flex items-baseline gap-2 mt-1">
                      <p className="text-xs font-black text-[#7A4117]">
                        ৳{item.price.toLocaleString()}
                      </p>
                      {item.compareAtPrice && item.compareAtPrice > item.price && (
                        <p className="text-[10px] text-[#8C7662] line-through">
                          ৳{item.compareAtPrice.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 gap-2">
                    <button
                      onClick={() => handleMoveToCart(item)}
                      className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-[#C88A2B] hover:bg-[#A46B1E] text-white px-3.5 py-1.5 rounded-lg transition shadow-sm"
                    >
                      <ShoppingBag className="w-3 h-3" /> ব্যাগে নিন
                    </button>
                    <button
                      onClick={() => {
                        removeFromWishlist(item.id);
                        toast.success("উইশলিস্ট থেকে সরানো হয়েছে");
                      }}
                      className="text-[#8C7662] hover:text-rose-600 transition"
                      aria-label="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer — always pinned to bottom */}
        {wishlistItems.length > 0 && (
          <div className="p-5 border-t border-[#EADFCF] bg-white flex-shrink-0">
            <Link
              href="/shop"
              onClick={onClose}
              className="block w-full py-3 text-center text-xs font-bold uppercase tracking-widest bg-[#C88A2B] hover:bg-[#A46B1E] text-white rounded-xl transition shadow-md"
            >
              আরও পণ্য দেখুন (Continue Shopping)
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(drawer, document.body);
}
