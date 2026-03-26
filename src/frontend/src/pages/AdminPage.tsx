import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { Product } from "@/data/products";
import * as bs from "@/lib/backendService";
import type {
  FrontendDiscount,
  FrontendOrder,
  FrontendSettings,
} from "@/lib/backendService";
type Order = FrontendOrder;
type Discount = FrontendDiscount;
type StoreSettings = FrontendSettings;
import {
  BarChart3,
  ChevronDown,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  Package,
  Pencil,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Star,
  Tag,
  Trash2,
  TrendingUp,
  Truck,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

const ADMIN_PASSWORD = "threadshub2024";

type Section =
  | "dashboard"
  | "products"
  | "orders"
  | "customers"
  | "payments"
  | "shipping"
  | "discounts"
  | "analytics"
  | "settings"
  | "subscribers";

const NAV_ITEMS: { id: Section; label: string; icon: React.ReactNode }[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  { id: "products", label: "Products", icon: <Package className="h-4 w-4" /> },
  { id: "orders", label: "Orders", icon: <ShoppingBag className="h-4 w-4" /> },
  { id: "customers", label: "Customers", icon: <Users className="h-4 w-4" /> },
  {
    id: "subscribers",
    label: "Contacts & Leads",
    icon: <Mail className="h-4 w-4" />,
  },
  {
    id: "payments",
    label: "Payments",
    icon: <CreditCard className="h-4 w-4" />,
  },
  { id: "shipping", label: "Shipping", icon: <Truck className="h-4 w-4" /> },
  { id: "discounts", label: "Discounts", icon: <Tag className="h-4 w-4" /> },
  {
    id: "analytics",
    label: "Analytics",
    icon: <BarChart3 className="h-4 w-4" />,
  },
  { id: "settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
];

const STATUS_COLORS: Record<Order["status"], string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  dispatched: "bg-purple-100 text-purple-800 border-purple-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

const STATUS_OPTIONS: Order["status"][] = [
  "pending",
  "confirmed",
  "dispatched",
  "delivered",
  "cancelled",
];

// ─── Login ───────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_auth", "1");
      onLogin();
    } else {
      setError(true);
      setPw("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm border border-slate-200"
        data-ocid="admin.panel"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>
        </div>
        <h1 className="text-xl font-bold text-center mb-1 text-slate-900">
          ThreadsHub Admin
        </h1>
        <p className="text-sm text-slate-500 text-center mb-6">
          Enter your password to continue
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="admin-pw">Password</Label>
            <Input
              id="admin-pw"
              type="password"
              placeholder="Admin password"
              value={pw}
              onChange={(e) => {
                setPw(e.target.value);
                setError(false);
              }}
              data-ocid="admin.input"
              autoFocus
            />
          </div>
          {error && (
            <p className="text-sm text-red-600" data-ocid="admin.error_state">
              Incorrect password. Please try again.
            </p>
          )}
          <Button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white"
            data-ocid="admin.submit_button"
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
function DashboardSection({
  orders,
  products,
}: { orders: Order[]; products: Product[] }) {
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + o.grandTotal, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const recentOrders = orders.slice(0, 5);

  const stats = [
    {
      label: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Revenue (PKR)",
      value: `PKR ${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Products",
      value: products.length,
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Pending Orders",
      value: pendingOrders,
      icon: Truck,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-slate-500">{s.label}</p>
                <div
                  className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center`}
                >
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                </div>
              </div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-slate-800">
            Recent Orders
          </CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 bg-slate-50">
                <TableHead className="text-xs font-semibold text-slate-500">
                  Order ID
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">
                  Customer
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">
                  Amount
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">
                  Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-slate-400 py-8"
                    data-ocid="dashboard.empty_state"
                  >
                    No orders yet.
                  </TableCell>
                </TableRow>
              ) : (
                recentOrders.map((o, i) => (
                  <TableRow
                    key={o.id}
                    className="border-slate-100"
                    data-ocid={`dashboard.order.item.${i + 1}`}
                  >
                    <TableCell className="font-mono text-xs text-slate-600">
                      {o.id}
                    </TableCell>
                    <TableCell className="font-medium text-slate-800 text-sm">
                      {o.customerName}
                    </TableCell>
                    <TableCell className="text-slate-700 text-sm font-medium">
                      PKR {o.grandTotal.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full border ${STATUS_COLORS[o.status]}`}
                      >
                        {o.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-400 text-xs">
                      {new Date(o.date).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

// ─── Products ────────────────────────────────────────────────────────────────
const EMPTY_PRODUCT: Omit<Product, "id"> = {
  name: "",
  description: "",
  price: 0,
  discountPrice: undefined,
  category: "Men",
  type: "Shirt",
  image: "",
  image2: "",
  image3: "",
  image4: "",
  featured: false,
  sizes: [],
  colors: [],
  newArrival: false,
  isBestSeller: false,
  stock: 50,
  fabric: "",
  rating: 4.5,
  reviewCount: 0,
  soldCount: 500,
  shortDescription: "",
  deliveryThreshold: "Above Rs. 2,000",
  returnDays: 7,
  reviews: [],
  colorImages: {},
};

function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [_loadingProds, setLoadingProds] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>(EMPTY_PRODUCT);
  const [sizesInput, setSizesInput] = useState("");
  const [colorsInput, setColorsInput] = useState("");
  const [imgPreview, setImgPreview] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const fileRef2 = useRef<HTMLInputElement>(null);
  const fileRef3 = useRef<HTMLInputElement>(null);
  const fileRef4 = useRef<HTMLInputElement>(null);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [imgPreview2, setImgPreview2] = useState("");
  const [imgPreview3, setImgPreview3] = useState("");
  const [imgPreview4, setImgPreview4] = useState("");

  const reload = async () => {
    const p = await bs.fetchProducts();
    setProducts(p);
  };

  useEffect(() => {
    bs.fetchProducts()
      .then((p) => {
        setProducts(p);
        setLoadingProds(false);
      })
      .catch(() => setLoadingProds(false));
  }, []);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_PRODUCT);
    setSizesInput("");
    setColorsInput("");
    setImgPreview("");
    setImgPreview2("");
    setImgPreview3("");
    setImgPreview4("");
    setReviewsOpen(false);
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      discountPrice: p.discountPrice,
      category: p.category,
      type: p.type,
      image: p.image,
      image2: p.image2 ?? "",
      image3: p.image3 ?? "",
      image4: p.image4 ?? "",
      featured: p.featured,
      sizes: p.sizes,
      colors: p.colors,
      newArrival: p.newArrival,
      isBestSeller: p.isBestSeller ?? false,
      stock: p.stock ?? 50,
      fabric: p.fabric ?? "",
      rating: p.rating ?? 4.5,
      reviewCount: p.reviewCount ?? 0,
      soldCount: p.soldCount ?? 500,
      shortDescription: p.shortDescription ?? "",
      deliveryThreshold: p.deliveryThreshold ?? "Above Rs. 2,000",
      returnDays: p.returnDays ?? 7,
      reviews: p.reviews ?? [],
      colorImages: p.colorImages ?? {},
    });
    setSizesInput(p.sizes.join(","));
    setColorsInput(p.colors.join(","));
    setImgPreview(p.image);
    setImgPreview2(p.image2 ?? "");
    setImgPreview3(p.image3 ?? "");
    setImgPreview4(p.image4 ?? "");
    setReviewsOpen(false);
    setDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setImgPreview(url);
      setForm((prev) => ({ ...prev, image: url }));
    };
    reader.readAsDataURL(file);
  };

  const makeGalleryHandler =
    (field: "image2" | "image3" | "image4", setPreview: (v: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        setPreview(url);
        setForm((prev) => ({ ...prev, [field]: url }));
      };
      reader.readAsDataURL(file);
    };

  const handleSave = async () => {
    const payload: Product = {
      ...form,
      id:
        editingId ??
        `prod_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      sizes: sizesInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      colors: colorsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      discountPrice: form.discountPrice || undefined,
      fabric: form.fabric || undefined,
      image2: form.image2 || undefined,
      image3: form.image3 || undefined,
      image4: form.image4 || undefined,
      shortDescription: form.shortDescription || undefined,
      deliveryThreshold: form.deliveryThreshold || "Above Rs. 2,000",
      returnDays: form.returnDays ?? 7,
      reviews: form.reviews ?? [],
      colorImages: form.colorImages ?? {},
    };
    if (!payload.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    try {
      await bs.saveProduct(payload, !editingId);
      toast.success(editingId ? "Product updated" : "Product added");
      await reload();
      setDialogOpen(false);
    } catch {
      toast.error("Failed to save product");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await bs.removeProduct(id);
      toast.success("Product deleted");
      await reload();
    } catch {
      toast.error("Failed to delete product");
    }
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-ocid="products.search_input"
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={openAdd}
            className="bg-slate-900 hover:bg-slate-800 text-white gap-2"
            data-ocid="products.add_button"
          >
            <Plus className="h-4 w-4" /> Add Product
          </Button>
          <label htmlFor="csv-import" className="cursor-pointer">
            <span className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              <Package className="h-4 w-4" /> Bulk CSV
            </span>
            <input
              id="csv-import"
              type="file"
              accept=".csv"
              className="sr-only"
              data-ocid="products.upload_button"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const text = await file.text();
                const lines = text.split("\n").filter(Boolean);
                const headers = lines[0].split(",").map((h) => h.trim());
                const parsed = lines
                  .slice(1)
                  .map((line) => {
                    const vals = line.split(",");
                    const obj: Record<string, string> = {};
                    headers.forEach((h, i) => {
                      obj[h] = (vals[i] ?? "").trim();
                    });
                    return {
                      id: `prod_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
                      name: obj.name ?? "",
                      description: obj.description ?? "",
                      shortDescription: "",
                      price: Number(obj.price) || 0,
                      discountPrice: obj.discountPrice
                        ? Number(obj.discountPrice)
                        : undefined,
                      category: (obj.category as Product["category"]) ?? "Men",
                      type: "Shirt" as const,
                      image: obj.image ?? "",
                      image2: undefined,
                      image3: undefined,
                      image4: undefined,
                      featured: false,
                      newArrival: false,
                      isBestSeller: false,
                      sizes: (obj.sizes ?? "S,M,L,XL")
                        .split(";")
                        .map((s) => s.trim()),
                      colors: (obj.colors ?? "White")
                        .split(";")
                        .map((c) => c.trim()),
                      stock: Number(obj.stock) || 50,
                      fabric: obj.fabric ?? "",
                      rating: Number(obj.rating) || 4.5,
                      reviewCount: 0,
                      soldCount: Number(obj.soldCount) || 0,
                      reviews: [],
                      colorImages: {},
                    } as Product;
                  })
                  .filter((p) => p.name);
                if (parsed.length === 0) {
                  toast.error("No valid products found in CSV");
                  return;
                }
                try {
                  const count = await bs.bulkImportProducts(parsed);
                  toast.success(`Imported ${count} products successfully`);
                  await reload();
                } catch {
                  toast.error("Bulk import failed");
                }
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 bg-slate-50">
                <TableHead className="text-xs font-semibold text-slate-500">
                  Image
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">
                  Name
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">
                  Category
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">
                  Price
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">
                  Stock
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">
                  Flags
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-slate-400 py-12"
                    data-ocid="products.empty_state"
                  >
                    No products found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((p, i) => (
                  <TableRow
                    key={p.id}
                    className="border-slate-100"
                    data-ocid={`products.item.${i + 1}`}
                  >
                    <TableCell>
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 object-cover rounded-md border border-slate-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%23f1f5f9'/%3E%3C/svg%3E";
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium text-slate-800 text-sm">
                      {p.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {p.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-800 text-sm">
                      <div>
                        <span className="font-medium">
                          PKR {p.price.toLocaleString()}
                        </span>
                        {p.discountPrice && (
                          <span className="text-xs text-green-600 block">
                            Sale: PKR {p.discountPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-xs font-semibold ${
                          (p.stock ?? 50) <= 5
                            ? "text-red-600"
                            : (p.stock ?? 50) <= 15
                              ? "text-orange-500"
                              : "text-green-600"
                        }`}
                      >
                        {p.stock ?? 50}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        {p.featured && (
                          <span className="text-xs text-purple-600">
                            Featured
                          </span>
                        )}
                        {p.isBestSeller && (
                          <span className="text-xs text-orange-500">
                            Best Seller
                          </span>
                        )}
                        {p.newArrival && (
                          <span className="text-xs text-green-600">New</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEdit(p)}
                          className="h-8 w-8 p-0 hover:bg-slate-100"
                          data-ocid={`products.edit_button.${i + 1}`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteConfirm(p.id)}
                          className="h-8 w-8 p-0 hover:bg-red-50 text-red-500"
                          data-ocid={`products.delete_button.${i + 1}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="w-full max-w-[95vw] sm:max-w-lg max-h-[85dvh] overflow-y-auto mx-auto"
          data-ocid="products.dialog"
        >
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Name *</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Product name"
                data-ocid="products.input"
              />
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Product description"
                rows={3}
                data-ocid="products.textarea"
              />
            </div>
            <div className="space-y-1">
              <Label>Key Highlights (one per line)</Label>
              <Textarea
                value={form.shortDescription ?? ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, shortDescription: e.target.value }))
                }
                placeholder={
                  "100% cotton fabric\nMachine washable\nAvailable in all sizes"
                }
                rows={3}
                data-ocid="products.highlights.textarea"
              />
              <p className="text-xs text-muted-foreground">
                Each line shown as a bullet point on product page
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Price (PKR)</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, price: Number(e.target.value) }))
                  }
                  data-ocid="products.price.input"
                />
              </div>
              <div className="space-y-1">
                <Label>Discount Price (PKR)</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.discountPrice ?? ""}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      discountPrice: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    }))
                  }
                  placeholder="Optional"
                  data-ocid="products.discount_price.input"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) =>
                    setForm((p) => ({
                      ...p,
                      category: v as Product["category"],
                    }))
                  }
                >
                  <SelectTrigger data-ocid="products.category.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Men", "Women", "Boys", "Girls", "Baby"].map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, type: v as Product["type"] }))
                  }
                >
                  <SelectTrigger data-ocid="products.type.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Shirt">Shirt</SelectItem>
                    <SelectItem value="Pants">Pants</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Stock Quantity</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.stock}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, stock: Number(e.target.value) }))
                  }
                  data-ocid="products.stock.input"
                />
              </div>
              <div className="space-y-1">
                <Label>Rating (1-5)</Label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  step={0.1}
                  value={form.rating}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, rating: Number(e.target.value) }))
                  }
                  data-ocid="products.rating.input"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Review Count</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.reviewCount ?? 0}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      reviewCount: Number(e.target.value),
                    }))
                  }
                  data-ocid="products.reviewcount.input"
                />
              </div>
              <div className="space-y-1">
                <Label>Sold Count</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.soldCount ?? 500}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      soldCount: Number(e.target.value),
                    }))
                  }
                  data-ocid="products.soldcount.input"
                />
              </div>
              <div className="space-y-1">
                <Label>Free Delivery Above</Label>
                <Input
                  value={form.deliveryThreshold ?? "Above Rs. 2,000"}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      deliveryThreshold: e.target.value,
                    }))
                  }
                  placeholder="Above Rs. 2,000"
                  data-ocid="products.delivery_threshold.input"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Return Policy (days)</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.returnDays ?? 7}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      returnDays: Number(e.target.value),
                    }))
                  }
                  data-ocid="products.return_days.input"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Fabric / Material</Label>
              <Input
                value={form.fabric ?? ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, fabric: e.target.value }))
                }
                placeholder="e.g. 100% Premium Cotton"
                data-ocid="products.fabric.input"
              />
            </div>
            <div className="space-y-1">
              <Label>Sizes (comma-separated)</Label>
              <Input
                value={sizesInput}
                onChange={(e) => setSizesInput(e.target.value)}
                placeholder="S,M,L,XL"
                data-ocid="products.sizes.input"
              />
            </div>
            <div className="space-y-1">
              <Label>Colors (comma-separated)</Label>
              <Input
                value={colorsInput}
                onChange={(e) => setColorsInput(e.target.value)}
                placeholder="White,Black,Blue"
                data-ocid="products.colors.input"
              />
            </div>
            {/* Color Images Section */}
            {colorsInput.trim() && (
              <div className="space-y-3">
                <Label className="text-sm font-semibold">
                  Color Images (Optional)
                </Label>
                <p className="text-xs text-muted-foreground -mt-1">
                  Assign a specific image to each color. When a customer clicks
                  that color, this image will automatically appear.
                </p>
                {colorsInput
                  .split(",")
                  .map((c) => c.trim())
                  .filter(Boolean)
                  .map((color) => {
                    const currentImg = form.colorImages?.[color] ?? "";
                    return (
                      <div
                        key={color}
                        className="border border-dashed border-slate-200 rounded-lg p-3 space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0"
                            style={{
                              backgroundColor:
                                (
                                  {
                                    White: "#FFFFFF",
                                    Blue: "#3B82F6",
                                    Grey: "#9CA3AF",
                                    Black: "#1F2937",
                                    Navy: "#1E3A5F",
                                    Brown: "#92400E",
                                    Pink: "#F9A8D4",
                                    Yellow: "#FDE68A",
                                    Beige: "#D2B48C",
                                    Green: "#22C55E",
                                    Red: "#EF4444",
                                    Purple: "#A855F7",
                                    "Pastel Pink": "#FBCFE8",
                                    "Pastel Blue": "#BFDBFE",
                                  } as Record<string, string>
                                )[color] ?? "#ccc",
                            }}
                          />
                          <Label className="text-xs font-medium">{color}</Label>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => {
                              const input = document.createElement("input");
                              input.type = "file";
                              input.accept = "image/*";
                              input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement)
                                  .files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  const url = ev.target?.result as string;
                                  setForm((p) => ({
                                    ...p,
                                    colorImages: {
                                      ...(p.colorImages ?? {}),
                                      [color]: url,
                                    },
                                  }));
                                };
                                reader.readAsDataURL(file);
                              };
                              input.click();
                            }}
                          >
                            Upload
                          </Button>
                          <Input
                            className="flex-1 h-8 text-xs"
                            value={
                              currentImg.startsWith("data:") ? "" : currentImg
                            }
                            onChange={(e) =>
                              setForm((p) => ({
                                ...p,
                                colorImages: {
                                  ...(p.colorImages ?? {}),
                                  [color]: e.target.value,
                                },
                              }))
                            }
                            placeholder="Enter image URL or upload"
                          />
                          {currentImg && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-xs text-red-500"
                              onClick={() =>
                                setForm((p) => {
                                  const updated = { ...(p.colorImages ?? {}) };
                                  delete updated[color];
                                  return { ...p, colorImages: updated };
                                })
                              }
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        {currentImg && (
                          <img
                            src={currentImg}
                            alt={`${color} preview`}
                            className="w-16 h-16 object-cover rounded border border-slate-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
            <div className="space-y-2">
              <Label>Product Image</Label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileRef.current?.click()}
                  data-ocid="products.upload_button"
                >
                  Upload Image
                </Button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <span className="text-xs text-slate-400">
                  or enter URL below
                </span>
              </div>
              <Input
                value={form.image.startsWith("data:") ? "" : form.image}
                onChange={(e) => {
                  setForm((p) => ({ ...p, image: e.target.value }));
                  setImgPreview(e.target.value);
                }}
                placeholder="/assets/generated/image.jpg"
                data-ocid="products.image.input"
              />
              {imgPreview && (
                <img
                  src={imgPreview}
                  alt="Preview"
                  className="mt-2 w-20 h-20 object-cover rounded-lg border border-slate-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
            </div>

            {/* Gallery Images 2-4 */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">
                Product Gallery (Images 2–4)
              </Label>
              <p className="text-xs text-muted-foreground -mt-1">
                Additional product angles shown in the image gallery
              </p>
              {(["image2", "image3", "image4"] as const).map((field, idx) => {
                const previews = [imgPreview2, imgPreview3, imgPreview4];
                const refs = [fileRef2, fileRef3, fileRef4];
                const setters = [
                  setImgPreview2,
                  setImgPreview3,
                  setImgPreview4,
                ];
                const preview = previews[idx];
                const ref = refs[idx];
                const label = `Image ${idx + 2}`;
                return (
                  <div
                    key={field}
                    className="space-y-1 border border-dashed border-slate-200 rounded-lg p-3"
                  >
                    <Label className="text-xs text-muted-foreground">
                      {label}
                    </Label>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => ref.current?.click()}
                      >
                        Upload
                      </Button>
                      <input
                        ref={ref}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={makeGalleryHandler(field, setters[idx])}
                      />
                      <Input
                        className="flex-1 h-8 text-xs"
                        value={
                          (form[field] ?? "").startsWith("data:")
                            ? ""
                            : (form[field] ?? "")
                        }
                        onChange={(e) => {
                          setForm((p) => ({ ...p, [field]: e.target.value }));
                          setters[idx](e.target.value);
                        }}
                        placeholder="/assets/generated/image.jpg or URL"
                      />
                      {(form[field] ?? "") && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs text-red-500"
                          onClick={() => {
                            setForm((p) => ({ ...p, [field]: "" }));
                            setters[idx]("");
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    {preview && (
                      <img
                        src={preview}
                        alt={`Gallery ${idx + 2}`}
                        className="mt-1 w-16 h-16 object-cover rounded border border-slate-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Product Flags</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.featured}
                    onCheckedChange={(v) =>
                      setForm((p) => ({ ...p, featured: v }))
                    }
                    id="featured-sw"
                    data-ocid="products.featured.switch"
                  />
                  <Label htmlFor="featured-sw" className="text-sm">
                    Featured
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.newArrival}
                    onCheckedChange={(v) =>
                      setForm((p) => ({ ...p, newArrival: v }))
                    }
                    id="newarrival-sw"
                    data-ocid="products.newarrival.switch"
                  />
                  <Label htmlFor="newarrival-sw" className="text-sm">
                    New Arrival
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.isBestSeller}
                    onCheckedChange={(v) =>
                      setForm((p) => ({ ...p, isBestSeller: v }))
                    }
                    id="bestseller-sw"
                    data-ocid="products.bestseller.switch"
                  />
                  <Label htmlFor="bestseller-sw" className="text-sm">
                    Best Seller
                  </Label>
                </div>
              </div>
            </div>

            {/* Customer Reviews Manager */}
            <div className="space-y-2 border border-border rounded-lg overflow-hidden">
              <button
                type="button"
                className="w-full flex items-center justify-between px-4 py-3 bg-secondary/40 hover:bg-secondary/70 transition-colors text-sm font-semibold"
                onClick={() => setReviewsOpen((v) => !v)}
                data-ocid="products.reviews_toggle.button"
              >
                <span>
                  Customer Reviews ({(form.reviews ?? []).length} reviews)
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${reviewsOpen ? "rotate-180" : ""}`}
                />
              </button>
              {reviewsOpen && (
                <div className="p-3 space-y-3">
                  {(form.reviews ?? []).map((rev, i) => (
                    <div
                      key={`review-${i}-${rev.name}`}
                      className="border border-dashed border-slate-200 rounded-lg p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground">
                          Review #{i + 1}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-red-500"
                          onClick={() =>
                            setForm((p) => ({
                              ...p,
                              reviews: (p.reviews ?? []).filter(
                                (_, ri) => ri !== i,
                              ),
                            }))
                          }
                          data-ocid={`products.review.delete_button.${i + 1}`}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Reviewer Name</Label>
                          <Input
                            className="h-8 text-xs"
                            value={rev.name}
                            onChange={(e) =>
                              setForm((p) => ({
                                ...p,
                                reviews: (p.reviews ?? []).map((r, ri) =>
                                  ri === i ? { ...r, name: e.target.value } : r,
                                ),
                              }))
                            }
                            placeholder="e.g. Amna S."
                            data-ocid={`products.review.name.input.${i + 1}`}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Rating</Label>
                          <Select
                            value={String(rev.rating)}
                            onValueChange={(v) =>
                              setForm((p) => ({
                                ...p,
                                reviews: (p.reviews ?? []).map((r, ri) =>
                                  ri === i ? { ...r, rating: Number(v) } : r,
                                ),
                              }))
                            }
                          >
                            <SelectTrigger
                              className="h-8 text-xs"
                              data-ocid={`products.review.rating.select.${i + 1}`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[5, 4, 3, 2, 1].map((s) => (
                                <SelectItem key={s} value={String(s)}>
                                  {"★".repeat(s)} ({s})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Review Text</Label>
                        <Textarea
                          className="text-xs"
                          rows={2}
                          value={rev.text}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              reviews: (p.reviews ?? []).map((r, ri) =>
                                ri === i ? { ...r, text: e.target.value } : r,
                              ),
                            }))
                          }
                          placeholder="Customer review text..."
                          data-ocid={`products.review.textarea.${i + 1}`}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">
                          Date (e.g. March 10, 2026)
                        </Label>
                        <Input
                          className="h-8 text-xs"
                          value={rev.date}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              reviews: (p.reviews ?? []).map((r, ri) =>
                                ri === i ? { ...r, date: e.target.value } : r,
                              ),
                            }))
                          }
                          placeholder="March 10, 2026"
                          data-ocid={`products.review.date.input.${i + 1}`}
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full text-xs gap-1"
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        reviews: [
                          ...(p.reviews ?? []),
                          { name: "", rating: 5, text: "", date: "" },
                        ],
                      }))
                    }
                    data-ocid="products.review.add_button"
                  >
                    <Plus className="h-3 w-3" /> Add Review
                  </Button>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="products.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-slate-900 hover:bg-slate-800 text-white"
              data-ocid="products.save_button"
            >
              {editingId ? "Update Product" : "Add Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <DialogContent className="max-w-sm" data-ocid="products.delete.dialog">
          <DialogHeader>
            <DialogTitle>Delete Product?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-500">
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              data-ocid="products.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              data-ocid="products.delete.confirm_button"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Orders ──────────────────────────────────────────────────────────────────
function OrdersSection() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<Order["status"] | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const reload = async () => {
    const o = await bs.fetchOrders();
    setOrders(o);
  };

  useEffect(() => {
    bs.fetchOrders()
      .then(setOrders)
      .catch(() => {});
  }, []);

  const baseFiltered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const filtered = searchQuery.trim()
    ? baseFiltered.filter((o) => {
        const q = searchQuery.toLowerCase();
        return (
          o.id.toLowerCase().includes(q) ||
          (o.customerName || "").toLowerCase().includes(q) ||
          (o.phone || "").toLowerCase().includes(q) ||
          (o.city || "").toLowerCase().includes(q)
        );
      })
    : baseFiltered;

  const handleStatus = async (id: string, status: string) => {
    try {
      await bs.changeOrderStatus(id, status);
      await reload();
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await bs.changeOrderStatus(id, "cancelled");
      await reload();
      toast.success("Order cancelled");
    } catch {
      toast.error("Failed to cancel order");
    }
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by order ID, name, phone, city..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="max-w-sm"
        data-ocid="orders.search_input"
      />
      <Tabs
        value={filter}
        onValueChange={(v) => setFilter(v as Order["status"] | "all")}
      >
        <TabsList className="bg-slate-100">
          <TabsTrigger value="all" data-ocid="orders.all.tab">
            All ({orders.length})
          </TabsTrigger>
          <TabsTrigger value="pending" data-ocid="orders.pending.tab">
            Pending
          </TabsTrigger>
          <TabsTrigger value="confirmed" data-ocid="orders.confirmed.tab">
            Confirmed
          </TabsTrigger>
          <TabsTrigger value="dispatched" data-ocid="orders.dispatched.tab">
            Dispatched
          </TabsTrigger>
          <TabsTrigger value="delivered" data-ocid="orders.delivered.tab">
            Delivered
          </TabsTrigger>
          <TabsTrigger value="cancelled" data-ocid="orders.cancelled.tab">
            Cancelled
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <Card className="border-slate-200 shadow-sm">
          <CardContent
            className="py-12 text-center text-slate-400"
            data-ocid="orders.empty_state"
          >
            No orders found.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((o, i) => (
            <Card
              key={o.id}
              className="border-slate-200 shadow-sm"
              data-ocid={`orders.item.${i + 1}`}
            >
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">
                        Order #{o.id}
                      </p>
                      <p className="font-semibold text-slate-700 text-sm">
                        {o.customerName}
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(o.date).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full border ${STATUS_COLORS[o.status]}`}
                    >
                      {o.status}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {o.paymentMethod === "cod" ? "COD" : "Online"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-slate-800">
                      PKR {o.grandTotal.toLocaleString()}
                    </p>
                    <select
                      value={o.status}
                      onChange={(e) =>
                        handleStatus(o.id, e.target.value as Order["status"])
                      }
                      className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
                      data-ocid={`orders.status.select.${i + 1}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <a
                      href={`https://wa.me/92${o.phone?.replace(/^0/, "")}?text=${encodeURIComponent(`Hi ${o.customerName}, your ThreadsHub order (PKR ${o.grandTotal.toLocaleString()}) status: ${o.status}. Thank you!`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-ocid={`orders.whatsapp.button.${i + 1}`}
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 gap-1.5 text-xs text-green-600 border-green-200 hover:bg-green-50"
                      >
                        <MessageCircle className="h-3 w-3" /> WhatsApp
                      </Button>
                    </a>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setExpandedId(expandedId === o.id ? null : o.id)
                      }
                      className="h-7 gap-1 text-xs"
                      data-ocid={`orders.expand.button.${i + 1}`}
                    >
                      <ChevronDown
                        className={`h-3 w-3 transition-transform ${expandedId === o.id ? "" : "-rotate-90"}`}
                      />{" "}
                      Details
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDeleteConfirm(o.id)}
                      className="h-7 w-7 p-0 hover:bg-red-50 text-red-500"
                      data-ocid={`orders.delete_button.${i + 1}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {expandedId === o.id && (
                  <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-700 text-xs uppercase tracking-wide">
                        Customer
                      </p>
                      <p className="text-slate-600">{o.customerName}</p>
                      <p className="text-slate-500">{o.phone}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-700 text-xs uppercase tracking-wide">
                        Delivery
                      </p>
                      <p className="text-slate-600">{o.address}</p>
                      <p className="text-slate-500">{o.city}</p>
                    </div>
                    <div className="col-span-full">
                      <p className="font-semibold text-slate-700 text-xs uppercase tracking-wide mb-2">
                        Items
                      </p>
                      <div className="space-y-1">
                        {o.items.map((item) => (
                          <div
                            key={item.productName}
                            className="flex justify-between text-slate-600"
                          >
                            <span>
                              {item.productName}{" "}
                              {item.size ? `(${item.size})` : ""} × {item.qty}
                            </span>
                            <span>
                              PKR {(item.price * item.qty).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between font-semibold text-slate-800 mt-2 pt-2 border-t border-slate-100">
                        <span>Grand Total</span>
                        <span>PKR {o.grandTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <DialogContent className="max-w-sm" data-ocid="orders.delete.dialog">
          <DialogHeader>
            <DialogTitle>Delete Order?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-500">
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              data-ocid="orders.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              data-ocid="orders.delete.confirm_button"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Customers ────────────────────────────────────────────────────────────────
function CustomersSection() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    bs.fetchOrders()
      .then(setOrders)
      .catch(() => {});
  }, []);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  type CustomerSummary = {
    name: string;
    email: string;
    phone: string;
    city: string;
    orders: Order[];
  };

  const customerMap: Record<string, CustomerSummary> = {};
  for (const o of orders) {
    const key = o.email || o.phone;
    if (!customerMap[key]) {
      customerMap[key] = {
        name: o.customerName,
        email: o.email,
        phone: o.phone,
        city: o.city,
        orders: [],
      };
    }
    customerMap[key].orders.push(o);
  }

  const customers = Object.values(customerMap).filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search),
  );

  const selected = selectedEmail ? customerMap[selectedEmail] : null;

  return (
    <div className="space-y-4">
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
          data-ocid="customers.search_input"
        />
      </div>

      <Card className="border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 bg-slate-50">
                <TableHead className="text-xs font-semibold text-slate-500">
                  Name
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">
                  Phone
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">
                  City
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">
                  Orders
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">
                  Total Spent
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-slate-400 py-12"
                    data-ocid="customers.empty_state"
                  >
                    No customers yet.
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((c, i) => {
                  const totalSpent = c.orders
                    .filter((o) => o.status !== "cancelled")
                    .reduce((s, o) => s + o.grandTotal, 0);
                  return (
                    <TableRow
                      key={c.email || c.phone}
                      className="border-slate-100"
                      data-ocid={`customers.item.${i + 1}`}
                    >
                      <TableCell className="font-medium text-slate-800 text-sm">
                        {c.name}
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm">
                        {c.phone}
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm">
                        {c.city}
                      </TableCell>
                      <TableCell className="text-slate-800 text-sm">
                        {c.orders.length}
                      </TableCell>
                      <TableCell className="text-slate-800 text-sm font-medium">
                        PKR {totalSpent.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => setSelectedEmail(c.email || c.phone)}
                          data-ocid={`customers.view.button.${i + 1}`}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={!!selected} onOpenChange={() => setSelectedEmail(null)}>
        <DialogContent
          className="w-full max-w-[95vw] sm:max-w-lg max-h-[85dvh] overflow-y-auto mx-auto"
          data-ocid="customers.dialog"
        >
          <DialogHeader>
            <DialogTitle>{selected?.name} — Order History</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="text-sm text-slate-500 space-y-0.5">
              <p>
                {selected?.phone} · {selected?.city}
              </p>
            </div>
            {selected?.orders.map((o, i) => (
              <div
                key={o.id}
                className="border border-slate-100 rounded-lg p-3"
                data-ocid={`customers.order.item.${i + 1}`}
              >
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    {new Date(o.date).toLocaleDateString()}
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full border ${STATUS_COLORS[o.status]}`}
                  >
                    {o.status}
                  </span>
                </div>
                <p className="text-sm text-slate-800 font-semibold mt-1">
                  PKR {o.grandTotal.toLocaleString()}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {o.items.map((x) => x.productName).join(", ")}
                </p>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedEmail(null)}
              data-ocid="customers.close_button"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Payments ────────────────────────────────────────────────────────────────
function PaymentsSection() {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  useEffect(() => {
    bs.fetchOrders()
      .then(setAllOrders)
      .catch(() => {});
  }, []);
  const orders = allOrders.filter((o) => o.status !== "cancelled");
  const total = orders.reduce((s, o) => s + o.grandTotal, 0);
  const codTotal = orders
    .filter((o) => o.paymentMethod === "cod")
    .reduce((s, o) => s + o.grandTotal, 0);
  const onlineTotal = orders
    .filter((o) => o.paymentMethod === "card")
    .reduce((s, o) => s + o.grandTotal, 0);
  const avg = orders.length ? Math.round(total / orders.length) : 0;
  const recent = allOrders.slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: "Total Revenue",
            value: `PKR ${total.toLocaleString()}`,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            label: "COD Revenue",
            value: `PKR ${codTotal.toLocaleString()}`,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Online Revenue",
            value: `PKR ${onlineTotal.toLocaleString()}`,
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
          {
            label: "Avg Order Value",
            value: `PKR ${avg.toLocaleString()}`,
            color: "text-orange-600",
            bg: "bg-orange-50",
          },
        ].map((s) => (
          <Card key={s.label} className="border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <p className="text-sm font-medium text-slate-500 mb-2">
                {s.label}
              </p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-slate-800">
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 bg-slate-50">
                <TableHead className="text-xs font-semibold text-slate-500">
                  Customer
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">
                  Amount
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">
                  Method
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">
                  Date
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-slate-400 py-8"
                    data-ocid="payments.empty_state"
                  >
                    No transactions yet.
                  </TableCell>
                </TableRow>
              ) : (
                recent.map((o, i) => (
                  <TableRow
                    key={o.id}
                    className="border-slate-100"
                    data-ocid={`payments.item.${i + 1}`}
                  >
                    <TableCell className="font-medium text-slate-800 text-sm">
                      {o.customerName}
                    </TableCell>
                    <TableCell className="text-slate-700 text-sm font-medium">
                      PKR {o.grandTotal.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {o.paymentMethod === "cod" ? "COD" : "Online"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500 text-xs">
                      {new Date(o.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full border ${STATUS_COLORS[o.status]}`}
                      >
                        {o.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

// ─── Shipping ────────────────────────────────────────────────────────────────
function ShippingSection() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    bs.fetchOrders()
      .then(setOrders)
      .catch(() => {});
  }, []);
  const [settings, setSettings] = useState({
    deliveryFee: 250,
    freeShippingThreshold: 2000,
  });
  useEffect(() => {
    bs.fetchSettings()
      .then((s) => setSettings(s))
      .catch(() => {});
  }, []);
  const pending = orders.filter(
    (o) => o.status === "pending" || o.status === "confirmed",
  ).length;
  const cityMap: Record<string, number> = {};
  for (const o of orders) {
    if (o.city) cityMap[o.city] = (cityMap[o.city] || 0) + 1;
  }
  const cities = Object.entries(cityMap).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm font-medium text-slate-500 mb-2">
              Pending Dispatch
            </p>
            <p className="text-3xl font-bold text-yellow-600">{pending}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm font-medium text-slate-500 mb-2">
              Delivery Fee
            </p>
            <p className="text-3xl font-bold text-slate-800">
              PKR {settings.deliveryFee}
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm font-medium text-slate-500 mb-2">
              Free Shipping Above
            </p>
            <p className="text-3xl font-bold text-slate-800">
              PKR {settings.freeShippingThreshold.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-slate-800">
            Orders by City
          </CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 bg-slate-50">
                <TableHead className="text-xs font-semibold text-slate-500">
                  City
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">
                  Orders
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cities.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="text-center text-slate-400 py-8"
                    data-ocid="shipping.empty_state"
                  >
                    No orders yet.
                  </TableCell>
                </TableRow>
              ) : (
                cities.map(([city, count], i) => (
                  <TableRow
                    key={city}
                    className="border-slate-100"
                    data-ocid={`shipping.item.${i + 1}`}
                  >
                    <TableCell className="font-medium text-slate-800">
                      {city}
                    </TableCell>
                    <TableCell className="text-slate-600">{count}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

// ─── Discounts ───────────────────────────────────────────────────────────────
function DiscountsSection() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [code, setCode] = useState("");
  const [percent, setPercent] = useState(10);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const reload = async () => {
    const d = await bs.fetchDiscounts();
    setDiscounts(d);
  };

  useEffect(() => {
    bs.fetchDiscounts()
      .then(setDiscounts)
      .catch(() => {});
  }, []);

  const handleAdd = async () => {
    if (!code.trim()) {
      toast.error("Code is required");
      return;
    }
    if (percent < 1 || percent > 100) {
      toast.error("Percent must be 1-100");
      return;
    }
    try {
      await bs.saveDiscount({
        code: code.trim().toUpperCase(),
        percent,
        active: true,
        usageCount: 0,
      });
      toast.success("Discount code added");
      await reload();
      setDialogOpen(false);
      setCode("");
      setPercent(10);
    } catch {
      toast.error("Failed to add discount");
    }
  };

  const handleDelete = async (c: string) => {
    try {
      await bs.removeDiscount(c);
      toast.success("Discount deleted");
      await reload();
    } catch {
      toast.error("Failed to delete");
    }
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white gap-2"
          data-ocid="discounts.add_button"
        >
          <Plus className="h-4 w-4" /> Add Discount Code
        </Button>
      </div>
      <Card className="border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 bg-slate-50">
                <TableHead className="text-xs font-semibold text-slate-500">
                  Code
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">
                  Discount %
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">
                  Usage
                </TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discounts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-slate-400 py-12"
                    data-ocid="discounts.empty_state"
                  >
                    No discount codes.
                  </TableCell>
                </TableRow>
              ) : (
                discounts.map((d, i) => (
                  <TableRow
                    key={d.code}
                    className="border-slate-100"
                    data-ocid={`discounts.item.${i + 1}`}
                  >
                    <TableCell className="font-mono font-semibold text-slate-800">
                      {d.code}
                    </TableCell>
                    <TableCell className="text-slate-700">
                      {d.percent}%
                    </TableCell>
                    <TableCell>
                      <button
                        type="button"
                        onClick={async () => {
                          await bs.saveDiscount({ ...d, active: !d.active });
                          await reload();
                        }}
                        data-ocid={`discounts.toggle.${i + 1}`}
                      >
                        <Badge
                          className={
                            d.active
                              ? "bg-green-100 text-green-800 border-green-200 cursor-pointer"
                              : "bg-slate-100 text-slate-500 border-slate-200 cursor-pointer"
                          }
                        >
                          {d.active ? "Active" : "Inactive"}
                        </Badge>
                      </button>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {d.usageCount}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteConfirm(d.code)}
                        className="h-8 w-8 p-0 hover:bg-red-50 text-red-500"
                        data-ocid={`discounts.delete_button.${i + 1}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm" data-ocid="discounts.dialog">
          <DialogHeader>
            <DialogTitle>Add Discount Code</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Code *</Label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. SUMMER20"
                data-ocid="discounts.code.input"
              />
            </div>
            <div className="space-y-1">
              <Label>Discount Percentage *</Label>
              <Input
                type="number"
                min={1}
                max={100}
                value={percent}
                onChange={(e) => setPercent(Number(e.target.value))}
                data-ocid="discounts.percent.input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="discounts.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              className="bg-slate-900 hover:bg-slate-800 text-white"
              data-ocid="discounts.save_button"
            >
              Add Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <DialogContent className="max-w-sm" data-ocid="discounts.delete.dialog">
          <DialogHeader>
            <DialogTitle>Delete Discount Code?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              data-ocid="discounts.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              data-ocid="discounts.delete.confirm_button"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Analytics ───────────────────────────────────────────────────────────────
function AnalyticsSection() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    bs.fetchOrders()
      .then(setOrders)
      .catch(() => {});
  }, []);

  const last7 = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const label = d.toLocaleDateString("en-PK", {
      month: "short",
      day: "numeric",
    });
    const revenue = orders
      .filter(
        (o) =>
          new Date(o.date).toDateString() === d.toDateString() &&
          o.status !== "cancelled",
      )
      .reduce((s, o) => s + o.grandTotal, 0);
    return { label, revenue };
  });

  const statusCounts = STATUS_OPTIONS.map((s) => ({
    name: s,
    value: orders.filter((o) => o.status === s).length,
  })).filter((x) => x.value > 0);
  const STATUS_PIE_COLORS = [
    "#F59E0B",
    "#3B82F6",
    "#8B5CF6",
    "#10B981",
    "#EF4444",
  ];

  const paymentData = [
    {
      name: "COD",
      orders: orders.filter((o) => o.paymentMethod === "cod").length,
    },
    {
      name: "Online",
      orders: orders.filter((o) => o.paymentMethod === "card").length,
    },
  ];

  const productCounts: Record<string, number> = {};
  for (const o of orders) {
    for (const item of o.items) {
      productCounts[item.productName] =
        (productCounts[item.productName] || 0) + item.qty;
    }
  }
  const topProducts = Object.entries(productCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-800">
              Revenue — Last 7 Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={last7}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(v: number) => [
                    `PKR ${v.toLocaleString()}`,
                    "Revenue",
                  ]}
                />
                <Bar dataKey="revenue" fill="#1e293b" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-800">
              Orders by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statusCounts.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">
                No order data yet.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusCounts}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label={(e) => e.name}
                  >
                    {statusCounts.map((entry, i) => (
                      <Cell
                        key={entry.name}
                        fill={STATUS_PIE_COLORS[i % STATUS_PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-800">
              Payment Method Split
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={paymentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="orders" fill="#64748b" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-800">
              Top Selling Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">
                No sales data yet.
              </p>
            ) : (
              <div className="space-y-3">
                {topProducts.map(([name, count], i) => (
                  <div
                    key={name}
                    className="flex items-center gap-3"
                    data-ocid={`analytics.product.item.${i + 1}`}
                  >
                    <div className="flex-none w-5 h-5 rounded-full bg-slate-800 text-white text-xs flex items-center justify-center font-bold">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">
                        {name}
                      </p>
                      <div className="h-1.5 bg-slate-100 rounded-full mt-1">
                        <div
                          className="h-1.5 bg-slate-800 rounded-full"
                          style={{
                            width: `${Math.min(100, (count / (topProducts[0]?.[1] || 1)) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-slate-600 flex-none">
                      {count} sold
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Settings ────────────────────────────────────────────────────────────────
function SettingsSection() {
  const [form, setForm] = useState<StoreSettings>(() => ({
    storeName: "ThreadsHub",
    whatsappNumber: "03174933882",
    easyPaisaNumber: "03041329809",
    contactEmail: "mirzayasir592@gmail.com",
    deliveryFee: 250,
    freeShippingThreshold: 2000,
    currency: "PKR",
    heroImage: "",
    announcementCode: "FIRST10",
    popupCode: "SUMMER26",
  }));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    bs.fetchSettings()
      .then(setForm)
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await bs.updateSettings(form);
      toast.success("Settings saved successfully");
    } catch {
      toast.error("Failed to save settings");
    }
    setSaving(false);
  };

  return (
    <Card className="border-slate-200 shadow-sm max-w-2xl">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-slate-800">
          Store Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-5">
          {[
            { label: "Store Name", key: "storeName" as const, type: "text" },
            {
              label: "WhatsApp Number",
              key: "whatsappNumber" as const,
              type: "text",
            },
            {
              label: "EasyPaisa / JazzCash Number",
              key: "easyPaisaNumber" as const,
              type: "text",
            },
            {
              label: "Contact Email",
              key: "contactEmail" as const,
              type: "email",
            },
            {
              label: "Delivery Fee (PKR)",
              key: "deliveryFee" as const,
              type: "number",
            },
            {
              label: "Free Shipping Threshold (PKR)",
              key: "freeShippingThreshold" as const,
              type: "number",
            },
            { label: "Currency", key: "currency" as const, type: "text" },
            {
              label: "Announcement Bar Discount Code",
              key: "announcementCode" as const,
              type: "text",
            },
            {
              label: "Popup Discount Code (Exit Intent)",
              key: "popupCode" as const,
              type: "text",
            },
          ].map(({ label, key, type }) => (
            <div key={key} className="space-y-1">
              <Label>{label}</Label>
              <Input
                type={type}
                value={form[key]}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    [key]:
                      type === "number"
                        ? Number(e.target.value)
                        : e.target.value,
                  }))
                }
                data-ocid={`settings.${key}.input`}
              />
            </div>
          ))}
          {/* ─── Hero Cover Photo ─── */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Hero Cover Photo</Label>
            <p className="text-xs text-muted-foreground">
              Upload a custom banner image for the homepage hero section.
            </p>
            <div className="overflow-hidden rounded-md border border-slate-200">
              <img
                src={
                  form.heroImage ||
                  "/assets/generated/hero-streetwear.dim_1400x600.jpg"
                }
                alt="Hero preview"
                className="w-full h-32 object-cover"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <label
                htmlFor="hero-upload"
                className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                data-ocid="settings.upload_button"
              >
                Upload New Photo
                <input
                  id="hero-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      const result = ev.target?.result as string;
                      setForm((p) => ({ ...p, heroImage: result }));
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
              {form.heroImage && (
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, heroImage: "" }))}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  data-ocid="settings.delete_button"
                >
                  Remove Custom Photo
                </button>
              )}
            </div>
          </div>
          <Button
            type="submit"
            className="bg-slate-900 hover:bg-slate-800 text-white"
            disabled={saving}
            data-ocid="settings.save_button"
          >
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// ─── Subscribers Section ──────────────────────────────────────────────────────
function SubscribersSection() {
  const [subscribers, setSubscribers] = useState<bs.FrontendSubscriber[]>([]);
  const [contacts, setContacts] = useState<bs.FrontendContact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Set<number>>(
    new Set(),
  );
  const [selectedSubs, setSelectedSubs] = useState<Set<number>>(new Set());

  useEffect(() => {
    bs.fetchSubscribers()
      .then(setSubscribers)
      .catch(() => {});
    bs.fetchContacts()
      .then(setContacts)
      .catch(() => {});
  }, []);

  const exportCSV = () => {
    const rows = [
      ["Email", "Date Subscribed", "Source"],
      ...subscribers.map((s) => [
        s.email,
        new Date(s.date).toLocaleDateString("en-PK"),
        s.whatsapp || "email",
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteSelectedContacts = async () => {
    const toDelete = contacts.filter((_, i) => selectedContacts.has(i));
    await Promise.all(
      toDelete.map((c) => bs.removeContact(c.id).catch(() => {})),
    );
    const updated = contacts.filter((_, i) => !selectedContacts.has(i));
    setContacts(updated);
    setSelectedContacts(new Set());
    toast.success("Selected messages deleted");
  };

  const deleteSelectedSubs = async () => {
    const toDelete = subscribers.filter((_, i) => selectedSubs.has(i));
    await Promise.all(
      toDelete.map((s) => bs.removeSubscriber(s.id).catch(() => {})),
    );
    const updated = subscribers.filter((_, i) => !selectedSubs.has(i));
    setSubscribers(updated);
    setSelectedSubs(new Set());
    toast.success("Selected subscribers deleted");
  };

  const toggleContact = (i: number) => {
    setSelectedContacts((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const toggleSub = (i: number) => {
    setSelectedSubs((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Contact Form Messages */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-base font-bold">
                Contact Form Messages
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Customer inquiries submitted via the Contact Us form
              </p>
            </div>
            {contacts.length > 0 && (
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedContacts.size === contacts.length}
                    onChange={(e) =>
                      setSelectedContacts(
                        e.target.checked
                          ? new Set(contacts.map((_, i) => i))
                          : new Set(),
                      )
                    }
                    className="rounded"
                    data-ocid="contacts.select_all.checkbox"
                  />
                  Select All
                </label>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={selectedContacts.size === 0}
                  onClick={deleteSelectedContacts}
                  data-ocid="contacts.delete_button"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Delete ({selectedContacts.size})
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <p
              className="text-sm text-muted-foreground text-center py-8"
              data-ocid="contacts.empty_state"
            >
              No contact submissions yet.
            </p>
          ) : (
            <div className="space-y-3">
              {contacts.map((c, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: no stable id
                  key={i}
                  className={`border rounded-xl p-4 space-y-1.5 transition-colors ${selectedContacts.has(i) ? "border-primary bg-primary/5" : "border-border"}`}
                >
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <label className="flex items-center gap-2 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={selectedContacts.has(i)}
                        onChange={() => toggleContact(i)}
                        className="rounded mt-0.5 flex-shrink-0"
                        data-ocid={`contacts.checkbox.${i + 1}`}
                      />
                      <span className="font-semibold text-sm text-foreground">
                        {c.name}
                      </span>
                    </label>
                    <span className="text-xs text-muted-foreground">
                      {new Date(c.date).toLocaleDateString("en-PK", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground pl-6">
                    {c.email} {c.phone ? `| ${c.phone}` : ""}
                  </p>
                  <p className="text-sm text-foreground/80 bg-muted/50 rounded-lg p-2.5 mt-1 ml-6">
                    {c.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Subscribers */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-base font-bold">
                {subscribers.length} Email Subscribers
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                Collected via navbar email capture popup
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={exportCSV}
                disabled={subscribers.length === 0}
              >
                Export CSV
              </Button>
              {selectedSubs.size > 0 && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={deleteSelectedSubs}
                  data-ocid="subscribers.delete_button"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Delete ({selectedSubs.size})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {subscribers.length === 0 ? (
            <p
              className="text-sm text-muted-foreground text-center py-8"
              data-ocid="subscribers.empty_state"
            >
              No subscribers yet. Email captures will appear here.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8">
                    <input
                      type="checkbox"
                      checked={selectedSubs.size === subscribers.length}
                      onChange={(e) =>
                        setSelectedSubs(
                          e.target.checked
                            ? new Set(subscribers.map((_, i) => i))
                            : new Set(),
                        )
                      }
                      className="rounded"
                      data-ocid="subscribers.select_all.checkbox"
                    />
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date Subscribed</TableHead>
                  <TableHead>Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.map((s, i) => (
                  <TableRow
                    // biome-ignore lint/suspicious/noArrayIndexKey: no stable id
                    key={i}
                    className={selectedSubs.has(i) ? "bg-primary/5" : ""}
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedSubs.has(i)}
                        onChange={() => toggleSub(i)}
                        className="rounded"
                        data-ocid={`subscribers.checkbox.${i + 1}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      {s.email}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(s.date).toLocaleDateString("en-PK", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                        {s.whatsapp || "email"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main AdminPage ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem("admin_auth") === "1",
  );
  const [section, setSection] = useState<Section>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    Promise.all([bs.fetchOrders(), bs.fetchProducts()])
      .then(([o, p]) => {
        setOrders(o);
        setProducts(p);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    document.title = `ThreadsHub Admin — ${section.charAt(0).toUpperCase() + section.slice(1)}`;
    return () => {
      document.title = "ThreadsHub";
    };
  }, [section]);

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    setAuthed(false);
  };

  const currentLabel =
    NAV_ITEMS.find((n) => n.id === section)?.label ?? "Dashboard";

  const renderSection = () => {
    switch (section) {
      case "dashboard":
        return <DashboardSection orders={orders} products={products} />;
      case "products":
        return <ProductsSection />;
      case "orders":
        return <OrdersSection />;
      case "customers":
        return <CustomersSection />;
      case "payments":
        return <PaymentsSection />;
      case "shipping":
        return <ShippingSection />;
      case "discounts":
        return <DiscountsSection />;
      case "analytics":
        return <AnalyticsSection />;
      case "settings":
        return <SettingsSection />;
      case "subscribers":
        return <SubscribersSection />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          role="presentation"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 flex flex-col z-40 transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <Star className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm leading-tight">
                ThreadsHub
              </p>
              <p className="text-xs text-slate-400">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => {
                setSection(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                section === item.id
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
              data-ocid={`admin.nav.${item.id}.link`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-100">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
            data-ocid="admin.logout.button"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen overflow-x-hidden min-w-0">
        <header className="sticky top-0 bg-white border-b border-slate-200 z-20 px-4 sm:px-6 h-14 flex items-center gap-4">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
            data-ocid="admin.menu.button"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center justify-between flex-1">
            <h1 className="text-base font-semibold text-slate-800">
              {currentLabel}
            </h1>
            <span className="text-xs text-slate-400 hidden sm:block">
              ThreadsHub Admin
            </span>
          </div>
        </header>

        <main
          className="flex-1 p-4 sm:p-6 overflow-x-hidden min-w-0"
          data-ocid={`admin.${section}.section`}
        >
          {renderSection()}
        </main>

        <footer className="px-6 py-3 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} ThreadsHub. Built with{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-600 underline"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
