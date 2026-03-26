export type Category = "Men" | "Women" | "Boys" | "Girls" | "Baby";
export type ProductType = "Shirt" | "Pants";

export interface ProductReview {
  name: string;
  rating: number;
  text: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: Category;
  type: ProductType;
  image: string;
  image2?: string;
  image3?: string;
  image4?: string;
  colorImages?: Record<string, string>;
  featured: boolean;
  sizes: string[];
  colors: string[];
  newArrival: boolean;
  isBestSeller: boolean;
  stock: number;
  fabric?: string;
  rating: number;
  reviewCount: number;
  soldCount?: number;
  shortDescription?: string;
  deliveryThreshold?: string;
  returnDays?: number;
  reviews?: ProductReview[];
}

export const categories: Category[] = ["Men", "Women", "Boys", "Girls", "Baby"];
export const productTypes: ProductType[] = ["Shirt", "Pants"];

export const products: Product[] = [
  {
    id: "1",
    name: "Men Embroidered Kurta",
    category: "Men",
    type: "Shirt",
    price: 1999,
    discountPrice: 1499,
    image: "/assets/generated/product-men-shirt.dim_400x400.jpg",
    description:
      "Elegant white cotton kurta with fine gold thread work (krhai) embroidery on neckline and cuffs. Perfect for Eid, weddings, or casual wear.",
    fabric: "100% Premium Cotton",
    shortDescription:
      "Fine gold thread (krhai) embroidery\nPremium 100% cotton fabric\nAvailable in S–XXL\nMachine washable",
    deliveryThreshold: "Above Rs. 2,000",
    returnDays: 7,
    featured: true,
    newArrival: false,
    isBestSeller: true,
    stock: 35,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Blue", "Beige"],
    rating: 4.8,
    reviewCount: 124,
    soldCount: 843,
  },
  {
    id: "2",
    name: "Men Embroidered Shalwar",
    category: "Men",
    type: "Pants",
    price: 1299,
    discountPrice: 999,
    image: "/assets/generated/product-men-pants.dim_400x400.jpg",
    description:
      "Classic white shalwar with embroidered border detail. Comfortable cotton fabric for all-day wear. Matches perfectly with any kurta.",
    fabric: "100% Cotton",
    deliveryThreshold: "Above Rs. 2,000",
    returnDays: 7,
    featured: true,
    newArrival: false,
    isBestSeller: true,
    stock: 28,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Beige", "Grey"],
    rating: 4.7,
    reviewCount: 89,
    soldCount: 612,
  },
  {
    id: "3",
    name: "Ladies Embroidered Lawn Suit",
    category: "Women",
    type: "Shirt",
    price: 2499,
    discountPrice: 1899,
    image: "/assets/generated/product-women-shirt.dim_400x400.jpg",
    description:
      "Beautiful ladies lawn suit with colorful thread work (krhai) embroidery and floral patterns. Soft fabric ideal for summer and festive occasions.",
    fabric: "Lawn / Chiffon Blend",
    shortDescription:
      "Vibrant floral embroidery\nSoft lawn fabric, ideal for summer\nFull 3-piece suit\nDry clean recommended",
    deliveryThreshold: "Above Rs. 2,000",
    returnDays: 7,
    featured: true,
    newArrival: true,
    isBestSeller: true,
    stock: 4,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Pink", "Green", "Blue"],
    rating: 4.9,
    reviewCount: 215,
    soldCount: 1240,
  },
  {
    id: "4",
    name: "Ladies Embroidered Trouser",
    category: "Women",
    type: "Pants",
    price: 1199,
    image: "/assets/generated/product-women-pants.dim_400x400.jpg",
    description:
      "Elegant ladies trouser with delicate border embroidery. Soft fabric, comfortable fit for formal or casual wear.",
    fabric: "Cambric Cotton",
    deliveryThreshold: "Above Rs. 2,000",
    returnDays: 7,
    featured: false,
    newArrival: true,
    isBestSeller: false,
    stock: 20,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Beige", "Grey"],
    rating: 4.5,
    reviewCount: 67,
    soldCount: 380,
  },
  {
    id: "5",
    name: "Boys Kurta Shalwar Set",
    category: "Boys",
    type: "Shirt",
    price: 1299,
    discountPrice: 999,
    image: "/assets/generated/product-boys-shirt.dim_400x400.jpg",
    description:
      "Traditional boys kurta shalwar with simple embroidery on collar. Comfortable and stylish for Eid, school events, and family occasions.",
    fabric: "100% Pique Cotton",
    deliveryThreshold: "Above Rs. 2,000",
    returnDays: 7,
    featured: true,
    newArrival: false,
    isBestSeller: true,
    stock: 50,
    sizes: ["4T", "5T", "6", "7", "8"],
    colors: ["Blue", "White", "Green"],
    rating: 4.6,
    reviewCount: 88,
    soldCount: 527,
  },
  {
    id: "6",
    name: "Boys Cotton Shalwar",
    category: "Boys",
    type: "Pants",
    price: 699,
    image: "/assets/generated/product-boys-pants.dim_400x400.jpg",
    description:
      "Comfortable boys shalwar in white cotton fabric. Easy to wash and durable for everyday wear.",
    fabric: "100% Cotton",
    deliveryThreshold: "Above Rs. 2,000",
    returnDays: 7,
    featured: false,
    newArrival: true,
    isBestSeller: false,
    stock: 3,
    sizes: ["4T", "5T", "6", "7", "8"],
    colors: ["White", "Beige", "Grey"],
    rating: 4.4,
    reviewCount: 43,
    soldCount: 290,
  },
  {
    id: "7",
    name: "Girls Embroidered Frock",
    category: "Girls",
    type: "Shirt",
    price: 1499,
    discountPrice: 1099,
    image: "/assets/generated/product-girls-shirt.dim_400x400.jpg",
    description:
      "Adorable girls frock with colorful floral thread work (krhai) embroidery around neckline and hem. Perfect for Eid, parties, and family events.",
    fabric: "Soft Cotton Blend",
    deliveryThreshold: "Above Rs. 2,000",
    returnDays: 7,
    featured: true,
    newArrival: true,
    isBestSeller: false,
    stock: 12,
    sizes: ["4T", "5T", "6", "7", "8"],
    colors: ["Pastel Pink", "White", "Pastel Blue"],
    rating: 4.7,
    reviewCount: 56,
    soldCount: 415,
  },
  {
    id: "8",
    name: "Girls Shalwar Pants",
    category: "Girls",
    type: "Pants",
    price: 699,
    image: "/assets/generated/product-girls-pants.dim_400x400.jpg",
    description:
      "Soft pink shalwar for girls. Comfortable elastic waist, easy to wear for school, play, and everyday use.",
    fabric: "95% Cotton, 5% Spandex",
    deliveryThreshold: "Above Rs. 2,000",
    returnDays: 7,
    featured: false,
    newArrival: false,
    isBestSeller: false,
    stock: 45,
    sizes: ["4T", "5T", "6", "7", "8"],
    colors: ["Pink", "White", "Beige"],
    rating: 4.3,
    reviewCount: 31,
    soldCount: 210,
  },
  {
    id: "9",
    name: "Baby Jora Suit Set",
    category: "Baby",
    type: "Shirt",
    price: 899,
    discountPrice: 699,
    image: "/assets/generated/product-baby-shirt.dim_400x400.jpg",
    description:
      "Ultra-soft baby jora with light embroidery. Gentle on sensitive baby skin, comfortable for everyday wear and special occasions.",
    fabric: "100% Organic Cotton",
    deliveryThreshold: "Above Rs. 2,000",
    returnDays: 7,
    featured: true,
    newArrival: false,
    isBestSeller: true,
    stock: 2,
    sizes: ["0-3M", "3-6M", "6-12M"],
    colors: ["White", "Pastel Blue", "Pastel Pink"],
    rating: 4.9,
    reviewCount: 178,
    soldCount: 960,
  },
  {
    id: "10",
    name: "Baby Cotton Shalwar",
    category: "Baby",
    type: "Pants",
    price: 499,
    image: "/assets/generated/product-baby-pants.dim_400x400.jpg",
    description:
      "Cozy soft shalwar for babies with elastic waist. Easy to put on and take off, gentle on skin.",
    fabric: "Fleece Cotton Blend",
    deliveryThreshold: "Above Rs. 2,000",
    returnDays: 7,
    featured: false,
    newArrival: true,
    isBestSeller: false,
    stock: 30,
    sizes: ["0-3M", "3-6M", "6-12M"],
    colors: ["White", "Beige", "Grey"],
    rating: 4.5,
    reviewCount: 62,
    soldCount: 340,
  },
  {
    id: "11",
    name: "Men Lawn Embroidered Kurta",
    category: "Men",
    type: "Shirt",
    price: 2299,
    discountPrice: 1799,
    image: "/assets/generated/product-men-linen.dim_400x400.jpg",
    description:
      "Premium lawn kurta with intricate thread work (krhai) embroidery on chest and sleeves. Breathable and comfortable for summer.",
    fabric: "100% Pure Lawn",
    deliveryThreshold: "Above Rs. 2,000",
    returnDays: 7,
    featured: true,
    newArrival: true,
    isBestSeller: false,
    stock: 8,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Beige", "White", "Grey"],
    rating: 4.6,
    reviewCount: 95,
    soldCount: 480,
  },
  {
    id: "12",
    name: "Ladies Casual Shalwar",
    category: "Women",
    type: "Pants",
    price: 899,
    image: "/assets/generated/product-women-casual.dim_400x400.jpg",
    description:
      "Comfortable everyday casual shalwar for women. Relaxed fit with elastic waist, perfect for home, work, or casual outings.",
    fabric: "Cotton Poplin",
    deliveryThreshold: "Above Rs. 2,000",
    returnDays: 7,
    featured: false,
    newArrival: false,
    isBestSeller: false,
    stock: 22,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Beige", "Brown"],
    rating: 4.4,
    reviewCount: 47,
    soldCount: 265,
  },
];
