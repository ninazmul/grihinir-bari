"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/database";
import SeoPage from "@/lib/database/models/seo.model";
import { requirePermission } from "@/lib/auth/rbac";

const DEFAULT_SEO_PAGES = [
  {
    route: "/",
    pageName: "Home Page",
    metaTitle: "Grihinir Bari | 100% Pure Cold-Pressed Ghani Mustard Oil (গৃহিণীর বাড়ি)",
    metaDescription: "গৃহিণীর বাড়ি — ঐতিহ্যবাহী কাঠের ঘানিভাঙা খাঁটি সরষের তেল। শতভাগ নির্ভেজাল, প্রাকৃতিক ঝাঁঝ ও সুবাসে ভরপুর। সারা বাংলাদেশে ক্যাশ অন ডেলিভারি।",
    keywords: ["Grihinir Bari", "গৃহিণীর বাড়ি", "খাঁটি সরষের তেল", "কাঠের ঘানিভাঙা তেল", "Cold Pressed Mustard Oil"],
    ogTitle: "Grihinir Bari | খাঁটি কাঠের ঘানিভাঙা সরষের তেল",
    ogDescription: "ঐতিহ্যবাহী কাঠের ঘানিতে প্রস্তুত শতভাগ নির্ভেজাল সরষের তেল।",
    ogImage: "/assets/images/og-cover.webp",
    robotsIndex: true,
    robotsFollow: true,
  },
  {
    route: "/shop",
    pageName: "Shop & Catalog",
    metaTitle: "আমাদের খাঁটি তেল সম্ভার | Grihinir Bari Catalog",
    metaDescription: "১ লিটার কাচের বোতল, ৫ লিটার পারিবারিক টিন ক্যান ও ঐতিহ্যবাহী কাঠের ঘানি সরষের তেল সংগ্রহ করুন।",
    keywords: ["Grihinir Bari Shop", "Buy Pure Mustard Oil", "1L Glass Bottle Mustard Oil", "5L Tin Pack"],
    ogTitle: "আমাদের খাঁটি তেল সম্ভার | Grihinir Bari Catalog",
    ogDescription: "গৃহিণীর বাড়ির শতভাগ খাঁটি কাঠের ঘানিভাঙা সরষের তেল ক্যাটালগ।",
    ogImage: "/assets/images/og-cover.webp",
    robotsIndex: true,
    robotsFollow: true,
  },
  {
    route: "/blog",
    pageName: "Journal & Stories",
    metaTitle: "ঘানি গল্প ও স্বাস্থ্যকথা | Grihinir Bari Journal",
    metaDescription: "খাঁটি সরষের তেলের ঔষধি গুণাগুণ, পুষ্টিতথ্য ও ঐতিহ্যবাহী বাঙালি রান্নার রেসিপি ব্লগ।",
    keywords: ["Mustard Oil Health Benefits", "ঘানি গল্প", "খাঁটি সরষের তেল চেনার উপায়"],
    ogTitle: "ঘানি গল্প ও স্বাস্থ্যকথা | Grihinir Bari Journal",
    ogDescription: "খাঁটি সরষের তেলের উপকারিতা ও স্বাস্থ্যকথা।",
    ogImage: "/assets/images/og-cover.webp",
    robotsIndex: true,
    robotsFollow: true,
  },
  {
    route: "/contact",
    pageName: "Contact Support",
    metaTitle: "যোগাযোগ ও কাস্টমার কেয়ার | Grihinir Bari",
    metaDescription: "গৃহিণীর বাড়ি কাস্টমার কেয়ারে যোগাযোগ করুন। খাঁটি ঘানিভাঙা সরষের তেল অর্ডার সংক্রান্ত তথ্য ও সহযোগিতার জন্য।",
    keywords: ["Grihinir Bari Contact", "Mustard Oil Customer Care", "গৃহিণীর বাড়ি হেল্পলাইন"],
    ogTitle: "যোগাযোগ ও কাস্টমার কেয়ার | Grihinir Bari",
    ogDescription: "গৃহিণীর বাড়ি গ্রাহক সহায়তা কেন্দ্র।",
    ogImage: "/assets/images/og-cover.webp",
    robotsIndex: true,
    robotsFollow: true,
  },
  {
    route: "/about",
    pageName: "Our Heritage Story",
    metaTitle: "আমাদের ঐতিহ্য ও ঘানি গল্প | Grihinir Bari",
    metaDescription: "গৃহিণীর বাড়ির খাঁটি ঘানিভাঙা সরষের তেল তৈরির পেছনের গল্প, দেশি সরিষা নির্বাচন ও গুণমানের নিশ্চয়তা।",
    keywords: ["Grihinir Bari Heritage", "কাঠের ঘানির গল্প", "Pure Cold Pressed Mustard Oil Story"],
    ogTitle: "আমাদের ঐতিহ্য ও ঘানি গল্প | Grihinir Bari",
    ogDescription: "ঐতিহ্যবাহী কাঠের ঘানিভাঙা নির্ভেজাল খাঁটি সরষের তেলের প্রতিশ্রুতি।",
    ogImage: "/assets/images/og-cover.webp",
    robotsIndex: true,
    robotsFollow: true,
  },
];

export async function getAllSeoPages() {
  try {
    await connectToDatabase();
    let pages = await SeoPage.find().sort({ route: 1 }).lean();

    if (pages.length === 0) {
      await SeoPage.insertMany(DEFAULT_SEO_PAGES);
      pages = await SeoPage.find().sort({ route: 1 }).lean();
    }

    return { success: true, data: JSON.parse(JSON.stringify(pages)) };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch SEO pages" };
  }
}

export async function getSeoPageByRoute(route: string) {
  try {
    await connectToDatabase();
    let page = await SeoPage.findOne({ route }).lean();
    if (!page) {
      const defaultPage = DEFAULT_SEO_PAGES.find((p) => p.route === route);
      if (defaultPage) {
        const created = await SeoPage.create(defaultPage);
        page = created.toObject();
      }
    }
    return { success: true, data: page ? JSON.parse(JSON.stringify(page)) : null };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch SEO page" };
  }
}

export async function updateSeoPage(route: string, payload: any) {
  await requirePermission("settings", "update");
  try {
    await connectToDatabase();
    const updated = await SeoPage.findOneAndUpdate(
      { route },
      { $set: payload },
      { new: true, upsert: true }
    );
    revalidatePath("/dashboard/seo");
    revalidatePath(route);
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update SEO page" };
  }
}
