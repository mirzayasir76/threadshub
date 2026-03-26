export interface Discount {
  code: string;
  percent: number;
  active: boolean;
  usageCount: number;
}

const STORAGE_KEY = "threadshub_discounts";

const defaults: Discount[] = [
  { code: "FIRST10", percent: 10, active: true, usageCount: 0 },
  { code: "SUMMER26", percent: 10, active: true, usageCount: 0 },
];

function ensureDefaultCodes(): void {
  const existing = getDiscounts();
  let changed = false;
  for (const d of defaults) {
    if (!existing.find((x) => x.code === d.code)) {
      existing.push(d);
      changed = true;
    }
  }
  if (changed) localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export function getDiscounts(): Discount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = [...defaults];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw) as Discount[];
    // Ensure defaults exist for returning users
    let changed = false;
    for (const d of defaults) {
      if (!parsed.find((x) => x.code === d.code)) {
        parsed.push(d);
        changed = true;
      }
    }
    if (changed) localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    return parsed;
  } catch {
    return [...defaults];
  }
}

// Keep ensureDefaultCodes callable externally if needed
export { ensureDefaultCodes };

export function saveDiscount(d: Discount): void {
  const all = getDiscounts();
  const idx = all.findIndex((x) => x.code === d.code);
  if (idx !== -1) {
    all[idx] = d;
  } else {
    all.push(d);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function deleteDiscount(code: string): void {
  const all = getDiscounts().filter((d) => d.code !== code);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function toggleDiscount(code: string): void {
  const all = getDiscounts();
  const idx = all.findIndex((d) => d.code === code);
  if (idx !== -1) {
    all[idx].active = !all[idx].active;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }
}
