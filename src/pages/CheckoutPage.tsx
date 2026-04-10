import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Truck, Store, CreditCard, Wallet, Banknote, ChevronRight, User, Phone, Bookmark, ChevronDown, UtensilsCrossed, Clock } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useCartStore } from '@/stores/cartStore';
import { useOrderStore } from '@/stores/orderStore';
import { useAddressStore, SavedAddress } from '@/stores/addressStore';
import { DeliveryMethod, PaymentMethod } from '@/types';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

const deliveryOptions = [
  { id: 'dine_in' as DeliveryMethod, label: 'Dine In', icon: UtensilsCrossed, fee: 0, desc: 'Makan di tempat' },
  { id: 'pickup' as DeliveryMethod, label: 'Pickup', icon: Store, fee: 0, desc: 'Ambil di kasir' },
  { id: 'delivery' as DeliveryMethod, label: 'Delivery', icon: Truck, fee: 15000, desc: 'Antar ke alamat' },
];

const paymentOptions = [
  { id: 'ewallet' as PaymentMethod, label: 'E-Wallet', icon: Wallet, desc: 'GoPay, OVO, Dana' },
  { id: 'bank_transfer' as PaymentMethod, label: 'Bank Transfer', icon: CreditCard, desc: 'BCA, Mandiri, BNI' },
  { id: 'cash' as PaymentMethod, label: 'Cash', icon: Banknote, desc: 'Bayar langsung' },
];

const deliveryFormSchema = z.object({
  name: z.string().trim().min(1, 'Nama harus diisi').max(100, 'Nama maksimal 100 karakter'),
  phone: z.string().trim().min(10, 'Nomor telepon minimal 10 digit').max(15, 'Nomor telepon maksimal 15 digit').regex(/^[0-9+\-\s]+$/, 'Format nomor telepon tidak valid'),
  address: z.string().trim().min(10, 'Alamat minimal 10 karakter').max(500, 'Alamat maksimal 500 karakter'),
});

const formVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.98 },
};

const cardHover = {
  scale: 1.01,
  transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
};

const cardTap = {
  scale: 0.98,
  transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
};

