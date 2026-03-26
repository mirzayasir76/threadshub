import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/context/StoreContext";
import type { Category } from "@/data/products";
import { categories } from "@/data/products";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Gift,
  Heart,
  Instagram,
  MessageCircle,
  Package,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const reviews = [
  {
    name: "Ayesha K.",
    city: "Lahore",
    rating: 5,
    text: "Quality is amazing! The fabric is so soft and the stitching is perfect. Delivery was within 3 days. Highly recommend ThreadsHub!",
    product: "Embroidered Lawn Suit",
    avatar:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Ahmed R.",
    city: "Karachi",
    rating: 5,
    text: "Ordered the Embroidered Kurta. Fits perfectly and looks very professional. Will definitely order again. Great value for money!",
    product: "Men Embroidered Kurta",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Sara M.",
    city: "Islamabad",
    rating: 4,
    text: "Bought kids clothes for my children. Excellent quality, durable, and the colors are vibrant. Kids love it!",
    product: "Boys Kurta Shalwar Set",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Usman T.",
    city: "Faisalabad",
    rating: 5,
    text: "COD option is very convenient. Received the package well-packed. The kurta is exactly as shown. Perfect fit!",
    product: "Men Lawn Embroidered Kurta",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
  },
];

const influencers = [
  {
    name: "Hina Altaf",
    handle: "@hina.altaf.official",
    instagramUrl: "https://instagram.com/hina.altaf.official",
    followers: "340K",
    quote:
      "ThreadsHub ka fabric real mein bohat soft hai. Main apni audience ko yehi recommend karti hoon for everyday Pakistani wear!",
    category: "Fashion & Lifestyle",
    img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Bilal Saeed",
    handle: "@bilalsaeed.style",
    instagramUrl: "https://instagram.com/bilalsaeed.style",
    followers: "128K",
    quote:
      "Yahan se kurtas order kiye — quality itni achi hai ke doston ne pucha kahan se liya. Fast delivery bhi!",
    category: "Men's Fashion Creator",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Maham Noor",
    handle: "@maham.noor.pk",
    instagramUrl: "https://instagram.com/maham.noor.pk",
    followers: "215K",
    quote:
      "Bachon ke kapre isi se mangwati hoon. Embroidered frocks itni pyari hain ke every mama will love them!",
    category: "Mom & Parenting Blogger",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
  },
];

const instagramPosts = [
  "/assets/generated/ig-post-1.dim_400x400.jpg",
  "/assets/generated/ig-post-2.dim_400x400.jpg",
  "/assets/generated/ig-post-3.dim_400x400.jpg",
  "/assets/generated/ig-post-4.dim_400x400.jpg",
  "/assets/generated/ig-post-5.dim_400x400.jpg",
  "/assets/generated/ig-post-6.dim_400x400.jpg",
  "/assets/generated/ig-post-7.dim_400x400.jpg",
  "/assets/generated/ig-post-8.dim_400x400.jpg",
  "/assets/generated/ig-post-9.dim_400x400.jpg",
];

const trustBadges = [
  { icon: Truck, label: "Free Delivery", desc: "Above Rs. 2,000" },
  { icon: Package, label: "Cash on Delivery", desc: "Pay on receipt" },
  { icon: RefreshCw, label: "Easy Returns", desc: "7-day return policy" },
  { icon: ShieldCheck, label: "Secure Checkout", desc: "100% safe & trusted" },
];

const categoryItems: {
  cat: Category;
  label: string;
  image: string;
  color: string;
}[] = [
  {
    cat: "Men",
    label: "Streetwear Collection",
    image: "/assets/generated/category-men.dim_400x500.jpg",
    color: "bg-slate-800",
  },
  {
    cat: "Women",
    label: "Elegant Styles",
    image: "/assets/generated/category-women.dim_400x500.jpg",
    color: "bg-rose-700",
  },
  {
    cat: "Boys",
    label: "Comfort Wear",
    image: "/assets/generated/category-boys.dim_400x500.jpg",
    color: "bg-blue-700",
  },
  {
    cat: "Girls",
    label: "Trendy Picks",
    image: "/assets/generated/category-girls.dim_400x500.jpg",
    color: "bg-pink-600",
  },
  {
    cat: "Baby",
    label: "Soft & Safe",
    image: "/assets/generated/category-baby.dim_400x500.jpg",
    color: "bg-amber-600",
  },
];

