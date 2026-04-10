import { useState } from 'react';
import { Search, Eye } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminStore, AdminCustomer } from '@/stores/adminStore';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

export default function AdminCustomers() {
  const { customers } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-display font-bold text-[#2E2E2E]">Customers</h1>
          <p className="text-[#6F4E37]/70">Manage your customers</p>
        </div>

        {/* Search */}
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F4E37]/50" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-[#E5DDD3]"
          />
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-xl border border-[#E5DDD3] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#FAF7F2]">
                <TableHead className="text-[#6F4E37]">Customer</TableHead>
                <TableHead className="text-[#6F4E37]">Phone</TableHead>
                <TableHead className="text-[#6F4E37]">Orders</TableHead>
                <TableHead className="text-[#6F4E37]">Total Spent</TableHead>
                <TableHead className="text-[#6F4E37]">Joined</TableHead>
                <TableHead className="text-[#6F4E37]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-[#FAF7F2]/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#C49A6C] rounded-full flex items-center justify-center text-white font-medium">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-[#2E2E2E]">{customer.name}</p>
                        <p className="text-sm text-[#6F4E37]/60">{customer.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-[#2E2E2E]">
                    {customer.phone || '-'}
                  </TableCell>
                  <TableCell className="text-[#2E2E2E]">
                    {customer.ordersCount}
                  </TableCell>
                  <TableCell className="font-medium text-[#2E2E2E]">
                    {formatCurrency(customer.totalSpent)}
                  </TableCell>
                  <TableCell className="text-[#6F4E37]/70">
                    {format(customer.createdAt, 'dd MMM yyyy')}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedCustomer(customer)}
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

        {/* Customer Detail Dialog */}
        <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Customer Details</DialogTitle>
            </DialogHeader>
            {selectedCustomer && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#C49A6C] rounded-full flex items-center justify-center text-white text-2xl font-medium">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-lg font-medium text-[#2E2E2E]">{selectedCustomer.name}</p>
                    <p className="text-[#6F4E37]/70">{selectedCustomer.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#FAF7F2] rounded-lg p-4">
                    <p className="text-sm text-[#6F4E37]/70">Total Orders</p>
                    <p className="text-xl font-bold text-[#2E2E2E]">{selectedCustomer.ordersCount}</p>
                  </div>
                  <div className="bg-[#FAF7F2] rounded-lg p-4">
                    <p className="text-sm text-[#6F4E37]/70">Total Spent</p>
                    <p className="text-xl font-bold text-[#2E2E2E]">{formatCurrency(selectedCustomer.totalSpent)}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#6F4E37]/70">Phone</span>
                    <span className="text-[#2E2E2E]">{selectedCustomer.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6F4E37]/70">Member Since</span>
                    <span className="text-[#2E2E2E]">{format(selectedCustomer.createdAt, 'dd MMM yyyy')}</span>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
