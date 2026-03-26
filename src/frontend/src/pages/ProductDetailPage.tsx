import ProductCard from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Expand,
  Laptop,
  Maximize,
  Minimize,
  Package,
  Pause,
  Play,
  RefreshCw,
  Ruler,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Star,
  Truck,
  X,
  ZoomIn,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const colorMap: Record<string, string> = {
  White: "#FFFFFF",
  Blue: "#3B82F6",
  Grey: "#9CA3AF",
  Black: "#1F2937",
  Navy: "#1E3A5F",
  Brown: "#92400E",
  Pink: "#F9A8D4",
  Yellow: "#FDE68A",
  Beige: "#D2B48C",
  Green: "#22C55E",
  Red: "#EF4444",
  Purple: "#A855F7",
  "Pastel Pink": "#FBCFE8",
  "Pastel Blue": "#BFDBFE",
};

const sizeChart = [
  { size: "XS", chest: "32", waist: "26", hips: "34" },
  { size: "S", chest: "34", waist: "28", hips: "36" },
  { size: "M", chest: "36", waist: "30", hips: "38" },
  { size: "L", chest: "38", waist: "32", hips: "40" },
  { size: "XL", chest: "40", waist: "34", hips: "42" },
  { size: "XXL", chest: "42", waist: "36", hips: "44" },
];

const mockReviews = [
  {
    name: "Amna S.",
    city: "Karachi",
    product: "Embroidered Lawn Suit",
    rating: 5,
    date: "March 10, 2026",
    text: "Absolutely love the quality! True to size and the fabric is premium. Received in just 3 days.",
    avatar: "AS",
    avatarImg: "/assets/generated/avatar-amna.dim_80x80.jpg",
  },
  {
    name: "Bilal K.",
    city: "Lahore",
    product: "Men Embroidered Kurta",
    rating: 5,
    date: "March 8, 2026",
    text: "Exactly as described. Perfect stitching, great color. Will definitely order again!",
    avatar: "BK",
    avatarImg: "/assets/generated/avatar-bilal.dim_80x80.jpg",
  },
  {
    name: "Fatima R.",
    city: "Islamabad",
    product: "Ladies Embroidered Suit",
    rating: 4,
    date: "February 28, 2026",
    text: "Good quality product. Size chart is accurate. Delivery was on time. Happy with the purchase.",
    avatar: "FR",
    avatarImg: "/assets/generated/avatar-fatima.dim_80x80.jpg",
  },
  {
    name: "Hasan M.",
    city: "Faisalabad",
    product: "Men Embroidered Kurta",
    rating: 5,
    date: "February 20, 2026",
    text: "Best value for money in Pakistan. Highly recommend to everyone looking for quality clothing.",
    avatar: "HM",
    avatarImg: "/assets/generated/avatar-hasan.dim_80x80.jpg",
  },
];

// ─── Delivery Countdown ───────────────────────────────────────────────────────
function DeliveryCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calcTime = () => {
      const now = new Date();
      const cutoff = new Date(now);
      cutoff.setHours(14, 0, 0, 0);
      if (now >= cutoff) cutoff.setDate(cutoff.getDate() + 1);
      const diff = cutoff.getTime() - now.getTime();
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    };
    calcTime();
    const interval = setInterval(calcTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-2 mb-6 px-3 py-2.5 rounded-lg bg-green-50 border border-green-200">
      <span className="text-green-700 text-lg">🚚</span>
      <div>
        <p className="text-xs font-bold text-green-800">
          Order within{" "}
          <span className="text-green-600 font-mono">
            {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:
            {pad(timeLeft.seconds)}
          </span>{" "}
          to get delivery by tomorrow
        </p>
        <p className="text-xs text-green-600">Express delivery available</p>
      </div>
    </div>
  );
}

