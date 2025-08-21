import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users } from 'lucide-react';
import React from 'react';

export const SocialWidgetSkeleton: React.FC = () => {
  return (
    <Card className="animate-pulse">
      <CardHeader className="pb-3 p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 lg:space-x-2">
            <Users className="h-4 w-4 lg:h-5 lg:w-5 text-muted-foreground" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>
          
          <div className="flex items-center space-x-1 lg:space-x-2">
            <Skeleton className="h-7 w-7 lg:h-8 lg:w-8 rounded" />
            <Skeleton className="h-7 w-7 lg:h-8 lg:w-8 rounded" />
          </div>
        </div>
        <Skeleton className="h-4 w-48" />
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Estatísticas Rápidas - Otimizadas */}
        <div className="grid grid-cols-3 gap-1 sm:gap-2 lg:gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="text-center p-1 sm:p-2 lg:p-3 bg-muted/50 rounded-lg">
              <Skeleton className="h-6 w-8 mx-auto mb-1" />
              <Skeleton className="h-3 w-12 mx-auto" />
            </div>
          ))}
        </div>

        {/* Amigos Online - Skeleton otimizado */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-16 rounded" />
          </div>
          
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-2 p-2 rounded-lg">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-20 flex-1" />
                <div className="flex space-x-1">
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-5 w-5 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Solicitações Pendentes - Skeleton otimizado */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-6 w-20 rounded" />
          </div>
          
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-2 p-2 rounded-lg bg-muted/30">
                <Skeleton className="h-6 w-6 rounded-full" />
                <div className="flex-1 min-w-0">
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ações Rápidas - Skeleton otimizado */}
        <div className="pt-2 border-t border-border">
          <div className="flex flex-col xl:flex-row xl:space-x-2 space-y-2 xl:space-y-0">
            <Skeleton className="h-9 w-full rounded-lg" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
