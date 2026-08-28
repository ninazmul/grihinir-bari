"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Star, Sparkles, Droplets } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { toast } from "react-hot-toast";

export default function ProductCard({ product }: { product: any }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      id: `${product._id}-default`,
      product: product._id,
      title: product.title,
      price: product.price,
      image: product.featuredImage,
      sku: product.sku || "GNB-100",
      quantity: 1,
    });
    toast.success("ব্যাগ-এ যোগ করা হয়েছে! (Added to Bag)");
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const wishlisted = isWishlisted(product._id);
    toggleWishlist({
      id: product._id,
      title: product.title,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: product.featuredImage,
      slug: product.slug,
    });
    toast.success(wishlisted ? "উইশলিস্ট থেকে সরানো হয়েছে" : "উইশলিস্টে যুক্ত হয়েছে!");
  };

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  return (
    <div className="group bg-white rounded-2xl border border-[#EADFCF] overflow-hidden shadow-sm hover:shadow-xl hover:border-[#C88A2B] transition duration-300 flex flex-col justify-between">
      <div>
        {/* Thumbnail Image Container */}
        <div className="relative aspect-square bg-[#FAF6EE] overflow-hidden">
          <Link href={`/product/${product.slug}`}>
            <img
              src={product.featuredImage}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
          </Link>

          {/* Purity & Discount Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {discountPercent && (
              <span className="bg-[#7A4117] text-white text-[10px] font-extrabold tracking-wider px-2.5 py-0.5 rounded-full shadow-md">
                {discountPercent}% ছাড়
              </span>
            )}
            {product.isFeatured ? (
              <span className="bg-[#C88A2B] text-white text-[9.5px] font-bold tracking-wide px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                <Droplets className="w-2.5 h-2.5" /> ১০০% খাঁটি ঘানি
              </span>
            ) : (
              <span className="bg-[#1D4D4F] text-white text-[9px] font-bold tracking-wide px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-[#FDE68A]" /> কোল্ড প্রেসড
              </span>
            )}
          </div>

          {/* Wishlist Heart Button */}
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-3 right-3 p-2 rounded-full border backdrop-blur-md transition ${
              isWishlisted(product._id)
                ? "bg-[#C88A2B] text-white border-[#C88A2B] shadow"
                : "bg-white/85 text-[#7A4117] hover:text-[#C88A2B] border-[#EADFCF]"
            }`}
            aria-label="Toggle Wishlist"
          >
            <Heart className="w-4 h-4 fill-current" />
          </button>
        </div>

        {/* Content Details */}
        <div className="p-4 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A4117] block">
            {typeof product.category === "object" ? product.category?.name : "গৃহিণীর বাড়ি খাঁটি তেল"}
          </span>

          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="text-xs font-bold text-[#271C16] group-hover:text-[#C88A2B] transition line-clamp-2 leading-snug">
              {product.title}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 text-[11px] text-[#271C16] font-medium">
            <Star className="w-3.5 h-3.5 fill-[#D49A25] text-[#D49A25]" />
            <span className="font-bold text-[#C88A2B]">{product.ratings?.average || 5.0}</span>
            <span className="text-[#8C7662]">({product.ratings?.count || 18} রিভিউ)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-base font-black text-[#7A4117]">
              ৳{product.price?.toLocaleString()}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-[#A89886] line-through font-medium">
                ৳{product.compareAtPrice?.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Add to Bag Button */}
      <div className="p-4 pt-0">
        <button
          onClick={handleAddToCart}
          className="w-full py-2.5 bg-[#C88A2B] hover:bg-[#A46B1E] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98]"
        >
          <ShoppingBag className="w-4 h-4 text-white" /> ব্যাগে যোগ করুন
        </button>
      </div>
    </div>
  );
}
