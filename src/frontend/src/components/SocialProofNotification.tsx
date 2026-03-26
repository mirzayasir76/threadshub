import { Flame } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const NOTIFICATIONS = [
  "Ali from Lahore just bought Classic Oxford Shirt",
  "Fatima from Karachi just ordered Floral Blouse",
  "Bilal from Islamabad just bought Slim Fit Denim",
  "Sara from Faisalabad just ordered Boys Polo Shirt",
  "Ahmed from Peshawar just bought Baby Onesie Set",
];

export default function SocialProofNotification() {
  const [current, setCurrent] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let index = 0;

    const show = () => {
      setCurrent(index % NOTIFICATIONS.length);
      setVisible(true);
      index++;

      // Hide after 4s
      setTimeout(() => setVisible(false), 4000);
    };

    // First show after 3s delay
    const initialTimer = setTimeout(() => {
      show();
      // Then every 8s
      const interval = setInterval(show, 8000);
      return () => clearInterval(interval);
    }, 3000);

    return () => clearTimeout(initialTimer);
  }, []);

  return (
    <div className="fixed bottom-24 left-4 z-40 pointer-events-none">
      <AnimatePresence mode="wait">
        {visible && current !== null && (
          <motion.div
            key={current}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="bg-card border border-border shadow-lg rounded-lg px-4 py-3 flex items-center gap-3 max-w-[280px]"
            data-ocid="social_proof.toast"
          >
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
              <Flame className="h-4 w-4 text-orange-500" />
            </div>
            <p className="font-sans text-xs text-foreground leading-snug">
              {NOTIFICATIONS[current]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
