"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { validateCoupon } from "@/lib/actions/coupon.actions";
import { ShoppingBag, Trash2, ArrowRight, Ticket, Truck, X } from "lucide-react";
import { toast } from "react-hot-toast";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("grihinir_applied_coupon");
      if (saved) {
        setAppliedCoupon(JSON.parse(saved));
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    setCouponLoading(true);

    try {
      const res = await validateCoupon(couponCode, subtotal);
      if (res.success && res.data) {
        setAppliedCoupon(res.data);
        localStorage.setItem("grihinir_applied_coupon", JSON.stringify(res.data));
        toast.success(`কুপন ${res.data.code} সফলভাবে প্রয়োগ করা হয়েছে!`);
      } else {
        toast.error(res.error || "অকার্যকর কুপন কোড");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to validate coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    localStorage.removeItem("grihinir_applied_coupon");
    toast.success("কুপন সরানো হয়েছে");
  };

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center space-y-4">
        <ShoppingBag className="w-16 h-16 text-[#C88A2B]/40 mx-auto" />
        <h1 className="text-2xl font-bold font-serif text-[#271C16]">আপনার শপিং ব্যাগ খালি</h1>
        <p className="text-xs text-[#8C7662]">গৃহিণীর বাড়ির খাঁটি ঘানিভাঙা সরষের তেল সম্ভার ঘুরে দেখুন।</p>
        <Link
          href="/shop"
          className="inline-block py-3 px-6 bg-[#C88A2B] hover:bg-[#A46B1E] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition shadow-md"
        >
          তেল ক্যাটালগ দেখুন (Explore Catalog)
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 bg-[#FDFBF7]">
      <div className="border-b border-[#EADFCF] pb-4 flex items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-[#271C16]">
          শপিং ব্যাগ / Shopping Bag
          <span className="ml-2 text-base font-medium text-[#8C7662]">({totalItems}টি পণ্য)</span>
        </h1>
        <Link href="/shop" className="text-xs font-bold uppercase tracking-wider text-[#7A4117] hover:text-[#C88A2B] underline-offset-2 hover:underline transition">
          আরও পণ্য যোগ করুন
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#EADFCF] p-6 shadow-sm space-y-4">
          <div className="divide-y divide-[#FAF6EE]">
            {cart.map((item) => (
              <div key={item.id} className="py-4 flex gap-4 items-center">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-24 object-cover rounded-2xl border border-[#EADFCF] flex-shrink-0"
                />
                <div className="flex-1 space-y-1">
                  <h3 className="text-sm font-bold text-[#271C16]">{item.title}</h3>
                  <div className="text-xs text-[#8C7662] font-mono">SKU: {item.sku}</div>
                  {item.size && <div className="text-xs text-[#7A4117] font-medium">সাইজ: {item.size}</div>}
                  <div className="text-sm font-black text-[#7A4117]">৳{item.price.toLocaleString()}</div>
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-[#EADFCF] rounded-xl bg-[#FAF6EE] p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-xs font-bold text-[#271C16] hover:bg-[#EADFCF] rounded-lg"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-bold text-[#271C16]">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 py-1 text-xs font-bold text-[#271C16] hover:bg-[#EADFCF] rounded-lg"
                      >
                        +
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="p-2 text-[#8C7662] hover:text-rose-600 transition" aria-label="Remove">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="bg-[#1D4D4F] text-white rounded-3xl border border-[#163A3C] shadow-2xl overflow-hidden">
          {/* Card Header */}
          <div className="px-6 py-5 border-b border-[#2A6668]">
            <h2 className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#FDE68A] flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#FDE68A]" />
              অর্ডার বিবরণী (Order Summary)
            </h2>
          </div>

          <div className="px-6 py-5 space-y-5">
            {/* Price Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#DBEBEB]">সাবটোটাল ({totalItems}টি পণ্য)</span>
                <span className="font-bold text-white">৳{subtotal.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-[#DBEBEB] flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#FDE68A]" /> ডেলিভারি চার্জ
                </span>
                <span className="font-bold text-[#FDE68A] text-xs">চেকআউট ধাপে হিসাব হবে</span>
              </div>

              {appliedCoupon && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#FDE68A] flex items-center gap-1.5 font-bold">
                    <Ticket className="w-3.5 h-3.5" /> {appliedCoupon.code}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#FDE68A]">-৳{discountAmount.toLocaleString()}</span>
                    <button onClick={handleRemoveCoupon} className="text-[#DBEBEB] hover:text-rose-300">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="border-t border-[#2A6668] pt-4 flex items-center justify-between">
              <span className="text-base font-extrabold text-white uppercase tracking-wider">সর্বমোট (Total)</span>
              <span className="text-2xl font-black text-[#FDE68A]">৳{finalTotal.toLocaleString()}</span>
            </div>

            {/* COD Badge */}
            <div className="bg-[#163A3C] border border-[#2A6668] rounded-2xl px-4 py-3 text-center">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#B8D7D7]">পেমেন্ট মাধ্যম</p>
              <p className="text-sm font-extrabold text-white mt-0.5">ক্যাশ অন ডেলিভারি (Cash on Delivery)</p>
            </div>

            {/* Coupon Input */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="text-[11px] font-bold text-[#B8D7D7] uppercase tracking-wider block">
                ডিসকাউন্ট কুপন কোড
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="COUPON CODE"
                  className="flex-1 px-3 py-2.5 text-xs bg-[#163A3C] border border-[#2A6668] focus:border-[#C88A2B] text-white placeholder-[#B8D7D7]/50 rounded-xl uppercase font-mono outline-none transition"
                />
                <button
                  type="submit"
                  disabled={couponLoading}
                  className="px-4 py-2.5 bg-[#C88A2B] hover:bg-[#A46B1E] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition disabled:opacity-50 shadow"
                >
                  {couponLoading ? "..." : "প্রয়োগ"}
                </button>
              </div>
            </form>

            {/* Checkout CTA */}
            <Link
              href="/checkout"
              className="flex items-center justify-center gap-2 w-full py-4 bg-[#C88A2B] hover:bg-[#A46B1E] text-white font-extrabold text-xs uppercase tracking-[0.2em] rounded-xl transition shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              অর্ডার সম্পন্ন করতে এগিয়ে যান <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-center text-[10px] text-[#B8D7D7] tracking-wide">
              ১০০% নিরাপদ ডেলিভারি · ক্যাশ অন ডেলিভারি · সহজ রিটার্ন
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
