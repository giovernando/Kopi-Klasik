import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, CreditCard, Wallet, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { haptics } from '@/utils/haptics';
import { cn } from '@/lib/utils';

interface PaymentMethod {
  id: string;
  type: 'card' | 'ewallet';
  name: string;
  details: string;
  icon: string;
  isDefault: boolean;
}

export default function PaymentMethodsPage() {
  const navigate = useNavigate();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      name: 'Visa',
      details: '**** **** **** 4242',
      icon: '💳',
      isDefault: true,
    },
    {
      id: '2',
      type: 'ewallet',
      name: 'GoPay',
      details: '+62 812 **** 5678',
      icon: '🟢',
      isDefault: false,
    },
    {
      id: '3',
      type: 'ewallet',
      name: 'OVO',
      details: '+62 812 **** 5678',
      icon: '🟣',
      isDefault: false,
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<'card' | 'ewallet'>('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    ewalletType: 'gopay',
    phone: '',
  });

  const handleSetDefault = (id: string) => {
    haptics.selection();
    setPaymentMethods(paymentMethods.map(pm => ({
      ...pm,
      isDefault: pm.id === id,
    })));
  };

  const handleDelete = (id: string) => {
    haptics.medium();
    setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
  };

  const handleAddCard = () => {
    haptics.success();
    const lastFour = formData.cardNumber.slice(-4) || '0000';
    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: 'card',
      name: 'Credit Card',
      details: `**** **** **** ${lastFour}`,
      icon: '💳',
      isDefault: paymentMethods.length === 0,
    };
    setPaymentMethods([...paymentMethods, newMethod]);
    setIsDialogOpen(false);
    setFormData({ cardNumber: '', cardName: '', expiry: '', cvv: '', ewalletType: 'gopay', phone: '' });
  };

  const handleAddEwallet = () => {
    haptics.success();
    const ewalletNames: Record<string, { name: string; icon: string }> = {
      gopay: { name: 'GoPay', icon: '🟢' },
      ovo: { name: 'OVO', icon: '🟣' },
      dana: { name: 'DANA', icon: '🔵' },
      shopeepay: { name: 'ShopeePay', icon: '🟠' },
    };
    const wallet = ewalletNames[formData.ewalletType];
    const maskedPhone = formData.phone.slice(0, 5) + ' **** ' + formData.phone.slice(-4);
    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: 'ewallet',
      name: wallet.name,
      details: maskedPhone,
      icon: wallet.icon,
      isDefault: paymentMethods.length === 0,
    };
    setPaymentMethods([...paymentMethods, newMethod]);
    setIsDialogOpen(false);
    setFormData({ cardNumber: '', cardName: '', expiry: '', cvv: '', ewalletType: 'gopay', phone: '' });
  };

  const ewalletOptions = [
    { id: 'gopay', name: 'GoPay', icon: '🟢' },
    { id: 'ovo', name: 'OVO', icon: '🟣' },
    { id: 'dana', name: 'DANA', icon: '🔵' },
    { id: 'shopeepay', name: 'ShopeePay', icon: '🟠' },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-display font-semibold">Payment Methods</h1>
        </div>
      </header>

      <div className="px-4 pt-6 space-y-6">
        {/* Cards Section */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Credit / Debit Cards
          </h2>
          <div className="space-y-3">
            {paymentMethods
              .filter(pm => pm.type === 'card')
              .map((method, index) => (
                <motion.div
                  key={method.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "relative bg-card border rounded-2xl p-4",
                    method.isDefault ? "border-primary" : "border-border"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{method.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{method.name}</h3>
                      <p className="text-sm text-muted-foreground font-mono">{method.details}</p>
                    </div>
                    {method.isDefault && (
                      <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                    {!method.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleSetDefault(method.id)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Set as Default
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete(method.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>

        {/* E-Wallets Section */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            E-Wallets
          </h2>
          <div className="space-y-3">
            {paymentMethods
              .filter(pm => pm.type === 'ewallet')
              .map((method, index) => (
                <motion.div
                  key={method.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "relative bg-card border rounded-2xl p-4",
                    method.isDefault ? "border-primary" : "border-border"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{method.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{method.name}</h3>
                      <p className="text-sm text-muted-foreground">{method.details}</p>
                    </div>
                    {method.isDefault && (
                      <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                    {!method.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleSetDefault(method.id)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Set as Default
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete(method.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>

        {/* Add New Payment Method */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-14 border-dashed border-2"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Payment Method
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md mx-4">
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {/* Type Selector */}
              <div className="flex gap-2">
                <Button
                  variant={paymentType === 'card' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setPaymentType('card')}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Card
                </Button>
                <Button
                  variant={paymentType === 'ewallet' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setPaymentType('ewallet')}
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  E-Wallet
                </Button>
              </div>

              {paymentType === 'card' ? (
                <>
                  <div>
                    <Label>Card Number</Label>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      className="mt-1 font-mono"
                      maxLength={19}
                    />
                  </div>
                  <div>
                    <Label>Cardholder Name</Label>
                    <Input
                      placeholder="John Doe"
                      value={formData.cardName}
                      onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Label>Expiry</Label>
                      <Input
                        placeholder="MM/YY"
                        value={formData.expiry}
                        onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                        className="mt-1"
                        maxLength={5}
                      />
                    </div>
                    <div className="flex-1">
                      <Label>CVV</Label>
                      <Input
                        placeholder="123"
                        value={formData.cvv}
                        onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                        className="mt-1"
                        maxLength={4}
                        type="password"
                      />
                    </div>
                  </div>
                  <Button className="w-full" onClick={handleAddCard}>
                    Add Card
                  </Button>
                </>
              ) : (
                <>
                  <div>
                    <Label>Select E-Wallet</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {ewalletOptions.map((wallet) => (
                        <Button
                          key={wallet.id}
                          variant={formData.ewalletType === wallet.id ? 'default' : 'outline'}
                          className="h-12 justify-start"
                          onClick={() => setFormData({ ...formData, ewalletType: wallet.id })}
                        >
                          <span className="mr-2">{wallet.icon}</span>
                          {wallet.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Input
                      placeholder="+62 812 3456 7890"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <Button className="w-full" onClick={handleAddEwallet}>
                    Link E-Wallet
                  </Button>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
