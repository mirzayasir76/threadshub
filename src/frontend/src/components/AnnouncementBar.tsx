import { useStore } from "@/context/StoreContext";
import { X } from "lucide-react";
import { useState } from "react";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const { settings } = useStore();
  const code = settings.announcementCode || "FIRST10";

  if (!visible) return null;

  return (
    <div
      className="bg-foreground text-background py-2.5 px-4 flex items-center justify-center relative overflow-hidden"
      data-ocid="announcement.section"
    >
      <p className="text-center font-bold text-xs sm:text-sm pr-8 line-clamp-2 sm:line-clamp-1">
        <span className="sm:hidden">
          🔥 Free Delivery + 10% OFF — Code:{" "}
          <span className="text-primary font-extrabold">{code}</span>
        </span>
        <span className="hidden sm:inline">
          🔥 Free Delivery + 10% OFF (Use Code:{" "}
          <span className="text-primary font-extrabold">{code}</span>) —{" "}
          <span className="font-extrabold">Limited Time Offer</span>
        </span>
      </p>
      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label="Dismiss announcement"
        data-ocid="announcement.close_button"
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity flex-shrink-0"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
