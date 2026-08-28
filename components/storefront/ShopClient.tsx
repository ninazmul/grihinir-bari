"use client";

import { useState, useMemo, useTransition, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import ProductCard from "@/components/storefront/ProductCard";
import { Filter, Search, X, SlidersHorizontal, ArrowUpDown, RotateCcw } from "lucide-react";

interface ShopClientProps {
  initialProducts: any[];
  categories: any[];
  initialParams: {
    category?: string;
    query?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

export default function ShopClient({
  initialProducts,
  categories,
  initialParams,
}: ShopClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local state for instant responsive interactions
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialParams.category || ""
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    initialParams.query || ""
  );
  const [sortOption, setSortOption] = useState<string>(
    initialParams.sort || "newest"
  );
  const [minPrice, setMinPrice] = useState<string>(
    initialParams.minPrice || ""
  );
  const [maxPrice, setMaxPrice] = useState<string>(
    initialParams.maxPrice || ""
  );
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state if URL searchParams change externally
  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "");
    setSearchQuery(searchParams.get("query") || "");
    setSortOption(searchParams.get("sort") || "newest");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
  }, [searchParams]);

  // Sync URL in background without blocking UI
  const updateUrlParams = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    startTransition(() => {
      const newQuery = params.toString();
      router.push(newQuery ? `${pathname}?${newQuery}` : pathname, {
        scroll: false,
      });
    });
  };

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    updateUrlParams({ category: slug || null });
  };

  const handleSortChange = (newSort: string) => {
    setSortOption(newSort);
    updateUrlParams({ sort: newSort === "newest" ? null : newSort });
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    updateUrlParams({ query: val.trim() || null });
  };

  const handlePriceFilter = (min: string, max: string) => {
    setMinPrice(min);
    setMaxPrice(max);
    updateUrlParams({
      minPrice: min || null,
      maxPrice: max || null,
    });
  };

  const handleResetFilters = () => {
    setSelectedCategory("");
    setSearchQuery("");
    setSortOption("newest");
    setMinPrice("");
    setMaxPrice("");
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  // Instant client-side memoized filtering & sorting (0ms delay)
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Filter by Category if selected
    if (selectedCategory) {
      result = result.filter((p) => {
        const catSlug =
          typeof p.category === "object" ? p.category?.slug : p.category;
        return catSlug === selectedCategory;
      });
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => {
        const titleMatch = p.title?.toLowerCase().includes(q);
        const skuMatch = p.sku?.toLowerCase().includes(q);
        const descMatch = p.description?.toLowerCase().includes(q);
        const categoryName =
          typeof p.category === "object" ? p.category?.name?.toLowerCase() : "";
        return titleMatch || skuMatch || descMatch || categoryName?.includes(q);
      });
    }

    // Filter by Price Range
    const minP = parseFloat(minPrice);
    const maxP = parseFloat(maxPrice);
    if (!isNaN(minP)) {
      result = result.filter((p) => p.price >= minP);
    }
    if (!isNaN(maxP)) {
      result = result.filter((p) => p.price <= maxP);
    }

    // Sort Products
    if (sortOption === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === "rating") {
      result.sort(
        (a, b) => (b.ratings?.average || 0) - (a.ratings?.average || 0)
      );
    } else if (sortOption === "popular") {
      result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    } else {
      // Default: newest
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return result;
  }, [initialProducts, selectedCategory, searchQuery, sortOption, minPrice, maxPrice]);

  const activeFilterCount =
    (selectedCategory ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    (minPrice || maxPrice ? 1 : 0) +
    (sortOption !== "newest" ? 1 : 0);

  const selectedCategoryObj = categories.find((c) => c.slug === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Top Banner Header */}
      <div className="bg-[#1D4D4F] text-white p-8 sm:p-12 rounded-3xl border border-[#163A3C] relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-xl space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#FDE68A]">
            GRIHINIR BARI • খাঁটি ঘানির তেল
          </span>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-serif">
            {selectedCategoryObj
              ? selectedCategoryObj.name
              : selectedCategory
              ? selectedCategory.replace(/-/g, " ").toUpperCase()
              : "আমাদের সরষের তেল সংগ্রহ"}
          </h1>
          <p className="text-xs sm:text-sm text-[#DBEBEB] leading-relaxed font-normal">
            ঐতিহ্যবাহী কাঠের ঘানিভাঙা খাঁটি সরষের তেল, ১ লিটার প্রিমিয়াম কাচের বোতল, ৫ লিটার পারিবারিক টিন প্যাক ও স্পেশাল গিফট হ্যাম্পার।
          </p>
        </div>
      </div>

      {/* Mobile Filter Toggle Button */}
      <div className="flex lg:hidden items-center justify-between gap-3">
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="flex-1 py-3 px-4 bg-[#C88A2B] hover:bg-[#A46B1E] text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-md"
        >
          <SlidersHorizontal className="w-4 h-4" /> ফিল্টার ও ক্যাটাগরি (Filters)
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-white text-[#C88A2B] text-[10px] font-black flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar Filters (Desktop & Collapsible Mobile Overlay) */}
        <aside
          className={`space-y-6 lg:block ${
            mobileFilterOpen
              ? "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm p-4 flex justify-end"
              : "hidden"
          }`}
          onClick={() => setMobileFilterOpen(false)}
        >
          <div
            className={`space-y-6 ${
              mobileFilterOpen
                ? "bg-[#FDFBF7] text-[#271C16] w-full max-w-xs h-full p-6 overflow-y-auto rounded-3xl shadow-2xl"
                : ""
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {mobileFilterOpen && (
              <div className="flex items-center justify-between border-b border-[#EADFCF] pb-3">
                <h3 className="font-extrabold uppercase tracking-wider text-sm text-[#7A4117]">
                  ফিল্টার করুন (Filters)
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 hover:bg-[#F5EFE6] rounded-lg text-[#7A4117]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Live Search Input */}
            <div className="bg-white p-5 rounded-2xl border border-[#EADFCF] shadow-sm space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#7A4117] flex items-center gap-2">
                <Search className="w-4 h-4 text-[#C88A2B]" /> পণ্য সার্চ করুন
              </h3>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="তেল, বোতল, টিন সার্চ..."
                  className="w-full pl-9 pr-8 py-2.5 text-xs bg-[#FAF6EE] border border-[#EADFCF] rounded-xl text-[#271C16] focus:outline-none focus:border-[#C88A2B] font-medium transition"
                />
                <Search className="w-4 h-4 text-[#8C7662] absolute left-3 top-3" />
                {searchQuery && (
                  <button
                    onClick={() => handleSearchChange("")}
                    className="absolute right-2.5 top-2.5 text-[#8C7662] hover:text-[#C88A2B]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div className="bg-white p-5 rounded-2xl border border-[#EADFCF] shadow-sm space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#7A4117] flex items-center gap-2 border-b border-[#EADFCF] pb-2">
                <Filter className="w-4 h-4 text-[#C88A2B]" /> ক্যাটাগরি (Categories)
              </h3>

              <ul className="space-y-1 text-xs font-medium">
                <li>
                  <button
                    onClick={() => handleCategoryChange("")}
                    className={`w-full text-left py-2 px-3 rounded-xl transition flex items-center justify-between ${
                      !selectedCategory
                        ? "bg-[#C88A2B] text-white font-bold shadow-sm"
                        : "text-[#271C16] hover:bg-[#FAF6EE] hover:text-[#C88A2B]"
                    }`}
                  >
                    <span>সকল পণ্য (All Products)</span>
                    <span className="text-[10px] opacity-80">({initialProducts.length})</span>
                  </button>
                </li>
                {categories.map((c: any) => {
                  const count = initialProducts.filter(
                    (p) =>
                      (typeof p.category === "object" ? p.category?.slug : p.category) ===
                      c.slug
                  ).length;

                  return (
                    <li key={c.slug}>
                      <button
                        onClick={() => handleCategoryChange(c.slug)}
                        className={`w-full text-left py-2 px-3 rounded-xl transition flex items-center justify-between ${
                          selectedCategory === c.slug
                            ? "bg-[#C88A2B] text-white font-bold shadow-sm"
                            : "text-[#271C16] hover:bg-[#FAF6EE] hover:text-[#C88A2B]"
                        }`}
                      >
                        <span className="truncate">{c.name}</span>
                        {count > 0 && (
                          <span className="text-[10px] opacity-80 ml-2 font-mono">
                            ({count})
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Price Filter */}
            <div className="bg-white p-5 rounded-2xl border border-[#EADFCF] shadow-sm space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#7A4117] flex items-center gap-2 border-b border-[#EADFCF] pb-2">
                মূল্য সীমা (Price Range ৳)
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-[#8C7662] font-bold block mb-1">
                    সর্বনিম্ন (MIN)
                  </label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => handlePriceFilter(e.target.value, maxPrice)}
                    placeholder="0"
                    className="w-full p-2 bg-[#FAF6EE] border border-[#EADFCF] rounded-lg text-xs focus:outline-none focus:border-[#C88A2B] font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#8C7662] font-bold block mb-1">
                    সর্বোচ্চ (MAX)
                  </label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => handlePriceFilter(minPrice, e.target.value)}
                    placeholder="5000"
                    className="w-full p-2 bg-[#FAF6EE] border border-[#EADFCF] rounded-lg text-xs focus:outline-none focus:border-[#C88A2B] font-mono"
                  />
                </div>
              </div>

              {/* Price Presets */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { label: "৳৫০০ এর নিচে", min: "", max: "500" },
                  { label: "৳৫০০ - ৳১৫০০", min: "500", max: "1500" },
                  { label: "৳১৫০০+", min: "1500", max: "" },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handlePriceFilter(preset.min, preset.max)}
                    className="text-[10px] font-bold px-2.5 py-1 bg-[#FAF6EE] hover:bg-[#C88A2B] hover:text-white rounded-md text-[#7A4117] transition border border-[#EADFCF]"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset All Filters */}
            {activeFilterCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="w-full py-2.5 text-xs font-bold text-[#7A4117] border border-[#EADFCF] rounded-xl hover:bg-[#FAF6EE] transition flex items-center justify-center gap-1.5 bg-white"
              >
                <RotateCcw className="w-3.5 h-3.5" /> ফিল্টার ক্লিয়ার করুন (Clear)
              </button>
            )}
          </div>
        </aside>

        {/* Products Display Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Controls Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#EADFCF] shadow-sm text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="text-[#271C16] font-extrabold">
                মোট {filteredProducts.length}টি পণ্য প্রদর্শিত হচ্ছে
              </span>
              {isPending && (
                <span className="w-3.5 h-3.5 border-2 border-[#C88A2B]/30 border-t-[#C88A2B] rounded-full animate-spin ml-1" />
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[#8C7662] font-medium flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#C88A2B]" /> সাজান (Sort):
              </span>
              <select
                value={sortOption}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-[#FAF6EE] border border-[#EADFCF] rounded-xl px-3 py-1.5 outline-none text-xs font-bold text-[#271C16] cursor-pointer focus:border-[#C88A2B] transition"
              >
                <option value="newest">নতুন সংযোজন (Newest)</option>
                <option value="price-asc">মূল্য: কম থেকে বেশি</option>
                <option value="price-desc">মূল্য: বেশি থেকে কম</option>
                <option value="rating">সর্বোচ্চ রেটিং (Top Rated)</option>
                <option value="popular">জনপ্রিয় পণ্য (Best Sellers)</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 bg-[#FAF6EE] p-3 rounded-xl border border-[#EADFCF] text-xs">
              <span className="font-extrabold text-[#7A4117] uppercase tracking-wider text-[10px]">
                অ্যাক্টিভ ফিল্টার:
              </span>
              {selectedCategory && (
                <span className="bg-[#1D4D4F] text-[#FDE68A] px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[11px] font-bold">
                  ক্যাটাগরি: {selectedCategory}
                  <X
                    className="w-3 h-3 cursor-pointer hover:opacity-70"
                    onClick={() => handleCategoryChange("")}
                  />
                </span>
              )}
              {searchQuery && (
                <span className="bg-[#1D4D4F] text-[#FDE68A] px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[11px] font-bold">
                  "{searchQuery}"
                  <X
                    className="w-3 h-3 cursor-pointer hover:opacity-70"
                    onClick={() => handleSearchChange("")}
                  />
                </span>
              )}
              {(minPrice || maxPrice) && (
                <span className="bg-[#1D4D4F] text-[#FDE68A] px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[11px] font-bold">
                  ৳{minPrice || "0"} - ৳{maxPrice || "∞"}
                  <X
                    className="w-3 h-3 cursor-pointer hover:opacity-70"
                    onClick={() => handlePriceFilter("", "")}
                  />
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-[11px] font-bold text-[#C88A2B] hover:underline ml-auto"
              >
                রিসেট করুন
              </button>
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#EADFCF] space-y-4">
              <Filter className="w-12 h-12 text-[#C88A2B]/40 mx-auto" />
              <div className="space-y-1">
                <p className="text-base font-bold text-[#271C16]">
                  কোনো পণ্য খুঁজে পাওয়া যায়নি
                </p>
                <p className="text-xs text-[#8C7662]">
                  অন্য কোনো কীওয়ার্ড লিখে সার্চ করুন অথবা ফিল্টার রিসেট করুন।
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="inline-block py-2.5 px-5 bg-[#C88A2B] hover:bg-[#A46B1E] text-white text-xs font-extrabold uppercase tracking-wider rounded-xl transition shadow-md"
              >
                ফিল্টার রিসেট করুন
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
