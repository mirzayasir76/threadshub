import type {
  Contact as BackendContact,
  Discount as BackendDiscount,
  Order as BackendOrder,
  Product as BackendProduct,
  Review as BackendReview,
  Settings as BackendSettings,
  Subscriber as BackendSubscriber,
} from "@/backend.d";
import { createActorWithConfig } from "@/config";
import type { Product as LocalProduct, ProductReview } from "@/data/products";

// ─── Actor singleton ───────────────────────────────────────────────────────────
// biome-ignore lint/suspicious/noExplicitAny: actor proxy has all methods at runtime
let _actorPromise: Promise<any> | null = null;

// biome-ignore lint/suspicious/noExplicitAny: backend actor supports all methods at runtime
async function getActor(): Promise<any> {
  if (!_actorPromise) {
    _actorPromise = createActorWithConfig().catch((err) => {
      _actorPromise = null;
      throw err;
    });
  }
  return _actorPromise;
}

// ─── Product type conversions ──────────────────────────────────────────────────
export type FrontendProduct = LocalProduct;

function toBackendProduct(p: FrontendProduct): BackendProduct {
  return {
    id: p.id,
    name: p.name,
    description: p.description ?? "",
    shortDescription: p.shortDescription ?? "",
    price: p.price,
    discountPrice: p.discountPrice != null ? [p.discountPrice] : [],
    category: p.category,
    image: p.image,
    image2: p.image2 ?? "",
    image3: p.image3 ?? "",
    image4: p.image4 ?? "",
    featured: p.featured,
    newArrival: p.newArrival,
    isBestSeller: p.isBestSeller ?? false,
    sizes: p.sizes,
    colors: p.colors,
    colorImages: Object.entries(p.colorImages ?? {}).map(
      ([k, v]) => [k, v] as [string, string],
    ),
    stock: BigInt(p.stock ?? 50),
    fabric: p.fabric ?? "",
    rating: p.rating ?? 4.5,
    reviewCount: BigInt(p.reviewCount ?? 0),
    soldCount: BigInt(p.soldCount ?? 0),
    deliveryThreshold: BigInt(
      Number.parseInt(
        (p.deliveryThreshold ?? "2000").replace(/[^0-9]/g, ""),
        10,
      ) || 2000,
    ),
    returnDays: BigInt(p.returnDays ?? 7),
    reviews: (p.reviews ?? []).map((r: ProductReview) => ({
      reviewer: r.name,
      rating: r.rating,
      comment: r.text,
      date: r.date,
    })),
    keyHighlights: (p.shortDescription ?? "").split("\n").filter(Boolean),
    viewingCount: BigInt(0),
    trendingBadge: false,
  };
}

function fromBackendProduct(p: BackendProduct): FrontendProduct {
  const discountPrice =
    Array.isArray(p.discountPrice) && p.discountPrice.length > 0
      ? p.discountPrice[0]
      : undefined;
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    shortDescription:
      p.shortDescription || (p.keyHighlights ?? []).join("\n") || "",
    price: p.price,
    discountPrice,
    category: p.category as LocalProduct["category"],
    type: "Shirt" as const,
    image: p.image,
    image2: p.image2 || undefined,
    image3: p.image3 || undefined,
    image4: p.image4 || undefined,
    colorImages: Object.fromEntries(p.colorImages ?? []),
    featured: p.featured,
    newArrival: p.newArrival,
    isBestSeller: p.isBestSeller,
    sizes: p.sizes,
    colors: p.colors,
    stock: Number(p.stock),
    fabric: p.fabric || undefined,
    rating: p.rating,
    reviewCount: Number(p.reviewCount),
    soldCount: Number(p.soldCount),
    deliveryThreshold: p.deliveryThreshold
      ? `Above Rs. ${Number(p.deliveryThreshold).toLocaleString()}`
      : "Above Rs. 2,000",
    returnDays: Number(p.returnDays),
    reviews: (p.reviews ?? []).map((r: BackendReview) => ({
      name: r.reviewer,
      rating: r.rating,
      text: r.comment,
      date: r.date,
    })),
  };
}

// ─── Product operations ────────────────────────────────────────────────────────
export async function fetchProducts(): Promise<FrontendProduct[]> {
  try {
    const actor = await getActor();
    const products = await actor.getProducts();
    return products.map(fromBackendProduct);
  } catch (err) {
    console.error("fetchProducts failed:", err);
    return [];
  }
}

/**
 * Save product to backend.
 * @param p - product data
 * @param isNew - true when adding a brand new product, false when editing existing
 */
export async function saveProduct(
  p: FrontendProduct,
  isNew = false,
): Promise<string> {
  const actor = await getActor();
  const bp = toBackendProduct(p);
  if (isNew) {
    return actor.addProduct(bp);
  }
  const ok = await actor.updateProduct(bp);
  if (!ok) throw new Error("Product update failed — product not found");
  return p.id;
}

export async function removeProduct(id: string): Promise<void> {
  const actor = await getActor();
  await actor.deleteProduct(id);
}

export async function bulkImportProducts(
  products: FrontendProduct[],
): Promise<number> {
  const actor = await getActor();
  const count = await actor.bulkImportProducts(products.map(toBackendProduct));
  return Number(count);
}

export async function seedInitialProducts(
  products: FrontendProduct[],
): Promise<void> {
  try {
    const actor = await getActor();
    await actor.seedProducts(products.map(toBackendProduct));
  } catch (err) {
    console.error("seedInitialProducts failed:", err);
  }
}

