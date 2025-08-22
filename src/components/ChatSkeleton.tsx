import React from 'react';

export const ChatSkeleton: React.FC = () => {
  return (
    <div className="h-[600px] border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Área de mensagens */}
      <div className="flex-1 p-4 space-y-4 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-xs ${i % 2 === 0 ? 'mr-auto' : 'ml-auto'}`}>
              {i % 2 === 0 && (
                <div className="flex items-center space-x-2 mb-2">
                  <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              )}
              <div className={`p-3 rounded-lg ${
                i % 2 === 0 
                  ? 'bg-gray-100 dark:bg-gray-800' 
                  : 'bg-blue-500'
              }`}>
                <div className={`h-4 w-32 rounded animate-pulse ${
                  i % 2 === 0 
                    ? 'bg-gray-200 dark:bg-gray-700' 
                    : 'bg-white/20'
                }`} />
                {i % 3 === 0 && (
                  <div className={`h-3 w-20 mt-2 rounded animate-pulse ${
                    i % 2 === 0 
                      ? 'bg-gray-200 dark:bg-gray-700' 
                      : 'bg-white/20'
                  }`} />
                )}
              </div>
              <div className="text-xs mt-1">
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input de mensagem */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center space-x-2">
          <div className="h-10 flex-1 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};
