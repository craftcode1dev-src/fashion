import { Product, Category, Order } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  return json.data ?? json;
}

export async function getProducts(params?: Record<string, string>): Promise<Product[]> {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  return fetchAPI<Product[]>(`/products${query}`);
}

export async function getProduct(slug: string): Promise<Product> {
  return fetchAPI<Product>(`/products/${slug}`);
}

export async function getCategories(params?: Record<string, string>): Promise<Category[]> {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  return fetchAPI<Category[]>(`/categories${query}`);
}

export async function getCategory(slug: string): Promise<Category> {
  return fetchAPI<Category>(`/categories/${slug}`);
}

export async function createOrder(data: Record<string, unknown>): Promise<Order> {
  return fetchAPI<Order>('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getOrder(orderNumber: string): Promise<Order> {
  return fetchAPI<Order>(`/orders/${orderNumber}`);
}

export async function subscribeNewsletter(email: string): Promise<{ message: string }> {
  return fetchAPI<{ message: string }>('/newsletter', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}