// ─── Order operations ──────────────────────────────────────────────────────────
export type FrontendOrder = {
  id: string;
  date: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: string;
  items: { productName: string; size: string; qty: number; price: number }[];
  productTotal: number;
  shippingFee: number;
  grandTotal: number;
  status: string;
  discountCode: string;
  discountAmount: number;
};

function toBackendOrder(o: FrontendOrder): BackendOrder {
  return {
    ...o,
    items: o.items.map((i) => ({ ...i, qty: BigInt(i.qty) })),
  };
}

function fromBackendOrder(o: BackendOrder): FrontendOrder {
  return {
    ...o,
    items: (o.items ?? []).map((i: any) => ({ ...i, qty: Number(i.qty) })),
  };
}

export async function fetchOrders(): Promise<FrontendOrder[]> {
  try {
    const actor = await getActor();
    const orders = await actor.getOrders();
    return orders.map(fromBackendOrder);
  } catch (err) {
    console.error("fetchOrders failed:", err);
    return [];
  }
}

export async function saveOrder(o: FrontendOrder): Promise<string> {
  const actor = await getActor();
  return actor.addOrder(toBackendOrder(o));
}

export async function fetchOrderById(
  id: string,
): Promise<FrontendOrder | null> {
  try {
    const actor = await getActor();
    const result: [] | [import("@/backend.d").Order] =
      await actor.getOrderById(id);
    if (Array.isArray(result) && result.length > 0 && result[0]) {
      return fromBackendOrder(result[0]);
    }
    return null;
  } catch (err) {
    console.error("fetchOrderById failed:", err);
    return null;
  }
}

export async function changeOrderStatus(
  id: string,
  status: string,
): Promise<void> {
  const actor = await getActor();
  await actor.updateOrderStatus(id, status);
}

// ─── Settings ─────────────────────────────────────────────────────────────────
export type FrontendSettings = BackendSettings;

const DEFAULT_SETTINGS: FrontendSettings = {
  storeName: "ThreadsHub",
  whatsappNumber: "03174933882",
  easyPaisaNumber: "03041329809",
  contactEmail: "mirzayasir592@gmail.com",
  deliveryFee: 250,
  freeShippingThreshold: 2000,
  currency: "PKR",
  heroImage: "",
  announcementCode: "FIRST10",
  popupCode: "SUMMER26",
};

export async function fetchSettings(): Promise<FrontendSettings> {
  try {
    const actor = await getActor();
    const s = await actor.getSettings();
    return { ...DEFAULT_SETTINGS, ...s };
  } catch (err) {
    console.error("fetchSettings failed:", err);
    return { ...DEFAULT_SETTINGS };
  }
}

export async function updateSettings(s: FrontendSettings): Promise<void> {
  const actor = await getActor();
  await actor.saveSettings(s);
}

// ─── Discounts ─────────────────────────────────────────────────────────────────
export type FrontendDiscount = {
  code: string;
  percent: number;
  active: boolean;
  usageCount: number;
};

function fromBackendDiscount(d: BackendDiscount): FrontendDiscount {
  return { ...d, usageCount: Number(d.usageCount) };
}

function toBackendDiscount(d: FrontendDiscount): BackendDiscount {
  return { ...d, usageCount: BigInt(d.usageCount) };
}

export async function fetchDiscounts(): Promise<FrontendDiscount[]> {
  try {
    const actor = await getActor();
    const list = await actor.getDiscounts();
    return list.map(fromBackendDiscount);
  } catch (err) {
    console.error("fetchDiscounts failed:", err);
    return [];
  }
}

export async function saveDiscount(d: FrontendDiscount): Promise<void> {
  const actor = await getActor();
  const existing = await fetchDiscounts();
  const exists = existing.find((x) => x.code === d.code);
  if (exists) {
    await actor.updateDiscount(toBackendDiscount(d));
  } else {
    await actor.addDiscount(toBackendDiscount(d));
  }
}

export async function removeDiscount(code: string): Promise<void> {
  const actor = await getActor();
  await actor.deleteDiscount(code);
}

export async function checkDiscount(code: string): Promise<number | null> {
  try {
    const actor = await getActor();
    const result: [] | [number] = await actor.validateDiscount(code);
    return Array.isArray(result) && result.length > 0
      ? (result[0] ?? null)
      : null;
  } catch {
    return null;
  }
}

// ─── Contacts ─────────────────────────────────────────────────────────────────
export type FrontendContact = BackendContact;

export async function fetchContacts(): Promise<FrontendContact[]> {
  try {
    const actor = await getActor();
    return actor.getContacts();
  } catch (err) {
    console.error("fetchContacts failed:", err);
    return [];
  }
}

export async function saveContact(
  c: Omit<FrontendContact, "id">,
): Promise<string> {
  const actor = await getActor();
  return actor.addContact({
    ...c,
    id: `contact_${Date.now()}`,
  });
}

export async function removeContact(id: string): Promise<void> {
  const actor = await getActor();
  await actor.deleteContact(id);
}

// ─── Subscribers ──────────────────────────────────────────────────────────────
export type FrontendSubscriber = BackendSubscriber;

export async function fetchSubscribers(): Promise<FrontendSubscriber[]> {
  try {
    const actor = await getActor();
    return actor.getSubscribers();
  } catch (err) {
    console.error("fetchSubscribers failed:", err);
    return [];
  }
}

export async function saveSubscriber(
  s: Omit<FrontendSubscriber, "id">,
): Promise<string> {
  const actor = await getActor();
  return actor.addSubscriber({
    ...s,
    id: `sub_${Date.now()}`,
  });
}

export async function removeSubscriber(id: string): Promise<void> {
  const actor = await getActor();
  await actor.deleteSubscriber(id);
}

export function generateProductId(): string {
  return `prod_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
