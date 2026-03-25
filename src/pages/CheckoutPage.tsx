import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Truck, Store, CreditCard, Wallet, Banknote, ChevronRight, User, Phone, Bookmark, ChevronDown } from 'lucide-react';
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
  { id: 'pickup' as DeliveryMethod, label: 'Pickup', icon: Store, fee: 0 },
  { id: 'grab' as DeliveryMethod, label: 'Grab', icon: Truck, fee: 15000 },
  { id: 'gojek' as DeliveryMethod, label: 'Gojek', icon: Truck, fee: 12000 },
];

const paymentOptions = [
  { id: 'ewallet' as PaymentMethod, label: 'E-Wallet', icon: Wallet, desc: 'GoPay, OVO, Dana' },
  { id: 'bank_transfer' as PaymentMethod, label: 'Bank Transfer', icon: CreditCard, desc: 'BCA, Mandiri, BNI' },
  { id: 'cash' as PaymentMethod, label: 'Cash', icon: Banknote, desc: 'Pay on delivery/pickup' },
];

// Validation schema
const deliveryFormSchema = z.object({
  name: z.string().trim().min(1, 'Nama harus diisi').max(100, 'Nama maksimal 100 karakter'),
  phone: z.string().trim().min(10, 'Nomor telepon minimal 10 digit').max(15, 'Nomor telepon maksimal 15 digit').regex(/^[0-9+\-\s]+$/, 'Format nomor telepon tidak valid'),
  address: z.string().trim().min(10, 'Alamat minimal 10 karakter').max(500, 'Alamat maksimal 500 karakter'),
});

interface DeliveryFormData {
  name: string;
  phone: string;
  address: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  address?: string;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const subtotal = useCartStore((s) => s.getSubtotal());
  const { deliveryMethod, paymentMethod, deliveryFee, setDeliveryMethod, setPaymentMethod, setDeliveryAddress, createOrder } = useOrderStore();
  const { savedAddresses, addAddress, getDefaultAddress } = useAddressStore();
  
