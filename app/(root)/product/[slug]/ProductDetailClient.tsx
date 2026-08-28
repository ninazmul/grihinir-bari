"use client";

import { useEffect, useState } from "react";
import {
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Check,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { createReview } from "@/lib/actions/review.actions";
import ProductCard from "@/components/storefront/ProductCard";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProductDetailClient({
  product,
  relatedProducts,
  reviews,
}: {
  product: any;
  relatedProducts: any[];
  reviews: any[];
}) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const allImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.featuredImage];
  const [activeImage, setActiveImage] = useState(
    allImages[0] || product.featuredImage,
  );

  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");
  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0]?.name || "",
  );
  const [quantity, setQuantity] = useState(1);

  // Review Form
  const [reviewName, setReviewName] = useState("");
  const [reviewEmail, setReviewEmail] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Image Zoom / Lightbox
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);

  useEffect(() => {
    if (!zoomOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomOpen(false);
      else if (e.key === "ArrowLeft")
        setZoomIndex((i) => (i - 1 + allImages.length) % allImages.length);
      else if (e.key === "ArrowRight")
        setZoomIndex((i) => (i + 1) % allImages.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [zoomOpen, allImages.length]);

  const openZoom = (src?: string) => {
    const idx = src ? allImages.indexOf(src) : allImages.indexOf(activeImage);
    setZoomIndex(idx >= 0 ? idx : 0);
    setZoomOpen(true);
  };
  const closeZoom = () => setZoomOpen(false);
  const goPrev = () =>
    setZoomIndex((i) => (i - 1 + allImages.length) % allImages.length);
  const goNext = () => setZoomIndex((i) => (i + 1) % allImages.length);

  const handleAddToCart = () => {
    addToCart({
      id: `${product._id}-${selectedSize}-${selectedColor}`,
      product: product._id,
      title: product.title,
      price: product.price,
      image: activeImage,
      sku: product.sku,
      quantity,
      size: selectedSize,
      color: selectedColor,
    });
    toast.success("Added to Shopping Bag!");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      const res = await createReview({
        product: product._id,
        authorName: reviewName,
        authorEmail: reviewEmail,
        rating: reviewRating,
        comment: reviewComment,
      });

      if (res.success) {
        toast.success(
          "Thank you! Your review has been submitted for moderation.",
        );
        setReviewName("");
        setReviewEmail("");
        setReviewComment("");
      } else {
        toast.error(res.error || "Failed to submit review");
      }
    } catch (err: any) {
      toast.error(err.message || "Error submitting review");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Top Product Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Gallery */}
        <div className="space-y-4">
          <div className="group relative aspect-square bg-gray-100 rounded-3xl overflow-hidden border border-gray-200 shadow-md">
            <img
              src={activeImage}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => openZoom(activeImage)}
              aria-label="Zoom product image"
              className="absolute inset-0 w-full h-full cursor-zoom-in"
            />
            <button
              type="button"
              onClick={() => openZoom(activeImage)}
              className="pointer-events-auto absolute top-3 right-3 bg-white/95 hover:bg-white text-gray-800 border border-gray-200 backdrop-blur shadow-sm p-2 rounded-full transition translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 flex items-center gap-1.5 text-[11px] font-bold"
            >
              <ZoomIn className="w-4 h-4" />
              <span>Zoom</span>
            </button>
          </div>

          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {allImages.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveImage(img);
                  }}
                  onDoubleClick={() => openZoom(img)}
                  className={`group/thumb relative w-20 h-20 rounded-xl overflow-hidden border-2 transition shrink-0 ${activeImage === img
                    ? "border-amber-800 shadow"
                    : "border-gray-200 opacity-70 hover:opacity-100"
                    }`}
                >
                  <img
                    src={img}
                    alt={`${product.title} view ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openZoom(img);
                    }}
                    aria-label={`Zoom view ${idx + 1}`}
                    className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/30 flex items-center justify-center transition"
                  >
                    <ZoomIn className="w-4 h-4 text-white opacity-0 group-hover/thumb:opacity-100 drop-shadow" />
                  </button>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Info Details */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#7A4117]">
              {product.category?.name || "খাঁটি সরষের তেল (Pure Mustard Oil)"}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-serif text-[#271C16] mt-1">
              {product.title}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 text-[#D49A25]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#D49A25]" />
                  ))}
                  <span className="text-xs font-bold text-[#7A4117]">
                    {product.ratings?.average || 5.0}
                  </span>
                </div>

                <div className="text-xs text-[#8C7662]">
                  ({product.ratings?.count || 18} টি ভেরিফাইড রিভিউ)
                </div>
              </div>
              <div className="min-w-fit text-xs font-mono font-bold text-[#7A4117] border-l border-[#EADFCF] pl-2 ml-2">
                SKU: {product.sku || "GNB-OIL"}
              </div>
            </div>
          </div>

          <div className="flex items-baseline gap-3 border-y border-[#EADFCF] py-4">
            <span className="text-3xl font-black text-[#7A4117]">
              ৳{product.price?.toLocaleString()}
            </span>
            {product.compareAtPrice && (
              <span className="text-base text-[#8C7662] line-through">
                ৳{product.compareAtPrice?.toLocaleString()}
              </span>
            )}
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full ml-auto">
              স্টকে আছে (ক্যাশ অন ডেলিভারি)
            </span>
          </div>

          <p className="text-xs text-[#271C16] leading-relaxed font-normal">
            {product.description}
          </p>

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7A4117] block">
                সাইজ / পরিমাণ নির্বাচন করুন:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s: string) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 text-xs font-bold rounded-xl border transition ${
                      selectedSize === s
                        ? "bg-[#C88A2B] text-white border-[#C88A2B] shadow-sm"
                        : "bg-white text-[#271C16] border-[#EADFCF] hover:border-[#C88A2B]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7A4117] block">
                ভ্যারিয়েন্ট:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c: any) => {
                  const colorName = c.name || c;
                  return (
                    <button
                      key={colorName}
                      onClick={() => setSelectedColor(colorName)}
                      className={`px-4 py-2 text-xs font-bold rounded-xl border transition ${
                        selectedColor === colorName
                          ? "bg-[#C88A2B] text-white border-[#C88A2B]"
                          : "bg-white text-[#271C16] border-[#EADFCF] hover:border-[#C88A2B]"
                      }`}
                    >
                      {colorName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity & Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-[#EADFCF] rounded-xl bg-[#FAF6EE] p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-sm font-bold text-[#271C16] hover:bg-[#EADFCF] rounded-lg"
                >
                  -
                </button>
                <span className="px-3 text-sm font-bold text-[#271C16]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 text-sm font-bold text-[#271C16] hover:bg-[#EADFCF] rounded-lg"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 bg-[#C88A2B] hover:bg-[#A46B1E] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98]"
              >
                <ShoppingBag className="w-4 h-4" /> ব্যাগে যোগ করুন
              </button>

              <button
                onClick={() => {
                  const wishlisted = isWishlisted(product._id);
                  toggleWishlist({
                    id: product._id,
                    title: product.title,
                    price: product.price,
                    compareAtPrice: product.compareAtPrice,
                    image: product.featuredImage || activeImage,
                    slug: product.slug,
                  });
                  toast.success(wishlisted ? "উইশলিস্ট থেকে সরানো হয়েছে" : "পছন্দের তালিকায় রাখা হয়েছে!");
                }}
                className={`p-3.5 rounded-xl border transition ${
                  isWishlisted(product._id)
                    ? "bg-[#C88A2B] text-white border-[#C88A2B]"
                    : "bg-white border-[#EADFCF] text-[#7A4117] hover:border-[#C88A2B]"
                }`}
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              className="w-full py-3.5 bg-[#7A4117] hover:bg-[#5C3010] text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition shadow-md flex items-center justify-center gap-2"
            >
              এখনই অর্ডার করুন (ক্যাশ অন ডেলিভারি)
            </button>
          </div>

          {/* Guarantee Icons */}
          <div className="flex flex-wrap justify-center gap-4 border-t border-[#EADFCF] pt-4 text-[11px] font-bold text-[#7A4117]">
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#C88A2B]" />
              <span>সারা দেশে ক্যাশ অন ডেলিভারি</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#C88A2B]" />
              <span>১০০% খাঁটি কাঠের ঘানিভাঙা</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-[#C88A2B]" />
              <span>সহজ রিটার্ন ও শতভাগ সন্তুষ্টি</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications & Care */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-3xl border border-[#EADFCF] shadow-sm">
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#7A4117] border-b border-[#EADFCF] pb-2">
            পণ্যের বিবরণ ও পুষ্টিগুণ (Specifications)
          </h3>
          <ul className="space-y-2 text-xs text-[#271C16]">
            {product.specifications?.map((sp: any, i: number) => (
              <li key={i} className="flex justify-between border-b border-[#EADFCF]/60 pb-1">
                <span className="font-bold text-[#7A4117]">{sp.key}:</span>
                <span>{sp.value}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#7A4117] border-b border-[#EADFCF] pb-2">
            সংরক্ষণ ও ব্যবহারের নির্দেশিকা (Storage &amp; Care)
          </h3>
          <p className="text-xs text-[#271C16] leading-relaxed">
            {product.careInstructions ||
              "সরাসরি সূর্যের আলো থেকে দূরে শুষ্ক ও ঠান্ডা স্থানে কাচের বোতল বা টিনের পাত্রে সংরক্ষণ করুন। ব্যবহারের পর পাত্রের মুখ ভালো করে আটকে রাখুন যাতে সরিষার প্রাকৃতিক ঝাঁঝ ও পুষ্টিমান অক্ষুণ্ণ থাকে।"}
          </p>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="space-y-8 bg-white p-8 rounded-3xl border border-[#EADFCF] shadow-sm">
        <h3 className="text-lg font-bold font-serif text-[#271C16] border-b border-[#EADFCF] pb-4">
          গ্রাহকদের পর্যালোচনা (Customer Reviews)
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Review List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-xs text-[#8C7662] italic">
                এই পণ্যে এখনও কোনো রিভিউ দেওয়া হয়নি। প্রথম রিভিউটি আপনি দিন!
              </p>
            ) : (
              reviews.map((r: any) => (
                <div
                  key={r._id}
                  className="p-4 bg-[#FAF6EE] rounded-2xl border border-[#EADFCF] space-y-1"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-[#271C16]">
                    <span>{r.authorName}</span>
                    <div className="flex text-[#D49A25]">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#D49A25]" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-[#271C16]">{r.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Review Form */}
          <form
            onSubmit={handleReviewSubmit}
            className="space-y-3 bg-[#FAF6EE] p-5 rounded-2xl border border-[#EADFCF] text-xs"
          >
            <h4 className="font-bold text-[#7A4117]">আপনার রিভিউ দিন</h4>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="আপনার নাম"
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                className="p-2.5 border border-[#EADFCF] rounded-xl bg-white focus:outline-none focus:border-[#C88A2B]"
              />
              <input
                type="email"
                required
                placeholder="ইমেইল"
                value={reviewEmail}
                onChange={(e) => setReviewEmail(e.target.value)}
                className="p-2.5 border border-[#EADFCF] rounded-xl bg-white focus:outline-none focus:border-[#C88A2B]"
              />
            </div>
            <textarea
              required
              rows={3}
              placeholder="পণ্যের গুণমান ও আপনার রান্নার অভিজ্ঞতা..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="w-full p-2.5 border border-[#EADFCF] rounded-xl bg-white focus:outline-none focus:border-[#C88A2B] resize-none"
            />
            <button
              type="submit"
              disabled={submittingReview}
              className="px-5 py-2.5 bg-[#C88A2B] hover:bg-[#A46B1E] text-white font-bold rounded-xl transition shadow-sm"
            >
              {submittingReview ? "সাবমিট হচ্ছে..." : "রিভিউ জমা দিন"}
            </button>
          </form>
        </div>
      </div>

      {/* Image Zoom Lightbox */}
      {zoomOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Zoomed product image"
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={closeZoom}
        >
          <button
            type="button"
            onClick={closeZoom}
            aria-label="Close zoom view"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 rounded-full p-2.5 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="Previous image"
            disabled={allImages.length <= 1}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 rounded-full p-2.5 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="Next image"
            disabled={allImages.length <= 1}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 rounded-full p-2.5 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-6xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full flex-1 flex items-center justify-center">
              <img
                src={allImages[zoomIndex] || activeImage}
                alt={`${product.title} - detail view ${zoomIndex + 1}`}
                className="max-w-full max-h-[78vh] object-contain rounded-xl select-none"
                draggable={false}
              />
            </div>

            {allImages.length > 1 && (
              <div className="mt-4 flex flex-col items-center gap-3 w-full max-w-4xl">
                <div className="text-xs font-semibold text-white/80 tracking-wider uppercase">
                  {zoomIndex + 1} / {allImages.length}
                </div>
                <div className="flex gap-2 overflow-x-auto w-full justify-center pb-1 px-2">
                  {allImages.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setZoomIndex(idx)}
                      aria-label={`View image ${idx + 1}`}
                      className={`w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-lg overflow-hidden border-2 transition ${idx === zoomIndex
                        ? "border-amber-400 scale-105"
                        : "border-white/20 opacity-60 hover:opacity-100"
                        }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <p className="sr-only">
              Press Escape to close. Use Left and Right arrow keys to navigate.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
