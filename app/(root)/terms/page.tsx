import { Metadata } from "next";
import { getCustomPage } from "@/lib/actions/page.actions";
import { FileText, Scale, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "https://grihinirbari.com";
  const title = "শর্তাবলী ও নিয়মাবলী | Grihinir Bari (গৃহিণীর বাড়ি)";
  const description = "গৃহিণীর বাড়ি ওয়েবসাইট ব্যবহারের নিয়মাবলী, অর্ডার প্রক্রিয়া, ক্যাশ অন ডেলিভারি এবং কাস্টমার সেবার শর্তাবলী।";

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/terms`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/terms`,
      siteName: "Grihinir Bari",
      images: [`${baseUrl}/assets/images/og-cover.webp`],
      type: "website",
    },
  };
}

export default async function TermsPage() {
  const res = await getCustomPage("terms");
  const page = res.data || {
    title: "শর্তাবলী ও নিয়মাবলী",
    subtitle: "গৃহিণীর বাড়ি ওয়েবসাইট ব্যবহারের সাধারণ নিয়মাবলী",
    content: "গৃহিণীর বাড়ি (grihinirbari.com) এ আপনাকে স্বাগতম।",
    sections: [],
  };

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "https://grihinirbari.com";

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    description: page.subtitle || "Terms of service for Grihinir Bari",
    url: `${baseUrl}/terms`,
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
          <Scale className="w-6 h-6" />
        </div>
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500">
          Legal Agreement
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
