import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  MessageCircle,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";

export default function RefundPolicyPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [productName, setProductName] = useState("");

  const handleRefundWhatsApp = () => {
    const order = orderNumber.trim() || "N/A";
    const product = productName.trim() || "N/A";
    const message = `Hello ThreadsHub! I would like to request a refund.\n\nOrder Number: ${order}\nProduct: ${product}\n\nPlease guide me through the refund process. Thank you.`;
    const url = `https://wa.me/923174933882?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <main
      className="max-w-2xl mx-auto px-4 py-12"
      data-ocid="refund-policy.page"
    >
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        data-ocid="refund-policy.link"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <h1 className="text-3xl font-bold mb-2">Refund Policy</h1>
      <p className="text-muted-foreground mb-8">
        We want you to be completely satisfied with your purchase. If you're not
        happy, here's how we handle returns and refunds.
      </p>

      <div className="space-y-6">
        <div className="border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-bold">Return Window</h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            You have{" "}
            <strong className="text-foreground">
              7 days from the date of delivery
            </strong>{" "}
            to request a return. After this period, we are unable to process
            return requests. Please ensure you initiate your return request as
            soon as possible if you are unhappy with your order.
          </p>
        </div>

        <div className="border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <h2 className="text-lg font-bold">Eligible Items</h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed mb-3">
            To be eligible for a return, items must meet the following
            conditions:
          </p>
          <ul className="space-y-2 text-sm">
            {[
              "Item must be unused and in original condition",
              "Original tags must still be attached",
              "Must be in original packaging",
              "Item must not show signs of wear, wash, or damage",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-muted-foreground"
              >
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-purple-600" />
            </div>
            <h2 className="text-lg font-bold">Return Process</h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            To initiate a return, fill in your order details below and tap the
            WhatsApp button. Your refund request message will be sent directly
            to our team.
          </p>
        </div>

        {/* Refund Request Form */}
        <div className="border-2 border-green-200 bg-green-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-green-800">
                Apply for Refund
              </h2>
              <p className="text-xs text-green-600">
                Fill your order details and send via WhatsApp
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <div>
              <label
                htmlFor="refund-order-number"
                className="block text-sm font-semibold text-green-800 mb-1"
              >
                Order Number
              </label>
              <input
                id="refund-order-number"
                type="text"
                placeholder="e.g. TH-1001"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full border border-green-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
                data-ocid="refund-policy.input"
              />
            </div>
            <div>
              <label
                htmlFor="refund-product-name"
                className="block text-sm font-semibold text-green-800 mb-1"
              >
                Product Name
              </label>
              <input
                id="refund-product-name"
                type="text"
                placeholder="e.g. Classic White Oxford Shirt"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full border border-green-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
                data-ocid="refund-policy.input"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleRefundWhatsApp}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl transition-colors text-sm"
            data-ocid="refund-policy.primary_button"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-current"
              aria-hidden="true"
            >
              <title>WhatsApp</title>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.374 0 0 5.373 0 12c0 2.117.549 4.107 1.508 5.84L.057 23.428a.75.75 0 0 0 .915.915l5.588-1.451A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.502-5.178-1.381l-.362-.214-3.754.975.995-3.645-.235-.374A9.96 9.96 0 0 1 2 12C2 6.478 6.477 2 12 2s10 4.478 10 10-4.477 10-10 10z" />
            </svg>
            Send Refund Request on WhatsApp
          </button>

          <p className="text-xs text-green-700 text-center mt-2">
            Your message will be pre-filled and sent to 0317-4933882
          </p>
        </div>

        <div className="border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
              <RotateCcw className="h-5 w-5 text-orange-600" />
            </div>
            <h2 className="text-lg font-bold">Refund Timeline</h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Once your return is received and inspected, we will notify you of
            the approval status. Approved refunds are processed within{" "}
            <strong className="text-foreground">3–5 business days</strong>. For
            COD orders, the refund will be sent via EasyPaisa or JazzCash to the
            number you provide.
          </p>
        </div>

        <div className="border border-red-100 bg-red-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-lg font-bold text-red-700">
              Non-Returnable Items
            </h2>
          </div>
          <ul className="space-y-2 text-sm">
            {[
              "Sale or discounted items",
              "Items that have been worn or washed",
              "Items damaged due to customer misuse",
              "Items returned after the 7-day window",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-red-700">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10 text-center">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
          data-ocid="refund-policy.secondary_button"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}
