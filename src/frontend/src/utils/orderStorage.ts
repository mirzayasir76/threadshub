export interface OrderItem {
  productName: string;
  size?: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode?: string;
  deliveryPhone: string;
  paymentMethod: "cod" | "card";
  shippingMethod: "cod" | "card";
  items: OrderItem[];
  productTotal: number;
  shippingFee: number;
  grandTotal: number;
  status: "pending" | "confirmed" | "dispatched" | "delivered" | "cancelled";
}

const STORAGE_KEY = "threadshub_orders";

export function saveOrder(order: Order): void {
  const orders = getAllOrders();
  orders.unshift(order);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function getAllOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

export function updateOrderStatus(
  orderId: string,
  status: Order["status"],
): void {
  const orders = getAllOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx !== -1) {
    orders[idx].status = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }
}

export function deleteOrder(orderId: string): void {
  const orders = getAllOrders().filter((o) => o.id !== orderId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}
