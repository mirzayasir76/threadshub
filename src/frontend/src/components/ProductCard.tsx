import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/data/products";
import { Link } from "@tanstack/react-router";
import { ShoppingBag, Star } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleQuickAdd = () => {
    addToCart(product, product.sizes[0], 1);
    toast.success(`${product.name} added to cart!`, {
      description: `Size: ${product.sizes[0]}`,
    });
  };

  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice! : product.price;
  const discountPct = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice!) / product.price) * 100,
      )
    : 0;

  const stock = product.stock ?? 50;
  const isLowStock = stock <= 5 && stock > 0;
  const outOfStock = stock === 0;
  const stockBarPct = Math.min(Math.round((stock / 10) * 100), 100);

  const rating = product.rating ?? 4.5;
  const isTrending = product.featured === true && rating >= 4.5;

  const renderStars = (r: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-3 w-3 ${
            s <= Math.round(r)
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted"
          }`}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-1">
        ({product.reviewCount ?? 0})
      </span>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className="group relative bg-card rounded-sm overflow-hidden shadow-card hover:shadow-elevated transition-shadow"
    >
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="block relative overflow-hidden"
      >
        <img
          src={product.image}
          alt={product.name}
          className="product-card-img"
          loading="lazy"
          decoding="async"
        />
        {/* Image badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isBestSeller && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-500 text-white leading-tight shadow-sm">
              ⭐ Best Seller
            </span>
          )}
          {isTrending && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-violet-600 text-white leading-tight shadow-sm">
              🔥 Trending
            </span>
          )}
          {product.newArrival && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-600 text-white leading-tight shadow-sm">
              New
            </span>
          )}
          {hasDiscount && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500 text-white leading-tight shadow-sm">
              -{discountPct}%
            </span>
          )}
        </div>
      </Link>

      {/* Card body */}
      <div className="p-3">
        <Link to="/product/$id" params={{ id: product.id }}>
          <h3 className="font-display text-base font-semibold text-card-foreground hover:text-primary transition-colors leading-tight">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1 mb-1">{renderStars(rating)}</div>

        {/* Social proof */}
        <p className="text-xs font-semibold text-orange-600 mb-2">
          🔥 {(product.soldCount ?? 500).toLocaleString()}+ sold
        </p>

        <div className="flex items-center gap-2 mb-2">
          <span className="font-sans font-bold text-base text-foreground">
            Rs. {displayPrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="font-sans text-xs text-muted-foreground line-through">
              Rs. {product.price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Stock urgency */}
        {isLowStock && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-red-600 mb-1">
              🔥 Only {stock} left!
            </p>
            <div className="h-1 w-full rounded-full bg-red-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-red-500 transition-all"
                style={{ width: `${stockBarPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Single CTA: Add to Cart */}
        <Button
          size="sm"
          onClick={handleQuickAdd}
          disabled={outOfStock}
          data-ocid="product.add_button"
          className="w-full bg-primary text-primary-foreground hover:opacity-90 rounded-sm text-xs sm:text-sm gap-1 font-bold"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          {outOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      </div>
    </motion.div>
  );
}
