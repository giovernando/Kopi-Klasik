import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Gift, Clock, Tag, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  code: string;
  expiresAt: string;
  image: string;
}

export default function OffersPage() {
  const navigate = useNavigate();

  const offers: Offer[] = [
    {
      id: '1',
      title: 'Welcome Bonus',
      description: 'Get 20% off on your first order!',
      discount: '20% OFF',
      code: 'WELCOME20',
      expiresAt: '2025-02-28',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=200&fit=crop',
    },
    {
      id: '2',
      title: 'Happy Hour',
      description: 'Buy 1 Get 1 Free on all coffee drinks',
      discount: 'BOGO',
      code: 'HAPPYHOUR',
      expiresAt: '2025-01-31',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=200&fit=crop',
    },
    {
      id: '3',
      title: 'Weekend Special',
      description: 'Free pastry with any large coffee',
      discount: 'FREE ITEM',
      code: 'WEEKEND',
      expiresAt: '2025-01-20',
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=200&fit=crop',
    },
    {
      id: '4',
      title: 'Loyalty Reward',
      description: 'Rp 50.000 off for loyal customers',
      discount: 'Rp 50K',
      code: 'LOYAL50',
      expiresAt: '2025-03-15',
      image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&h=200&fit=crop',
    },
  ];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-display font-semibold">Offers & Promotions</h1>
        </div>
      </header>

      <div className="px-4 pt-6 space-y-4">
        {/* Active Offers */}
        {offers.map((offer, index) => (
          <motion.div
            key={offer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-border rounded-2xl overflow-hidden"
          >
            <div 
              className="h-28 bg-cover bg-center relative"
              style={{ backgroundImage: `url(${offer.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-4">
                <span className="px-3 py-1 bg-accent text-accent-foreground text-sm font-bold rounded-full">
                  {offer.discount}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-display font-semibold text-foreground">{offer.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{offer.description}</p>
              
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Expires {formatDate(offer.expiresAt)}</span>
                </div>
                <Button size="sm" variant="accent" onClick={() => navigate('/menu')}>
                  Use Now
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              <div className="mt-3 flex items-center gap-2 bg-secondary rounded-lg p-2">
                <Tag className="h-4 w-4 text-primary" />
                <code className="text-sm font-mono font-semibold text-foreground">
                  {offer.code}
                </code>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Empty State */}
        {offers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <Gift className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-foreground">No offers available</h3>
            <p className="text-sm text-muted-foreground text-center mt-1">
              Check back later for exciting promotions!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
