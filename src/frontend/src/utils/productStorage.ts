import { products as defaultProducts } from "@/data/products";
import type { Category, Product, ProductType } from "@/data/products";

export type { Category, Product, ProductType };

const STORAGE_KEY = "threadshub_products";
const SEEDED_KEY = "threadshub_products_seeded_v4";

function seed(): void {
  if (localStorage.getItem(SEEDED_KEY)) return;
  // Clear old seeds so new fields populate
  localStorage.removeItem(STORAGE_KEY);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
  localStorage.setItem(SEEDED_KEY, "1");
}

export function getProducts(): Product[] {
  seed();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [...defaultProducts];
    const parsed = JSON.parse(raw) as Product[];
    // Backfill any missing new fields for old stored products
    return parsed.map((p) => ({
      ...p,
      isBestSeller: p.isBestSeller ?? false,
      stock: p.stock ?? 50,
      rating: p.rating ?? 4.5,
      reviewCount: p.reviewCount ?? 0,
      deliveryThreshold: p.deliveryThreshold ?? "Above Rs. 2,000",
      returnDays: p.returnDays ?? 7,
      reviews: p.reviews ?? [],
      colorImages: p.colorImages ?? {},
    }));
  } catch {
    return [...defaultProducts];
  }
}

export function saveProduct(product: Product): void {
  const all = getProducts();
  all.push(product);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function updateProduct(updated: Product): void {
  const all = getProducts();
  const idx = all.findIndex((p) => p.id === updated.id);
  if (idx !== -1) {
    all[idx] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }
}

export function deleteProduct(id: string): void {
  const all = getProducts().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function generateProductId(): string {
  return `prod_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
