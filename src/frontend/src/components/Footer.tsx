import { Link } from "@tanstack/react-router";
import { Package, RefreshCw, ShieldCheck } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const utmUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="border-t border-border bg-secondary/30 py-16 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="font-display text-xl font-bold">
              Threads<span className="text-primary">Hub</span>
            </span>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
              Quality clothing for every age — from newborns to adults. Style
              that grows with your family.
            </p>
            <p className="mt-3 text-sm text-muted-foreground italic max-w-xs">
              ThreadsHub delivers premium fashion for men, women &amp; kids
              across Pakistan. Designed for comfort, built for style.
            </p>
            <p className="mt-3 text-sm font-semibold text-foreground">
              📞 0317-4933882
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="https://wa.me/923174933882"
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="footer.whatsapp.button"
                className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center hover:bg-green-700 transition-colors"
                aria-label="WhatsApp"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="w-4 h-4"
                  role="img"
                  aria-label="WhatsApp"
                >
                  <title>WhatsApp</title>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-3">
              Shop
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Men", cat: "Men" },
                { label: "Women", cat: "Women" },
                { label: "Boys", cat: "Boys" },
                { label: "Girls", cat: "Girls" },
                { label: "Baby", cat: "Baby" },
              ].map((item) => (
                <li key={item.cat}>
                  <Link
                    to="/shop"
                    search={{ category: item.cat }}
                    data-ocid={`footer.${item.cat.toLowerCase()}.link`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/shop"
                  search={{ filter: "new" }}
                  data-ocid="footer.new-arrivals.link"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  search={{ filter: "bestseller" }}
                  data-ocid="footer.best-sellers.link"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-3">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/about"
                  data-ocid="footer.about.link"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  data-ocid="footer.contact.link"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/923174933882"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="footer.whatsapp-support.link"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-3">
              Policies
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/service-policy"
                  data-ocid="footer.shipping-policy.link"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/refund-policy"
                  data-ocid="footer.refund-policy.link"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/refund-policy"
                  data-ocid="footer.returns.link"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Returns &amp; Exchanges
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  data-ocid="footer.privacy-policy.link"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Badges Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 py-6 border-t border-b border-border mb-6">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Package className="h-4 w-4 text-primary" /> Cash on Delivery
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <RefreshCw className="h-4 w-4 text-primary" /> Easy Returns
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" /> Secure Checkout
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-2">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {year} ThreadsHub. All rights reserved.</p>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <span className="text-xs text-muted-foreground">We accept:</span>
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                VISA
              </span>
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                MC
              </span>
              <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                JazzCash
              </span>
              <span className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                Easypaisa
              </span>
              <span className="bg-gray-700 text-white text-xs font-bold px-2 py-0.5 rounded">
                COD
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/privacy-policy"
                data-ocid="footer.bottom.privacy-policy.link"
                className="hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/refund-policy"
                data-ocid="footer.bottom.refund-policy.link"
                className="hover:text-foreground transition-colors"
              >
                Refund Policy
              </Link>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Built with ❤️ using{" "}
            <a
              href={utmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
