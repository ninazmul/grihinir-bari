import { Metadata } from "next";
import { getCustomPage } from "@/lib/actions/page.actions";
import { ShieldCheck, Lock, FileText, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "https://grihinirbari.com";
  const title = "গোপনীয়তা ও তথ্য সুরক্ষা নীতি | Grihinir Bari (গৃহিণীর বাড়ি)";
  const description = "গৃহিণীর বাড়ির ডেটা সুরক্ষা ও গোপনীয়তা নীতি। জানুন কীভাবে আমরা আপনার ব্যক্তিগত তথ্য ও অর্ডার ট্র্যাকিং নিরাপদ রাখি।";

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/privacy`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/privacy`,
      siteName: "Grihinir Bari",
      images: [`${baseUrl}/assets/images/og-cover.webp`],
      type: "website",
    },
  };
}

export default async function PrivacyPage() {
  const res = await getCustomPage("privacy");
  const page = res.data || {
    title: "গোপনীয়তা ও ডেটা সুরক্ষা নীতি",
    subtitle: "গৃহিণীর বাড়ি কীভাবে আপনার ব্যক্তিগত তথ্য সুরক্ষিত রাখে",
    content: "গৃহিণীর বাড়ি (grihinirbari.com) আপনার তথ্যের গোপনীয়তাকে সর্বোচ্চ গুরুত্ব দেয়।",
    sections: [],
  };

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "https://grihinirbari.com";

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    description: page.subtitle || "Privacy policy for Grihinir Bari",
    url: `${baseUrl}/privacy`,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      {/* Hero */}
      <div className="text-center space-y-3 border-b pb-8">
        <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center mx-auto mb-2 shadow-md">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">
          Security &amp; Compliance
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-gray-900">
          {page.title}
        </h1>
        {page.subtitle && (
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">{page.subtitle}</p>
        )}
      </div>

      {/* Main Introduction */}
      {page.content && (
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 text-sm text-gray-700 leading-relaxed shadow-sm">
          {page.content}
        </div>
      )}

      {/* Sections List */}
      <div className="space-y-8">
        {page.sections?.map((sec: any, idx: number) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-2">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              {sec.heading}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pl-6 whitespace-pre-line">
              {sec.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
