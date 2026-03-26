import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo } from "react";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQty, cartTotal } = useCart();
  const { settings, products } = useStore();

  const freeThreshold = settings.freeShippingThreshold ?? 2000;
  const deliveryFee = settings.deliveryFee ?? 250;

  const remaining = Math.max(0, freeThreshold - cartTotal);
  const progress = Math.min(100, (cartTotal / freeThreshold) * 100);
  const freeDelivery = cartTotal >= freeThreshold;

  const cartProductIds = new Set(cartItems.map((i) => i.product.id));
  const recommendations = useMemo(() => {
    const eligible = products.filter((p) => !cartProductIds.has(p.id));
    const shuffled = [...eligible].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }, [products, cartProductIds]);

  if (cartItems.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-24 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/30 mb-6" />
        <h1 className="font-display text-3xl font-bold">Your bag is empty</h1>
        <p className="text-muted-foreground mt-2 font-sans">
          Add some items to get started.
        </p>
        <Link to="/shop">
          <Button className="mt-8 bg-primary text-primary-foreground hover:opacity-90 rounded-sm px-8 uppercase tracking-widest text-sm gap-2">
            Browse Shop <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-4xl font-bold mb-8">Shopping Bag</h1>

      {/* Free delivery progress */}
      <div className="mb-6 p-4 bg-card rounded-lg border border-border shadow-sm">
        {freeDelivery ? (
          <div className="flex items-center gap-2 text-green-700 font-semibold text-sm">
            <span className="text-lg">🎉</span>
            <span>You&apos;ve unlocked FREE delivery!</span>
          </div>
        ) : (
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Add{" "}
              <span className="font-bold text-foreground">
                Rs. {remaining.toLocaleString()}
              </span>{" "}
              more to get FREE delivery
            </p>
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full bg-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Rs. 0</span>
              <span>Rs. {freeThreshold.toLocaleString()} (Free delivery)</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {cartItems.map((item, idx) => {
              const itemPrice =
                item.product.discountPrice ?? item.product.price;
              return (
                <motion.div
                  key={item.cartKey}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  data-ocid={`cart.item.${idx + 1}`}
                  className="flex gap-4 bg-card rounded-sm p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <Link
                    to="/product/$id"
                    params={{ id: item.product.id }}
                    className="shrink-0"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-sm bg-secondary/30"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          to="/product/$id"
                          params={{ id: item.product.id }}
                        >
                          <h3 className="font-display font-semibold text-base hover:text-primary transition-colors">
                            {item.product.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.product.category} · {item.product.type} · Size:{" "}
                          {item.size}
                        </p>
                        {/* Urgency badge */}
                        {(item.product.stock ?? 50) < 10 && (
                          <span className="inline-block mt-1 text-xs font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                            🔥 Only {item.product.stock} left
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.cartKey)}
                        data-ocid={`cart.remove_button.${idx + 1}`}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 border border-border rounded-sm">
                        <button
                          type="button"
                          onClick={() => updateQty(item.cartKey, item.qty - 1)}
                          className="px-2.5 py-1 hover:bg-muted transition-colors text-sm"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={item.qty}
                          min={1}
                          onChange={(e) =>
                            updateQty(item.cartKey, Number(e.target.value))
                          }
                          data-ocid={`cart.quantity_input.${idx + 1}`}
                          className="w-10 text-center text-sm font-semibold bg-transparent border-none outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => updateQty(item.cartKey, item.qty + 1)}
                          className="px-2.5 py-1 hover:bg-muted transition-colors text-sm"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-sans font-bold text-base">
                        Rs. {(itemPrice * item.qty).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card rounded-sm shadow-card p-6 sticky top-24">
            <h2 className="font-display text-xl font-semibold mb-4">
              Order Summary
            </h2>
            <Separator className="mb-4" />
            {cartItems.map((item) => {
              const itemPrice =
                item.product.discountPrice ?? item.product.price;
              return (
                <div
                  key={item.cartKey}
                  className="flex justify-between text-sm font-sans mb-2"
                >
                  <span className="text-muted-foreground truncate max-w-[150px]">
                    {item.product.name} ×{item.qty}
                  </span>
                  <span className="font-medium">
                    Rs. {(itemPrice * item.qty).toLocaleString()}
                  </span>
                </div>
              );
            })}
            <Separator className="my-4" />
            <div className="flex justify-between font-sans font-bold text-base mb-2">
              <span>Subtotal</span>
              <span>Rs. {cartTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm font-sans text-muted-foreground mb-6">
              <span>Shipping</span>
              <span
                className={freeDelivery ? "text-green-600 font-semibold" : ""}
              >
                {freeDelivery ? "FREE" : `Rs. ${deliveryFee}`}
              </span>
            </div>
            <div className="flex justify-between font-sans font-bold text-lg border-t border-border pt-4">
              <span>Total</span>
              <span>
                Rs.{" "}
                {(
                  cartTotal + (freeDelivery ? 0 : deliveryFee)
                ).toLocaleString()}
              </span>
            </div>
            <Link to="/checkout">
              <Button
                className="w-full mt-6 bg-primary text-primary-foreground hover:opacity-90 rounded-sm uppercase tracking-widest text-sm gap-2"
                data-ocid="cart.checkout.primary_button"
              >
                Checkout <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* You May Also Like */}
      {recommendations.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold mb-6">
            You May Also Like
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-3 sm:overflow-visible">
            {recommendations.map((product) => {
              const recPrice = product.discountPrice ?? product.price;
              return (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-48 sm:w-auto bg-card rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                >
                  <Link to="/product/$id" params={{ id: product.id }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </Link>
                  <div className="p-3">
                    <Link to="/product/$id" params={{ id: product.id }}>
                      <h3 className="font-semibold text-sm leading-tight line-clamp-2 hover:text-primary transition-colors mb-1">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-sm">
                        Rs. {recPrice.toLocaleString()}
                      </span>
                      <Link to="/product/$id" params={{ id: product.id }}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-7 px-2"
                          data-ocid="cart.recommendation.button"
                        >
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
