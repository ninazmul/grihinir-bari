"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { getDeliveryZones } from "@/lib/actions/delivery.actions";
import { createOrder } from "@/lib/actions/order.actions";
import { validateCoupon } from "@/lib/actions/coupon.actions";
import { ShieldCheck, Truck, ShoppingBag, Check, Ticket, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, totalItems, clearCart } = useCart();
  const [deliveryZones, setDeliveryZones] = useState<any[]>([]);
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Coupon State
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("Dhaka");
  const [district, setDistrict] = useState("Dhaka");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function loadZones() {
      const res = await getDeliveryZones();
      if (res.success && res.data) {
        setDeliveryZones(res.data);
        if (res.data.length > 0) setSelectedZone(res.data[0]);
      }
    }
    loadZones();

    // Check for saved coupon from Cart
    try {
      const savedCoupon = localStorage.getItem("grihinir_applied_coupon");
      if (savedCoupon) {
        setAppliedCoupon(JSON.parse(savedCoupon));
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);

    try {
      const res = await validateCoupon(couponInput.trim(), subtotal);
      if (res.success && res.data) {
        setAppliedCoupon(res.data);
        localStorage.setItem("grihinir_applied_coupon", JSON.stringify(res.data));
        toast.success(`কুপন ${res.data.code} যুক্ত করা হয়েছে!`);
        setCouponInput("");
      } else {
        toast.error(res.error || "অকার্যকর কুপন কোড");
      }
    } catch (err: any) {
      toast.error(err.message || "Error validating coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    localStorage.removeItem("grihinir_applied_coupon");
    toast.success("কুপন সরানো হয়েছে");
  };

  const deliveryCharge = selectedZone
    ? selectedZone.freeDeliveryThreshold && subtotal >= selectedZone.freeDeliveryThreshold
      ? 0
      : selectedZone.baseCharge
    : 80;

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount || 0 : 0;
  const totalPayable = Math.max(0, subtotal + deliveryCharge - discountAmount);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setLoading(true);

    try {
      const orderPayload = {
        guestInfo: { name: fullName, email, phone },
        items: cart.map((item) => ({
          product: item.product,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          sku: item.sku,
          size: item.size,
          color: item.color,
        })),
        shippingAddress: {
          fullName,
          phone,
          email,
          addressLine,
          city,
          district,
          deliveryZoneId: selectedZone?._id,
          zoneName: selectedZone?.name || "Dhaka City",
        },
        deliveryCharge,
        discountAmount,
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        subtotal,
        totalAmount: totalPayable,
        notes,
      };

      const res = await createOrder(orderPayload);

      if (res.success && res.data) {
        toast.success("অর্ডার সফলভাবে গ্রহণ করা হয়েছে!");
        localStorage.removeItem("grihinir_applied_coupon");
        clearCart();
        router.push(`/order/${res.data._id}`);
      } else {
        toast.error(res.error || "Failed to place order");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred placing order");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center space-y-4">
        <ShoppingBag className="w-16 h-16 text-[#C88A2B]/40 mx-auto opacity-40" />
        <h1 className="text-2xl font-bold font-serif text-[#271C16]">আপনার শপিং ব্যাগ খালি</h1>
        <p className="text-xs text-[#8C7662]">চেকআউট করার আগে পছন্দের সরষের তেল ব্যাগে যুক্ত করুন।</p>
        <Link
          href="/shop"
          className="inline-block py-3 px-6 bg-[#C88A2B] hover:bg-[#A46B1E] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition shadow-md"
        >
          তেল ক্যাটালগ দেখুন (Explore Catalog)
        </Link>
      </div>
    );
  }

  const inputClass =
    "w-full p-3 text-xs border border-[#EADFCF] rounded-xl bg-[#FAF6EE] text-[#271C16] placeholder-[#8C7662]/60 focus:outline-none focus:border-[#C88A2B] transition";
  const labelClass = "font-bold text-[#7A4117] block mb-1 text-xs";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 bg-[#FDFBF7]">
      {/* Page Header */}
      <div className="border-b border-[#EADFCF] pb-4 flex items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-[#271C16]">
          চেকআউট / Checkout
          <span className="ml-2 text-base font-medium text-[#8C7662]">
            ({totalItems}টি পণ্য)
          </span>
        </h1>
        <Link
          href="/cart"
          className="text-xs font-bold uppercase tracking-wider text-[#7A4117] hover:text-[#C88A2B] underline-offset-2 hover:underline transition"
        >
          ← ব্যাগে ফিরে যান
        </Link>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* ── Left: Shipping Form ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Section 1: Contact & Shipping */}
          <div className="bg-white rounded-3xl border border-[#EADFCF] p-6 sm:p-8 shadow-sm space-y-5">
            <h2 className="text-sm font-extrabold uppercase tracking-[0.15em] text-[#271C16] border-b border-[#EADFCF] pb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#C88A2B] text-white text-[10px] font-black flex items-center justify-center flex-shrink-0">1</span>
              ডেলিভারি ঠিকানা ও যোগাযোগ (Shipping Info)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>আপনার পুরো নাম *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="যেমন: তারিকুল ইসলাম"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>মোবাইল নম্বর *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className={`${inputClass} font-mono`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>ইমেইল এড্রেস (ঐচ্ছিক)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>জেলা / শহর *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setDistrict(e.target.value);
                  }}
                  placeholder="ঢাকা / চট্টগ্রাম / রাজশাহী"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>সম্পূর্ণ ডেলিভারি ঠিকানা (বাসা/রোড/এলাকা) *</label>
              <textarea
                required
                rows={2}
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                placeholder="বাসা নং, রোড নং, এলাকা বিস্তারিত লিখুন..."
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>ডেলিভারি সংক্রান্ত নোট (ঐচ্ছিক)</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="ডেলিভারির জন্য কোনো বিশেষ নির্দেশনা থাকলে লিখুন..."
                className={inputClass}
              />
            </div>
          </div>

          {/* Section 2: Delivery Zone */}
          <div className="bg-white rounded-3xl border border-[#EADFCF] p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold uppercase tracking-[0.15em] text-[#271C16] border-b border-[#EADFCF] pb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#C88A2B] text-white text-[10px] font-black flex items-center justify-center flex-shrink-0">2</span>
              ডেলিভারি এরিয়া নির্বাচন করুন (Delivery Zone)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {deliveryZones.map((zone) => {
                const isSelected = selectedZone?._id === zone._id;
                const isFree =
                  zone.freeDeliveryThreshold && subtotal >= zone.freeDeliveryThreshold;

                return (
                  <div
                    key={zone._id}
                    onClick={() => setSelectedZone(zone)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-[#1D4D4F] text-white border-[#1D4D4F] shadow-md"
                        : "bg-white text-[#271C16] border-[#EADFCF] hover:border-[#C88A2B]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          isSelected ? "border-[#FDE68A] bg-[#FDE68A]" : "border-[#EADFCF]"
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 text-[#1D4D4F]" />}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs truncate">{zone.name}</div>
                        <div className={`text-[10px] mt-0.5 ${isSelected ? "text-[#DBEBEB]" : "text-[#8C7662]"}`}>
                          {zone.estimatedDays}
                        </div>
                      </div>
                    </div>
                    <div className={`font-black text-sm flex-shrink-0 ${isFree ? "text-[#FDE68A]" : ""}`}>
                      {isFree ? "ফ্রি ডেলিভারি" : `৳${zone.baseCharge}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Review Items */}
          <div className="bg-white rounded-3xl border border-[#EADFCF] p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold uppercase tracking-[0.15em] text-[#271C16] border-b border-[#EADFCF] pb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#C88A2B] text-white text-[10px] font-black flex items-center justify-center flex-shrink-0">3</span>
              নির্বাচিত পণ্যসমূহ (Items)
            </h2>
            <div className="divide-y divide-[#FAF6EE]">
              {cart.map((item) => (
                <div key={item.id} className="py-3 flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-14 h-16 object-cover rounded-xl border border-[#EADFCF] flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-[#271C16] line-clamp-1">{item.title}</h3>
                    <div className="text-[10px] text-[#8C7662] font-mono mt-0.5">SKU: {item.sku}</div>
                    {item.size && <div className="text-[10px] text-[#7A4117]">সাইজ: {item.size}</div>}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-black text-[#7A4117]">৳{(item.price * item.quantity).toLocaleString()}</div>
                    <div className="text-[10px] text-[#8C7662]">পরিমাণ: {item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Order Summary ── */}
        <div className="bg-[#1D4D4F] text-white rounded-3xl border border-[#163A3C] shadow-2xl overflow-hidden sticky top-28">
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
                <span className="text-[#DBEBEB]">
                  সাবটোটাল ({totalItems}টি পণ্য)
                </span>
                <span className="font-bold text-white">৳{subtotal.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-[#DBEBEB] flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#FDE68A]" /> ডেলিভারি চার্জ
                </span>
                <span className={`font-bold text-sm ${deliveryCharge === 0 ? "text-[#FDE68A]" : "text-white"}`}>
                  {deliveryCharge === 0 ? "ফ্রি" : `৳${deliveryCharge}`}
                </span>
              </div>

              {appliedCoupon && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#FDE68A] flex items-center gap-1.5 font-bold">
                    <Ticket className="w-3.5 h-3.5" /> {appliedCoupon.code}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#FDE68A]">-৳{discountAmount.toLocaleString()}</span>
                    <button type="button" onClick={handleRemoveCoupon} className="text-[#DBEBEB] hover:text-rose-300">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="border-t border-[#2A6668] pt-4 flex items-center justify-between">
              <span className="text-base font-extrabold text-white uppercase tracking-wider">সর্বমোট (Total)</span>
              <span className="text-2xl font-black text-[#FDE68A]">৳{totalPayable.toLocaleString()}</span>
            </div>

            {/* Coupon Code Input */}
            {!appliedCoupon && (
              <div className="space-y-2 pt-2 border-t border-[#2A6668]">
                <label className="text-[11px] font-bold text-[#B8D7D7] uppercase tracking-wider block">
                  কুপন কোড লিখুন
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="COUPON CODE"
                    className="flex-1 px-3 py-2.5 text-xs bg-[#163A3C] border border-[#2A6668] focus:border-[#C88A2B] text-white placeholder-[#B8D7D7]/50 rounded-xl uppercase font-mono outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                    className="px-4 py-2.5 bg-[#C88A2B] hover:bg-[#A46B1E] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition disabled:opacity-50 shadow"
                  >
                    {couponLoading ? "..." : "প্রয়োগ"}
                  </button>
                </div>
              </div>
            )}

            {/* COD Badge */}
            <div className="bg-[#163A3C] border border-[#2A6668] rounded-2xl px-4 py-3 space-y-1">
              <div className="flex items-center gap-2 text-[#FDE68A] font-extrabold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#FDE68A]" />
                ক্যাশ অন ডেলিভারি (Cash on Delivery)
              </div>
              <p className="text-[11px] text-[#DBEBEB] leading-relaxed">
                পণ্য হাতে পেয়ে দেখে ডেলিভারিম্যানের কাছে মূল্য পরিশোধ করবেন।
              </p>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-4 bg-[#C88A2B] hover:bg-[#A46B1E] text-white font-extrabold text-xs uppercase tracking-[0.2em] rounded-xl transition shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  অর্ডার প্রসেস হচ্ছে...
                </>
              ) : (
                "অর্ডার নিশ্চিত করুন (Confirm Order)"
              )}
            </button>

            <p className="text-center text-[10px] text-[#B8D7D7] tracking-wide">
              ১০০% খাঁটি কাঠের ঘানি তেল · ক্যাশ অন ডেলিভারি · সহজ রিটার্ন
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
