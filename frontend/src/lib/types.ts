export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  size: string;
  color_name: string;
  color_hex: string;
  sku: string | null;
  stock: number;
  price_modifier: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  gender: string;
  description: string | null;
  image_url: string | null;
  is_featured: boolean;
  sort_order: number;
  products_count?: number;
  products?: Product[];
}

export interface Product {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  sku: string;
  subtitle: string | null;
  description: string;
  composition: string | null;
  care_instructions: string | null;
  fit_advice: string | null;
  origin: string | null;
  price: number;
  compare_at_price: number | null;
  gender: string;
  subcategory: string | null;
  popularity?: number;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_bestseller: boolean;
  is_active: boolean;
  stock: number;
  category?: Category;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface CartItem {
  product: Product;
  variant: ProductVariant | null;
  quantity: number;
}

export interface OrderItem {
  product_id: number;
  product_variant_id: number | null;
  product_name: string;
  variant_label: string | null;
  price: number;
  quantity: number;
  total: number;
  image_url: string | null;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  order_status: string;
  payment_status: string;
  items: OrderItem[];
  created_at: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_postal_code?: string;
  shipping_country?: string;
  shipping_method?: string;
  payment_method?: string;
}
