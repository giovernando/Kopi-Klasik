import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Users, X } from 'lucide-react';
import { useReservationStore } from '@/stores/reservationStore';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function ReservationHistoryPage() {
  const reservations = useReservationStore((s) => s.reservations);
  const cancelReservation = useReservationStore((s) => s.cancelReservation);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-600';
      case 'confirmed':
        return 'bg-emerald-500/20 text-emerald-600';
      case 'completed':
        return 'bg-blue-500/20 text-blue-600';
      case 'cancelled':
        return 'bg-red-500/20 text-red-600';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-4 px-4 h-14">
          <Link to="/profile" className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-display font-bold text-lg">Reservation History</h1>
        </div>
      </header>

      <main className="p-4 pb-24">
        {reservations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-display font-bold mb-2">No Reservations</h2>
            <p className="text-muted-foreground mb-6">You haven't made any reservations yet.</p>
            <Button variant="accent" asChild>
              <Link to="/reservations">Make a Reservation</Link>
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {reservations.map((reservation, index) => (
              <motion.div
                key={reservation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">{reservation.id}</p>
                    <p className="font-semibold">{reservation.name}</p>
                  </div>
                  <span className={cn('px-3 py-1 rounded-full text-xs font-medium capitalize', getStatusColor(reservation.status))}>
                    {reservation.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{format(new Date(reservation.date), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{reservation.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{reservation.guests} guests</span>
                  </div>
                </div>

                {reservation.notes && (
                  <p className="text-sm text-muted-foreground mt-3 italic">"{reservation.notes}"</p>
                )}

                {reservation.status === 'pending' && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full mt-4"
                    onClick={() => cancelReservation(reservation.id)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel Reservation
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
