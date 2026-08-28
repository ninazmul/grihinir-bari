import { Metadata } from "next";
import { getCustomPage } from "@/lib/actions/page.actions";
import ReturnsClient from "./ReturnsClient";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "https://grihinirbari.com";
  const title = "রিটার্ন ও রিপ্লেসমেন্ট নীতিমালা | Grihinir Bari (গৃহিণীর বাড়ি)";
  const description = "গৃহিণীর বাড়ির সহজ রিটার্ন ও রিপ্লেসমেন্ট পলিসি। খাঁটি কাঠের ঘানি সরষের তেলের সিল বা বোতল অক্ষত রেখে সন্তুষ্টির নিশ্চয়তা।";

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/returns`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/returns`,
      siteName: "Grihinir Bari",
      images: [`${baseUrl}/assets/images/og-cover.webp`],
      type: "website",
    },
  };
}

export default async function ReturnsPage() {
  const res = await getCustomPage("returns");
  const page = res.data;
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "https://grihinirbari.com";

  const returnPolicyJsonLd = {
    "@context": "https://schema.org",
    "@type": "MerchantReturnPolicy",
    name: "Grihinir Bari Return Policy",
    applicableCountry: "BD",
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 7,
    returnMethod: "https://schema.org/ReturnByMail",
    returnFees: "https://schema.org/FreeReturn",
    url: `${baseUrl}/returns`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(returnPolicyJsonLd) }}
      />
      <ReturnsClient page={page} />
    </>
  );
}

