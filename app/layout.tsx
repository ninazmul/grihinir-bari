import { Metadata } from "next";
import { Inter, DM_Serif_Display, Hind_Siliguri } from "next/font/google";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { getSetting } from "@/lib/actions/setting.actions";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
});

const solaimanLipi = localFont({
  src: [
    {
      path: "../public/fonts/SolaimanLipi.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-bengali",
});

export async function generateMetadata(): Promise<Metadata> {
  const setting = await getSetting();

  const defaultTitle =
    "Grihinir Bari | 100% Pure Cold-Pressed Ghani Mustard Oil – গৃহিণীর বাড়ি খাঁটি সরষের তেল";
  const defaultDescription =
    "গৃহিণীর বাড়ি (Grihinir Bari) offers 100% authentic wooden ghani cold-pressed mustard oil, rich in natural pungent aroma, essential nutrients, and zero chemicals. Cash on Delivery across Bangladesh.";
  const defaultKeywords = [
    "Grihinir Bari",
    "গৃহিণীর বাড়ি",
    "খাঁটি সরষের তেল",
    "কাঠের ঘানিভাঙা তেল",
    "Cold Pressed Mustard Oil Bangladesh",
    "Ghani Mustard Oil Dhaka",
    "Pure Mustard Oil Online",
    "Organic Mustard Oil BD",
    "Cash on Delivery Mustard Oil",
  ];
  const defaultUrl = "https://grihinirbari.com";
  const defaultImage = "/assets/images/og-cover.webp";

  const seo = setting?.seo || {};
  const metadataBase = seo.canonicalUrlBase
    ? new URL(seo.canonicalUrlBase)
    : new URL(defaultUrl);

  return {
    title: {
      default: seo.siteTitle || defaultTitle,
      template: "%s | Grihinir Bari – গৃহিণীর বাড়ি",
    },
    description: seo.siteMetaDescription || defaultDescription,
    keywords: seo.siteKeywords?.length ? seo.siteKeywords : defaultKeywords,
    metadataBase,
    icons: {
      icon: "/assets/images/logo-icon.png",
      shortcut: "/assets/images/logo-icon.png",
      apple: "/assets/images/logo-icon.png",
    },
    alternates: {
      canonical: seo.canonicalUrlBase || defaultUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: seo.ogTitle || seo.siteTitle || defaultTitle,
      description:
        seo.ogDescription || seo.siteMetaDescription || defaultDescription,
      url: seo.canonicalUrlBase || defaultUrl,
      siteName: "Grihinir Bari",
      images: seo.ogImage
        ? [
          {
            url: seo.ogImage,
            width: 1200,
            height: 630,
            alt: "Grihinir Bari – 100% Pure Ghani Mustard Oil",
          },
        ]
        : [
          {
            url: defaultImage,
            width: 1200,
            height: 630,
            alt: "Grihinir Bari – 100% Pure Ghani Mustard Oil",
          },
        ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title:
        seo.twitterCardTitle || seo.ogTitle || seo.siteTitle || defaultTitle,
      description:
        seo.twitterCardDescription ||
        seo.ogDescription ||
        seo.siteMetaDescription ||
        defaultDescription,
      images: seo.twitterCardImage ? [seo.twitterCardImage] : [defaultImage],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const setting = await getSetting();

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "https://grihinirbari.com";

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Grihinir Bari",
    alternateName: "গৃহিণীর বাড়ি",
    url: baseUrl,
    logo: `${baseUrl}/assets/images/logo.png`,
    description:
      "Grihinir Bari provides 100% pure traditional wooden ghani cold-pressed mustard oil with uncompromised natural aroma, taste, and purity.",
    contactPoint: setting?.phoneNumber || setting?.contactEmail
      ? {
        "@type": "ContactPoint",
        telephone: setting.phoneNumber || "",
        email: setting.contactEmail || "",
        contactType: "customer service",
        areaServed: "BD",
        availableLanguage: ["bn", "en"],
      }
      : undefined,
  };

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Grihinir Bari",
    alternateName: "গৃহিণীর বাড়ি",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/shop?query={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const cssVars = `
    :root {
      --primary: #C88A2B;
      --primary-foreground: #FFFFFF;
    }
  `;

  return (
    <html lang="bn" data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webSiteJsonLd),
          }}
        />
      </head>
      <style precedence="default" href="grihinir-bari-css-vars">{cssVars}</style>
      <body
        className={`${inter.variable} ${dmSerif.variable} ${hindSiliguri.variable} ${solaimanLipi.variable} font-sans bg-[#FDFBF7] text-[#271C16] antialiased`}
      >
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}

