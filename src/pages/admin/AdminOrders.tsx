import { useState } from 'react';
import { Eye, Filter } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminStore, AdminOrder } from '@/stores/adminStore';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { format } from 'date-fns';

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

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useAdminStore();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(o => o.status === statusFilter);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-[#2E2E2E]">Orders</h1>
            <p className="text-[#6F4E37]/70">Manage customer orders</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-white border-[#E5DDD3]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl border border-[#E5DDD3] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#FAF7F2]">
                <TableHead className="text-[#6F4E37]">Order ID</TableHead>
                <TableHead className="text-[#6F4E37]">Customer</TableHead>
                <TableHead className="text-[#6F4E37]">Items</TableHead>
                <TableHead className="text-[#6F4E37]">Total</TableHead>
                <TableHead className="text-[#6F4E37]">Delivery</TableHead>
                <TableHead className="text-[#6F4E37]">Status</TableHead>
                <TableHead className="text-[#6F4E37]">Date</TableHead>
                <TableHead className="text-[#6F4E37]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-[#FAF7F2]/50">
                  <TableCell className="font-medium text-[#2E2E2E]">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-[#2E2E2E]">{order.customerName}</p>
                      <p className="text-sm text-[#6F4E37]/60">{order.customerEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-[#6F4E37]/70">
                    {order.items.length} items
                  </TableCell>
                  <TableCell className="font-medium text-[#2E2E2E]">
                    {formatCurrency(order.total)}
                  </TableCell>
                  <TableCell className="text-[#2E2E2E] capitalize">
                    {order.deliveryMethod}
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={order.status} 
                      onValueChange={(value: AdminOrder['status']) => updateOrderStatus(order.id, value)}
                    >
                      <SelectTrigger className="w-32 h-8">
                        <Badge className={statusColors[order.status]}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-[#6F4E37]/70">
                    {format(order.createdAt, 'dd MMM yyyy HH:mm')}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                      className="text-[#6F4E37] hover:bg-[#6F4E37]/10"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Order Detail Dialog */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="bg-[#FAF7F2] rounded-lg p-4">
                  <p className="font-medium text-[#2E2E2E]">{selectedOrder.customerName}</p>
                  <p className="text-sm text-[#6F4E37]/70">{selectedOrder.customerEmail}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-[#2E2E2E] mb-2">Items</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.name} x{item.quantity}</span>
                        <span>{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#E5DDD3] pt-3">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>{formatCurrency(selectedOrder.total)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Badge className={statusColors[selectedOrder.status]}>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {selectedOrder.deliveryMethod}
                  </Badge>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
