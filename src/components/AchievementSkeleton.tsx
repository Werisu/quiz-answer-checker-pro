import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export const AchievementSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-gray-100 dark:bg-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progresso para próximo nível */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Skeleton className="w-5 h-5 rounded" />
              <Skeleton className="h-5 w-48" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-3 w-full rounded-full" />
              <div className="text-center">
                <Skeleton className="h-4 w-40 mx-auto" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progresso por categoria */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="w-4 h-4 rounded" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-5 w-12 rounded-full" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const AchievementCardSkeleton: React.FC = () => {
  return (
    <Card className="bg-white dark:bg-gray-900 border-0 shadow-sm rounded-2xl">
      <CardContent className="p-6">
        <div className="space-y-4 animate-pulse">
          {/* Header */}
          <div className="flex items-center space-x-3">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="w-16 h-6 rounded-full" />
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-3 w-full rounded-full" />
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <div className="space-y-1">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-3 w-full" />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const AchievementListSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Header com filtros */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>

      {/* Grid de conquistas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <AchievementCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};
