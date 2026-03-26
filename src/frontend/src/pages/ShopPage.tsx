import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { useStore } from "@/context/StoreContext";
import { categories, productTypes } from "@/data/products";
import type { Category, ProductType } from "@/data/products";
import { useSearch } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

type ShopSearch = { category?: string; filter?: string };

const PAGE_HEADINGS: Record<string, string> = {
  new: "New Arrivals",
  bestseller: "Best Sellers",
  Men: "Men's Collection",
  Women: "Women's Collection",
  Boys: "Boys' Collection",
  Girls: "Girls' Collection",
  Baby: "Baby Collection",
};

export default function ShopPage() {
  const search = useSearch({ strict: false }) as ShopSearch;
  const { products } = useStore();
  const initialCategory: Category | "All" =
    search.category && (categories as string[]).includes(search.category)
      ? (search.category as Category)
      : "All";

  const [activeCategory, setActiveCategory] = useState<Category | "All">(
    initialCategory,
  );
  const [activeType, setActiveType] = useState<ProductType | "All">("All");
  const [searchText, setSearchText] = useState("");
  const [discountBanner, setDiscountBanner] = useState(
    () => sessionStorage.getItem("pendingDiscount") || "",
  );

  useEffect(() => {
    if (search.category && (categories as string[]).includes(search.category)) {
      setActiveCategory(search.category as Category);
    } else {
      setActiveCategory("All");
    }
  }, [search.category]);

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchType = activeType === "All" || p.type === activeType;
    const matchSearch =
      !searchText ||
      p.name.toLowerCase().includes(searchText.toLowerCase()) ||
      p.description.toLowerCase().includes(searchText.toLowerCase());
    if (search.filter === "new") return p.newArrival && matchSearch;
    if (search.filter === "bestseller") return p.isBestSeller && matchSearch;
    return matchCat && matchType && matchSearch;
  });

  const pageHeading = search.filter
    ? PAGE_HEADINGS[search.filter] || "Collection"
    : search.category && PAGE_HEADINGS[search.category]
      ? PAGE_HEADINGS[search.category]
      : "All Products";

  return (
    <div>
      {discountBanner && (
        <div
          className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 flex items-center justify-between rounded-md mx-4 sm:mx-6 lg:mx-8 mt-4"
          data-ocid="shop.success_state"
        >
          <span className="font-semibold text-sm">
            Your 10% discount is ready! Use code{" "}
            <strong>{discountBanner}</strong> at checkout.
          </span>
          <button
            type="button"
            onClick={() => {
              setDiscountBanner("");
              sessionStorage.removeItem("pendingDiscount");
            }}
            className="ml-4 text-green-600 hover:text-green-800 font-bold text-lg leading-none"
          >
            &times;
          </button>
        </div>
      )}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {search.filter ? "Collections" : "Explore"}
          </span>
          <h1 className="font-display text-4xl font-bold mt-1">
            {pageHeading}
          </h1>
          <p className="text-muted-foreground mt-2 font-sans text-sm">
            {filtered.length} item{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {!search.filter && (
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-9 font-sans"
                data-ocid="shop.search_input"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {(["All", ...categories] as (Category | "All")[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  data-ocid="shop.tab"
                  className={`px-3 py-1.5 rounded-sm text-xs font-sans font-semibold uppercase tracking-wider transition-colors ${
                    activeCategory === cat
                      ? "bg-foreground text-background"
                      : "bg-secondary text-foreground hover:bg-secondary/70"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {!search.filter && activeCategory !== "All" && (
          <div className="flex gap-2 flex-wrap mb-8">
            {(["All", ...productTypes] as (ProductType | "All")[]).map(
              (type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setActiveType(type)}
                  data-ocid="shop.tab"
                  className={`px-3 py-1.5 rounded-sm text-xs font-sans font-semibold uppercase tracking-wider transition-colors ${
                    activeType === type
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground hover:bg-secondary/70"
                  }`}
                >
                  {type}
                </button>
              ),
            )}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-24" data-ocid="shop.empty_state">
            <p className="font-display text-2xl mb-2">No products found</p>
            <p className="text-muted-foreground font-sans text-sm">
              Try adjusting your filters or search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((product, idx) => (
              <div key={product.id} data-ocid={`shop.item.${idx + 1}`}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