// Generate pickup time options (every 15 min for next 3 hours)
function generatePickupTimes(): string[] {
  const times: string[] = [];
  const now = new Date();
  const start = new Date(now.getTime() + 15 * 60 * 1000); // Start 15min from now
  start.setMinutes(Math.ceil(start.getMinutes() / 15) * 15, 0, 0);
  
  for (let i = 0; i < 12; i++) {
    const t = new Date(start.getTime() + i * 15 * 60 * 1000);
    times.push(t.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
  }
  return times;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const subtotal = useCartStore((s) => s.getSubtotal());
  const { deliveryMethod, paymentMethod, deliveryFee, setDeliveryMethod, setPaymentMethod, setDeliveryAddress, createOrder } = useOrderStore();
  const { savedAddresses, addAddress, getDefaultAddress } = useAddressStore();

  // Dine In state
  const [tableNumber, setTableNumber] = useState('');

  // Pickup state
  const [pickupName, setPickupName] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const pickupTimes = generatePickupTimes();

  // Delivery state
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveAddress, setSaveAddress] = useState(false);
  const [showSavedAddresses, setShowSavedAddresses] = useState(false);
  const [selectedSavedAddress, setSelectedSavedAddress] = useState<SavedAddress | null>(null);

  useEffect(() => {
    const defaultAddr = getDefaultAddress();
    if (defaultAddr) {
      setFormData({ name: defaultAddr.name, phone: defaultAddr.phone, address: defaultAddr.address });
      setSelectedSavedAddress(defaultAddr);
    }
  }, [getDefaultAddress]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSelectedSavedAddress(null);
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined! }));
  };

  const handleSelectSavedAddress = (address: SavedAddress) => {
    setFormData({ name: address.name, phone: address.phone, address: address.address });
    setSelectedSavedAddress(address);
    setShowSavedAddresses(false);
    setErrors({});
  };

  const validateForm = (): boolean => {
    if (deliveryMethod === 'dine_in') {
      if (!tableNumber.trim()) {
        toast({ title: 'Nomor meja harus diisi', variant: 'destructive' });
        return false;
      }
      return true;
    }
    if (deliveryMethod === 'pickup') {
      if (!pickupName.trim()) {
        toast({ title: 'Nama harus diisi', variant: 'destructive' });
        return false;
      }
      if (!pickupTime) {
        toast({ title: 'Pilih jam pengambilan', variant: 'destructive' });
        return false;
      }
      return true;
    }
    // delivery
    const result = deliveryFormSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handlePlaceOrder = () => {
    if (!validateForm()) {
      if (deliveryMethod === 'delivery') {
        toast({ title: 'Form tidak lengkap', description: 'Mohon lengkapi semua data pengiriman', variant: 'destructive' });
      }
      return;
    }

    if (deliveryMethod === 'delivery') {
      if (saveAddress && !selectedSavedAddress) {
        addAddress({
          name: formData.name, phone: formData.phone, address: formData.address,
          label: 'Alamat Pengiriman', isDefault: savedAddresses.length === 0,
        });
        toast({ title: 'Alamat tersimpan', description: 'Alamat berhasil disimpan untuk pengiriman berikutnya' });
      }
      setDeliveryAddress({ label: 'Delivery', fullAddress: formData.address });
    }

    createOrder({
      tableNumber: deliveryMethod === 'dine_in' ? tableNumber : undefined,
      customerName: deliveryMethod === 'pickup' ? pickupName : undefined,
      pickupTime: deliveryMethod === 'pickup' ? pickupTime : undefined,
    });
    navigate('/order-success');
  };

  const isFormComplete = (() => {
    if (!deliveryMethod || !paymentMethod) return false;
    if (deliveryMethod === 'dine_in') return !!tableNumber.trim();
    if (deliveryMethod === 'pickup') return !!pickupName.trim() && !!pickupTime;
    return !!(formData.name.trim() && formData.phone.trim() && formData.address.trim());
  })();

  return (
    <PageContainer title="Checkout" showBack noBottomNav>
      <div className="space-y-6 pb-32">
        {/* Order Type */}
        <section>
          <h2 className="font-display font-semibold mb-3">Tipe Pesanan</h2>
          <div className="grid grid-cols-3 gap-2">
            {deliveryOptions.map((opt) => (
              <motion.button
                key={opt.id}
                whileHover={cardHover}
                whileTap={cardTap}
                onClick={() => {
                  setDeliveryMethod(opt.id);
                  setErrors({});
                }}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-colors',
                  deliveryMethod === opt.id
                    ? 'border-accent bg-accent/10'
                    : 'border-border bg-card hover:border-accent/40'
                )}
              >
                <motion.div
                  animate={deliveryMethod === opt.id ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <opt.icon className={cn('h-6 w-6', deliveryMethod === opt.id ? 'text-accent' : 'text-muted-foreground')} />
                </motion.div>
                <span className="font-semibold text-sm">{opt.label}</span>
                <span className="text-xs text-muted-foreground">{opt.fee === 0 ? 'Gratis' : formatPrice(opt.fee)}</span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Dynamic Form Area */}
        <AnimatePresence mode="wait">
          {deliveryMethod === 'dine_in' && (
            <motion.section
              key="dine_in"
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-card border border-border rounded-2xl p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <UtensilsCrossed className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h2 className="font-display font-semibold">Dine In</h2>
                  <p className="text-xs text-muted-foreground">Masukkan nomor meja Anda</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tableNumber" className="text-sm font-medium">
                  Nomor Meja <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="tableNumber"
                  type="number"
                  placeholder="Contoh: 12"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="text-center text-2xl font-bold h-16 tracking-widest"
                  min={1}
                  max={100}
                />
              </div>
            </motion.section>
          )}

          {deliveryMethod === 'pickup' && (
            <motion.section
              key="pickup"
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-card border border-border rounded-2xl p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Store className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h2 className="font-display font-semibold">Pickup</h2>
                  <p className="text-xs text-muted-foreground">Isi nama dan pilih jam pengambilan</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pickupName" className="text-sm font-medium">
                    Nama Customer <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="pickupName"
                      placeholder="Nama untuk pengambilan"
                      value={pickupName}
                      onChange={(e) => setPickupName(e.target.value)}
                      className="pl-11"
                      maxLength={100}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Jam Pengambilan <span className="text-destructive">*</span>
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {pickupTimes.map((time) => (
                      <motion.button
                        key={time}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setPickupTime(time)}
                        className={cn(
                          'flex items-center justify-center gap-1.5 p-3 rounded-xl border-2 text-sm font-medium transition-colors',
                          pickupTime === time
                            ? 'border-accent bg-accent/10 text-accent'
                            : 'border-border bg-background hover:border-accent/40'
                        )}
                      >
                        <Clock className="h-3.5 w-3.5" />
                        {time}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {deliveryMethod === 'delivery' && (
            <motion.section
              key="delivery"
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-card border border-border rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Truck className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h2 className="font-display font-semibold">Data Pengiriman</h2>
                    <p className="text-xs text-muted-foreground">Isi alamat lengkap tujuan</p>
                  </div>
                </div>
                {savedAddresses.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setShowSavedAddresses(!showSavedAddresses)}
                    className="text-sm font-medium flex items-center gap-1 text-accent"
                  >
                    <Bookmark className="h-4 w-4" />
                    Tersimpan
                    <ChevronDown className={cn("h-4 w-4 transition-transform", showSavedAddresses && "rotate-180")} />
                  </motion.button>
                )}
              </div>

              <AnimatePresence>
                {showSavedAddresses && savedAddresses.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 space-y-2 overflow-hidden"
                  >
                    {savedAddresses.map((addr) => (
                      <motion.button
                        key={addr.id}
                        whileHover={cardHover}
                        whileTap={cardTap}
                        type="button"
                        onClick={() => handleSelectSavedAddress(addr)}
                        className={cn(
                          "w-full text-left p-3 rounded-xl border-2 transition-colors",
                          selectedSavedAddress?.id === addr.id
                            ? "border-accent bg-accent/10"
                            : "border-border bg-background hover:border-accent/50"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <MapPin className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm truncate">{addr.name}</p>
                              {addr.isDefault && (
                                <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">Default</span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{addr.phone}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2">{addr.address}</p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Nama Penerima <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="name" placeholder="Masukkan nama lengkap" value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={cn('pl-11', errors.name && 'border-destructive focus-visible:ring-destructive')}
                      maxLength={100} />
                  </div>
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Nomor Telepon <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="phone" type="tel" placeholder="08xxxxxxxxxx" value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={cn('pl-11', errors.phone && 'border-destructive focus-visible:ring-destructive')}
                      maxLength={15} />
                  </div>
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium">
                    Alamat Lengkap <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 h-4 w-4 text-muted-foreground" />
                    <textarea id="address"
                      placeholder="Masukkan alamat lengkap (nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan)"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={cn(
                        'w-full min-h-[100px] pl-11 pr-4 py-3 rounded-md border bg-background text-sm resize-none',
                        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                        errors.address ? 'border-destructive focus:ring-destructive' : 'border-input'
                      )}
                      maxLength={500} />
                  </div>
                  {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
                  <p className="text-xs text-muted-foreground">{formData.address.length}/500 karakter</p>
                </div>

                {!selectedSavedAddress && (
                  <div className="flex items-center gap-3 pt-2">
                    <Checkbox id="saveAddress" checked={saveAddress}
                      onCheckedChange={(checked) => setSaveAddress(checked === true)}
                      className="border-2 data-[state=checked]:bg-accent data-[state=checked]:border-accent" />
                    <label htmlFor="saveAddress" className="text-sm cursor-pointer select-none text-muted-foreground">
                      Simpan alamat untuk pengiriman berikutnya
                    </label>
                  </div>
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Payment Method */}
        <section>
          <h2 className="font-display font-semibold mb-3">Metode Pembayaran</h2>
          <div className="space-y-2">
            {paymentOptions.map((opt) => (
              <motion.button
                key={opt.id}
                whileHover={cardHover}
                whileTap={cardTap}
                onClick={() => setPaymentMethod(opt.id)}
                className={cn(
                  'w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-colors',
                  paymentMethod === opt.id ? 'border-accent bg-accent/10' : 'border-border bg-card'
                )}
              >
                <opt.icon className={cn('h-5 w-5', paymentMethod === opt.id ? 'text-accent' : 'text-muted-foreground')} />
                <div className="flex-1 text-left">
                  <p className="font-medium">{opt.label}</p>
                  <p className="text-xs text-muted-foreground">{opt.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </motion.button>
            ))}
          </div>
        </section>

        {/* Summary */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-4"
        >
          <h2 className="font-display font-semibold mb-3">Ringkasan Pesanan</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ongkos Kirim</span>
              <span>{deliveryFee === 0 ? 'Gratis' : formatPrice(deliveryFee)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border text-lg font-bold">
              <span>Total</span>
              <span className="text-accent">{formatPrice(subtotal + deliveryFee)}</span>
            </div>
          </div>
        </motion.section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 safe-bottom">
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
          <Button variant="accent" size="lg" className="w-full" onClick={handlePlaceOrder} disabled={!isFormComplete}>
            Pesan Sekarang • {formatPrice(subtotal + deliveryFee)}
          </Button>
        </motion.div>
      </div>
    </PageContainer>
  );
}
