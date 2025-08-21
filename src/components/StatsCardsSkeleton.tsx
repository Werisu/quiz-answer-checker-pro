import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export const StatsCardsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6 animate-pulse">
      {/* Card de Amigos */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4">
        <div className="text-2xl font-bold text-white">
          <Skeleton className="h-8 w-12 bg-white/20" />
        </div>
        <div className="text-xs opacity-90 text-white">
          <Skeleton className="h-3 w-16 bg-white/20" />
        </div>
      </div>

              {/* Card de Amigos */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4">
        <div className="text-2xl font-bold text-white">
          <Skeleton className="h-8 w-8 bg-white/20" />
        </div>
        <div className="text-xs opacity-90 text-white">
          <Skeleton className="h-3 w-12 bg-white/20" />
        </div>
      </div>

      {/* Card de Pendentes */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4">
        <div className="text-2xl font-bold text-white">
          <Skeleton className="h-8 w-8 bg-white/20" />
        </div>
        <div className="text-xs opacity-90 text-white">
          <Skeleton className="h-3 w-20 bg-white/20" />
        </div>
      </div>
    </div>
  );
};
