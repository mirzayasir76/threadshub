import AnnouncementBar from "@/components/AnnouncementBar";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import * as bs from "@/lib/backendService";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  HelpCircle,
  Mail,
  Menu,
  MessageSquare,
  Package,
  Phone,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { label: "Home", to: "/", exact: true },
  { label: "Men", to: "/shop", search: { category: "Men" } },
  { label: "Women", to: "/shop", search: { category: "Women" } },
  { label: "Boys", to: "/shop", search: { category: "Boys" } },
  { label: "Girls", to: "/shop", search: { category: "Girls" } },
  { label: "Baby", to: "/shop", search: { category: "Baby" } },
  { label: "New Arrivals", to: "/shop", search: { filter: "new" } },
  { label: "Best Sellers", to: "/shop", search: { filter: "bestseller" } },
];

// ─── Email Capture Modal ──────────────────────────────────────────────────────
function EmailCaptureModal({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    bs.saveSubscriber({
      email: email.trim().toLowerCase(),
      whatsapp: "",
      date: new Date().toISOString(),
    }).catch(() => {});
    setSubmitted(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText("FIRST10").catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setEmail("");
    setSubmitted(false);
    setCopied(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="bg-background rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden"
              data-ocid="email_capture.modal"
            >
              <div className="bg-primary px-6 pt-8 pb-6 text-center relative">
                <button
                  type="button"
                  onClick={handleClose}
                  className="absolute top-3 right-3 p-1 rounded-full text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10 transition-colors"
                  data-ocid="email_capture.close_button"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="text-4xl mb-2">🎁</div>
                <h2 className="text-2xl font-display font-bold text-primary-foreground mb-1">
                  Unlock 10% OFF Instantly
                </h2>
                <p className="text-primary-foreground/80 font-sans text-sm">
                  Join ThreadsHub VIP Club
                </p>
              </div>
              <div className="px-6 py-6">
                {!submitted ? (
                  <form onSubmit={handleSubmit}>
                    <p className="text-muted-foreground text-sm text-center mb-4">
                      Enter your email below and get your exclusive discount
                      code delivered instantly.
                    </p>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      data-ocid="email_capture.input"
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary mb-3"
                    />
                    <button
                      type="submit"
                      data-ocid="email_capture.submit_button"
                      className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:opacity-90 transition-opacity text-sm"
                    >
                      Get My 10% OFF Code →
                    </button>
                  </form>
                ) : (
                  <div
                    className="text-center"
                    data-ocid="email_capture.success_state"
                  >
                    <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-foreground mb-1">
                      Your code is ready!
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Use{" "}
                      <span className="font-bold text-primary">FIRST10</span> at
                      checkout for 10% OFF
                    </p>
                    <div className="flex gap-2 mb-4">
                      <div className="flex-1 bg-muted rounded-xl px-4 py-3 text-center font-mono font-bold text-foreground tracking-widest">
                        FIRST10
                      </div>
                      <button
                        type="button"
                        onClick={handleCopy}
                        data-ocid="email_capture.secondary_button"
                        className="px-4 py-3 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors flex items-center gap-1.5 text-sm font-semibold"
                      >
                        <Copy className="h-4 w-4" />
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        handleClose();
                        navigate({ to: "/shop" });
                      }}
                      data-ocid="email_capture.primary_button"
                      className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:opacity-90 transition-opacity text-sm"
                    >
                      Start Shopping
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Contact Us Modal ─────────────────────────────────────────────────────────
function ContactUsModal({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    bs.saveContact({
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: form.message,
      date: new Date().toISOString(),
    }).catch(() => {});
    const waMsg = encodeURIComponent(
      `Hi, I have a query:\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nMessage: ${form.message}`,
    );
    window.open(`https://wa.me/923174933882?text=${waMsg}`, "_blank");
    setSubmitted(true);
  };

  const handleClose = () => {
    setForm({ name: "", email: "", phone: "", message: "" });
    setSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[200]"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="bg-background rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden max-h-[90vh] overflow-y-auto"
              data-ocid="contact_us.modal"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="text-xl font-display font-bold text-foreground">
                  CONTACT US
                </h2>
                <button
                  type="button"
                  onClick={handleClose}
                  className="p-1 rounded-full hover:bg-muted transition-colors"
                  data-ocid="contact_us.close_button"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="px-6 py-6">
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <p className="text-muted-foreground text-sm mb-2">
                      We're here to help you!
                    </p>
                    <input
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="Your Name"
                      data-ocid="contact_us.input"
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="Email Address"
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      placeholder="Phone Number"
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <textarea
                      required
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      placeholder="Your Message / Comment"
                      rows={4}
                      data-ocid="contact_us.textarea"
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                    <button
                      type="submit"
                      data-ocid="contact_us.submit_button"
                      className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:opacity-90 transition-opacity text-sm mt-1"
                    >
                      Send Message
                    </button>
                  </form>
                ) : (
                  <div
                    className="text-center py-4"
                    data-ocid="contact_us.success_state"
                  >
                    <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-foreground mb-1">
                      Message Sent!
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Thanks! We'll get back to you soon.
                    </p>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="bg-primary text-primary-foreground font-bold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity text-sm"
                      data-ocid="contact_us.close_button"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Help Center Modal ────────────────────────────────────────────────────────
const HELP_ITEMS = [
  {
    id: "faqs",
    label: "FAQS",
    icon: "❓",
    content: `**Frequently Asked Questions**

Q: What payment methods do you accept?
A: We accept Cash on Delivery (COD), EasyPaisa, JazzCash, and Bank Transfer.

Q: How long does delivery take?
A: Standard delivery takes 3-5 business days across Pakistan.

Q: Can I track my order?
A: Yes! Use "Track Your Order" in our menu with your Order ID and phone number.

Q: What sizes do you offer?
A: We offer XS, S, M, L, XL, XXL for adults and age-based sizes for kids.

Q: Is Cash on Delivery available?
A: Yes, COD is available across Pakistan.`,
  },
  {
    id: "privacy",
    label: "PRIVACY POLICY",
    icon: "🔒",
    content:
      "ThreadsHub is committed to protecting your privacy. We collect your name, phone number, and address only to process and deliver your orders. We do not share your information with third parties. Your data is stored securely and used only for order fulfillment and customer support.",
  },
  {
    id: "shipping",
    label: "SHIPPING",
    icon: "📦",
    content:
      "• Standard delivery: 3-5 business days\n• Free delivery on orders above Rs. 2,000\n• Delivery available across Pakistan\n• Orders are dispatched within 24 hours of confirmation\n• You will receive a WhatsApp confirmation once your order is dispatched",
  },
  {
    id: "returns",
    label: "RETURN AND EXCHANGE",
    icon: "🔄",
    content:
      "• 7-day return/exchange policy from date of delivery\n• Item must be unused, unwashed, and in original packaging\n• To initiate a return, contact us on WhatsApp: 03174933882\n• Refunds processed within 3-5 business days after item received\n• Sale items are not eligible for return",
  },
  {
    id: "availability",
    label: "ITEM AVAILABILITY",
    icon: "🏷️",
    content: `• Stock levels are updated in real-time\n• Items marked "Only X left" have limited stock\n• If an item goes out of stock after your order, we will contact you within 24 hours\n• Pre-orders are available for popular items — contact us on WhatsApp`,
  },
  {
    id: "giftcards",
    label: "GIFT CARDS",
    icon: "🎁",
    content:
      "• ThreadsHub Gift Cards available in: Rs. 500, Rs. 1,000, Rs. 2,000, Rs. 5,000\n• Gift cards are delivered via WhatsApp within 1 hour\n• Valid for 1 year from date of purchase\n• Cannot be exchanged for cash\n• To purchase, contact us on WhatsApp: 03174933882",
  },
  {
    id: "terms",
    label: "TERMS & CONDITIONS",
    icon: "📋",
    content:
      "• By placing an order, you agree to our terms\n• Prices are in PKR and may change without notice\n• ThreadsHub reserves the right to cancel any order\n• Fraudulent orders will be reported to authorities\n• Customer is responsible for providing correct delivery address\n• ThreadsHub is not liable for delays caused by courier partners",
  },
  {
    id: "care",
    label: "CLOTHING CARE",
    icon: "👕",
    content:
      "• Machine wash cold with similar colors\n• Do not bleach\n• Tumble dry low\n• Iron on low heat\n• Dry clean for embroidered/heavy work items\n• Store in a cool, dry place\n• Do not wring or twist delicate fabrics",
  },
];

function HelpCenterModal({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const handleClose = () => {
    setActiveItem(null);
    onClose();
  };

  const current = HELP_ITEMS.find((i) => i.id === activeItem);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[200]"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="bg-background rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto overflow-hidden max-h-[90vh] flex flex-col"
              data-ocid="help_center.modal"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
                {activeItem ? (
                  <button
                    type="button"
                    onClick={() => setActiveItem(null)}
                    className="flex items-center gap-1.5 text-sm font-semibold text-primary"
                    data-ocid="help_center.secondary_button"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                ) : (
                  <div>
                    <h2 className="text-lg font-display font-bold text-foreground">
                      FAQ! Need Help?
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      We've got you covered
                    </p>
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleClose}
                  className="p-1 rounded-full hover:bg-muted transition-colors"
                  data-ocid="help_center.close_button"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1">
                {!activeItem ? (
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {HELP_ITEMS.map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => setActiveItem(item.id)}
                          data-ocid={`help_center.${item.id}.button`}
                          className="flex flex-col items-center gap-2 p-4 border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-center group"
                        >
                          <span className="text-2xl">{item.icon}</span>
                          <span className="text-xs font-bold text-foreground/80 group-hover:text-primary uppercase tracking-wide leading-tight">
                            {item.label}
                          </span>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      See Our Most Frequently Asked Questions Below
                    </p>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">{current?.icon}</span>
                      <h3 className="text-base font-bold text-foreground">
                        {current?.label}
                      </h3>
                    </div>
                    <div className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                      {current?.content}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Track Order Modal ────────────────────────────────────────────────────────
type OrderStatus = "pending" | "confirmed" | "dispatched" | "delivered";

const STATUS_STEPS: OrderStatus[] = [
  "pending",
  "confirmed",
  "dispatched",
  "delivered",
];
const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Order Placed",
  confirmed: "Confirmed",
  dispatched: "Dispatched",
  delivered: "Delivered",
};
const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  dispatched: "bg-purple-100 text-purple-800 border-purple-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
};

interface OrderRecord {
  id: string;
  phone: string;
  email?: string;
  total: number;
  status: OrderStatus;
  items: { name: string; qty: number; price: number }[];
  createdAt: string;
  name: string;
  city: string;
}

function TrackOrderModal({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OrderRecord | "not_found" | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = orderId.trim();
    if (!trimmed) return;
    setLoading(true);
    try {
      const found = await bs.fetchOrderById(trimmed);
      if (found) {
        setResult({
          id: found.id,
          phone: found.phone,
          email: found.email,
          total: found.grandTotal,
          status: found.status as OrderStatus,
          items: found.items.map((i) => ({
            name: i.productName,
            qty: i.qty,
            price: i.price,
          })),
          createdAt: found.date,
          name: found.customerName,
          city: found.city,
        });
      } else {
        setResult("not_found");
      }
    } catch {
      setResult("not_found");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOrderId("");
    setResult(null);
    onClose();
  };

  const currentStatusIdx =
    result && result !== "not_found" ? STATUS_STEPS.indexOf(result.status) : -1;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[200]"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="bg-background rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden max-h-[90vh] overflow-y-auto"
              data-ocid="track_order.modal"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-display font-bold text-foreground">
                    Track Your Order
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="p-1 rounded-full hover:bg-muted transition-colors"
                  data-ocid="track_order.close_button"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="px-6 py-6">
                {!result ? (
                  <form onSubmit={handleTrack} className="flex flex-col gap-3">
                    <p className="text-muted-foreground text-sm mb-2">
                      Enter your Order ID to check your order status.
                    </p>
                    <input
                      required
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      placeholder="Enter your Order ID (e.g. TH-123456)"
                      data-ocid="track_order.input"
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      data-ocid="track_order.submit_button"
                      className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:opacity-90 transition-opacity text-sm disabled:opacity-60"
                    >
                      {loading ? "Searching..." : "Track Order"}
                    </button>
                  </form>
                ) : result === "not_found" ? (
                  <div
                    className="text-center"
                    data-ocid="track_order.error_state"
                  >
                    <div className="text-4xl mb-3">❌</div>
                    <h3 className="text-base font-bold text-foreground mb-1">
                      Order not found
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      No order found with this ID. Please check the Order ID
                      from your confirmation screen.
                    </p>
                    <div className="flex gap-2 justify-center flex-wrap">
                      <button
                        type="button"
                        onClick={() => setResult(null)}
                        className="px-4 py-2 border border-border rounded-xl text-sm font-semibold hover:bg-muted transition-colors"
                      >
                        Try Again
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          window.open("https://wa.me/923174933882", "_blank")
                        }
                        data-ocid="track_order.secondary_button"
                        className="px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors"
                      >
                        Contact Us
                      </button>
                    </div>
                  </div>
                ) : (
                  <div data-ocid="track_order.success_state">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span className="font-bold text-green-600">
                        Order Found!
                      </span>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4 mb-4 space-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Order</span>
                        <span className="font-bold">#{result.id}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Status</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-bold border ${STATUS_COLORS[result.status]}`}
                        >
                          {result.status.charAt(0).toUpperCase() +
                            result.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Customer</span>
                        <span className="font-medium">{result.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">City</span>
                        <span className="font-medium">{result.city}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total</span>
                        <span className="font-bold text-primary">
                          Rs. {result.total.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ordered</span>
                        <span className="font-medium text-xs">
                          {new Date(result.createdAt).toLocaleDateString(
                            "en-PK",
                            { year: "numeric", month: "short", day: "numeric" },
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">
                        Items
                      </p>
                      {result.items.map((item, i) => (
                        <div
                          // biome-ignore lint/suspicious/noArrayIndexKey: order items have no stable id
                          key={i}
                          className="flex justify-between text-sm py-1.5 border-b border-border/40 last:border-0"
                        >
                          <span className="text-foreground/80">
                            {item.name} × {item.qty}
                          </span>
                          <span className="font-medium">
                            Rs. {(item.price * item.qty).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">
                        Order Timeline
                      </p>
                      {STATUS_STEPS.map((step, idx) => (
                        <div key={step} className="flex items-center gap-2.5">
                          <div
                            className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${
                              idx <= currentStatusIdx
                                ? "bg-primary border-primary"
                                : "bg-muted border-border"
                            }`}
                          />
                          <span
                            className={`text-sm ${
                              idx <= currentStatusIdx
                                ? "text-foreground font-medium"
                                : "text-muted-foreground"
                            }`}
                          >
                            {STATUS_LABELS[step]}
                            {idx <= currentStatusIdx && " ✓"}
                          </span>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setResult(null)}
                      className="mt-4 w-full py-2.5 border border-border rounded-xl text-sm font-semibold hover:bg-muted transition-colors"
                    >
                      Track Another Order
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
export default function Navbar() {
  const { cartCount } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useStore();
  const storeName = settings.storeName || "ThreadsHub";

  const isProductPage = location.pathname.startsWith("/product/");

  // Scroll detection for transparent navbar on product pages
  useEffect(() => {
    if (!isProductPage) {
      setScrolled(false);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isProductPage]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: setDrawerOpen is stable
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const nameFirst = storeName.slice(0, storeName.length - 3);
  const nameLast = storeName.slice(-3);

  const handleNavClick = (link: (typeof NAV_LINKS)[0]) => {
    setDrawerOpen(false);
    if (link.search) {
      navigate({
        to: link.to,
        search: link.search as unknown as Record<string, string>,
      });
    } else {
      navigate({ to: link.to });
    }
  };

  // On product page, navbar floats over image (fixed + transparent → opaque on scroll)
  // On other pages: sticky + always opaque
  const isTransparent = isProductPage && !scrolled;

  const headerClass = isProductPage
    ? `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent border-b border-transparent"
          : "bg-background/95 backdrop-blur-sm border-b border-border shadow-sm"
      }`
    : "fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border transition-all duration-300";

  const iconColor = isTransparent
    ? "text-white hover:text-white/80"
    : "hover:text-primary";
  const logoColor = isTransparent ? "text-white" : "text-foreground";
  const logoPrimaryColor = isTransparent ? "text-white/90" : "text-primary";

  return (
    <>
      <header className={headerClass}>
        <AnnouncementBar />
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Hamburger (mobile) + Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className={`lg:hidden p-2 -ml-1 transition-colors ${iconColor}`}
              onClick={() => setDrawerOpen((v) => !v)}
              aria-label="Toggle menu"
              data-ocid="nav.menu.button"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-0 flex-shrink-0"
            >
              <span
                className={`font-display text-2xl font-bold tracking-tight transition-colors ${logoColor}`}
              >
                {nameFirst}
              </span>
              <span
                className={`font-display text-2xl font-bold tracking-tight transition-colors ${logoPrimaryColor}`}
              >
                {nameLast}
              </span>
            </Link>
          </div>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.to === "/" && link.exact
                  ? location.pathname === "/"
                  : location.pathname === link.to &&
                    (!link.search ||
                      Object.entries(link.search).every(
                        ([k, v]) =>
                          new URLSearchParams(location.search).get(k) === v,
                      ));
              return (
                <button
                  type="button"
                  key={link.label}
                  onClick={() => handleNavClick(link)}
                  data-ocid={`nav.${link.label.toLowerCase().replace(/\s+/g, "_")}.link`}
                  className={`text-sm font-sans font-semibold uppercase tracking-widest transition-colors whitespace-nowrap ${
                    isActive
                      ? isTransparent
                        ? "text-white border-b-2 border-white pb-0.5"
                        : "text-foreground border-b-2 border-primary pb-0.5"
                      : isTransparent
                        ? "text-white/80 hover:text-white"
                        : "text-foreground/60 hover:text-foreground"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Right: Search + Email + Cart */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => navigate({ to: "/shop" })}
              aria-label="Search"
              data-ocid="nav.search.button"
              className={`p-2 transition-colors ${iconColor}`}
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => setEmailModalOpen(true)}
              aria-label="Subscribe for discount"
              data-ocid="nav.email.button"
              className={`p-2 transition-colors ${iconColor}`}
            >
              <Mail className="h-5 w-5" />
            </button>

            <Link
              to="/cart"
              data-ocid="nav.cart_button"
              className={`relative p-2 transition-colors ${iconColor}`}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span
                  className={`absolute -top-1 -right-1 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ${
                    isTransparent
                      ? "bg-white text-black"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
          </div>
        </nav>
      </header>

      {/* Spacer: only on non-product pages (where navbar is sticky it takes space naturally;
          on product pages navbar is fixed so page content starts at top) */}
      {!isProductPage && <div className="h-[104px]" />}

      {/* ── Left Drawer (mobile) ────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="drawer-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-[100] lg:hidden"
              onClick={() => setDrawerOpen(false)}
            />

            <motion.div
              key="drawer-panel"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              className="fixed top-0 left-0 h-full z-[101] bg-background shadow-2xl flex flex-col lg:hidden"
              style={{ width: "min(80vw, 320px)" }}
              data-ocid="nav.drawer.panel"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <Link
                  to="/"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-0"
                >
                  <span className="font-display text-xl font-bold tracking-tight text-foreground">
                    {nameFirst}
                  </span>
                  <span className="font-display text-xl font-bold tracking-tight text-primary">
                    {nameLast}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 rounded-full hover:bg-muted transition-colors"
                  data-ocid="nav.drawer.close_button"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="px-4 py-3">
                  {NAV_LINKS.map((link) => (
                    <button
                      type="button"
                      key={link.label}
                      onClick={() => handleNavClick(link)}
                      data-ocid={`nav.mobile.${link.label.toLowerCase().replace(/\s+/g, "_")}.link`}
                      className="w-full text-left text-sm font-sans font-semibold uppercase tracking-widest text-foreground/70 hover:text-foreground hover:bg-muted/60 transition-colors py-3 px-3 rounded-lg"
                    >
                      {link.label}
                    </button>
                  ))}
                </div>

                <div className="mx-4 my-1 border-t border-border" />

                <div className="px-4 py-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDrawerOpen(false);
                      setContactModalOpen(true);
                    }}
                    data-ocid="nav.contact_us.button"
                    className="w-full text-left flex items-center gap-3 text-sm font-sans font-semibold text-foreground/70 hover:text-foreground hover:bg-muted/60 transition-colors py-3 px-3 rounded-lg"
                  >
                    <MessageSquare className="h-4 w-4 text-primary flex-shrink-0" />
                    Contact Us
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDrawerOpen(false);
                      setHelpModalOpen(true);
                    }}
                    data-ocid="nav.help.button"
                    className="w-full text-left flex items-center gap-3 text-sm font-sans font-semibold text-foreground/70 hover:text-foreground hover:bg-muted/60 transition-colors py-3 px-3 rounded-lg"
                  >
                    <HelpCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    Help
                  </button>
                </div>

                <div className="mx-4 my-1 border-t border-border" />

                <div className="px-4 py-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDrawerOpen(false);
                      setTrackModalOpen(true);
                    }}
                    data-ocid="nav.track_order.button"
                    className="w-full text-left flex items-center gap-3 text-sm font-sans font-semibold text-foreground/70 hover:text-foreground hover:bg-muted/60 transition-colors py-3 px-3 rounded-lg"
                  >
                    <Package className="h-4 w-4 text-primary flex-shrink-0" />
                    Track Your Order
                  </button>
                </div>
              </div>

              <div className="px-4 py-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="w-full py-2.5 border border-border rounded-xl text-sm font-semibold text-foreground/60 hover:bg-muted transition-colors"
                  data-ocid="nav.drawer.close_button"
                >
                  Close Menu
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <EmailCaptureModal
        open={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
      />
      <ContactUsModal
        open={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
      <HelpCenterModal
        open={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
      />
      <TrackOrderModal
        open={trackModalOpen}
        onClose={() => setTrackModalOpen(false)}
      />
    </>
  );
}