  const [formData, setFormData] = useState<DeliveryFormData>({
    name: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [saveAddress, setSaveAddress] = useState(false);
  const [showSavedAddresses, setShowSavedAddresses] = useState(false);
  const [selectedSavedAddress, setSelectedSavedAddress] = useState<SavedAddress | null>(null);

  // Load default address on mount
  useEffect(() => {
    const defaultAddr = getDefaultAddress();
    if (defaultAddr) {
      setFormData({
        name: defaultAddr.name,
        phone: defaultAddr.phone,
        address: defaultAddr.address,
      });
      setSelectedSavedAddress(defaultAddr);
    }
  }, [getDefaultAddress]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  const handleInputChange = (field: keyof DeliveryFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSelectedSavedAddress(null); // Clear selected saved address when user edits
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSelectSavedAddress = (address: SavedAddress) => {
    setFormData({
      name: address.name,
      phone: address.phone,
      address: address.address,
    });
    setSelectedSavedAddress(address);
    setShowSavedAddresses(false);
    setErrors({});
  };

  const validateForm = (): boolean => {
    if (deliveryMethod === 'pickup') return true;
    
    const result = deliveryFormSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.errors.forEach(err => {
        const field = err.path[0] as keyof FormErrors;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const isDeliveryMethod = deliveryMethod === 'grab' || deliveryMethod === 'gojek';

  const handlePlaceOrder = () => {
    if (!validateForm()) {
      toast({
        title: 'Form tidak lengkap',
        description: 'Mohon lengkapi semua data pengiriman',
        variant: 'destructive',
      });
      return;
    }
    
    if (isDeliveryMethod) {
      // Save address if checkbox is checked
      if (saveAddress && !selectedSavedAddress) {
        addAddress({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          label: 'Alamat Pengiriman',
          isDefault: savedAddresses.length === 0, // Make default if first address
        });
        toast({
          title: 'Alamat tersimpan',
          description: 'Alamat berhasil disimpan untuk pengiriman berikutnya',
        });
      }
      
      setDeliveryAddress({ 
        label: 'Delivery', 
        fullAddress: formData.address,
      });
    }
    createOrder();
    navigate('/order-success');
  };

  const isFormComplete = deliveryMethod === 'pickup' || 
    (formData.name.trim() && formData.phone.trim() && formData.address.trim());

  return (
    <PageContainer title="Checkout" showBack noBottomNav>
      <div className="space-y-6 pb-32">
        {/* Delivery Method */}
        <section>
          <h2 className="font-display font-semibold mb-3">Metode Pengiriman</h2>
          <div className="space-y-2">
            {deliveryOptions.map((opt) => (
              <button 
                key={opt.id} 
                onClick={() => {
                  setDeliveryMethod(opt.id);
                  setErrors({});
                }} 
                className={cn(
                  'w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all',
                  deliveryMethod === opt.id ? 'border-accent bg-accent/10' : 'border-border bg-card'
                )}
              >
                <opt.icon className="h-5 w-5" />
                <span className="flex-1 text-left font-medium">{opt.label}</span>
                <span className="text-muted-foreground">{opt.fee === 0 ? 'Gratis' : formatPrice(opt.fee)}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Delivery Form - Only show for Grab or Gojek */}
        {isDeliveryMethod && (
          <motion.section 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-card border border-border rounded-2xl p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold">Data Pengiriman</h2>
              {savedAddresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowSavedAddresses(!showSavedAddresses)}
                  className="text-sm font-medium flex items-center gap-1 text-accent"
                >
                  <Bookmark className="h-4 w-4" />
                  Alamat Tersimpan
                  <ChevronDown className={cn("h-4 w-4 transition-transform", showSavedAddresses && "rotate-180")} />
                </button>
              )}
            </div>

            {/* Saved Addresses Dropdown */}
            {showSavedAddresses && savedAddresses.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 space-y-2"
              >
                {savedAddresses.map((addr) => (
                  <button
                    key={addr.id}
                    type="button"
                    onClick={() => handleSelectSavedAddress(addr)}
                    className={cn(
                      "w-full text-left p-3 rounded-xl border-2 transition-all",
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
                            <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{addr.phone}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{addr.address}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}

            <div className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Nama Penerima <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="name"
                    placeholder="Masukkan nama lengkap" 
                    value={formData.name} 
                    onChange={(e) => handleInputChange('name', e.target.value)} 
                    className={cn('pl-11', errors.name && 'border-destructive focus-visible:ring-destructive')}
                    maxLength={100}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name}</p>
                )}
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Nomor Telepon <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="phone"
                    type="tel"
                    placeholder="08xxxxxxxxxx" 
                    value={formData.phone} 
                    onChange={(e) => handleInputChange('phone', e.target.value)} 
                    className={cn('pl-11', errors.phone && 'border-destructive focus-visible:ring-destructive')}
                    maxLength={15}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-destructive">{errors.phone}</p>
                )}
              </div>

              {/* Address Field */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium">
                  Alamat Lengkap <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 h-4 w-4 text-muted-foreground" />
                  <textarea 
                    id="address"
                    placeholder="Masukkan alamat lengkap (nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan)" 
                    value={formData.address} 
                    onChange={(e) => handleInputChange('address', e.target.value)} 
                    className={cn(
                      'w-full min-h-[100px] pl-11 pr-4 py-3 rounded-md border bg-background text-sm resize-none',
                      'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                      errors.address ? 'border-destructive focus:ring-destructive' : 'border-input'
                    )}
                    maxLength={500}
                  />
                </div>
                {errors.address && (
                  <p className="text-xs text-destructive">{errors.address}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {formData.address.length}/500 karakter
                </p>
              </div>

              {/* Save Address Checkbox */}
              {!selectedSavedAddress && (
                <div className="flex items-center gap-3 pt-2">
                  <Checkbox
                    id="saveAddress"
                    checked={saveAddress}
                    onCheckedChange={(checked) => setSaveAddress(checked === true)}
                    className="border-2 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                  />
                  <label 
                    htmlFor="saveAddress" 
                    className="text-sm cursor-pointer select-none text-muted-foreground"
                  >
                    Simpan alamat untuk pengiriman berikutnya
                  </label>
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* Payment Method */}
        <section>
          <h2 className="font-display font-semibold mb-3">Metode Pembayaran</h2>
          <div className="space-y-2">
            {paymentOptions.map((opt) => (
              <button 
                key={opt.id} 
                onClick={() => setPaymentMethod(opt.id)} 
                className={cn(
                  'w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all',
                  paymentMethod === opt.id ? 'border-accent bg-accent/10' : 'border-border bg-card'
                )}
              >
                <opt.icon className="h-5 w-5" />
                <div className="flex-1 text-left">
                  <p className="font-medium">{opt.label}</p>
                  <p className="text-xs text-muted-foreground">{opt.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </section>

        {/* Summary */}
        <section className="bg-card border border-border rounded-2xl p-4">
          <h2 className="font-display font-semibold mb-3">Ringkasan Pesanan</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ongkos Kirim</span>
              <span>{formatPrice(deliveryFee)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border text-lg font-bold">
              <span>Total</span>
              <span className="text-accent">{formatPrice(subtotal + deliveryFee)}</span>
            </div>
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 safe-bottom">
        <Button 
          variant="accent" 
          size="lg" 
          className="w-full" 
          onClick={handlePlaceOrder} 
          disabled={!deliveryMethod || !paymentMethod || !isFormComplete}
        >
          Pesan Sekarang • {formatPrice(subtotal + deliveryFee)}
        </Button>
      </div>
    </PageContainer>
  );
}