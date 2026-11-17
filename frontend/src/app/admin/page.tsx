import { TrendingUp, ShoppingCart, Users, Package } from 'lucide-react';

interface RecentOrder {
  id: number;
  order_number: string;
  customer_name: string;
  created_at: string;
  total_amount: number;
  status: string;
}

interface TopProduct {
  id: number;
  name: string;
  total_sold: number;
  revenue: number;
  image_url?: string;
}

interface DashboardStats {
  total_revenue: number;
  total_orders: number;
  total_customers: number;
  total_products: number;
  recent_orders: RecentOrder[];
  top_products: TopProduct[];
}

const MOCK_STATS: DashboardStats = {
  total_revenue: 48750.0,
  total_orders: 24,
  total_customers: 18,
  total_products: 12,
  recent_orders: [
    { id: 1, order_number: 'MV-00024', customer_name: 'Sophie Leclerc', created_at: '2026-11-10T14:32:00Z', total_amount: 2890, status: 'processing' },
    { id: 2, order_number: 'MV-00023', customer_name: 'James Whitmore', created_at: '2026-11-10T11:15:00Z', total_amount: 1245, status: 'shipped' },
    { id: 3, order_number: 'MV-00022', customer_name: 'Amara Diallo', created_at: '2026-11-09T16:50:00Z', total_amount: 3400, status: 'delivered' },
    { id: 4, order_number: 'MV-00021', customer_name: 'Lena Müller', created_at: '2026-11-09T09:20:00Z', total_amount: 760, status: 'pending' },
    { id: 5, order_number: 'MV-00020', customer_name: 'Carlos Vidal', created_at: '2026-11-08T18:05:00Z', total_amount: 1980, status: 'cancelled' },
  ],
  top_products: [
    { id: 1, name: 'Cashmere Turtleneck', total_sold: 34, revenue: 29750 },
    { id: 2, name: 'Linen Trench Coat', total_sold: 21, revenue: 24150 },
    { id: 3, name: 'Wool Blazer', total_sold: 18, revenue: 19800 },
    { id: 4, name: 'Silk Blouse', total_sold: 15, revenue: 9750 },
    { id: 5, name: 'Wide-Leg Trousers', total_sold: 12, revenue: 7800 },
  ],
};

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

async function getStats(): Promise<DashboardStats> {
  const apiBase =
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === 'development'
      ? 'http://localhost:8000/api/v1'
      : '');

  // The demo storefront has no deployed admin API; fall back to mock data.
  if (!apiBase) return MOCK_STATS;

  try {
    const res = await fetch(`${apiBase}/admin/dashboard/stats`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('API error');
    return res.json();
  } catch {
    return MOCK_STATS;
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default async function AdminDashboard() {
  const stats = await getStats();
  const isMock = stats === MOCK_STATS || stats.total_orders === MOCK_STATS.total_orders;

  const statCards = [
    {
      label: 'Total Revenue',
      value: formatCurrency(stats.total_revenue),
      icon: TrendingUp,
      color: 'text-green-600 bg-green-50',
    },
    {
      label: 'Total Orders',
      value: stats.total_orders.toString(),
      icon: ShoppingCart,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Customers',
      value: stats.total_customers.toString(),
      icon: Users,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      label: 'Products',
      value: stats.total_products.toString(),
      icon: Package,
      color: 'text-orange-600 bg-orange-50',
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl text-[#1A1A1A]">Dashboard</h1>
        <p className="text-sm text-[#6B6B6B] mt-1">Welcome back to Maison Valère Admin</p>
        {isMock && (
          <p className="mt-2 inline-block text-xs bg-yellow-50 border border-yellow-200 text-yellow-700 px-3 py-1 rounded">
            ⚠ Using mock data — API offline
          </p>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white border border-gray-200 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-[#6B6B6B] uppercase tracking-widest">{card.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-[#1A1A1A] tabular-nums">{card.value}</p>
                </div>
                <span className={`flex items-center justify-center w-10 h-10 rounded ${card.color}`}>
                  <Icon size={18} strokeWidth={1.5} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-medium text-[#1A1A1A]">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs text-[#6B6B6B] uppercase tracking-widest font-medium">Order</th>
                  <th className="text-left px-6 py-3 text-xs text-[#6B6B6B] uppercase tracking-widest font-medium">Customer</th>
                  <th className="text-left px-6 py-3 text-xs text-[#6B6B6B] uppercase tracking-widest font-medium hidden sm:table-cell">Date</th>
                  <th className="text-right px-6 py-3 text-xs text-[#6B6B6B] uppercase tracking-widest font-medium">Amount</th>
                  <th className="text-left px-6 py-3 text-xs text-[#6B6B6B] uppercase tracking-widest font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-[#6B6B6B]">{order.order_number}</td>
                    <td className="px-6 py-4 font-medium text-[#1A1A1A]">{order.customer_name}</td>
                    <td className="px-6 py-4 text-[#6B6B6B] hidden sm:table-cell">{formatDate(order.created_at)}</td>
                    <td className="px-6 py-4 text-right font-medium text-[#1A1A1A] tabular-nums">{formatCurrency(order.total_amount)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium capitalize ${STATUS_STYLES[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-medium text-[#1A1A1A]">Top Products</h2>
          </div>
          <ul className="divide-y divide-gray-50">
            {stats.top_products.map((product, idx) => (
              <li key={product.id} className="px-6 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                <span className="text-xs text-[#6B6B6B] w-5 tabular-nums">{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1A1A1A] truncate">{product.name}</p>
                  <p className="text-xs text-[#6B6B6B] mt-0.5">{product.total_sold} sold</p>
                </div>
                <span className="text-sm font-medium text-[#1A1A1A] tabular-nums whitespace-nowrap">
                  {formatCurrency(product.revenue)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
