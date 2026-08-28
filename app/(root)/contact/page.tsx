import { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { getSetting } from "@/lib/actions/setting.actions";
import ContactForm from "./ContactForm";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "https://grihinirbari.com";
  const title = "যোগাযোগ | Grihinir Bari (গৃহিণীর বাড়ি) কাস্টমার সাপোর্ট";
  const description =
    "গৃহিণীর বাড়ি কাস্টমার কেয়ারে যোগাযোগ করুন। খাঁটি ঘানিভাঙা সরষের তেল অর্ডার সংক্রান্ত তথ্য, হোলসেল বা যেকোনো প্রশ্নের জন্য আমরা প্রস্তুত।";

  return {
    title,
    description,
    keywords: ["Contact Grihinir Bari", "গৃহিণীর বাড়ি যোগাযোগ", "Mustard oil customer care Bangladesh", "Grihinir Bari Hotline"],
    alternates: {
      canonical: `${baseUrl}/contact`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/contact`,
      siteName: "Grihinir Bari",
      images: [
        {
          url: `${baseUrl}/assets/images/og-cover.webp`,
          width: 1200,
          height: 630,
          alt: "Contact Grihinir Bari Customer Care",
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

export default async function ContactPage() {
  const setting = (await getSetting()) || ({} as any);
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "https://grihinirbari.com";

  const contactPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Grihinir Bari",
    description: "Contact details for Grihinir Bari customer care.",
    url: `${baseUrl}/contact`,
    mainEntity: {
      "@type": "Organization",
      name: "Grihinir Bari",
      url: baseUrl,
      email: setting?.contactEmail || "support@grihinirbari.com",
      telephone: setting?.phoneNumber || "+8801700000000",
      address: setting?.address
        ? {
          "@type": "PostalAddress",
          streetAddress: setting.address,
          addressCountry: "BD",
        }
        : undefined,
    },
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageJsonLd) }}
      />
      <Toaster />
      {/* Page Header */}
      <div className="bg-[#1D4D4F] text-white py-16 border-b border-[#163A3C]">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#FDE68A]">
            যোগাযোগ ও সহায়তা • CUSTOMER CARE
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif">আমাদের সাথে যোগাযোগ করুন</h1>
          <p className="text-[#DBEBEB] max-w-2xl mx-auto text-xs sm:text-sm font-normal">
            পণ্য অর্ডার, বাল্ক ক্রয় অথবা যেকোনো পরামর্শ ও মতামতের জন্য আমাদের কাস্টমার কেয়ারে যোগাযোগ করুন।
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold font-serif text-[#271C16] mb-2">
              যোগাযোগের তথ্য
            </h2>

            <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-[#EADFCF] shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#FAF6EE] flex items-center justify-center flex-shrink-0 text-[#C88A2B]">
                <Mail size={18} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#7A4117]">
                  ইমেইল (Email)
                </h3>
                <a
                  href={`mailto:${setting?.contactEmail || "support@grihinirbari.com"}`}
                  className="text-xs text-[#271C16] hover:text-[#C88A2B]"
                >
                  {setting?.contactEmail || "support@grihinirbari.com"}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-[#EADFCF] shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#FAF6EE] flex items-center justify-center flex-shrink-0 text-[#C88A2B]">
                <Phone size={18} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#7A4117]">
                  হটলাইন নম্বর (Phone)
                </h3>
                <p className="text-xs text-[#271C16] font-mono">
                  {setting?.phoneNumber || "+880 1700-000000"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-[#EADFCF] shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#FAF6EE] flex items-center justify-center flex-shrink-0 text-[#C88A2B]">
                <MapPin size={18} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#7A4117]">
                  ঠিকানা (Address)
                </h3>
                <p className="text-xs text-[#271C16]">{setting?.address || "ঢাকা, বাংলাদেশ"}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-[#EADFCF] shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#FAF6EE] flex items-center justify-center flex-shrink-0 text-[#C88A2B]">
                <Clock size={18} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#7A4117]">
                  অফিস সময়
                </h3>
                <p className="text-xs text-[#271C16]">
                  {setting?.officeHours || "সকাল ৯টা - রাত ৯টা (প্রতিদিন)"}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-[#EADFCF]">
            <h2 className="text-xl font-bold font-serif text-[#271C16] mb-1">
              সরাসরি বার্তা পাঠান (Send a Message)
            </h2>
            <p className="text-xs text-[#8C7662] mb-6">
              নিচের ফর্মটি পূরণ করে আপনার প্রশ্ন বা বার্তা পাঠান। আমাদের টিম দ্রুত আপনার সাথে যোগাযোগ করবে।
            </p>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
