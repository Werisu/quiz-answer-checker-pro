import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export const ChatSkeleton: React.FC = () => {
  return (
    <Card className="h-[600px] border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden animate-pulse">
      <CardHeader className="border-b border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 h-full flex flex-col">
        {/* Área de mensagens */}
        <div className="flex-1 p-4 space-y-4 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-xs ${i % 2 === 0 ? 'mr-auto' : 'ml-auto'}`}>
                {i % 2 === 0 && (
                  <div className="flex items-center space-x-2 mb-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                )}
                <div className={`p-3 rounded-lg ${
                  i % 2 === 0 
                    ? 'bg-gray-100 dark:bg-gray-800' 
                    : 'bg-blue-500 text-white'
                }`}>
                  <Skeleton className={`h-4 w-32 ${i % 2 === 0 ? '' : 'bg-white/20'}`} />
                  {i % 3 === 0 && (
                    <Skeleton className={`h-3 w-20 mt-2 ${i % 2 === 0 ? '' : 'bg-white/20'}`} />
                  )}
                </div>
                <div className={`text-xs mt-1 ${i % 2 === 0 ? 'text-gray-500' : 'text-blue-400'}`}>
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input de mensagem */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-10 flex-1 rounded-lg" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
