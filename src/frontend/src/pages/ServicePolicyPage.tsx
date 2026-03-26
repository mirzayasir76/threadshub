import { Link } from "@tanstack/react-router";
import { ArrowLeft, Clock, MapPin, Package, Phone } from "lucide-react";

export default function ServicePolicyPage() {
  return (
    <main
      className="max-w-2xl mx-auto px-4 py-12"
      data-ocid="service-policy.page"
    >
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        data-ocid="service-policy.link"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <h1 className="text-3xl font-bold mb-2">Service Policy</h1>
      <p className="text-muted-foreground mb-8">
        ThreadsHub is committed to providing quality products and excellent
        service to all our customers across Pakistan.
      </p>

      <div className="space-y-6">
        <div className="border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-bold">Order Processing</h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            All orders are processed within 24 hours of placement. You will
            receive a confirmation once your order has been packed and
            dispatched. Orders placed on weekends or public holidays will be
            processed on the next business day.
          </p>
        </div>

        <div className="border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-green-600" />
            </div>
            <h2 className="text-lg font-bold">Delivery</h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            We deliver nationwide across Pakistan within 3–7 business days. Cash
            on Delivery (COD) is available at all locations. Delivery timelines
            may vary slightly for remote areas. We work with trusted courier
            partners to ensure your order arrives safely.
          </p>
        </div>

        <div className="border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
              <Package className="h-5 w-5 text-purple-600" />
            </div>
            <h2 className="text-lg font-bold">Product Quality</h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Every item at ThreadsHub is carefully quality-checked before
            dispatch. We ensure that all garments meet our standards for
            stitching, fabric quality, and sizing accuracy. If you receive a
            defective or incorrect item, please contact us immediately.
          </p>
        </div>

        <div className="border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
              <Phone className="h-5 w-5 text-orange-600" />
            </div>
            <h2 className="text-lg font-bold">Customer Support</h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Our customer support team is available to assist you. You can reach
            us via WhatsApp at{" "}
            <a
              href="https://wa.me/923174933882"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold underline underline-offset-2"
            >
              0317-4933882
            </a>
            . We typically respond within a few hours during business hours
            (Mon–Sat, 9am–7pm).
          </p>
        </div>
      </div>

      <div className="mt-10 text-center">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
          data-ocid="service-policy.primary_button"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}
