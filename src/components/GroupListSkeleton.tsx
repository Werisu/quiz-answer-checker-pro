import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search } from 'lucide-react';
import React from 'react';

export const GroupListSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header com botões de ação */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center space-x-2">
            <Plus className="h-4 w-4 text-muted-foreground" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Grid de grupos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="border-0 shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header do grupo */}
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 3 }).map((_, tagIndex) => (
                    <Skeleton key={tagIndex} className="h-6 w-16 rounded-full" />
                  ))}
                </div>

                {/* Estatísticas */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  {Array.from({ length: 3 }).map((_, statIndex) => (
                    <div key={statIndex}>
                      <Skeleton className="h-5 w-8 mx-auto mb-1" />
                      <Skeleton className="h-3 w-12 mx-auto" />
                    </div>
                  ))}
                </div>

                {/* Ações */}
                <div className="flex space-x-2 pt-2">
                  <Skeleton className="h-8 w-20 rounded-lg" />
                  <Skeleton className="h-8 w-20 rounded-lg" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-center space-x-2 pt-6">
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    </div>
  );
};
