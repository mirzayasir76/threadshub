import { Link } from "@tanstack/react-router";
import {
  Eye,
  Lock,
  Mail,
  Phone,
  Share2,
  Shield,
  UserCheck,
} from "lucide-react";
import { motion } from "motion/react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-secondary/30 border-b border-border py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">Last updated: January 2025</p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <p className="text-muted-foreground leading-relaxed">
            At ThreadsHub, we value your trust and are committed to protecting
            your personal information. This Privacy Policy explains what
            information we collect, how we use it, and your rights regarding
            your data when you shop with us.
          </p>
        </motion.section>

        {/* Section 1 */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Eye className="h-5 w-5 text-primary" />
            </div>
            <h2 className="font-display text-xl font-bold">
              1. Information We Collect
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            When you place an order with ThreadsHub, we collect the following
            information:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                <strong className="text-foreground">Full Name</strong> — to
                address and identify your order
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                <strong className="text-foreground">Phone Number</strong> — so
                we and the courier can contact you for delivery
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                <strong className="text-foreground">Delivery Address</strong> —
                to dispatch your order to the correct location
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                <strong className="text-foreground">City</strong> — to calculate
                delivery charges and estimate delivery time
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                <strong className="text-foreground">Order Details</strong> —
                items purchased, sizes, quantities, and payment method
              </span>
            </li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            We do <strong className="text-foreground">not</strong> collect
            credit/debit card numbers, passwords, or any financial account
            information.
          </p>
        </motion.section>

        {/* Section 2 */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <UserCheck className="h-5 w-5 text-primary" />
            </div>
            <h2 className="font-display text-xl font-bold">
              2. How We Use Your Information
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Your information is used strictly for the following purposes:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Processing and fulfilling your orders</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                Communicating order status updates via WhatsApp or phone call
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                Handing your delivery details to our courier partner for
                dispatch
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                Resolving customer support issues or returns/exchanges
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                Occasionally sending you exclusive offers or new arrival updates
                (you can opt out anytime)
              </span>
            </li>
          </ul>
        </motion.section>

        {/* Section 3 */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Share2 className="h-5 w-5 text-primary" />
            </div>
            <h2 className="font-display text-xl font-bold">
              3. Sharing of Information
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            ThreadsHub does <strong className="text-foreground">not</strong>{" "}
            sell, rent, or share your personal information with any third
            parties for marketing purposes.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            The only exception is your delivery information (name, phone,
            address, city) which is shared with our trusted courier partners
            (such as TCS, Leopards, or CallCourier) solely for the purpose of
            delivering your order. These courier companies are bound by their
            own privacy obligations and will not use your data for any other
            purpose.
          </p>
        </motion.section>

        {/* Section 4 */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <h2 className="font-display text-xl font-bold">4. Data Security</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            We take reasonable precautions to protect your information from
            unauthorized access, alteration, disclosure, or destruction. Your
            order data is stored securely within our platform and only
            accessible to authorized ThreadsHub team members.
          </p>
        </motion.section>

        {/* Section 5 */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <h2 className="font-display text-xl font-bold">5. Your Rights</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            You have the right to:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                Request access to the personal information we hold about you
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Request correction or deletion of your personal data</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Opt out of any promotional communications from us</span>
            </li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            To exercise any of these rights, please contact us via WhatsApp or
            email.
          </p>
        </motion.section>

        {/* Contact */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-secondary/30 border border-border rounded-lg p-6 space-y-4"
        >
          <h2 className="font-display text-xl font-bold">Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions about this Privacy Policy, please reach
            out to us:
          </p>
          <div className="space-y-3">
            <a
              href="https://wa.me/923174933882"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm font-medium hover:text-primary transition-colors"
            >
              <Phone className="h-4 w-4 text-green-600" />
              WhatsApp: 0317-4933882
            </a>
            <a
              href="mailto:mirzayasir592@gmail.com"
              className="flex items-center gap-3 text-sm font-medium hover:text-primary transition-colors"
            >
              <Mail className="h-4 w-4 text-primary" />
              mirzayasir592@gmail.com
            </a>
          </div>
        </motion.section>

        {/* Back links */}
        <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to Home
          </Link>
          <Link
            to="/refund-policy"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Refund Policy
          </Link>
          <Link
            to="/service-policy"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Service Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
