"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/database";
import CustomPage from "@/lib/database/models/customPage.model";
import { requirePermission } from "@/lib/auth/rbac";

const DEFAULT_PAGES_DATA: Record<string, { title: string; subtitle: string; content: string; sections: { heading: string; body: string }[] }> = {
  about: {
    title: "ঐতিহ্যবাহী কাঠের ঘানিভাঙা খাঁটি সরষের তেলের নির্ভরতা",
    subtitle: "গৃহিণীর বাড়ি • THE HERITAGE OF GRIHINIR BARI",
    content: "বাঙালির হেঁশেলে সরষের তেলের গন্ধ মানেই খাঁটি পুষ্টি আর জিভে জল আনা স্বাদ। গৃহিণীর বাড়ি প্রতিশ্রুতিবদ্ধ প্রতিটি পরিবারে পৌঁছে দিতে ভেজালমুক্ত, কোল্ড-প্রেসড কাঠের ঘানিভাঙা সরষের তেল।",
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
  },
  privacy: {
    title: "গোপনীয়তা ও ডেটা সুরক্ষা নীতি",
    subtitle: "গৃহিণীর বাড়ি কীভাবে আপনার ব্যক্তিগত তথ্য সুরক্ষিত রাখে",
    content: "গৃহিণীর বাড়ি (grihinirbari.com) আপনার তথ্যের গোপনীয়তাকে সর্বোচ্চ গুরুত্ব দেয়। অর্ডার প্রক্রিয়া ও সেবার মান নিশ্চিতে প্রয়োজনীয় তথ্য সুরক্ষিতভাবে সংরক্ষিত থাকে।",
    sections: [
      {
        heading: "১. যেসব তথ্য সংগ্রহ করা হয়",
        body: "অর্ডার ডেলিভারির সুবিধার্থে গ্রাহকের নাম, ফোন নম্বর, ডেলিভারি ঠিকানা ও ইমেইল সংগ্রহ করা হয়।",
      },
      {
        heading: "২. তথ্যের ব্যবহার",
        body: "সংগৃহীত তথ্য কেবল পার্সেল ডেলিভারি ও অর্ডার ট্র্যাকিং আপডেটের উদ্দেশ্যে ব্যবহৃত হয়।",
      },
      {
        heading: "৩. তথ্য সুরক্ষা ও নিরাপত্তা",
        body: "আমরা কোনো অবস্থাতেই গ্রাহকের ব্যক্তিগত তথ্য তৃতীয় কোনো পক্ষের কাছে বিক্রি বা শেয়ার করি না।",
      },
    ],
  },
  returns: {
    title: "রিটার্ন ও রিপ্লেসমেন্ট নীতিমালা",
    subtitle: "সহজ ৭ দিনের রিটার্ন ও সন্তুষ্টির নিশ্চয়তা",
    content: "গৃহিণীর বাড়ির পণ্যের গুণমান নিয়ে কোনো সন্দেহ বা অসন্তোষ থাকলে আমরা দ্রুত রিটার্ন বা রিপ্লেসমেন্টের ব্যবস্থা করে থাকি।",
    sections: [
      {
        heading: "১. রিটার্ন পাওয়ার যোগ্যতা",
        body: "পণ্য হাতে পাওয়ার পর সিল খোলা না থাকলে অথবা ডেলিভারির সময় বোতল ভাঙা বা লিক হলে সাথে সাথে ডেলিভারিম্যানকে ফেরত দিতে পারবেন।",
      },
      {
        heading: "২. রিফান্ড প্রক্রিয়া",
        body: "রিটার্নকৃত পণ্য যাচাই-বাছাইয়ের পর ৩ থেকে ৫ কার্যদিবসের মধ্যে আপনার বিকাশ, নগদ বা ব্যাংক একাউন্টে রিফান্ড পাঠানো হবে।",
      },
    ],
  },
  terms: {
    title: "শর্তাবলী ও নিয়মাবলী",
    subtitle: "গৃহিণীর বাড়ি ওয়েবসাইট ব্যবহারের সাধারণ নিয়মাবলী",
    content: "গৃহিণীর বাড়ি (grihinirbari.com) ওয়েবসাইটে অর্ডার করার মাধ্যমে আপনি আমাদের সাধারণ শর্তাবলীতে সম্মতি জানাচ্ছেন।",
    sections: [
      {
        heading: "১. পণ্যের প্রাপ্যতা ও মূল্য",
        body: "ওয়েবসাইটে প্রদর্শিত সকল পণ্যের মূল্য বাংলাদেশি টাকায় (৳) নির্ধারিত। স্টক থাকা সাপেক্ষে অর্ডার কার্যকর হয়।",
      },
      {
        heading: "২. ক্যাশ অন ডেলিভারি (COD)",
        body: "ক্যাশ অন ডেলিভারি অর্ডারের ক্ষেত্রে পণ্য হাতে পেয়ে সম্পূর্ণ মূল্য ডেলিভারিম্যানের কাছে পরিশোধ করতে হবে।",
      },
    ],
  },
};

export async function getCustomPage(slug: "about" | "privacy" | "returns" | "terms") {
  try {
    await connectToDatabase();
    let page = await CustomPage.findOne({ slug }).lean();

    if (!page) {
      const defaultData = DEFAULT_PAGES_DATA[slug];
      if (defaultData) {
        const created = await CustomPage.create({ slug, ...defaultData });
        page = created.toObject();
      }
    }

    return { success: true, data: page ? JSON.parse(JSON.stringify(page)) : null };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch page content" };
  }
}

export async function getAllCustomPages() {
  try {
    await connectToDatabase();
    const slugs = ["about", "privacy", "returns", "terms"] as const;
    const pages: Record<string, any> = {};

    for (const slug of slugs) {
      const res = await getCustomPage(slug);
      if (res.success && res.data) {
        pages[slug] = res.data;
      }
    }

    return { success: true, data: pages };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch all page contents" };
  }
}

export async function updateCustomPage(slug: string, payload: any) {
  await requirePermission("homepage-cms", "update");
  try {
    await connectToDatabase();
    const updated = await CustomPage.findOneAndUpdate(
      { slug },
      { $set: payload },
      { new: true, upsert: true }
    );

    revalidatePath(`/dashboard/homepage-cms`);
    revalidatePath(`/${slug}`);
    if (slug === "returns") revalidatePath("/returns");
    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update page content" };
  }
}