// ─── Image Lightbox ───────────────────────────────────────────────────────────
function ImageLightbox({
  images,
  initialIndex,
  onClose,
}: {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(initialIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbs, setShowThumbs] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isMobileView, setIsMobileView] = useState(false);
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pinchStartDist = useRef<number | null>(null);
  const pinchStartZoom = useRef(1);

  const prev = useCallback(() => {
    setZoom(1);
    setCurrent((c) => (c - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    setZoom(1);
    setCurrent((c) => (c + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrent((c) => (c + 1) % images.length);
        setZoom(1);
      }, 3500);
    } else {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    }
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, [isPlaying, images.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, onClose]);

  const containerRef = useRef<HTMLDivElement>(null);
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };
  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) setIsFullscreen(false);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchStartDist.current = Math.sqrt(dx * dx + dy * dy);
      pinchStartZoom.current = zoom;
    }
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStartDist.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const newZoom = Math.min(
        4,
        Math.max(1, pinchStartZoom.current * (dist / pinchStartDist.current)),
      );
      setZoom(newZoom);
    }
  };
  const onTouchEnd = () => {
    pinchStartDist.current = null;
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] bg-black/95 flex flex-col"
      style={{ touchAction: "none" }}
    >
      <div className="flex items-center justify-between px-4 py-3 bg-black/70 backdrop-blur-sm z-10 flex-shrink-0">
        <span className="text-white/70 text-sm font-medium">
          {current + 1} / {images.length}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsMobileView((v) => !v)}
            className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition"
          >
            {isMobileView ? (
              <Laptop className="w-5 h-5" />
            ) : (
              <Smartphone className="w-5 h-5" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowThumbs((v) => !v)}
            className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="7" height="7" strokeWidth={2} rx="1" />
              <rect x="14" y="3" width="7" height="7" strokeWidth={2} rx="1" />
              <rect x="3" y="14" width="7" height="7" strokeWidth={2} rx="1" />
              <rect x="14" y="14" width="7" height="7" strokeWidth={2} rx="1" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setIsPlaying((v) => !v)}
            className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(4, z + 0.5))}
            className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(1, z - 0.5))}
            className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition"
            disabled={zoom <= 1}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" strokeWidth={2} />
              <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth={2} />
              <line x1="8" y1="11" x2="14" y2="11" strokeWidth={2} />
            </svg>
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition"
          >
            {isFullscreen ? (
              <Minimize className="w-5 h-5" />
            ) : (
              <Maximize className="w-5 h-5" />
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition ml-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {images.length > 1 && (
          <button
            type="button"
            onClick={prev}
            className="absolute left-3 z-10 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 transition"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
        )}
        <div
          className="flex items-center justify-center overflow-hidden"
          style={{
            width: isMobileView ? "375px" : "100%",
            maxWidth: isMobileView ? "375px" : "800px",
            height: isMobileView ? "667px" : "100%",
            maxHeight: isMobileView ? "667px" : "100%",
            border: isMobileView ? "2px solid rgba(255,255,255,0.15)" : "none",
            borderRadius: isMobileView ? "16px" : "0",
            background: isMobileView ? "#111" : "transparent",
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <img
            src={images[current]}
            alt={`Product view ${current + 1}`}
            style={{
              transform: `scale(${zoom})`,
              transition: "transform 0.2s ease",
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              cursor: zoom > 1 ? "zoom-out" : "zoom-in",
            }}
            onClick={() => setZoom((z) => (z > 1 ? 1 : Math.min(2, z + 0.5)))}
            onKeyDown={() => setZoom((z) => (z > 1 ? 1 : Math.min(2, z + 0.5)))}
            draggable={false}
          />
        </div>
        {images.length > 1 && (
          <button
            type="button"
            onClick={next}
            className="absolute right-3 z-10 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 transition"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        )}
      </div>

      {showThumbs && images.length > 1 && (
        <div className="flex gap-2 px-4 py-3 overflow-x-auto bg-black/60 backdrop-blur-sm flex-shrink-0 justify-center">
          {images.map((img, i) => (
            <button
              type="button"
              // biome-ignore lint/suspicious/noArrayIndexKey: lightbox thumbnail order is stable
              key={i}
              onClick={() => {
                setCurrent(i);
                setZoom(1);
              }}
              className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all ${
                current === i
                  ? "border-white scale-105"
                  : "border-white/20 hover:border-white/50"
              }`}
            >
              <img
                src={img}
                alt={`Thumb ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Sticky Add-to-Cart Bar ──────────────────────────────────────────────────
function StickyCartBar({
  product,
  displayPrice,
  hasDiscount,
  qty,
  onQtyDown,
  onQtyUp,
  onAddToCart,
  visible,
}: {
  product: import("@/data/products").Product;
  displayPrice: number;
  hasDiscount: boolean;
  qty: number;
  onQtyDown: () => void;
  onQtyUp: () => void;
  onAddToCart: () => void;
  visible: boolean;
}) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: visible ? 0 : 100, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-2xl px-4 py-3 flex items-center gap-3"
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-12 h-12 object-cover rounded flex-shrink-0 hidden sm:block"
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{product.name}</p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">
            Rs. {displayPrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">
              Rs. {product.price.toLocaleString()}
            </span>
          )}
        </div>
      </div>
      {/* Qty control */}
      <div className="flex items-center border border-border rounded overflow-hidden flex-shrink-0">
        <button
          type="button"
          onClick={onQtyDown}
          className="px-2.5 py-1.5 hover:bg-muted text-sm font-bold"
        >
          −
        </button>
        <span className="px-3 py-1.5 text-sm font-bold min-w-[2rem] text-center">
          {qty}
        </span>
        <button
          type="button"
          onClick={onQtyUp}
          className="px-2.5 py-1.5 hover:bg-muted text-sm font-bold"
        >
          +
        </button>
      </div>
      <Button
        onClick={onAddToCart}
        size="sm"
        className="rounded font-bold uppercase tracking-wider text-xs px-4 bg-foreground text-background hover:opacity-90 flex-shrink-0"
      >
        <ShoppingCart className="h-3.5 w-3.5 mr-1" />
        Add to Cart
      </Button>
    </motion.div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { products } = useStore();
  const product = products.find((p) => p.id === id);
  const { addToCart } = useCart();
  const _navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [stickyVisible, setStickyVisible] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Viewing count — per-product
  const baseCount = product?.isBestSeller
    ? 20 + ((id?.charCodeAt(0) ?? 0) % 6)
    : 15 + ((id?.charCodeAt(0) ?? 0) % 6);
  const [viewingCount, setViewingCount] = useState(baseCount);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const newBase = product?.isBestSeller
      ? 20 + ((id?.charCodeAt(0) ?? 0) % 6)
      : 15 + ((id?.charCodeAt(0) ?? 0) % 6);
    setViewingCount(newBase);

    const schedule = () => {
      const delay = 3000 + Math.random() * 5000;
      return setTimeout(() => {
        setViewingCount((prev) => {
          const min = product?.isBestSeller ? 20 : 15;
          const max = product?.isBestSeller ? 42 : 32;
          const goUp = Math.random() > 0.3;
          const next = goUp ? prev + 1 : prev - 1;
          return Math.min(max, Math.max(min, next));
        });
        timerRef.current = schedule();
      }, delay);
    };
    timerRef.current = schedule();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [id, product?.isBestSeller]);

  // Sticky bar on scroll past CTA
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0 },
    );
    if (ctaRef.current) obs.observe(ctaRef.current);
    return () => obs.disconnect();
  }, []);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="font-display text-2xl">Product not found</p>
        <Link to="/shop" className="text-primary underline mt-4 inline-block">
          Back to Shop
        </Link>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice! : product.price;
  const discountPct = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice!) / product.price) * 100,
      )
    : 0;

  const stock = product.stock ?? 50;
  const isLowStock = stock <= 10 && stock > 0;
  const outOfStock = stock === 0;

  const images = [
    product.image,
    product.image2,
    product.image3,
    product.image4,
  ].filter(Boolean) as string[];
  const colorImagesMap = product.colorImages ?? {};
  const extraColorImgs = Object.values(colorImagesMap).filter(
    (img): img is string => Boolean(img) && !images.includes(img),
  );
  const allImages =
    images.length > 0
      ? [...images, ...extraColorImgs]
      : [product.image, ...extraColorImgs];

  const handleColorSelect = (c: string) => {
    setSelectedColor(c);
    const img = colorImagesMap[c];
    if (img) {
      const idx = allImages.indexOf(img);
      if (idx !== -1) setActiveImage(idx);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size first");
      return;
    }
    if (!selectedColor && product.colors && product.colors.length > 0) {
      toast.error("Please select a color first");
      return;
    }
    addToCart(product, selectedSize, qty);
    setAdded(true);
    toast.success(`${product.name} added to cart!`, {
      description: `Size: ${selectedSize}${selectedColor ? ` · Color: ${selectedColor}` : ""} · Qty: ${qty}`,
    });
    setTimeout(() => setAdded(false), 2000);
  };

  const avgRating = product.rating ?? 4.5;
  const reviewCount =
    product.reviewCount ??
    (product.reviews && product.reviews.length > 0
      ? product.reviews.length
      : mockReviews.length);
  const activeReviews =
    product.reviews && product.reviews.length > 0
      ? product.reviews
      : mockReviews;

  return (
    <>
      {lightboxOpen && (
        <ImageLightbox
          images={allImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      <StickyCartBar
        product={product}
        displayPrice={displayPrice}
        hasDiscount={!!hasDiscount}
        qty={qty}
        onQtyDown={() => setQty((q) => Math.max(1, q - 1))}
        onQtyUp={() => setQty((q) => Math.min(stock || 99, q + 1))}
        onAddToCart={handleAddToCart}
        visible={stickyVisible}
      />

      {/* ── Full-bleed hero image ─────────────────────────────────────── */}
      <div
        className="relative w-full overflow-hidden bg-black"
        style={{ marginTop: "-0px" }}
      >
        <button
          type="button"
          className="relative w-full block cursor-zoom-in group"
          style={{ display: "block" }}
          onClick={() => {
            setLightboxIndex(activeImage);
            setLightboxOpen(true);
          }}
          aria-label="Click to view full image"
        >
          <img
            src={allImages[activeImage]}
            alt={product.name}
            className="w-full object-cover"
            style={{ height: "clamp(320px, 75vw, 680px)", maxHeight: "80vh" }}
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

          <div className="absolute top-20 right-3 bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Expand className="w-4 h-4" />
          </div>

          {product.isBestSeller && (
            <div className="absolute top-20 left-3">
              <span className="bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                🔥 Best Seller
              </span>
            </div>
          )}
          {hasDiscount && (
            <div
              className={`absolute ${
                product.isBestSeller ? "top-28" : "top-20"
              } left-3`}
            >
              <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                -{discountPct}% OFF
              </span>
            </div>
          )}
          {product.newArrival && (
            <div className="absolute top-20 right-12">
              <span className="bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                New Arrival
              </span>
            </div>
          )}

          {isLowStock && (
            <div className="absolute bottom-4 left-3 right-3">
              <div className="bg-red-600/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-2 rounded-lg text-center shadow">
                ⚠️ Only {stock} pieces left — Order now!
              </div>
            </div>
          )}

          {allImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImage(
                    (i) => (i - 1 + allImages.length) % allImages.length,
                  );
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImage((i) => (i + 1) % allImages.length);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </button>

        {allImages.length > 1 && (
          <div className="flex gap-2 px-4 py-2 overflow-x-auto bg-black/5 border-b border-border/20">
            {allImages.map((img, i) => (
              <button
                type="button"
                // biome-ignore lint/suspicious/noArrayIndexKey: thumbnails are stable positional
                key={i}
                onClick={() => setActiveImage(i)}
                className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded overflow-hidden border-2 transition-all ${
                  activeImage === i
                    ? "border-foreground"
                    : "border-border hover:border-foreground/40"
                }`}
              >
                <img
                  src={img}
                  alt={`View ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Product Details ─────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-24">
        {/* Compact rating */}
        <div className="flex items-center gap-1 pt-4 pb-1 text-xs text-muted-foreground">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400 flex-shrink-0" />
          <span className="font-bold text-foreground">{avgRating}</span>
          <span className="mx-0.5 text-muted-foreground/40">·</span>
          <span className="font-bold text-foreground">{reviewCount}</span>
          <svg
            className="h-3 w-3 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
            />
            <circle cx="9" cy="7" r="4" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
            />
          </svg>
        </div>

        {/* Product name */}
        <h1 className="font-display text-xl sm:text-2xl font-bold leading-snug text-foreground pt-1 pb-2">
          {product.name}
        </h1>

        {/* Price */}
        <div className="flex items-center gap-3 flex-wrap pb-3">
          <span className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Rs. {displayPrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <>
              <span className="text-base text-muted-foreground line-through">
                Rs. {product.price.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                Save Rs. {(product.price - displayPrice).toLocaleString()}
              </span>
            </>
          )}
        </div>

        {/* Delivery Countdown */}
        <DeliveryCountdown />

        {/* Stock */}
        {outOfStock ? (
          <div className="mb-6">
            <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full">
              Out of Stock
            </span>
          </div>
        ) : isLowStock ? (
          <div className="mb-6">
            <span className="text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-full animate-pulse">
              🔥 Only {stock} pcs left!
            </span>
          </div>
        ) : (
          <div className="mb-6">
            <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
              ✓ In Stock
            </span>
          </div>
        )}

        {/* 👁️ Viewing count */}
        <div className="flex items-center gap-2 mb-6 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 w-fit">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <svg
            className="w-4 h-4 text-amber-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <span className="text-sm font-bold text-amber-800">
            {viewingCount} people viewing right now
          </span>
          <span className="text-xs text-amber-600">
            {viewingCount > 25 ? "🔥" : viewingCount > 18 ? "⚡" : "👀"}
          </span>
        </div>

        {/* Qty + Add to Cart — same row */}
        <div ref={ctaRef} className="flex items-center gap-3 mb-6">
          <div className="flex items-center border-2 border-border rounded-lg overflow-hidden flex-shrink-0">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-3 py-2.5 hover:bg-muted transition-colors text-base font-bold leading-none"
            >
              −
            </button>
            <span className="px-4 py-2.5 font-bold text-base min-w-[2.5rem] text-center">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(stock || 99, q + 1))}
              className="px-3 py-2.5 hover:bg-muted transition-colors text-base font-bold leading-none"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={outOfStock || added}
            data-ocid="product.add_to_cart_button"
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-foreground text-background font-bold text-sm uppercase tracking-wider rounded-lg hover:opacity-85 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(139,58,47,0.4)] hover:shadow-[0_0_25px_rgba(139,58,47,0.6)]"
          >
            <ShoppingCart className="h-4 w-4" />
            {added ? "Added! ✓" : outOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>

        {/* WhatsApp Quick Order */}
        <a
          href={`https://wa.me/923174933882?text=${encodeURIComponent(`Hi! I want to order:\n\n*${product.name}*\nSize: ${selectedSize || "Please select"}\nColor: ${selectedColor || "Please select"}\nQuantity: ${qty}\n\nPlease confirm availability.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          data-ocid="product.whatsapp_button"
          className="flex items-center justify-center gap-2 w-full py-3 px-4 mb-6 bg-[#25D366] hover:bg-[#20bc5a] text-white font-bold text-sm rounded-lg transition-all hover:scale-[1.02] active:scale-95 shadow-md"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 fill-current"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Order on WhatsApp
        </a>

        <div className="border-t border-border/40 my-6" />

        {/* Colors */}
        {product.colors && product.colors.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-bold mb-2 text-foreground">
              Color{selectedColor ? `: ${selectedColor}` : ""}
            </p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => handleColorSelect(c)}
                  title={c}
                  className={`w-9 h-9 rounded-full border-3 transition-all ${
                    selectedColor === c
                      ? "border-foreground scale-110 ring-2 ring-foreground ring-offset-2"
                      : "border-border hover:border-foreground/50"
                  }`}
                  style={{
                    backgroundColor: colorMap[c] ?? "#ccc",
                    border:
                      selectedColor === c
                        ? "2.5px solid #000"
                        : "2px solid #d1d5db",
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Sizes */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-foreground">Size</p>
            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  data-ocid="product.size_chart.button"
                  className="text-xs text-primary underline flex items-center gap-1"
                >
                  <Ruler className="h-3 w-3" /> Size Chart
                </button>
              </DialogTrigger>
              <DialogContent data-ocid="product.size_chart.dialog">
                <DialogHeader>
                  <DialogTitle>Size Chart</DialogTitle>
                </DialogHeader>
                <p className="text-xs text-muted-foreground mb-3">
                  All measurements in inches
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 pr-4 text-left font-semibold">
                          Size
                        </th>
                        <th className="py-2 pr-4 text-left font-semibold">
                          Chest
                        </th>
                        <th className="py-2 pr-4 text-left font-semibold">
                          Waist
                        </th>
                        <th className="py-2 text-left font-semibold">Hips</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sizeChart.map((row) => (
                        <tr
                          key={row.size}
                          className="border-b border-border/40"
                        >
                          <td className="py-2 pr-4 font-medium">{row.size}</td>
                          <td className="py-2 pr-4 text-muted-foreground">
                            {row.chest}&quot;
                          </td>
                          <td className="py-2 pr-4 text-muted-foreground">
                            {row.waist}&quot;
                          </td>
                          <td className="py-2 text-muted-foreground">
                            {row.hips}&quot;
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-3 italic">
                  💡 Tip: If between sizes, size up for a comfortable fit. For
                  kurtas, measure chest + add 2 inches ease.
                </p>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`min-w-[3rem] px-3 py-2 rounded-lg border text-sm font-semibold transition-all ${
                  selectedSize === s
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-foreground border-border hover:border-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mb-6">
            <p className="text-sm font-bold text-foreground mb-2">
              Description
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>
        )}

        {/* Key highlights */}
        {product.shortDescription && (
          <ul className="space-y-1.5 mb-6">
            {product.shortDescription
              .split("\n")
              .filter(Boolean)
              .map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{line}</span>
                </li>
              ))}
          </ul>
        )}

        {/* Fabric */}
        {product.fabric && (
          <div className="bg-secondary/40 rounded-lg p-3 flex items-center gap-2 mb-6 text-sm">
            <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span>
              <strong>Material:</strong> {product.fabric}
            </span>
          </div>
        )}

        {/* Why Choose This Product */}
        <div className="mb-6 p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
          <h3 className="font-display text-base font-bold text-foreground mb-3">
            ✨ Why Choose This Product
          </h3>
          <ul className="space-y-2">
            {[
              "Premium fabric quality",
              "Comfortable all-day wear",
              "Perfect for occasions",
              "Durable stitching",
            ].map((point) => (
              <li
                key={point}
                className="flex items-center gap-2 text-sm text-foreground"
              >
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs flex-shrink-0">
                  ✓
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-border/40 my-6" />

        {/* Delivery & Return */}
        <div className="mb-6">
          <p className="text-sm font-bold text-foreground mb-3">
            Delivery &amp; Return
          </p>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center text-center gap-1.5 p-3 bg-secondary/40 rounded-lg">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-semibold">Free delivery</span>
              <span className="text-xs text-muted-foreground">
                {product.deliveryThreshold ?? "Above Rs. 2,000"}
              </span>
            </div>
            <div className="flex flex-col items-center text-center gap-1.5 p-3 bg-secondary/40 rounded-lg">
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-semibold">Easy returns</span>
              <span className="text-xs text-muted-foreground">
                {product.returnDays ?? 7}-day policy
              </span>
            </div>
            <div className="flex flex-col items-center text-center gap-1.5 p-3 bg-secondary/40 rounded-lg">
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-semibold">Secure</span>
              <span className="text-xs text-muted-foreground">
                100% trusted
              </span>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div
          className="grid grid-cols-4 gap-2 mb-6"
          data-ocid="product.trust.section"
        >
          {[
            { icon: Truck, label: "Free Delivery" },
            { icon: Package, label: "COD" },
            { icon: RefreshCw, label: "Easy Returns" },
            { icon: ShieldCheck, label: "Secure" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center text-center gap-1 p-2 bg-secondary/40 rounded-lg"
            >
              <item.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-[10px] font-semibold leading-tight">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Complete Your Look */}
        {relatedProducts.length > 0 && (
          <section className="mb-8" data-ocid="product.recommended.section">
            <h2 className="font-display text-lg font-bold mb-1">
              Complete Your Look
            </h2>
            <div className="inline-flex items-center gap-1.5 bg-orange-100 border border-orange-300 text-orange-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
              🛍️ Buy 2 &amp; Save Rs. 300
            </div>
            <div className="grid grid-cols-2 gap-3">
              {relatedProducts.slice(0, 4).map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* UGC Section */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-display text-lg font-bold">
              Real Customers, Real Style
            </h2>
            <span className="text-xs bg-pink-100 text-pink-700 font-semibold px-2 py-0.5 rounded-full">
              ❤️ Verified
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                img: "/assets/generated/ugc-customer-1.dim_400x500.jpg",
                name: "Amna S.",
                city: "Karachi",
              },
              {
                img: "/assets/generated/ugc-customer-2.dim_400x500.jpg",
                name: "Bilal K.",
                city: "Lahore",
              },
              {
                img: "/assets/generated/ugc-customer-3.dim_400x500.jpg",
                name: "Fatima R.",
                city: "Islamabad",
              },
              {
                img: "/assets/generated/ugc-customer-4.dim_400x500.jpg",
                name: "Sara M.",
                city: "Peshawar",
              },
            ].map((item) => (
              <div
                key={item.name}
                className="relative overflow-hidden rounded-xl group cursor-pointer"
              >
                <img
                  src={item.img}
                  alt={`${item.name} wearing ThreadsHub`}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-xs font-bold">{item.name}</p>
                  <p className="text-white/80 text-xs">{item.city}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Customer Reviews */}
        <section data-ocid="product.reviews.section">
          <div className="mb-4">
            <h2 className="font-display text-lg font-bold">Customer Reviews</h2>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-4 w-4 ${
                      s <= Math.round(avgRating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold text-sm">
                {avgRating} out of 5
              </span>
              <span className="text-muted-foreground text-sm">
                ({reviewCount} reviews)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeReviews.map((r, i) => {
              const initials = r.name
                .split(" ")
                .map((w) => w[0] ?? "")
                .join("")
                .toUpperCase()
                .slice(0, 2);
              const isMock = "avatar" in r;
              const mockR = r as (typeof mockReviews)[0];
              return (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: stable review index
                  key={i}
                  className="bg-card p-4 rounded-xl border border-border/50"
                  data-ocid={`product.review.item.${i + 1}`}
                >
                  <div className="flex gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-3 w-3 ${
                          s <= r.rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    &ldquo;{r.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-2">
                    {isMock && mockR.avatarImg ? (
                      <img
                        src={mockR.avatarImg}
                        alt={r.name}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-primary/20"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {initials}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-xs">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.date}</p>
                      {isMock && mockR.city && (
                        <p className="text-xs text-muted-foreground">
                          {mockR.city} · {mockR.product}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
