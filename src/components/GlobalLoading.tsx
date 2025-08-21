import { useLoading } from '@/contexts/LoadingContext';
import { Loader2 } from 'lucide-react';
import React from 'react';

export const GlobalLoading: React.FC = () => {
  const { isAnyLoading } = useLoading();

  if (!isAnyLoading) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-pulse">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm font-medium">Carregando...</span>
      </div>
    </div>
  );
};

// Componente de loading para botões
export const LoadingButton: React.FC<{
  loading: boolean;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  onClick?: () => void;
}> = ({ 
  loading, 
  children, 
  className = '', 
  variant = 'default',
  size = 'default',
  disabled = false,
  onClick 
}) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background ${
        variant === 'default' ? 'bg-primary text-primary-foreground hover:bg-primary/90' :
        variant === 'destructive' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' :
        variant === 'outline' ? 'border border-input hover:bg-accent hover:text-accent-foreground' :
        variant === 'secondary' ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' :
        variant === 'ghost' ? 'hover:bg-accent hover:text-accent-foreground' :
        variant === 'link' ? 'underline-offset-4 hover:underline text-primary' : ''
      } ${
        size === 'default' ? 'h-10 px-4 py-2' :
        size === 'sm' ? 'h-9 px-3' :
        size === 'lg' ? 'h-11 px-8' :
        size === 'icon' ? 'h-10 w-10' : ''
      } ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      {children}
    </button>
  );
};

// Componente de loading para cards
export const LoadingCard: React.FC<{
  loading: boolean;
  children: React.ReactNode;
  className?: string;
  skeleton?: React.ReactNode;
}> = ({ loading, children, className = '', skeleton }) => {
  if (loading) {
    return skeleton || (
      <div className={`animate-pulse ${className}`}>
        <div className="bg-muted rounded-lg p-4">
          <div className="space-y-3">
            <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
            <div className="h-4 bg-muted-foreground/20 rounded w-1/2"></div>
            <div className="h-4 bg-muted-foreground/20 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return <div className={className}>{children}</div>;
};

// Componente de loading para listas
export const LoadingList: React.FC<{
  loading: boolean;
  children: React.ReactNode;
  className?: string;
  itemCount?: number;
}> = ({ loading, children, className = '', itemCount = 3 }) => {
  if (loading) {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: itemCount }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-muted-foreground/20 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted-foreground/20 rounded w-1/4"></div>
                  <div className="h-3 bg-muted-foreground/20 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <div className={className}>{children}</div>;
};

// Componente de loading para formulários
export const LoadingForm: React.FC<{
  loading: boolean;
  children: React.ReactNode;
  className?: string;
}> = ({ loading, children, className = '' }) => {
  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 bg-muted-foreground/20 rounded w-1/4"></div>
            <div className="h-10 bg-muted-foreground/20 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-muted-foreground/20 rounded w-1/3"></div>
            <div className="h-10 bg-muted-foreground/20 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-muted-foreground/20 rounded w-1/5"></div>
            <div className="h-20 bg-muted-foreground/20 rounded"></div>
          </div>
          <div className="h-10 bg-muted-foreground/20 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  return <div className={className}>{children}</div>;
};
