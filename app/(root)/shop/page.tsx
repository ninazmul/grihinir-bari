import { Metadata } from "next";
import { getProducts } from "@/lib/actions/product.actions";
import { getCategories } from "@/lib/actions/category.actions";
import ShopClient from "@/components/storefront/ShopClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    query?: string;
    sort?: any;
    minPrice?: string;
    maxPrice?: string;
  }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "https://grihinirbari.com";

  let title = "আমাদের খাঁটি তেল সম্ভার | Grihinir Bari (গৃহিণীর বাড়ি) Catalog";
  if (params.category) {
    const formattedCat = params.category
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    title = `${formattedCat} | Grihinir Bari (গৃহিণীর বাড়ি)`;
  } else if (params.query) {
    title = `অনুসন্ধান: "${params.query}" | Grihinir Bari`;
  }

  const description =
    "গৃহিণীর বাড়ি এর ১০০% খাঁটি কোল্ড-প্রেসড কাঠের ঘানিভাঙা সরষের তেল সংগ্রহ করুন। ১ লিটার কাচের বোতল, ৫ লিটার পারিবারিক টিন ক্যান ও ঐতিহ্যবাহী কাঠের ঘানি তেল সারা বাংলাদেশে হোম ডেলিভারি।";

  const canonical = params.category
    ? `${baseUrl}/shop?category=${encodeURIComponent(params.category)}`
    : `${baseUrl}/shop`;

  return {
    title,
    description,
    keywords: [
      "Grihinir Bari Shop",
      "গৃহিণীর বাড়ি সরষের তেল",
      "কাঠের ঘানিভাঙা খাঁটি সরিষার তেল",
      "Cold Pressed Mustard Oil Bangladesh",
      "Buy Pure Mustard Oil Online",
      "1L Glass Bottle Mustard Oil",
      "5L Tin Can Mustard Oil BD",
    ],
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Grihinir Bari",
      images: [
        {
          url: `${baseUrl}/assets/images/og-cover.webp`,
          width: 1200,
          height: 630,
          alt: "Grihinir Bari Pure Mustard Oil Catalog",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/assets/images/og-cover.webp`],
    },
  };
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    query?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}) {
  const params = await searchParams;

  // Fetch initial catalog dataset efficiently in parallel
  const [productsRes, categoriesRes] = await Promise.all([
    getProducts({
      limit: 100, // Fetch catalog items for instant client-side interactions
    }),
    getCategories(),
  ]);

  const products = productsRes.success ? productsRes.data : [];
  const categories = categoriesRes.success ? categoriesRes.data : [];

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "https://grihinirbari.com";

  const collectionPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: params.category
      ? `Grihinir Bari ${params.category.replace("-", " ").toUpperCase()} Collection`
      : "Grihinir Bari Pure Mustard Oil Catalog",
    url: `${baseUrl}/shop`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.map((p: any, idx: number) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `${baseUrl}/product/${p.slug}`,
        name: p.title,
      })),
    },
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
      ...(params.category
        ? [
          {
            "@type": "ListItem",
            position: 3,
            name: params.category.replace("-", " ").toUpperCase(),
            item: `${baseUrl}/shop?category=${params.category}`,
          },
        ]
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ShopClient
          initialProducts={products}
          categories={categories}
          initialParams={params}
        />
      </div>
    </>
  );
}
