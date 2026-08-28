import { Metadata } from "next";
import { getProductBySlug, getRelatedProducts } from "@/lib/actions/product.actions";
import { getReviewsByProduct } from "@/lib/actions/review.actions";
import ProductDetailClient from "./ProductDetailClient";
import Link from "next/link";
import Script from "next/script";

export const dynamic = "force-dynamic";

// ─── Dynamic SEO Metadata ─────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const res = await getProductBySlug(slug);

  if (!res.success || !res.data) {
    return { title: "Product Not Found | Grihinir Bari" };
  }

  const p = res.data;
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "https://grihinirbari.com";

  const title = p.seoTitle || p.seo?.title || `${p.title} - Buy Online in Bangladesh | Grihinir Bari`;
  const description =
    p.seoDescription ||
    p.seo?.description ||
    p.shortDescription ||
    `${p.title} - ১০০% খাঁটি কাঠের ঘানিভাঙা সরষের তেল মূল্য ৳${p.price?.toLocaleString()}। সারা বাংলাদেশে ক্যাশ অন ডেলিভারি। Grihinir Bari থেকে কিনুন।`;

  const keywords = p.seoKeywords?.length
    ? p.seoKeywords
    : [
      p.title,
      p.category?.name || "Mustard Oil",
      "Grihinir Bari",
      "গৃহিণীর বাড়ি",
      "খাঁটি সরষের তেল",
      "Buy pure mustard oil Bangladesh",
      "Cash on Delivery mustard oil",
      ...(p.tags || []),
    ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: p.canonicalUrl || `${baseUrl}/product/${p.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/product/${p.slug}`,
      siteName: "Grihinir Bari",
      images: p.featuredImage
        ? [{ url: p.featuredImage, width: 1200, height: 1200, alt: p.title }]
        : [{ url: `${baseUrl}/assets/images/og-cover.webp`, width: 1200, height: 630, alt: p.title }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: p.featuredImage ? [p.featuredImage] : [`${baseUrl}/assets/images/og-cover.webp`],
    },
  };
}

// ─── Product Detail Page ──────────────────────────────────────
export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await getProductBySlug(slug);

  if (!res.success || !res.data) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold font-serif text-[#271C16]">পণ্য খুঁজে পাওয়া যায়নি</h1>
        <p className="text-xs text-[#8C7662]">আপনি যে পণ্যটি খুঁজছেন তা বর্তমানে স্টক আউট বা অনুপলব্ধ।</p>
        <Link href="/shop" className="inline-block text-xs font-bold text-[#C88A2B] underline">
          ক্যাটালগে ফিরে যান
        </Link>
      </div>
    );
  }

  const product = res.data;
  const [relatedRes, reviewsRes] = await Promise.all([
    getRelatedProducts(product.category?._id || product.category, product._id),
    getReviewsByProduct(product._id),
  ]);

  const related = relatedRes.success ? relatedRes.data : [];
  const reviews = reviewsRes.success ? reviewsRes.data : [];

  // ─── JSON-LD Structured Data ─────────────────────────────
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "https://grihinirbari.com";

  const productJsonLd: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.shortDescription || product.description?.slice(0, 300),
    image: product.images?.length
      ? product.images
      : product.featuredImage
        ? [product.featuredImage]
        : [],
    sku: product.sku,
    mpn: product.sku || product._id,
    category: product.category?.name || "Pure Mustard Oil",
    brand: {
      "@type": "Brand",
      name: product.brand?.name || "Grihinir Bari",
    },
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/product/${product.slug}`,
      priceCurrency: "BDT",
      price: product.price,
      itemCondition: "https://schema.org/NewCondition",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Grihinir Bari",
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "BD",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
    },
    ...(product.ratings?.count > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.ratings.average,
        reviewCount: product.ratings.count,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    ...(reviews.length > 0 && {
      review: reviews.slice(0, 5).map((r: any) => ({
        "@type": "Review",
        author: {
          "@type": "Person",
          name: r.authorName || "Customer",
        },
        datePublished: r.createdAt ? new Date(r.createdAt).toISOString() : undefined,
        reviewBody: r.comment,
        reviewRating: {
          "@type": "Rating",
          ratingValue: r.rating || 5,
          bestRating: 5,
          worstRating: 1,
        },
      })),
    }),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shop",
        item: `${baseUrl}/shop`,
      },
      ...(product.category?.name
        ? [
          {
            "@type": "ListItem",
            position: 3,
            name: product.category.name,
            item: `${baseUrl}/shop?category=${product.category.slug}`,
          },
        ]
        : []),
      {
        "@type": "ListItem",
        position: product.category?.name ? 4 : 3,
        name: product.title,
        item: `${baseUrl}/product/${product.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductDetailClient product={product} relatedProducts={related} reviews={reviews} />
    </>
  );
}


