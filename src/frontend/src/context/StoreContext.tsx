import { products as defaultProducts } from "@/data/products";
import type { Product } from "@/data/products";
import * as bs from "@/lib/backendService";
import type { FrontendDiscount, FrontendSettings } from "@/lib/backendService";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface StoreContextType {
  products: Product[];
  settings: FrontendSettings;
  discounts: FrontendDiscount[];
  loading: boolean;
  refetchProducts: () => Promise<void>;
  refetchSettings: () => Promise<void>;
  refetchDiscounts: () => Promise<void>;
}

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

const StoreContext = createContext<StoreContextType>({
  products: [],
  settings: DEFAULT_SETTINGS,
  discounts: [],
  loading: true,
  refetchProducts: async () => {},
  refetchSettings: async () => {},
  refetchDiscounts: async () => {},
});

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<FrontendSettings>(DEFAULT_SETTINGS);
  const [discounts, setDiscounts] = useState<FrontendDiscount[]>([]);
  const [loading, setLoading] = useState(true);

  const refetchProducts = useCallback(async () => {
    try {
      const p = await bs.fetchProducts();
      setProducts(p);
    } catch {
      // keep existing
    }
  }, []);

  const refetchSettings = useCallback(async () => {
    try {
      const s = await bs.fetchSettings();
      setSettings(s);
    } catch {
      // keep defaults
    }
  }, []);

  const refetchDiscounts = useCallback(async () => {
    try {
      const d = await bs.fetchDiscounts();
      setDiscounts(d);
    } catch {
      // keep existing
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const [fetchedProducts, fetchedSettings, fetchedDiscounts] =
          await Promise.all([
            bs.fetchProducts(),
            bs.fetchSettings(),
            bs.fetchDiscounts(),
          ]);

        // Seed products if empty
        if (fetchedProducts.length === 0) {
          await bs.seedInitialProducts(defaultProducts);
          const seeded = await bs.fetchProducts();
          setProducts(seeded.length > 0 ? seeded : defaultProducts);
        } else {
          setProducts(fetchedProducts);
        }

        // Seed default discounts if empty
        if (fetchedDiscounts.length === 0) {
          await Promise.all([
            bs.saveDiscount({
              code: "FIRST10",
              percent: 10,
              active: true,
              usageCount: 0,
            }),
            bs.saveDiscount({
              code: "SUMMER26",
              percent: 10,
              active: true,
              usageCount: 0,
            }),
          ]);
          const seededDiscounts = await bs.fetchDiscounts();
          setDiscounts(seededDiscounts);
        } else {
          setDiscounts(fetchedDiscounts);
        }

        setSettings(fetchedSettings);
      } catch (err) {
        console.error("StoreContext init failed:", err);
        // Fallback to defaults
        setProducts(defaultProducts);
        setSettings(DEFAULT_SETTINGS);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  return (
    <StoreContext.Provider
      value={{
        products,
        settings,
        discounts,
        loading,
        refetchProducts,
        refetchSettings,
        refetchDiscounts,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
