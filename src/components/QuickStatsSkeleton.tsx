import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export const QuickStatsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-3 animate-pulse">
      {/* Estatística de Engajamento */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-0 shadow-sm rounded-2xl">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-10 h-10 rounded-xl bg-blue-200 dark:bg-blue-800" />
            <div>
              <Skeleton className="h-6 w-16 bg-blue-200 dark:bg-blue-800 mb-1" />
              <Skeleton className="h-3 w-20 bg-blue-200 dark:bg-blue-800" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatística de Sessões */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-0 shadow-sm rounded-2xl">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-10 h-10 rounded-xl bg-green-200 dark:bg-green-800" />
            <div>
              <Skeleton className="h-6 w-8 bg-green-200 dark:bg-green-800 mb-1" />
              <Skeleton className="h-3 w-16 bg-green-200 dark:bg-green-800" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
