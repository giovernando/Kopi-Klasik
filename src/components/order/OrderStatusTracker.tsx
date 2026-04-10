import { motion } from 'framer-motion';
import { Check, Clock, Coffee, Package, Truck, MapPin } from 'lucide-react';
import { OrderStatus, DeliveryMethod } from '@/types';
import { cn } from '@/lib/utils';

interface OrderStatusTrackerProps {
  status: OrderStatus;
  deliveryMethod: DeliveryMethod;
  estimatedDelivery?: Date;
}

const getStepsForDelivery = (deliveryMethod: DeliveryMethod) => {
  const baseSteps = [
    { id: 'pending', label: 'Order Placed', icon: Clock },
    { id: 'confirmed', label: 'Confirmed', icon: Check },
    { id: 'preparing', label: 'Preparing', icon: Coffee },
    { id: 'ready', label: 'Ready', icon: Package },
  ];

  if (deliveryMethod === 'pickup') {
    return [...baseSteps, { id: 'completed', label: 'Picked Up', icon: MapPin }];
  }

  return [
    ...baseSteps,
    { id: 'delivering', label: 'On the Way', icon: Truck },
    { id: 'completed', label: 'Delivered', icon: MapPin },
  ];
};

const statusOrder: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'completed'];

export default function OrderStatusTracker({ status, deliveryMethod, estimatedDelivery }: OrderStatusTrackerProps) {
  const steps = getStepsForDelivery(deliveryMethod);
  const currentIndex = statusOrder.indexOf(status);

  const getStepStatus = (stepId: string) => {
    const stepIndex = statusOrder.indexOf(stepId as OrderStatus);
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-semibold">Order Status</h3>
        {estimatedDelivery && status !== 'completed' && status !== 'cancelled' && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>~{Math.max(0, Math.round((new Date(estimatedDelivery).getTime() - Date.now()) / 60000))} min</span>
          </div>
        )}
      </div>

      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-border" />
        <motion.div
          className="absolute left-5 top-5 w-0.5 bg-accent"
          initial={{ height: 0 }}
          animate={{ height: `${(Math.max(0, currentIndex) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step, index) => {
            const stepStatus = getStepStatus(step.id);
            const Icon = step.icon;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 relative"
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300',
                    stepStatus === 'completed' && 'bg-accent text-accent-foreground',
                    stepStatus === 'current' && 'bg-accent text-accent-foreground ring-4 ring-accent/30',
                    stepStatus === 'upcoming' && 'bg-muted text-muted-foreground'
                  )}
                >
                  {stepStatus === 'completed' ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={cn(
                      'font-medium transition-colors',
                      stepStatus === 'current' && 'text-accent',
                      stepStatus === 'upcoming' && 'text-muted-foreground'
                    )}
                  >
                    {step.label}
                  </p>
                  {stepStatus === 'current' && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-muted-foreground"
                    >
                      In progress...
                    </motion.p>
                  )}
                </div>
                {stepStatus === 'current' && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-2 h-2 rounded-full bg-accent"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
