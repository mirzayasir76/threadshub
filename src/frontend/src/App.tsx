import ExitIntentPopup from "@/components/ExitIntentPopup";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SocialProofNotification from "@/components/SocialProofNotification";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/context/CartContext";
import { StoreProvider } from "@/context/StoreContext";
import AboutPage from "@/pages/AboutPage";
import AdminPage from "@/pages/AdminPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import ContactPage from "@/pages/ContactPage";
import HomePage from "@/pages/HomePage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import RefundPolicyPage from "@/pages/RefundPolicyPage";
import ServicePolicyPage from "@/pages/ServicePolicyPage";
import ShopPage from "@/pages/ShopPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const queryClient = new QueryClient();

function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      <AnimatePresence>
        {hovered && (
          <motion.span
            key="tooltip"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.18 }}
            className="bg-gray-900 text-white text-xs font-sans font-medium px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap pointer-events-none"
          >
            Chat on WhatsApp
          </motion.span>
        )}
      </AnimatePresence>
      <motion.a
        href="https://wa.me/923174933882"
        target="_blank"
        rel="noopener noreferrer"
        data-ocid="whatsapp.button"
        aria-label="Chat on WhatsApp"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
        style={{ backgroundColor: "#25D366" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          className="w-7 h-7"
          role="img"
          aria-label="WhatsApp"
        >
          <title>WhatsApp</title>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </motion.a>
    </div>
  );
}

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors position="bottom-right" />
    </>
  ),
});

const storeLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "_store",
  component: () => (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden w-full">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <WhatsAppButton />
      <SocialProofNotification />
      <ExitIntentPopup />
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => storeLayoutRoute,
  path: "/",
  component: HomePage,
});

const shopRoute = createRoute({
  getParentRoute: () => storeLayoutRoute,
  path: "/shop",
  validateSearch: (
    search: Record<string, unknown>,
  ): { category?: string; filter?: string } => ({
    category: typeof search.category === "string" ? search.category : undefined,
    filter: typeof search.filter === "string" ? search.filter : undefined,
  }),
  component: ShopPage,
});

const productRoute = createRoute({
  getParentRoute: () => storeLayoutRoute,
  path: "/product/$id",
  component: ProductDetailPage,
});

const cartRoute = createRoute({
  getParentRoute: () => storeLayoutRoute,
  path: "/cart",
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => storeLayoutRoute,
  path: "/checkout",
  component: CheckoutPage,
});

const contactRoute = createRoute({
  getParentRoute: () => storeLayoutRoute,
  path: "/contact",
  component: ContactPage,
});

const servicePolicyRoute = createRoute({
  getParentRoute: () => storeLayoutRoute,
  path: "/service-policy",
  component: ServicePolicyPage,
});

const refundPolicyRoute = createRoute({
  getParentRoute: () => storeLayoutRoute,
  path: "/refund-policy",
  component: RefundPolicyPage,
});

const privacyPolicyRoute = createRoute({
  getParentRoute: () => storeLayoutRoute,
  path: "/privacy-policy",
  component: PrivacyPolicyPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => storeLayoutRoute,
  path: "/about",
  component: AboutPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  storeLayoutRoute.addChildren([
    indexRoute,
    shopRoute,
    productRoute,
    cartRoute,
    checkoutRoute,
    contactRoute,
    servicePolicyRoute,
    refundPolicyRoute,
    privacyPolicyRoute,
    aboutRoute,
  ]),
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </StoreProvider>
    </QueryClientProvider>
  );
}
