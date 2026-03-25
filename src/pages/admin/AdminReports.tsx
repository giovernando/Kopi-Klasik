import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatCard } from '@/components/admin/StatCard';
import { useAdminStore } from '@/stores/adminStore';
import { ShoppingBag, Users, Coffee, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const salesByCategory = [
  { name: 'Coffee', sales: 4500000 },
  { name: 'Tea', sales: 1200000 },
  { name: 'Pastry', sales: 2100000 },
  { name: 'Food', sales: 1800000 },
  { name: 'Dessert', sales: 900000 },
];

const ordersByStatus = [
  { name: 'Completed', value: 145, color: '#22c55e' },
  { name: 'Processing', value: 32, color: '#3b82f6' },
  { name: 'Pending', value: 18, color: '#eab308' },
  { name: 'Cancelled', value: 5, color: '#ef4444' },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

export default function AdminReports() {
  const { orders, customers, products } = useAdminStore();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = totalRevenue / orders.length || 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-display font-bold text-[#2E2E2E]">Reports</h1>
          <p className="text-[#6F4E37]/70">Analytics and insights</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            change="+12.5% from last month"
            changeType="positive"
            icon={TrendingUp}
            iconColor="bg-green-600"
          />
          <StatCard
            title="Total Orders"
            value={orders.length.toString()}
            change="+8% from last month"
            changeType="positive"
            icon={ShoppingBag}
            iconColor="bg-[#6F4E37]"
          />
          <StatCard
            title="Total Customers"
            value={customers.length.toString()}
            change="+15 new this month"
            changeType="positive"
            icon={Users}
            iconColor="bg-[#C49A6C]"
          />
          <StatCard
            title="Avg Order Value"
            value={formatCurrency(avgOrderValue)}
            change="+5% from last month"
            changeType="positive"
            icon={Coffee}
            iconColor="bg-[#4E342E]"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales by Category */}
          <div className="bg-white rounded-xl p-5 border border-[#E5DDD3]">
            <h2 className="text-lg font-semibold text-[#2E2E2E] mb-4">Sales by Category</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesByCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5DDD3" />
                  <XAxis dataKey="name" stroke="#6F4E37" />
                  <YAxis 
                    stroke="#6F4E37"
                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ 
                      backgroundColor: '#FAF7F2', 
                      border: '1px solid #E5DDD3',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="sales" fill="#6F4E37" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Orders by Status */}
          <div className="bg-white rounded-xl p-5 border border-[#E5DDD3]">
            <h2 className="text-lg font-semibold text-[#2E2E2E] mb-4">Orders by Status</h2>
            <div className="h-[300px] flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ordersByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {ordersByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FAF7F2', 
                      border: '1px solid #E5DDD3',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {ordersByStatus.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-[#2E2E2E]">{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl p-5 border border-[#E5DDD3]">
          <h2 className="text-lg font-semibold text-[#2E2E2E] mb-4">Top Selling Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {products.slice(0, 5).map((product, index) => (
              <div key={product.id} className="bg-[#FAF7F2] rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl mx-auto mb-2">
                  ☕
                </div>
                <p className="font-medium text-[#2E2E2E] text-sm">{product.name}</p>
                <p className="text-xs text-[#6F4E37]/60 mt-1">{Math.floor(Math.random() * 100 + 50)} sold</p>
                <p className="text-sm font-semibold text-[#6F4E37] mt-1">{formatCurrency(product.price)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
