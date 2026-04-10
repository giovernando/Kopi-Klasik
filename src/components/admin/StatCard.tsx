import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
}

export function StatCard({ title, value, change, changeType = 'neutral', icon: Icon, iconColor = 'bg-[#6F4E37]' }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-5 border border-[#E5DDD3] shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#6F4E37]/70 font-medium">{title}</p>
          <p className="text-2xl font-bold text-[#2E2E2E] mt-1">{value}</p>
          {change && (
            <p className={cn(
              "text-sm mt-1 font-medium",
              changeType === 'positive' && "text-green-600",
              changeType === 'negative' && "text-red-600",
              changeType === 'neutral' && "text-[#6F4E37]/60"
            )}>
              {change}
            </p>
          )}
        </div>
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", iconColor)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
