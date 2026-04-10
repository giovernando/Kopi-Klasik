import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Eye, 
  Check, 
  X, 
  Calendar,
  Clock,
  Users,
  Phone
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useReservationStore } from '@/stores/reservationStore';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Reservation, ReservationStatus } from '@/types';

export default function AdminReservations() {
  const { reservations, updateReservationStatus, cancelReservation } = useReservationStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch = reservation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ReservationStatus) => {
    const variants: Record<ReservationStatus, { className: string; label: string }> = {
      pending: { className: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      confirmed: { className: 'bg-blue-100 text-blue-800', label: 'Confirmed' },
      completed: { className: 'bg-green-100 text-green-800', label: 'Completed' },
      cancelled: { className: 'bg-red-100 text-red-800', label: 'Cancelled' },
    };
    const variant = variants[status];
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const handleConfirm = (id: string) => {
    updateReservationStatus(id, 'confirmed');
  };

  const handleComplete = (id: string) => {
    updateReservationStatus(id, 'completed');
  };

  const handleCancel = (id: string) => {
    cancelReservation(id);
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-[#2E2E2E]">Reservations</h1>
        <p className="text-gray-500">Manage customer reservations</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-[#E5DDD3]"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px] bg-white border-[#E5DDD3]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reservations Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-[#E5DDD3] overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FAF7F2]">
              <tr>
                <th className="text-left p-4 font-semibold text-[#2E2E2E]">ID</th>
                <th className="text-left p-4 font-semibold text-[#2E2E2E]">Guest</th>
                <th className="text-left p-4 font-semibold text-[#2E2E2E]">Date & Time</th>
                <th className="text-left p-4 font-semibold text-[#2E2E2E]">Party Size</th>
                <th className="text-left p-4 font-semibold text-[#2E2E2E]">Status</th>
                <th className="text-left p-4 font-semibold text-[#2E2E2E]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DDD3]">
              {filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No reservations found
                  </td>
                </tr>
              ) : (
                filteredReservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                    <td className="p-4 font-mono text-sm">{reservation.id}</td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-[#2E2E2E]">{reservation.name}</p>
                        <p className="text-sm text-gray-500">{reservation.phone}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{format(new Date(reservation.date), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{reservation.time}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{reservation.guests} guests</span>
                      </div>
                    </td>
                    <td className="p-4">{getStatusBadge(reservation.status)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedReservation(reservation)}
                          className="text-[#6F4E37] hover:bg-[#6F4E37]/10"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {reservation.status === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleConfirm(reservation.id)}
                              className="text-green-600 hover:bg-green-50"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCancel(reservation.id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {reservation.status === 'confirmed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleComplete(reservation.id)}
                            className="text-blue-600 hover:bg-blue-50"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Reservation Detail Dialog */}
      <Dialog open={!!selectedReservation} onOpenChange={() => setSelectedReservation(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reservation Details</DialogTitle>
          </DialogHeader>
          {selectedReservation && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">ID</span>
                <span className="font-mono">{selectedReservation.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Status</span>
                {getStatusBadge(selectedReservation.status)}
              </div>
              <hr className="border-[#E5DDD3]" />
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-[#6F4E37]" />
                  <div>
                    <p className="font-medium">{selectedReservation.name}</p>
                    <p className="text-sm text-gray-500">{selectedReservation.guests} guests</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-[#6F4E37]" />
                  <span>{selectedReservation.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-[#6F4E37]" />
                  <span>{format(new Date(selectedReservation.date), 'EEEE, MMMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-[#6F4E37]" />
                  <span>{selectedReservation.time}</span>
                </div>
              </div>
              {selectedReservation.notes && (
                <>
                  <hr className="border-[#E5DDD3]" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Special Requests</p>
                    <p className="text-[#2E2E2E]">{selectedReservation.notes}</p>
                  </div>
                </>
              )}
              <hr className="border-[#E5DDD3]" />
              <div className="flex gap-2">
                {selectedReservation.status === 'pending' && (
                  <>
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => {
                        handleConfirm(selectedReservation.id);
                        setSelectedReservation(null);
                      }}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Confirm
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => {
                        handleCancel(selectedReservation.id);
                        setSelectedReservation(null);
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                )}
                {selectedReservation.status === 'confirmed' && (
                  <Button
                    className="flex-1 bg-[#6F4E37] hover:bg-[#4E342E] text-white"
                    onClick={() => {
                      handleComplete(selectedReservation.id);
                      setSelectedReservation(null);
                    }}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Mark as Completed
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}