export default function HomePage() {
  const { products, settings } = useStore();
  const featured = products.filter((p) => p.featured);
  const newArrivals = products.filter((p) => p.newArrival);
  const bestSellers = products.filter((p) => p.isBestSeller);
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const filteredFeatured =
    activeCategory === "All"
      ? featured
      : featured.filter((p) => p.category === activeCategory);

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    const msg = encodeURIComponent(
      `Hi ThreadsHub! I would like to subscribe for deals and offers. My WhatsApp number is: ${phone.trim()}. Please send me the 10% discount code. Thank you!`,
    );
    window.open(`https://wa.me/923174933882?text=${msg}`, "_blank");
    setSubmitted(true);
  };

  return (
    <main className="w-full overflow-x-hidden">
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-foreground">
        <img
          src={
            settings.heroImage ||
            "/assets/generated/hero-streetwear.dim_1400x600.jpg"
          }
          alt="ThreadsHub 2026 Streetwear Collection"
          className="w-full h-[380px] sm:h-[520px] object-cover object-center"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/10" />
        <div className="absolute inset-0 flex flex-col items-start justify-center px-4 sm:px-16 lg:px-24 z-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="font-display text-2xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-[260px] sm:max-w-xl">
              🔥 New 2026
              <br />
              <em className="not-italic text-primary">Streetwear</em> Collection
            </h1>
            <p className="mt-3 text-white font-sans text-sm sm:text-lg font-semibold max-w-[220px] sm:max-w-sm drop-shadow">
              Premium Quality Oversized Fits Under Rs. 1999
            </p>
            <div className="mt-5 flex flex-col sm:flex-row gap-3 w-full max-w-[260px] sm:max-w-none">
              <Link to="/shop" className="w-full sm:w-auto">
                <Button
                  data-ocid="hero.primary_button"
                  className="w-full sm:w-auto bg-primary text-primary-foreground hover:opacity-90 rounded-sm px-4 sm:px-6 py-3 font-bold uppercase tracking-wide text-xs sm:text-sm gap-2"
                >
                  Shop Now → Upgrade Your Style 🔥
                </Button>
              </Link>
              <Link
                to="/shop"
                search={{ filter: "new" }}
                className="w-full sm:w-auto"
              >
                <button
                  type="button"
                  data-ocid="hero.new_arrivals_button"
                  className="w-full sm:w-auto border-2 border-white text-white bg-transparent hover:bg-white/15 transition-colors rounded-sm px-4 sm:px-6 py-3 font-bold uppercase tracking-wide text-xs sm:text-sm flex items-center justify-center gap-2"
                >
                  New Arrivals
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Trust Badges ─────────────────────────────────────── */}
      <section
        className="bg-foreground/5 border-b border-border"
        data-ocid="trust.section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {trustBadges.map((badge) => (
              <motion.div
                key={badge.label}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.45, ease: "easeOut" },
                  },
                }}
                whileHover={{ scale: 1.03 }}
                className="flex items-center gap-2 sm:gap-3 min-w-0 cursor-default"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-sm bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <badge.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-sans font-semibold text-xs text-foreground truncate">
                    {badge.label}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {badge.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Best Sellers ─────────────────────────────────────── */}
      {bestSellers.length > 0 && (
        <section
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14"
          data-ocid="bestsellers.section"
        >
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="font-sans text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
                Most Popular
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold mt-1">
                Best Sellers
              </h2>
            </div>
            <Link
              to="/shop"
              search={{ filter: "bestseller" }}
              data-ocid="bestsellers.link"
              className="text-sm font-sans font-medium text-primary hover:underline flex items-center gap-1"
            >
              Shop Best Sellers <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {bestSellers.slice(0, 4).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* ─── Categories (Premium with lifestyle images) ────────── */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 border-t border-border"
        data-ocid="categories.section"
      >
        <div className="text-center mb-10">
          <span className="font-sans text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Browse
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mt-1">
            Shop by Category
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {categoryItems.map(({ cat, label, image }, i) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={i === 4 ? "col-span-2 sm:col-span-1" : ""}
            >
              <Link
                to="/shop"
                search={{ category: cat }}
                data-ocid={`categories.${cat.toLowerCase()}.link`}
                className="block group"
              >
                <div className="relative rounded-sm overflow-hidden aspect-[4/5] hover:shadow-elevated transition-shadow cursor-pointer">
                  <img
                    src={image}
                    alt={label}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  {/* Text at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                    <p className="font-display font-bold text-white text-sm sm:text-base leading-tight">
                      {label}
                    </p>
                    <p className="font-sans text-xs text-white/80 mt-0.5 uppercase tracking-widest">
                      Shop Now →
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Featured Collection ───────────────────────────────── */}
      <section
        className="bg-secondary/30 py-8 sm:py-14"
        data-ocid="featured.section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="font-sans text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                Curated Picks
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold mt-1">
                Featured Collection
              </h2>
            </div>
            <Link
              to="/shop"
              data-ocid="featured.link"
              className="text-sm font-sans font-medium text-primary hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(["All", ...categories] as (Category | "All")[]).map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setActiveCategory(cat)}
                data-ocid="home.category.tab"
                className={`category-pill ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:border-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredFeatured.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Sparkles className="h-8 w-8 mx-auto mb-3 opacity-40" />
              <p className="font-sans">
                No featured items in this category yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredFeatured.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── New Arrivals ─────────────────────────────────────── */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14"
        data-ocid="newarrivals.section"
      >
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="font-sans text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-green-600">
              Just In
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mt-1">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/shop"
            search={{ filter: "new" }}
            data-ocid="newarrivals.link"
            className="text-sm font-sans font-medium text-primary hover:underline flex items-center gap-1"
          >
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {newArrivals.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Zap className="h-8 w-8 mx-auto mb-3 opacity-40" />
            <p className="font-sans">New arrivals coming soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {newArrivals.slice(0, 4).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* ─── Discount Banner ──────────────────────────────────── */}
      <section
        className="bg-foreground text-background py-12 px-4"
        data-ocid="discount.section"
      >
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-primary">
              Limited Time Offer
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mt-3 mb-4">
              Get <span className="text-primary">10% OFF</span>
              <br />
              Your First Order
            </h2>
            <p className="font-sans text-background/70 mb-6 text-base">
              Use code{" "}
              <span className="font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                FIRST10
              </span>{" "}
              at checkout. Valid on all products.
            </p>
            <Link to="/shop">
              <Button
                data-ocid="discount.shop_button"
                className="bg-primary hover:opacity-90 text-primary-foreground rounded-sm px-10 py-3 font-bold uppercase tracking-widest text-sm gap-2"
              >
                Shop Now → Upgrade Your Style 🔥
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── Instagram Gallery ─────────────────────────────────── */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14"
        data-ocid="instagram.section"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Instagram className="h-5 w-5 text-pink-500" />
            <span className="font-sans text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">
              Instagram
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold">
            Follow Us <span className="text-primary">@threadshub</span>
          </h2>
          <p className="text-muted-foreground mt-2 font-sans text-sm">
            Tag #ThreadsHub to be featured
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {instagramPosts.map((src, i) => (
            <motion.a
              key={src}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid={`instagram.item.${i + 1}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="block aspect-square overflow-hidden rounded-sm group relative"
            >
              <img
                src={src}
                alt={`ThreadsHub style ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-all duration-300 flex items-center justify-center">
                <Heart className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.a>
          ))}
        </div>
        <div className="text-center mt-6">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="instagram.follow.button"
          >
            <Button
              variant="outline"
              className="gap-2 font-semibold uppercase tracking-widest text-xs"
            >
              <Instagram className="h-4 w-4 text-pink-500" />
              Follow @threadshub
            </Button>
          </a>
        </div>
      </section>

      {/* ─── Customer Reviews (Testimonials) ──────────────────── */}
      <section
        className="bg-secondary/30 py-8 sm:py-14 px-4"
        data-ocid="reviews.section"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="font-sans text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Testimonials
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mt-1">
              What Customers Say
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {reviews.map((r, i) => (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
                }}
                className={`p-6 rounded-xl shadow-card ${
                  i % 2 === 0 ? "bg-white" : "bg-[#f8f5f2]"
                }`}
                data-ocid={`reviews.item.${i + 1}`}
              >
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-4 w-4 ${
                        s <= r.rating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                </div>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-4">
                  "{r.text}"
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={r.avatar}
                    alt={r.name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-primary/20"
                    loading="lazy"
                    decoding="async"
                  />
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      {r.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {r.city} • {r.product}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Influencer Section ───────────────────────────────── */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14"
        data-ocid="influencers.section"
      >
        <div className="text-center mb-10">
          <span className="font-sans text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Loved By
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mt-1">
            Fashion Influencers
          </h2>
          <p className="text-muted-foreground mt-2 font-sans text-sm max-w-lg mx-auto">
            Pakistani fashion creators choose ThreadsHub for their daily looks
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {influencers.map((inf, i) => (
            <motion.div
              key={inf.handle}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{
                scale: 1.03,
                boxShadow:
                  "0 0 0 4px rgba(139,58,47,0.15), 0 8px 32px rgba(0,0,0,0.12)",
              }}
              className="bg-card p-6 rounded-xl shadow-card text-center"
              data-ocid={`influencers.item.${i + 1}`}
            >
              <img
                src={inf.img}
                alt={inf.name}
                className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-4 border-primary/30"
                loading="lazy"
                decoding="async"
              />
              <p className="font-display font-bold text-xl">{inf.name}</p>
              <a
                href={inf.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm font-semibold hover:underline"
              >
                {inf.handle}
              </a>
              <p className="text-xs text-muted-foreground mt-1 mb-3">
                {inf.followers} followers • {inf.category}
              </p>
              <p className="font-sans text-sm text-muted-foreground italic leading-relaxed">
                "{inf.quote}"
              </p>
              <div className="flex gap-1 justify-center mt-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <a
                href={inf.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 w-full text-xs font-semibold gap-1 hover:bg-primary hover:text-white transition-colors"
                >
                  <Instagram className="h-3 w-3" /> View Profile
                </Button>
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── WhatsApp Lead Capture ─────────────────────────────── */}
      <section
        className="bg-green-900 text-white py-16 px-4"
        data-ocid="leadcapture.section"
      >
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Gift className="h-7 w-7 text-green-300" />
              <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-green-300">
                Exclusive Offer
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
              Unlock <span className="text-green-300">10% OFF</span> Instantly
              🎁
            </h2>
            <p className="font-sans text-white/70 mb-8 text-base">
              Enter your WhatsApp number and get exclusive deals + priority
              offers
            </p>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-800/60 border border-green-600 rounded-sm px-6 py-5 inline-flex items-center gap-3"
                data-ocid="leadcapture.success_state"
              >
                <MessageCircle className="h-6 w-6 text-green-300 flex-shrink-0" />
                <p className="font-sans text-sm font-semibold text-green-100">
                  WhatsApp is opening — send the message to get your discount
                  code!
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleLeadSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <Input
                  type="tel"
                  placeholder="Your WhatsApp number (e.g. 03001234567)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  data-ocid="leadcapture.input"
                  className="flex-1 border-green-600 bg-green-800/50 text-white placeholder:text-green-400 focus:border-green-400"
                  style={{ borderRadius: "30px" }}
                  required
                />
                <Button
                  type="submit"
                  data-ocid="leadcapture.submit_button"
                  className="bg-green-400 hover:bg-green-300 text-green-900 font-bold uppercase tracking-wider text-sm px-6 rounded-full gap-2 whitespace-nowrap shadow-lg hover:shadow-xl transition-shadow"
                >
                  <MessageCircle className="h-4 w-4" /> Get My Discount Now
                </Button>
              </form>
            )}
            <p className="font-sans text-xs text-green-300 mt-3 flex items-center justify-center gap-1">
              <ShieldCheck className="h-3 w-3" /> No spam. Only premium deals.
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
