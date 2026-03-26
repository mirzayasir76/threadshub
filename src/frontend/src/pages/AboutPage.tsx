import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  Heart,
  Package,
  RotateCcw,
  ShieldCheck,
  Star,
  Truck,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

const values = [
  {
    icon: <Star className="h-6 w-6 text-primary" />,
    title: "Premium Quality",
    desc: "Every garment is carefully selected for fabric quality, stitching, and durability — clothes that last.",
  },
  {
    icon: <Truck className="h-6 w-6 text-primary" />,
    title: "Fast Nationwide Delivery",
    desc: "We deliver across all of Pakistan within 3–5 business days through trusted courier partners.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-primary" />,
    title: "Cash on Delivery",
    desc: "Pay when you receive your order. No upfront risk — your satisfaction comes first.",
  },
  {
    icon: <RotateCcw className="h-6 w-6 text-primary" />,
    title: "Easy Returns",
    desc: "Not happy? We offer hassle-free returns and exchanges so you always get what you love.",
  },
  {
    icon: <Package className="h-6 w-6 text-primary" />,
    title: "Affordable PKR Prices",
    desc: "Real market-fair prices in Pakistani Rupees. Quality fashion that doesn't break the bank.",
  },
  {
    icon: <Users className="h-6 w-6 text-primary" />,
    title: "For Every Family Member",
    desc: "From newborns to adults — Men, Women, Boys, Girls, and Babies. One store for the whole family.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-secondary/30 border-b border-border py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="h-6 w-6 text-primary" fill="currentColor" />
              <span className="text-sm font-semibold text-primary uppercase tracking-widest">
                Our Story
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
              Threads<span className="text-primary">Hub</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              A Pakistan-based clothing brand built with one mission: bring
              quality, stylish, and affordable fashion to every family — from
              newborns to adults.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Story section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="prose prose-neutral max-w-none"
        >
          <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
            <div className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl font-bold">
                How We Started
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                ThreadsHub was born from a simple frustration — finding
                high-quality, fairly-priced clothing for the whole family in
                Pakistan shouldn't be this hard.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We started with a small but thoughtfully curated collection of
                garments for men, women, and children. Every piece was chosen
                with care: the right fabric, proper stitching, and styles that
                actually look good in everyday life.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today, ThreadsHub serves customers across all of Pakistan — from
                Karachi to Lahore, Islamabad to Peshawar — delivering quality
                clothing right to your doorstep.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-10 text-center border border-primary/20">
              <div className="space-y-6">
                <div>
                  <p className="font-display text-5xl font-bold text-primary">
                    12+
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Premium Products
                  </p>
                </div>
                <div className="border-t border-primary/20 pt-6">
                  <p className="font-display text-5xl font-bold text-primary">
                    5
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Categories for Every Age
                  </p>
                </div>
                <div className="border-t border-primary/20 pt-6">
                  <p className="font-display text-5xl font-bold text-primary">
                    COD
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Nationwide Pakistan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Why Choose Us */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-10">
            Why Choose ThreadsHub?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 + i * 0.07 }}
                className="bg-card border border-border rounded-xl p-6 space-y-3 hover:border-primary/40 transition-colors"
              >
                <div className="w-11 h-11 bg-primary/10 rounded-lg flex items-center justify-center">
                  {v.icon}
                </div>
                <h3 className="font-semibold text-base">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 text-center bg-primary/5 border border-primary/20 rounded-2xl py-12 px-8"
        >
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">
            Ready to Shop?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Explore our full collection and find the perfect styles for every
            member of your family.
          </p>
          <Link to="/shop" data-ocid="about.shop.primary_button">
            <Button className="bg-primary text-primary-foreground px-8 py-3 font-semibold text-base">
              Shop Now
            </Button>
          </Link>
        </motion.div>

        {/* Back link */}
        <div className="mt-10 pt-6 border-t border-border">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
