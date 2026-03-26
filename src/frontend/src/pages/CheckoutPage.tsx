import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import * as bs from "@/lib/backendService";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Lock,
  MessageCircle,
  Package,
  ShieldCheck,
  Tag,
  Truck,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

type PaymentMethod = "cod" | "card";

interface FormData {
  name: string;
  phone: string;
  address: string;
  city: string;
}

interface SavedOrder {
  form: FormData;
  grandTotal: number;
  paymentMethod: PaymentMethod;
}

declare const window: Window & {
  gtag?: (
    command: string,
    action: string,
    params: Record<string, unknown>,
  ) => void;
};

export default function CheckoutPage() {
  const { settings, discounts } = useStore();
  const WHATSAPP_NUMBER = settings.whatsappNumber.replace(/^0/, "92");
  const EASYPAISA_NUMBER = settings.easyPaisaNumber;
  const COD_FEE = settings.deliveryFee ?? 250;
  const FREE_THRESHOLD = settings.freeShippingThreshold ?? 2000;

  const { cartItems, cartTotal, clearCart } = useCart();
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [submitted, setSubmitted] = useState(false);
  const [savedOrder, setSavedOrder] = useState<SavedOrder | null>(null);
  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    address: "",
    city: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );
  const [orderNum] = useState(
    () => `TH-${Math.floor(100000 + Math.random() * 900000)}`,
  );

  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState<{
    code: string;
    percent: number;
  } | null>(null);
  const [discountError, setDiscountError] = useState("");

  // Auto-apply discount from popup
  useEffect(() => {
    const pending = sessionStorage.getItem("pendingDiscount");
    if (pending) {
      const found = discounts.find(
        (d) => d.code === pending.toUpperCase() && d.active,
      );
      if (found) {
        setDiscountCode(found.code);
        setDiscountApplied({ code: found.code, percent: found.percent });
        sessionStorage.removeItem("pendingDiscount");
      }
    }
  }, [discounts]);

  const productTotal = cartTotal;
  const shippingFee = productTotal >= FREE_THRESHOLD ? 0 : COD_FEE;
  const discountAmount = discountApplied
    ? Math.floor((productTotal * discountApplied.percent) / 100)
    : 0;
  const grandTotal = productTotal + shippingFee - discountAmount;

  const handleChange =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((p) => ({ ...p, [field]: e.target.value }));
      if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
    };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApplyDiscount = async () => {
    setDiscountError("");
    const code = discountCode.trim().toUpperCase();
    const localFound = discounts.find((d) => d.code === code && d.active);
    if (localFound) {
      setDiscountApplied({
        code: localFound.code,
        percent: localFound.percent,
      });
      return;
    }
    const percent = await bs.checkDiscount(code);
    if (percent !== null) {
      setDiscountApplied({ code, percent });
    } else {
      setDiscountError("Invalid or inactive discount code.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const currentGrandTotal = grandTotal;
    const currentForm = { ...form };
    const currentPaymentMethod = paymentMethod;

    const orderPayload: bs.FrontendOrder = {
      id: orderNum,
      date: new Date().toISOString(),
      customerName: form.name,
      email: "",
      phone: form.phone,
      address: form.address,
      city: form.city,
      postalCode: "",
      paymentMethod,
      items: cartItems.map((i) => ({
        productName: i.product.name,
        size: i.size,
        qty: i.qty,
        price: i.product.discountPrice ?? i.product.price,
      })),
      productTotal,
      shippingFee,
      grandTotal: currentGrandTotal,
      status: "pending",
      discountCode: discountApplied?.code ?? "",
      discountAmount,
    };

    try {
      await bs.saveOrder(orderPayload);
    } catch (err) {
      console.error("Failed to save order:", err);
    }

    if (typeof window.gtag !== "undefined") {
      window.gtag("event", "purchase", {
        transaction_id: orderNum,
        value: currentGrandTotal,
        currency: "PKR",
        items: cartItems.map((item) => ({
          item_id: item.product.id,
          item_name: item.product.name,
          quantity: item.qty,
          price: item.product.discountPrice ?? item.product.price,
        })),
      });
    }

    setSavedOrder({
      form: currentForm,
      grandTotal: currentGrandTotal,
      paymentMethod: currentPaymentMethod,
    });
    clearCart();
    setSubmitted(true);
  };

  useEffect(() => {
    if (!submitted || !savedOrder) return;
    const timer = setTimeout(() => {
      const msg = encodeURIComponent(
        `Hello ThreadsHub 👋\nI have placed an order.\n\nOrder ID: ${orderNum}\nName: ${savedOrder.form.name}\nPhone: ${savedOrder.form.phone}\nCity: ${savedOrder.form.city}\nTotal: Rs. ${savedOrder.grandTotal.toLocaleString()}\nPayment: ${savedOrder.paymentMethod === "cod" ? "Cash on Delivery" : "EasyPaisa / JazzCash"}\n\nPlease confirm my order. Thank you!`,
      );
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
    }, 1500);
    return () => clearTimeout(timer);
  }, [submitted, savedOrder, orderNum, WHATSAPP_NUMBER]);

  if (cartItems.length === 0 && !submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <Package className="h-16 w-16 mx-auto mb-6 text-muted-foreground opacity-40" />
        <p className="font-display text-2xl mb-4">Your cart is empty</p>
        <Link to="/shop">
          <Button className="bg-primary text-primary-foreground">
            Shop Now
          </Button>
        </Link>
      </div>
    );
  }

  if (submitted && savedOrder) {
    const { form: sf, grandTotal: sgt, paymentMethod: spm } = savedOrder;
    const waMsg = encodeURIComponent(
      `Hello ThreadsHub 👋\nI have placed an order.\n\nOrder ID: ${orderNum}\nName: ${sf.name}\nPhone: ${sf.phone}\nCity: ${sf.city}\nTotal: Rs. ${sgt.toLocaleString()}\nPayment: ${spm === "cod" ? "Cash on Delivery" : "EasyPaisa / JazzCash"}\n\nPlease confirm my order. Thank you!`,
    );
    const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`;

    const deliverySteps = [
      { label: "Order Placed ✓", done: true },
      { label: "Processing", done: false },
      { label: "Shipped", done: false },
      { label: "Delivered", done: false },
    ];

    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-lg w-full bg-card rounded-sm shadow-elevated p-8 text-center"
          data-ocid="checkout.success_state"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="h-10 w-10 text-green-600" />
          </motion.div>

          <h1 className="font-display text-3xl font-bold mb-2 text-green-700">
            🎉 Your Order is Confirmed!
          </h1>
          <p className="text-muted-foreground font-sans mb-6">
            Thank you for shopping with ThreadsHub. Your order is being
            processed and will be delivered in 3–5 business days.
          </p>

          {/* Order details */}
          <div className="bg-secondary/50 rounded-sm p-4 mb-5 text-sm space-y-1 text-left">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Number</span>
              <span className="font-mono font-bold text-foreground">
                #{orderNum}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name</span>
              <span className="font-semibold">{sf.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone</span>
              <span className="font-semibold">{sf.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">City</span>
              <span className="font-semibold">{sf.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment</span>
              <span className="font-semibold">
                {spm === "cod" ? "Cash on Delivery" : "EasyPaisa / JazzCash"}
              </span>
            </div>
            <div className="flex justify-between border-t border-border pt-1 mt-1">
              <span className="text-muted-foreground">Total</span>
              <span className="font-bold text-base">
                Rs. {sgt.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Delivery timeline stepper */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Delivery Timeline
            </p>
            <div className="flex items-center">
              {deliverySteps.map((step, i) => (
                <div key={step.label} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        step.done
                          ? "bg-green-500 text-white"
                          : "bg-secondary border-2 border-border text-muted-foreground"
                      }`}
                    >
                      {step.done ? "✓" : i + 1}
                    </div>
                    <p
                      className={`text-[10px] mt-1 text-center leading-tight max-w-[56px] ${
                        step.done
                          ? "text-green-700 font-semibold"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                  {i < deliverySteps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-1 mb-4 ${
                        step.done ? "bg-green-400" : "bg-border"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="checkout.whatsapp_button"
            >
              <Button
                className="w-full text-white gap-2 font-bold"
                style={{ backgroundColor: "#25D366" }}
              >
                <MessageCircle className="h-4 w-4" />
                Track on WhatsApp 📱
              </Button>
            </a>
            <Link to="/shop">
              <Button
                variant="outline"
                className="w-full"
                data-ocid="checkout.continue_shopping_button"
              >
                Continue Shopping →
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/cart"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            data-ocid="checkout.back.link"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Cart
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />
            <span>Secure Checkout</span>
          </div>
        </div>

        {/* Trust badges strip */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {[
            { icon: "🔒", text: "Secure Checkout" },
            { icon: "🚚", text: "Delivery in 3–5 days" },
            { icon: "💯", text: "7-day return guarantee" },
          ].map((badge) => (
            <div
              key={badge.text}
              className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-full"
            >
              <span>{badge.icon}</span>
              <span>{badge.text}</span>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-10">
          {/* Left: Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Mobile order summary toggle */}
            <div className="lg:hidden bg-card rounded-sm border border-border">
              <button
                type="button"
                onClick={() => setOrderSummaryOpen((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold"
                data-ocid="checkout.order_summary.toggle"
              >
                <span className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Order Summary
                  <span className="text-muted-foreground font-normal">
                    ({cartItems.length} items)
                  </span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-bold">
                    Rs. {grandTotal.toLocaleString()}
                  </span>
                  {orderSummaryOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </button>
              <AnimatePresence>
                {orderSummaryOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden border-t border-border"
                  >
                    <div className="px-4 py-3 space-y-3">
                      {cartItems.map((item) => (
                        <div
                          key={`${item.product.id}-${item.size}`}
                          className="flex gap-3 items-center"
                        >
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded border border-border"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Size: {item.size} × {item.qty}
                            </p>
                          </div>
                          <span className="font-semibold text-sm">
                            Rs.{" "}
                            {(
                              (item.product.discountPrice ??
                                item.product.price) * item.qty
                            ).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Delivery Info */}
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold">
                Delivery Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="name"
                  >
                    Full Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange("name")}
                    placeholder="e.g. Muhammad Ali"
                    data-ocid="checkout.name.input"
                    autoComplete="name"
                    className="w-full border border-border rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                  />
                  {errors.name && (
                    <p
                      className="text-xs text-red-600 mt-1"
                      data-ocid="checkout.name.error_state"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="phone"
                  >
                    Phone Number *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange("phone")}
                    placeholder="03XXXXXXXXX"
                    data-ocid="checkout.phone.input"
                    autoComplete="tel"
                    className="w-full border border-border rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                  />
                  {errors.phone && (
                    <p
                      className="text-xs text-red-600 mt-1"
                      data-ocid="checkout.phone.error_state"
                    >
                      {errors.phone}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="city"
                  >
                    City *
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={form.city}
                    onChange={handleChange("city")}
                    placeholder="e.g. Lahore"
                    data-ocid="checkout.city.input"
                    autoComplete="address-level2"
                    className="w-full border border-border rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                  />
                  {errors.city && (
                    <p
                      className="text-xs text-red-600 mt-1"
                      data-ocid="checkout.city.error_state"
                    >
                      {errors.city}
                    </p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="address"
                  >
                    Full Address *
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={form.address}
                    onChange={handleChange("address")}
                    placeholder="House #, Street, Area"
                    data-ocid="checkout.address.input"
                    autoComplete="street-address"
                    className="w-full border border-border rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                  />
                  {errors.address && (
                    <p
                      className="text-xs text-red-600 mt-1"
                      data-ocid="checkout.address.error_state"
                    >
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold">Payment Method</h2>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  data-ocid="checkout.cod.toggle"
                  className={`w-full flex items-center gap-4 p-4 rounded-sm border-2 transition-all ${
                    paymentMethod === "cod"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-foreground/30"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                      paymentMethod === "cod"
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    }`}
                  />
                  <div className="text-left flex-1">
                    <p className="font-semibold text-sm">
                      💰 Cash on Delivery (COD)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Pay when you receive your order
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {paymentMethod === "cod" && (
                      <span className="text-xs font-bold text-green-700 bg-green-100 border border-green-300 px-2 py-0.5 rounded-full">
                        ✓ Selected
                      </span>
                    )}
                    <span className="text-xs font-semibold text-green-600">
                      Most Popular
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  data-ocid="checkout.online.toggle"
                  className={`w-full flex items-center gap-4 p-4 rounded-sm border-2 transition-all ${
                    paymentMethod === "card"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-foreground/30"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                      paymentMethod === "card"
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    }`}
                  />
                  <div className="text-left flex-1">
                    <p className="font-semibold text-sm">
                      📱 EasyPaisa / JazzCash
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Send payment to <strong>{EASYPAISA_NUMBER}</strong> then
                      share screenshot on WhatsApp
                    </p>
                  </div>
                  {paymentMethod === "card" && (
                    <span className="text-xs font-bold text-green-700 bg-green-100 border border-green-300 px-2 py-0.5 rounded-full flex-shrink-0">
                      ✓ Selected
                    </span>
                  )}
                </button>
              </div>

              {paymentMethod === "card" && (
                <div className="bg-amber-50 border border-amber-200 rounded-sm p-4 text-sm">
                  <p className="font-semibold text-amber-800 mb-1">
                    Online Payment Instructions
                  </p>
                  <ol className="text-amber-700 space-y-1 list-decimal list-inside text-xs">
                    <li>
                      Send Rs. {grandTotal.toLocaleString()} to{" "}
                      {EASYPAISA_NUMBER} via EasyPaisa or JazzCash
                    </li>
                    <li>Take a screenshot of your payment</li>
                    <li>
                      Send it on WhatsApp:{" "}
                      <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        0317-4933882
                      </a>
                    </li>
                    <li>Your order will be confirmed after verification</li>
                  </ol>
                </div>
              )}
            </div>

            {/* Discount Code */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Discount Code</h3>
              {discountApplied ? (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-sm px-3 py-2">
                  <Tag className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-700">
                    {discountApplied.code} — {discountApplied.percent}% OFF
                    applied!
                  </span>
                  <button
                    type="button"
                    onClick={() => setDiscountApplied(null)}
                    className="ml-auto text-muted-foreground hover:text-foreground"
                    data-ocid="checkout.remove_discount.button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => {
                      setDiscountCode(e.target.value);
                      setDiscountError("");
                    }}
                    placeholder="Enter code (e.g. FIRST10)"
                    data-ocid="checkout.discount.input"
                    className="flex-1 border border-border rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleApplyDiscount}
                    data-ocid="checkout.apply_discount.button"
                    className="text-sm"
                  >
                    Apply
                  </Button>
                </div>
              )}
              {discountError && (
                <p
                  className="text-xs text-red-600"
                  data-ocid="checkout.discount.error_state"
                >
                  {discountError}
                </p>
              )}
            </div>

            <Button
              type="submit"
              data-ocid="checkout.submit_button"
              className="w-full bg-primary text-primary-foreground hover:opacity-90 font-bold uppercase tracking-widest text-sm py-4 gap-2 rounded-sm"
            >
              <ShieldCheck className="h-4 w-4" />
              Place Order — Rs. {grandTotal.toLocaleString()}
            </Button>
          </form>

          {/* Right: Desktop Order Summary */}
          <div className="hidden lg:block space-y-4">
            <div className="bg-card rounded-sm border border-border p-5 sticky top-24">
              <h3 className="font-display text-lg font-bold mb-4">
                Order Summary
              </h3>
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div
                    key={`${item.product.id}-${item.size}`}
                    className="flex gap-3 items-center"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-14 h-14 object-cover rounded border border-border"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-tight truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.size} × {item.qty}
                      </p>
                    </div>
                    <span className="font-semibold text-sm flex-shrink-0">
                      Rs.{" "}
                      {(
                        (item.product.discountPrice ?? item.product.price) *
                        item.qty
                      ).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>Rs. {productTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span
                    className={
                      shippingFee === 0 ? "text-green-600 font-semibold" : ""
                    }
                  >
                    {shippingFee === 0 ? "FREE" : `Rs. ${shippingFee}`}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base border-t border-border pt-2">
                  <span>Total</span>
                  <span>Rs. {grandTotal.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {["COD", "EasyPaisa", "JazzCash"].map((m) => (
                  <span
                    key={m}
                    className="text-xs bg-secondary px-2.5 py-1 rounded-full font-medium text-muted-foreground"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
