import type { Principal } from "@icp-sdk/core/principal";

export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;

export interface Review {
    reviewer: string;
    rating: number;
    comment: string;
    date: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    shortDescription: string;
    price: number;
    discountPrice: [] | [number];
    category: string;
    image: string;
    image2: string;
    image3: string;
    image4: string;
    featured: boolean;
    newArrival: boolean;
    isBestSeller: boolean;
    sizes: string[];
    colors: string[];
    colorImages: Array<[string, string]>;
    stock: bigint;
    fabric: string;
    rating: number;
    reviewCount: bigint;
    soldCount: bigint;
    deliveryThreshold: bigint;
    returnDays: bigint;
    reviews: Review[];
    keyHighlights: string[];
    viewingCount: bigint;
    trendingBadge: boolean;
}

export interface OrderItem {
    productName: string;
    size: string;
    qty: bigint;
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
    postalCode: string;
    paymentMethod: string;
    items: OrderItem[];
    productTotal: number;
    shippingFee: number;
    grandTotal: number;
    status: string;
    discountCode: string;
    discountAmount: number;
}

export interface Settings {
    storeName: string;
    whatsappNumber: string;
    easyPaisaNumber: string;
    contactEmail: string;
    deliveryFee: number;
    freeShippingThreshold: number;
    currency: string;
    heroImage: string;
    announcementCode: string;
    popupCode: string;
}

export interface Discount {
    code: string;
    percent: number;
    active: boolean;
    usageCount: bigint;
}

export interface Contact {
    id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    date: string;
}

export interface Subscriber {
    id: string;
    email: string;
    whatsapp: string;
    date: string;
}

export interface backendInterface {
    _initializeAccessControlWithSecret(secret: string): Promise<void>;
    getProducts(): Promise<Product[]>;
    addProduct(product: Product): Promise<string>;
    updateProduct(product: Product): Promise<boolean>;
    deleteProduct(id: string): Promise<boolean>;
    bulkImportProducts(products: Product[]): Promise<bigint>;
    seedProducts(products: Product[]): Promise<void>;
    getOrders(): Promise<Order[]>;
    getOrderById(id: string): Promise<[] | [Order]>;
    addOrder(order: Order): Promise<string>;
    updateOrderStatus(id: string, status: string): Promise<boolean>;
    getSettings(): Promise<Settings>;
    saveSettings(settings: Settings): Promise<boolean>;
    getDiscounts(): Promise<Discount[]>;
    addDiscount(discount: Discount): Promise<boolean>;
    updateDiscount(discount: Discount): Promise<boolean>;
    deleteDiscount(code: string): Promise<boolean>;
    validateDiscount(code: string): Promise<[] | [number]>;
    getContacts(): Promise<Contact[]>;
    addContact(contact: Contact): Promise<string>;
    deleteContact(id: string): Promise<boolean>;
    getSubscribers(): Promise<Subscriber[]>;
    addSubscriber(subscriber: Subscriber): Promise<string>;
    deleteSubscriber(id: string): Promise<boolean>;
}
