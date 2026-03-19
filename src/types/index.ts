// ─── Auth ───────────────────────────────────────────────────────────────────

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// ─── User ────────────────────────────────────────────────────────────────────

export interface Address {
  street?: string;
  city?: string;
  country?: string;
  zip?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar: string;
  phone?: string;
  address?: Address;
  wishlist: string[];
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Category ────────────────────────────────────────────────────────────────

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategory?: string | Category;
  createdAt: string;
  updatedAt: string;
}

// ─── Product ─────────────────────────────────────────────────────────────────

export interface Product {
  _id: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  discount: number;
  brand: string;
  category: string | Category;
  rating: number;
  reviewCount: number;
  stock: number;
  sold: number;
  tags: string[];
  isFeatured: boolean;
  specifications?: Record<string, string>;
  createdBy?: string | User;
  createdAt: string;
  updatedAt: string;
}

// ─── Review ──────────────────────────────────────────────────────────────────

export interface Review {
  _id: string;
  userId: string | User;
  productId: string;
  rating: number;
  comment: string;
  helpful: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Cart ────────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: string | Product;
  quantity: number;
  price: number;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Order ───────────────────────────────────────────────────────────────────

export type PaymentStatus = "pending" | "paid" | "failed";
export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  title: string;
  image?: string;
}

export interface Order {
  _id: string;
  userId: string | User;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: Address;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── API Response ────────────────────────────────────────────────────────────

export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: Meta;
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface MonthlyDataPoint {
  _id: { year: number; month: number };
  orders: number;
  revenue: number;
}

export interface OrderStatusPoint {
  _id: OrderStatus;
  count: number;
}

export interface TopProduct {
  _id: string;
  title: string;
  sold: number;
  rating: number;
  images: string[];
}

export interface TopCategory {
  _id: string;
  name: string;
  count: number;
}

export interface DashboardChartData {
  monthlyData: MonthlyDataPoint[];
  ordersByStatus: OrderStatusPoint[];
  topProducts: TopProduct[];
  topCategories: TopCategory[];
}

// ─── Product Query Params ────────────────────────────────────────────────────

export interface ProductQueryParams {
  search?: string;
  category?: string;
  brand?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  isFeatured?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}
