import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Clock, Check } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useReservationStore } from '@/stores/reservationStore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { PWAInstallPrompt } from '@/components/home/PWAInstallPrompt';

const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

export default function ReservationsPage() {
  const { toast } = useToast();
  const createReservation = useReservationStore((s) => s.createReservation);
  const reservations = useReservationStore((s) => s.reservations);

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = () => {
    if (!date || !time || !name || !phone) {
      toast({ title: 'Missing information', description: 'Please fill all fields', variant: 'destructive' });
      return;
    }
    createReservation({ date: new Date(date), time, guests, name, phone });
    toast({ title: 'Reservation Confirmed!', description: `Table for ${guests} on ${date} at ${time}` });
    setDate(''); setTime(''); setName(''); setPhone('');
  };

  return (
    <PageContainer title="Reserve a Table">
      <div className="space-y-6">
        {/* Date */}
        <div>
          <label className="text-sm font-medium flex items-center gap-2 mb-2"><Calendar className="h-4 w-4" />Select Date</label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
        </div>

        {/* Time */}
        <div>
          <label className="text-sm font-medium flex items-center gap-2 mb-2"><Clock className="h-4 w-4" />Select Time</label>
          <div className="grid grid-cols-4 gap-2">
            {timeSlots.map((slot) => (
              <button key={slot} onClick={() => setTime(slot)} className={cn('py-2 px-3 rounded-lg border text-sm font-medium transition-all', time === slot ? 'bg-accent text-accent-foreground border-accent' : 'border-border bg-card')}>
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Guests */}
        <div>
          <label className="text-sm font-medium flex items-center gap-2 mb-2"><Users className="h-4 w-4" />Number of Guests</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <button key={n} onClick={() => setGuests(n)} className={cn('flex-1 py-3 rounded-xl border font-semibold transition-all', guests === n ? 'bg-accent text-accent-foreground border-accent' : 'border-border bg-card')}>
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-3">
          <Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Phone number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>

        <Button variant="accent" size="lg" className="w-full" onClick={handleSubmit}>Confirm Reservation</Button>

        {/* Past Reservations */}
        {reservations.length > 0 && (
          <div className="pt-6 border-t border-border">
            <h3 className="font-display font-semibold mb-3">Your Reservations</h3>
            <div className="space-y-2">
              {reservations.slice(0, 3).map((res) => (
                <div key={res.id} className="bg-card border border-border rounded-xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center"><Check className="h-5 w-5 text-success" /></div>
                  <div className="flex-1">
                    <p className="font-medium">{new Date(res.date).toLocaleDateString()} at {res.time}</p>
                    <p className="text-sm text-muted-foreground">{res.guests} guests</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </PageContainer>
  );
}
