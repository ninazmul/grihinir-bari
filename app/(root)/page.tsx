import { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/actions/product.actions";
import { getCategories } from "@/lib/actions/category.actions";
import { getHeroSlides } from "@/lib/actions/hero.actions";
import { getApprovedReviews, getProductsForReview } from "@/lib/actions/review.actions";
import { getSetting } from "@/lib/actions/setting.actions";
import ProductCard from "@/components/storefront/ProductCard";
import TestimonialsSection from "@/components/storefront/TestimonialsSection";
import HeroSlider from "@/components/storefront/HeroSlider";
import { ShieldCheck, ArrowRight, Sparkles, Star, Award, Droplets, CheckCircle2, HeartHandshake } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const setting = await getSetting();
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "https://grihinirbari.com";

  const title = setting?.seo?.siteTitle || "Grihinir Bari | 100% Pure Cold-Pressed Ghani Mustard Oil (গৃহিণীর বাড়ি)";
  const description =
    setting?.seo?.siteMetaDescription ||
    "গৃহিণীর বাড়ি — ঐতিহ্যবাহী কাঠের ঘানিভাঙা খাঁটি সরষের তেল। শতভাগ নির্ভেজাল, প্রাকৃতিক ঝাঁঝ ও সুবাসে ভরপুর। সারা বাংলাদেশে ক্যাশ অন ডেলিভারি।";
  const keywords = setting?.seo?.siteKeywords?.length
    ? setting.seo.siteKeywords
    : [
      "Grihinir Bari",
      "গৃহিণীর বাড়ি",
      "খাঁটি সরষের তেল",
      "কাঠের ঘানিভাঙা তেল",
      "Cold Pressed Mustard Oil Bangladesh",
      "Pure Ghani Mustard Oil Dhaka",
      "Shorisher Tel BD",
    ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: baseUrl,
    },
    openGraph: {
      title,
      description,
      url: baseUrl,
      siteName: "Grihinir Bari",
      images: [
        {
          url: setting?.seo?.ogImage || "/assets/images/og-cover.webp",
          width: 1200,
          height: 630,
          alt: "Grihinir Bari Pure Mustard Oil",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [setting?.seo?.twitterCardImage || "/assets/images/og-cover.webp"],
    },
  };
}

export default async function HomePage() {
  const [productsRes, categoriesRes, heroSlidesRes, reviewsRes, reviewProductsRes] = await Promise.all([
    getProducts({ limit: 12 }),
    getCategories(),
    getHeroSlides({ enabled: true }),
    getApprovedReviews(12),
    getProductsForReview(),
  ]);

  let products = productsRes.success ? productsRes.data : [];
  let categories = categoriesRes.success ? categoriesRes.data : [];
  const approvedReviews = reviewsRes.success ? reviewsRes.data : [];
  const reviewProducts = reviewProductsRes.success ? reviewProductsRes.data : [];

  // Seed sample authentic mustard oil products if database has no products yet
  if (products.length === 0) {
    products = [
      {
        _id: "demo-1",
        title: "১ লিটার প্রিমিয়াম কাচের বোতল খাঁটি ঘানিভাঙা সরষের তেল (1L Glass Bottle)",
        slug: "1l-glass-bottle-pure-ghani-mustard-oil",
        price: 420,
        compareAtPrice: 480,
        featuredImage: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800",
        sku: "GNB-GLS-01",
        stock: 45,
        isFeatured: true,
        isBestSeller: true,
        category: { name: "কাচের বোতল (Glass Bottles)", slug: "glass-bottles" },
        ratings: { average: 5.0, count: 32 },
      },
      {
        _id: "demo-2",
        title: "৫ লিটার পারিবারিক টিন ক্যান ঘানিভাঙা সরষের তেল (5L Tin Pack)",
        slug: "5l-family-tin-pack-mustard-oil",
        price: 1950,
        compareAtPrice: 2200,
        featuredImage: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800",
        sku: "GNB-TIN-02",
        stock: 25,
        isFeatured: true,
        isTrending: true,
        category: { name: "৫ লিটার টিন (5L Tin Pack)", slug: "5l-tin" },
        ratings: { average: 4.9, count: 48 },
      },
      {
        _id: "demo-3",
        title: "৫০০ মি.লি. ঐতিহ্যবাহী র কাচের বয়াম সরষের তেল (500ml Raw Jar)",
        slug: "500ml-raw-glass-jar-mustard-oil",
        price: 230,
        compareAtPrice: 260,
        featuredImage: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800",
        sku: "GNB-JAR-03",
        stock: 30,
        isFeatured: true,
        category: { name: "উপহার বয়াম (Gift Jar)", slug: "gift-jar" },
        ratings: { average: 5.0, count: 19 },
      },
      {
        _id: "demo-4",
        title: "২ লিটার স্পেশাল কাঠের ঘানি দেশি কালো সরষের তেল (2L Black Mustard)",
        slug: "2l-artisanal-black-mustard-oil",
        price: 820,
        compareAtPrice: 950,
        featuredImage: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800",
        sku: "GNB-BLK-04",
        stock: 18,
        isFeatured: true,
        isBestSeller: true,
        category: { name: "কাঠের ঘানি (Wood-Pressed)", slug: "wood-pressed" },
        ratings: { average: 5.0, count: 27 },
      },
      {
        _id: "demo-5",
        title: "১ লিটার ফিল্টার্ড হলুদ সরষের তেল (1L Cold-Pressed Yellow Mustard)",
        slug: "1l-cold-pressed-yellow-mustard-oil",
        price: 450,
        compareAtPrice: 500,
        featuredImage: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800",
        sku: "GNB-YLW-05",
        stock: 22,
        isNewArrival: true,
        category: { name: "হলুদ সরষে (Yellow Mustard)", slug: "yellow-mustard" },
        ratings: { average: 4.8, count: 15 },
      },
      {
        _id: "demo-6",
        title: "গৃহিণী স্পেশাল ঐতিহ্যবাহী গিফট হ্যাম্পার প্যাক (Heritage Gift Pack)",
        slug: "grihinir-heritage-gift-hamper-pack",
        price: 1450,
        compareAtPrice: 1700,
        featuredImage: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800",
        sku: "GNB-GFT-06",
        stock: 14,
        isFeatured: true,
        isTrending: true,
        category: { name: "উপহার প্যাক (Gift Packs)", slug: "gift-packs" },
        ratings: { average: 5.0, count: 35 },
      },
    ];
  }

  const defaultCategories = [
    { name: "কাঠের ঘানি তেল (Wood Pressed)", slug: "wood-pressed", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800" },
    { name: "কাচের বোতল (Glass Bottles)", slug: "glass-bottles", image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800" },
    { name: "৫ লিটার টিন (5L Tin Pack)", slug: "5l-tin", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800" },
    { name: "দেশি কালো সরষে (Black Mustard)", slug: "black-mustard", image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800" },
    { name: "হলুদ সরষের তেল (Yellow Mustard)", slug: "yellow-mustard", image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800" },
    { name: "উপহার সেট (Gift Packs)", slug: "gift-packs", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800" },
  ];

  const catList = categories.length > 0 ? categories : defaultCategories;

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "https://grihinirbari.com";
  const homepageItemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Grihinir Bari Pure Ghani Mustard Oil Products",
    itemListElement: products.slice(0, 8).map((p: any, idx: number) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `${baseUrl}/product/${p.slug}`,
      name: p.title,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageItemListJsonLd) }}
      />
      <div className="space-y-20 pb-20 bg-[#FDFBF7]">
        {/* Hero Slider Section */}
        <HeroSlider slides={heroSlidesRes.data} />

        {/* Featured Categories Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#7A4117] block">
              বাছাইকৃত পণ্য সম্ভার • CURATED SELECTION
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-[#271C16]">
              SIGNATURE VARIETIES / আমাদের বাছাইকৃত তেল ও পণ্য
            </h2>
            <div className="w-16 h-1 bg-[#C88A2B] mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {catList.map((cat: any) => (
              <Link
                key={cat.slug}
                href={`/shop?category=${cat.slug}`}
                className="group relative rounded-2xl overflow-hidden aspect-[3/4] border border-[#EADFCF] shadow-sm hover:shadow-xl hover:border-[#C88A2B] transition duration-300 bg-white"
              >
                <img
                  src={cat.image || "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800"}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D4D4F]/95 via-[#1D4D4F]/30 to-transparent" />
                <div className="absolute bottom-4 left-3 right-3 text-center">
                  <h3 className="text-xs font-bold text-white tracking-wide group-hover:text-[#FDE68A] transition leading-snug">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Mustard Oil Products Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 border-[#EADFCF]">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#7A4117]">
                ১০০% খাঁটি ও প্রাকৃতিক • 100% RAW &amp; PURE
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-[#271C16] mt-1">
                OUR PURE OILS / আমাদের সরষের তেল সংগ্রহ
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-extrabold uppercase tracking-widest text-[#C88A2B] hover:text-[#A46B1E] inline-flex items-center gap-1 mt-2 sm:mt-0 group"
            >
              সকল পণ্য দেখুন (View Catalog) <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>

        {/* Traditional Wooden Ghani Heritage Section */}
        <section className="bg-[#1D4D4F] text-white py-20 border-y border-[#163A3C] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#FDE68A] flex items-center gap-2">
                <Droplets className="w-4 h-4 text-[#FDE68A]" /> খাঁটি ঘানির ঐতিহ্য • THE GHANI LEGACY
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold font-serif text-white leading-tight">
                TRADITIONAL WOODEN GHANI HERITAGE <br />
                <span className="text-[#FDE68A] text-2xl sm:text-3xl font-sans font-bold">
                  ঐতিহ্যবাহী কাঠের ঘানি ও নির্ভেজাল খাঁটি তেল
                </span>
              </h2>
              <p className="text-sm text-[#DBEBEB] leading-relaxed font-normal">
                সনাতন কাঠের ঘানিতে ধীরগতিতে পিষে তেল প্রস্তুত করায় তেলের প্রাকৃতিক তাপমাত্রা ৪০°C এর নিচে থাকে। এর ফলে সরিষার মূল ঝাঁঝ, প্রাকৃতিক এসেনশিয়াল অয়েল ও পুষ্টিমান শতভাগ অক্ষুণ্ণ থাকে। প্রতিটি ফোঁটায় মাটির গন্ধ ও খাঁটি বাঙালি রান্নার আসল স্বাদ।
              </p>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#2A6668]">
                <div className="bg-[#163A3C] p-4 rounded-xl border border-[#2A6668]">
                  <div className="text-2xl font-bold text-[#FDE68A] font-serif">১০০%</div>
                  <div className="text-[11px] text-[#B8D7D7] font-semibold mt-1">খাঁটি কাঠের ঘানি</div>
                </div>
                <div className="bg-[#163A3C] p-4 rounded-xl border border-[#2A6668]">
                  <div className="text-2xl font-bold text-[#FDE68A] font-serif">&lt; ৪০°C</div>
                  <div className="text-[11px] text-[#B8D7D7] font-semibold mt-1">কোল্ড প্রেসড প্রযুক্তি</div>
                </div>
                <div className="bg-[#163A3C] p-4 rounded-xl border border-[#2A6668]">
                  <div className="text-2xl font-bold text-[#FDE68A] font-serif">০% ভেজাল</div>
                  <div className="text-[11px] text-[#B8D7D7] font-semibold mt-1">জিরো কেমিক্যাল</div>
                </div>
              </div>
            </div>

            <div className="relative aspect-square rounded-3xl overflow-hidden border-2 border-[#C88A2B]/40 shadow-2xl bg-[#163A3C]">
              <img
                src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1000"
                alt="Traditional Wooden Ghani Oil Cold Press Extraction"
                className="w-full h-full object-cover filter contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#163A3C]/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 bg-[#1D4D4F]/90 backdrop-blur-md p-4 rounded-2xl border border-[#C88A2B]/30 text-white">
                <p className="text-xs font-bold text-[#FDE68A]">
                  &ldquo;খাঁটি সরষের তেলের ঝাঁঝ আর সোনালী রঙেই লুকিয়ে থাকে পরিবারের সুস্বাস্থ্য ও রান্নার আসল রূপ।&rdquo;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Testimonials + Review Form */}
        <TestimonialsSection reviews={approvedReviews} products={reviewProducts} />
      </div>
    </>
  );
}
