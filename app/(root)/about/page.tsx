import { Metadata } from "next";
import Link from "next/link";
import { Droplets, ShieldCheck, Award, Sparkles, HeartHandshake, CheckCircle2 } from "lucide-react";
import { getCustomPage } from "@/lib/actions/page.actions";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "https://grihinirbari.com";
  const title = "আমাদের গল্প | Grihinir Bari (গৃহিণীর বাড়ি) - খাঁটি ঘানিভাঙা সরষের তেল";
  const description =
    "গৃহিণীর বাড়ি এর ঐতিহ্য ও প্রতিশ্রুতি — দেশি বাছাইকৃত সরিষা থেকে সনাতন কাঠের ঘানিতে প্রস্তুত শতভাগ নির্ভেজাল কোল্ড প্রেসড সরষের তেল।";

  return {
    title,
    description,
    keywords: ["About Grihinir Bari", "গৃহিণীর বাড়ির গল্প", "কাঠের ঘানিভাঙা তেল প্রস্তুত প্রণালী", "Pure mustard oil heritage Bangladesh"],
    alternates: {
      canonical: `${baseUrl}/about`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/about`,
      siteName: "Grihinir Bari",
      images: [
        {
          url: `${baseUrl}/assets/images/og-cover.webp`,
          width: 1200,
          height: 630,
          alt: "Grihinir Bari Pure Mustard Oil Heritage",
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

export default async function AboutPage() {
  const res = await getCustomPage("about");
  const page = res.data || {
    title: "ঐতিহ্যবাহী কাঠের ঘানিভাঙা খাঁটি সরষের তেলের নির্ভরতা",
    subtitle: "গৃহিণীর বাড়ি • THE HERITAGE OF GRIHINIR BARI",
    content:
      "বাঙালির হেঁশেলে সরষের তেলের গন্ধ মানেই খাঁটি পুষ্টি আর জিভে জল আনা স্বাদ। গৃহিণীর বাড়ি প্রতিশ্রুতিবদ্ধ প্রতিটি পরিবারে পৌঁছে দিতে ভেজালমুক্ত, কোল্ড-প্রেসড কাঠের ঘানিভাঙা সরষের তেল।",
    sections: [
      {
        heading: "শতভাগ দেশি সরিষা নির্বাচন",
        body: "আমরা দেশের সেরা অঞ্চলের কৃষকদের থেকে সরাসরি বাছাইকৃত দেশি কালো ও হলুদ সরিষা সংগ্রহ করি। প্রতিটি দানা পরিষ্কার করে রোদে শুকিয়ে প্রস্তুত করা হয়।",
      },
      {
        heading: "সনাতন কাঠের ঘানি প্রযুক্তি",
        body: "ধীরগতির কাঠের ঘানিতে পিষে তেল নিষ্কাশন করা হয় যার তাপমাত্রা সর্বদা ৪০ ডিগ্রি সেলসিয়াসের নিচে থাকে। ফলে তেলের মূল পুষ্টি ও ঝাঁঝ অক্ষুণ্ণ থাকে।",
      },
      {
        heading: "প্রাকৃতিক ফিল্টারিং ও পিউরিটি",
        body: "কোনো ধরনের রাসায়নিক দ্রাবক, প্রিজারভেটিভ বা কৃত্রিম সুবাস ছাড়া শুধু সূক্ষ্ম সুতি কাপড়ে প্রাকৃতিক নিয়মে থিতিয়ে বোতলজাত করা হয়।",
      },
    ],
  };

  const icons = [Droplets, Award, ShieldCheck, Sparkles];
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "https://grihinirbari.com";

  const aboutPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: page.title,
    description: page.content || "About Grihinir Bari pure mustard oil.",
    url: `${baseUrl}/about`,
    mainEntity: {
      "@type": "Organization",
      name: "Grihinir Bari",
      url: baseUrl,
      logo: `${baseUrl}/assets/images/logo.png`,
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 bg-[#FDFBF7]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageJsonLd) }}
      />
      {/* Brand Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#7A4117] block">
          {page.subtitle || "গৃহিণীর বাড়ি • THE HERITAGE OF GRIHINIR BARI"}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-[#271C16] leading-tight">
          {page.title}
        </h1>
        {page.content && (
          <p className="text-sm text-[#7A4117] leading-relaxed font-normal">
            {page.content}
          </p>
        )}
      </div>

      {/* Hero Image */}
      <div className="aspect-[21/9] rounded-3xl overflow-hidden border border-[#EADFCF] shadow-2xl relative">
        <img
          src="https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=1600"
          alt="Mustard harvest field under sunlight"
          className="w-full h-full object-cover filter contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1D4D4F]/90 via-[#1D4D4F]/30 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8 text-white font-serif">
          <p className="text-xl sm:text-2xl font-bold italic text-[#FDE68A]">
            &ldquo;মাটির সোঁদা ঘ্রাণ আর খাঁটি সরিষার আসল ঝাঁঝেই পরিবারের সুস্বাস্থ্য।&rdquo;
          </p>
        </div>
      </div>

      {/* Dynamic CMS Sections */}
      {page.sections && page.sections.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {page.sections.map((sec: any, idx: number) => {
            const IconComp = icons[idx % icons.length];
            return (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-[#EADFCF] shadow-sm space-y-3 hover:border-[#C88A2B] transition">
                <IconComp className="w-8 h-8 text-[#C88A2B]" />
                <h3 className="text-lg font-bold font-serif text-[#271C16]">{sec.heading}</h3>
                <p className="text-xs text-[#7A4117] leading-relaxed whitespace-pre-line">
                  {sec.body}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
