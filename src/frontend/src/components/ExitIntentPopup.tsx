import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const { settings } = useStore();
  const popupCode = settings.popupCode || "SUMMER26";

  useEffect(() => {
    if (sessionStorage.getItem("exitPopupShown")) return;

    let lastScrollY = window.scrollY;

    const timer = setTimeout(() => {
      if (!sessionStorage.getItem("exitPopupShown")) {
        setVisible(true);
        sessionStorage.setItem("exitPopupShown", "1");
      }
    }, 10000);

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setVisible(true);
        sessionStorage.setItem("exitPopupShown", "1");
        document.removeEventListener("mouseleave", handleMouseLeave);
      }
    };

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = lastScrollY - currentY;
      if (delta > 60 && currentY > 200) {
        setVisible(true);
        sessionStorage.setItem("exitPopupShown", "1");
        window.removeEventListener("scroll", handleScroll);
      }
      lastScrollY = currentY;
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleShopNow = () => {
    sessionStorage.setItem("pendingDiscount", popupCode);
    setVisible(false);
    navigate({ to: "/shop" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="exit-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.72)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setVisible(false);
          }}
          data-ocid="exit_popup.modal"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative bg-card rounded-lg shadow-2xl max-w-sm w-full overflow-hidden"
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-primary via-orange-400 to-primary" />

            <button
              type="button"
              onClick={() => setVisible(false)}
              data-ocid="exit_popup.close_button"
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-secondary hover:bg-secondary/70 text-muted-foreground transition-colors"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="p-8 text-center space-y-5">
              <div className="text-5xl">🎁</div>
              <div className="space-y-2">
                <h2 className="font-display text-2xl font-bold leading-tight">
                  Wait! Don't Leave Yet
                </h2>
                <p className="text-muted-foreground font-sans">
                  Get <strong className="text-foreground">10% OFF</strong> your
                  first order
                </p>
              </div>

              <div className="bg-secondary border border-dashed border-primary/50 rounded-md py-3 px-4">
                <p className="text-xs text-muted-foreground mb-1 font-sans">
                  Use code at checkout
                </p>
                <p className="font-display text-2xl font-bold tracking-widest text-primary">
                  {popupCode}
                </p>
              </div>

              <Button
                onClick={handleShopNow}
                data-ocid="exit_popup.primary_button"
                className="w-full rounded-sm font-semibold uppercase tracking-wider text-sm bg-primary hover:opacity-90 text-primary-foreground"
              >
                Apply Discount & Shop Now
              </Button>

              <button
                type="button"
                onClick={() => setVisible(false)}
                data-ocid="exit_popup.cancel_button"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors underline"
              >
                No thanks, I'll pay full price
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
