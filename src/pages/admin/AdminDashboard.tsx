import { ShoppingBag, DollarSign, Coffee, TrendingUp } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatCard } from '@/components/admin/StatCard';
import { useAdminStore } from '@/stores/adminStore';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const salesData = [
  { name: 'Mon', sales: 2400000 },
  { name: 'Tue', sales: 1398000 },
  { name: 'Wed', sales: 9800000 },
  { name: 'Thu', sales: 3908000 },
  { name: 'Fri', sales: 4800000 },
  { name: 'Sat', sales: 3800000 },
  { name: 'Sun', sales: 4300000 },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function AdminDashboard() {
  const { orders, products } = useAdminStore();
  
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const bestSelling = products[0]?.name || 'Cappuccino';
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-display font-bold text-[#2E2E2E]">Dashboard</h1>
          <p className="text-[#6F4E37]/70">Welcome back to Kopi Klasik admin</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Orders"
            value={totalOrders.toString()}
            change="+12% from last month"
            changeType="positive"
            icon={ShoppingBag}
            iconColor="bg-[#6F4E37]"
          />
          <StatCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            change="+8% from last month"
            changeType="positive"
            icon={DollarSign}
            iconColor="bg-[#C49A6C]"
          />
          <StatCard
            title="Best Selling"
            value={bestSelling}
            change="32 sold today"
            changeType="neutral"
            icon={Coffee}
            iconColor="bg-[#4E342E]"
          />
          <StatCard
            title="Growth"
            value="+15.3%"
            change="Compared to last week"
            changeType="positive"
            icon={TrendingUp}
            iconColor="bg-green-600"
          />
        </div>

        {/* Charts and Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-[#E5DDD3]">
            <h2 className="text-lg font-semibold text-[#2E2E2E] mb-4">Weekly Sales</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
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
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#6F4E37" 
                    strokeWidth={2}
                    dot={{ fill: '#6F4E37' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl p-5 border border-[#E5DDD3]">
            <h2 className="text-lg font-semibold text-[#2E2E2E] mb-4">Top Products</h2>
            <div className="space-y-4">
              {products.slice(0, 5).map((product, index) => (
                <div key={product.id} className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-[#FAF7F2] rounded-full flex items-center justify-center text-sm font-medium text-[#6F4E37]">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-[#2E2E2E] text-sm">{product.name}</p>
                    <p className="text-xs text-[#6F4E37]/60">{formatCurrency(product.price)}</p>
                  </div>
                  <span className="text-sm text-[#6F4E37]/70">{Math.floor(Math.random() * 50 + 10)} sold</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-[#E5DDD3] overflow-hidden">
          <div className="p-5 border-b border-[#E5DDD3]">
            <h2 className="text-lg font-semibold text-[#2E2E2E]">Recent Orders</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-[#FAF7F2]">
                <TableHead className="text-[#6F4E37]">Order ID</TableHead>
                <TableHead className="text-[#6F4E37]">Customer</TableHead>
                <TableHead className="text-[#6F4E37]">Items</TableHead>
                <TableHead className="text-[#6F4E37]">Total</TableHead>
                <TableHead className="text-[#6F4E37]">Status</TableHead>
                <TableHead className="text-[#6F4E37]">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.slice(0, 5).map((order) => (
                <TableRow key={order.id} className="hover:bg-[#FAF7F2]/50">
                  <TableCell className="font-medium text-[#2E2E2E]">{order.id}</TableCell>
                  <TableCell className="text-[#2E2E2E]">{order.customerName}</TableCell>
                  <TableCell className="text-[#6F4E37]/70">
                    {order.items.map(i => i.name).join(', ')}
                  </TableCell>
                  <TableCell className="text-[#2E2E2E]">{formatCurrency(order.total)}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[order.status]}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#6F4E37]/70">
                    {format(order.createdAt, 'dd MMM yyyy')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
