"use client";

import { useState } from "react";
import { Star, Send, ChevronLeft, ChevronRight, Quote, MessageSquare, Droplets } from "lucide-react";
import { createReview } from "@/lib/actions/review.actions";
import { toast } from "react-hot-toast";

interface ReviewFormProps {
  reviews: any[];
  products: any[];
}

export default function TestimonialsSection({ reviews, products }: ReviewFormProps) {
  // Review form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [productId, setProductId] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Carousel state for reviews
  const [page, setPage] = useState(0);
  const perPage = 3;
  const totalPages = Math.ceil(reviews.length / perPage);
  const visibleReviews = reviews.slice(page * perPage, page * perPage + perPage);

  // Static fallback testimonials when no approved reviews exist
  const fallbackTestimonials = [
    {
      _id: "fb-1",
      authorName: "সাহিদা পারভীন (উত্তরা, ঢাকা)",
      rating: 5,
      comment: "গৃহিণীর বাড়ির কাচের বোতলের সরষের তেলের ঝাঁঝ ও ঘ্রাণ অতুলনীয়! ইলিশ ভাপা আর আলু ভর্তায় দিলে ছোটবেলার গ্রামের বাড়ির স্বাদ মনে পড়ে যায়। সম্পূর্ণ নির্ভেজাল।",
      product: { title: "১ লিটার প্রিমিয়াম কাচের বোতল খাঁটি ঘানিভাঙা সরষের তেল" },
      createdAt: new Date().toISOString(),
    },
    {
      _id: "fb-2",
      authorName: "রফিকুল ইসলাম (জিইসি, চট্টগ্রাম)",
      rating: 5,
      comment: "আমরা ৫ লিটার পারিবারিক টিন প্যাক নিয়েছিলাম। কাঠের ঘানির আসল ঝাঁঝ আছে এবং রান্নায় তেল খুব কম লাগে। ক্যাশ অন ডেলিভারিতে ২ দিনের মধ্যেই পেয়েছি।",
      product: { title: "৫ লিটার পারিবারিক টিন ক্যান ঘানিভাঙা সরষের তেল" },
      createdAt: new Date().toISOString(),
    },
    {
      _id: "fb-3",
      authorName: "তানজিলা আহমেদ (উপশহর, সিলেট)",
      rating: 5,
      comment: "আমের আচার তৈরির জন্য এই তেল ব্যবহার করেছি। কোনো বাজে গন্ধ নেই, অসাধারণ প্রাকৃতিক সোনালী রঙ। গৃহিণীর বাড়ি সত্যিই ভরসা করার মতো একটি ব্র্যান্ড।",
      product: { title: "২ লিটার স্পেশাল দেশি কালো সরষের তেল" },
      createdAt: new Date().toISOString(),
    },
  ];

  const displayReviews = reviews.length > 0 ? visibleReviews : fallbackTestimonials;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) {
      toast.error("দয়া করে পণ্য নির্বাচন করুন / Please select a product");
      return;
    }
    setSubmitting(true);
    try {
      const res = await createReview({
        product: productId,
        authorName: name,
        authorEmail: email,
        rating,
        comment,
      });
      if (res.success) {
        toast.success("ধন্যবাদ! আপনার রিভিউটি মডারেশনের পর প্রদর্শিত হবে।");
        setName("");
        setEmail("");
        setProductId("");
        setRating(5);
        setComment("");
        setShowForm(false);
      } else {
        toast.error(res.error || "Failed to submit review");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#7A4117] block">
          গ্রাহকদের ভালোবাসা • VALUED CUSTOMER REVIEWS
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-[#271C16]">
          REVIEWS &amp; TRUST / গ্রাহক সন্তুষ্টি ও অভিজ্ঞতা
        </h2>
        <p className="text-xs text-[#7A4117]">
          সারা বাংলাদেশের হাজারো পরিবারের গৃহিণীদের নির্ভরতা ও খাঁটি সরষের তেলের অভিজ্ঞতা
        </p>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayReviews.map((r: any) => (
          <div
            key={r._id}
            className="bg-white p-6 rounded-2xl border border-[#EADFCF] shadow-sm space-y-4 hover:border-[#C88A2B] hover:shadow-md transition duration-300 group flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Quote icon */}
              <Quote className="w-6 h-6 text-[#ECCF75] group-hover:text-[#C88A2B] transition" />

              {/* Stars */}
              <div className="flex text-[#D49A25] gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < r.rating ? "fill-[#D49A25] text-[#D49A25]" : "fill-zinc-200 text-zinc-200"
                    }`}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-xs text-[#271C16] italic leading-relaxed line-clamp-4 font-normal">
                &ldquo;{r.comment}&rdquo;
              </p>
            </div>

            {/* Author */}
            <div className="border-t border-[#EADFCF] pt-3">
              <h4 className="text-xs font-extrabold text-[#7A4117]">{r.authorName}</h4>
              {r.product?.title && (
                <p className="text-[10px] text-[#8C7662] font-semibold mt-0.5 truncate">
                  পণ্য: {r.product.title}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination (only when real reviews exceed one page) */}
      {reviews.length > perPage && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="p-2 rounded-lg border border-[#EADFCF] hover:border-[#C88A2B] transition disabled:opacity-30 disabled:cursor-not-allowed bg-white"
          >
            <ChevronLeft className="w-4 h-4 text-[#7A4117]" />
          </button>
          <span className="text-xs font-bold text-[#7A4117]">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page === totalPages - 1}
            className="p-2 rounded-lg border border-[#EADFCF] hover:border-[#C88A2B] transition disabled:opacity-30 disabled:cursor-not-allowed bg-white"
          >
            <ChevronRight className="w-4 h-4 text-[#7A4117]" />
          </button>
        </div>
      )}

      {/* Write Review CTA + Form */}
      <div className="text-center">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C88A2B] hover:bg-[#A46B1E] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition shadow-lg hover:shadow-xl active:scale-95"
          >
            <MessageSquare className="w-4 h-4" /> আপনার অভিজ্ঞতা শেয়ার করুন (Write a Review)
          </button>
        ) : (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#EADFCF] p-6 sm:p-8 shadow-md text-left space-y-5">
            <div className="space-y-1 border-b border-[#EADFCF] pb-3">
              <h3 className="text-sm font-bold text-[#271C16] flex items-center gap-2">
                <Droplets className="w-4 h-4 text-[#C88A2B]" /> আপনার মতামত লিখুন (Write Review)
              </h3>
              <p className="text-[10px] text-[#8C7662]">
                আপনার পর্যালোচনা অনুমোদনের পর ওয়েবসাইটে দৃশ্যমান হবে।
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="আপনার নাম (Your Name)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-4 py-2.5 text-xs border border-[#EADFCF] rounded-xl focus:outline-none focus:border-[#C88A2B] transition bg-[#FAF6EE]"
                />
                <input
                  type="email"
                  required
                  placeholder="ইমেইল (Email Address)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-2.5 text-xs border border-[#EADFCF] rounded-xl focus:outline-none focus:border-[#C88A2B] transition bg-[#FAF6EE]"
                />
              </div>

              {/* Product Select */}
              <select
                required
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full px-4 py-2.5 text-xs border border-[#EADFCF] rounded-xl focus:outline-none focus:border-[#C88A2B] transition bg-[#FAF6EE] text-[#271C16]"
              >
                <option value="">কোন পণ্যটি কিনেছেন নির্বাচন করুন (Select Product)</option>
                {products.map((p: any) => (
                  <option key={p._id} value={p._id}>
                    {p.title}
                  </option>
                ))}
              </select>

              {/* Star Rating */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#7A4117]">রেটিং নির্বাচন করুন (Your Rating)</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(s)}
                      className="p-0.5 transition"
                    >
                      <Star
                        className={`w-6 h-6 transition ${
                          s <= (hoverRating || rating)
                            ? "fill-[#D49A25] text-[#D49A25]"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-bold text-[#7A4117] self-center">
                    {hoverRating || rating}/5 Star
                  </span>
                </div>
              </div>

              {/* Comment */}
              <textarea
                required
                rows={4}
                placeholder="গৃহিণীর বাড়ির খাঁটি সরষের তেল সম্পর্কে আপনার অভিজ্ঞতা লিখুন..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-3 text-xs border border-[#EADFCF] rounded-xl focus:outline-none focus:border-[#C88A2B] transition bg-[#FAF6EE] resize-none"
              />

              {/* Submit + Cancel */}
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#C88A2B] hover:bg-[#A46B1E] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition shadow-md disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? "সাবমিট হচ্ছে..." : "রিভিউ জমা দিন (Submit)"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 text-xs font-bold text-[#7A4117] border border-[#EADFCF] rounded-xl hover:border-[#C88A2B] transition bg-white"
                >
                  বাতিল করুন (Cancel)
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
