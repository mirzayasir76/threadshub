import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill all fields");
      return;
    }
    // Pre-fill WhatsApp message
    const msg = encodeURIComponent(
      `Hi ThreadsHub! My name is ${form.name} (${form.email}).\n\n${form.message}`,
    );
    window.open(`https://wa.me/923174933882?text=${msg}`, "_blank");
    setSubmitted(true);
    toast.success("Opening WhatsApp with your message!");
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Get In Touch
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mt-2">
            Contact Us
          </h1>
          <p className="text-muted-foreground mt-3 font-sans text-base max-w-lg mx-auto">
            Have a question, need help with an order, or just want to say hello?
            We're here for you!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Info */}
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-2xl font-bold mb-6">
                Store Information
              </h2>
              <div className="space-y-5">
                <div
                  className="flex items-start gap-4"
                  data-ocid="contact.address.card"
                >
                  <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Address</p>
                    <p className="text-muted-foreground text-sm mt-0.5">
                      Lahore, Punjab, Pakistan
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-start gap-4"
                  data-ocid="contact.whatsapp.card"
                >
                  <div className="w-10 h-10 rounded-sm bg-green-100 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">WhatsApp</p>
                    <a
                      href="https://wa.me/923174933882"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-ocid="contact.whatsapp.link"
                      className="text-green-600 hover:underline text-sm mt-0.5 block"
                    >
                      0317-4933882
                    </a>
                    <p className="text-xs text-muted-foreground">
                      Click to open chat directly
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-start gap-4"
                  data-ocid="contact.phone.card"
                >
                  <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Phone</p>
                    <p className="text-muted-foreground text-sm mt-0.5">
                      0317-4933882
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-start gap-4"
                  data-ocid="contact.email.card"
                >
                  <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Email</p>
                    <p className="text-muted-foreground text-sm mt-0.5">
                      support@threadshub.pk
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-start gap-4"
                  data-ocid="contact.hours.card"
                >
                  <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      Business Hours
                    </p>
                    <p className="text-muted-foreground text-sm mt-0.5">
                      Monday – Saturday: 10:00 AM – 8:00 PM
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Sunday: 12:00 PM – 6:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "🚚", title: "Free Delivery", desc: "Above Rs. 2,000" },
                {
                  icon: "💰",
                  title: "Cash on Delivery",
                  desc: "Pay when you receive",
                },
                {
                  icon: "↩️",
                  title: "Easy Returns",
                  desc: "7-day return policy",
                },
                {
                  icon: "🔒",
                  title: "Secure Checkout",
                  desc: "100% safe & trusted",
                },
              ].map((b) => (
                <div
                  key={b.title}
                  className="bg-secondary/50 rounded-sm p-3 text-center"
                >
                  <div className="text-2xl mb-1">{b.icon}</div>
                  <p className="font-semibold text-xs">{b.title}</p>
                  <p className="text-xs text-muted-foreground">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <div>
            <h2 className="font-display text-2xl font-bold mb-6">
              Send Us a Message
            </h2>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 rounded-sm p-8 text-center"
                data-ocid="contact.success_state"
              >
                <MessageCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold text-green-800 mb-2">
                  Message Sent!
                </h3>
                <p className="text-green-700 text-sm">
                  Your message has been opened in WhatsApp. Send it to reach us
                  directly.
                </p>
                <Button
                  onClick={() => setSubmitted(false)}
                  variant="outline"
                  className="mt-4"
                  data-ocid="contact.reset.button"
                >
                  Send Another Message
                </Button>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
                data-ocid="contact.form"
              >
                <div className="space-y-1">
                  <Label htmlFor="contact-name">Full Name *</Label>
                  <Input
                    id="contact-name"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    data-ocid="contact.name.input"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="contact-email">Email Address *</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                    data-ocid="contact.email.input"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="contact-message">Message *</Label>
                  <Textarea
                    id="contact-message"
                    placeholder="Tell us how we can help you..."
                    value={form.message}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, message: e.target.value }))
                    }
                    rows={5}
                    data-ocid="contact.message.textarea"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  data-ocid="contact.submit_button"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Send via WhatsApp
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Your message will open in WhatsApp — send it to reach us.
                </p>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </main>
  );
}
