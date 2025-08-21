import { Loader2 } from 'lucide-react';
import React from 'react';

interface ActionButtonProps {
  loading: boolean;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  loadingText?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  loading,
  children,
  className = '',
  variant = 'default',
  size = 'default',
  disabled = false,
  onClick,
  icon,
  loadingText
}) => {
  const buttonContent = loading ? (
    <>
      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      {loadingText || 'Carregando...'}
    </>
  ) : (
    <>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </>
  );

  const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
  
  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'underline-offset-4 hover:underline text-primary'
  };

  const sizeClasses = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 px-3',
    lg: 'h-11 px-8',
    icon: 'h-10 w-10'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {buttonContent}
    </button>
  );
};

// Botão específico para aceitar solicitações de amizade
export const AcceptFriendButton: React.FC<{
  loading: boolean;
  onClick: () => void;
  className?: string;
}> = ({ loading, onClick, className = '' }) => (
  <ActionButton
    loading={loading}
    onClick={onClick}
    variant="default"
    size="sm"
    className={`bg-green-600 hover:bg-green-700 text-white ${className}`}
    loadingText="Aceitando..."
  >
    Aceitar
  </ActionButton>
);

// Botão específico para rejeitar solicitações de amizade
export const RejectFriendButton: React.FC<{
  loading: boolean;
  onClick: () => void;
  className?: string;
}> = ({ loading, onClick, className = '' }) => (
  <ActionButton
    loading={loading}
    onClick={onClick}
    variant="destructive"
    size="sm"
    className={className}
    loadingText="Rejeitando..."
  >
    Rejeitar
  </ActionButton>
);

// Botão para enviar mensagem
export const SendMessageButton: React.FC<{
  loading: boolean;
  onClick: () => void;
  className?: string;
}> = ({ loading, onClick, className = '' }) => (
  <ActionButton
    loading={loading}
    onClick={onClick}
    variant="ghost"
    size="sm"
    className={className}
    loadingText="Enviando..."
  >
    Enviar
  </ActionButton>
);

// Botão para criar grupo
export const CreateGroupButton: React.FC<{
  loading: boolean;
  onClick: () => void;
  className?: string;
}> = ({ loading, onClick, className = '' }) => (
  <ActionButton
    loading={loading}
    onClick={onClick}
    variant="default"
    size="default"
    className={`bg-green-600 hover:bg-green-700 ${className}`}
    loadingText="Criando..."
    icon={<span className="text-lg">+</span>}
  >
    Criar Grupo
  </ActionButton>
);

// Botão para entrar em grupo
export const JoinGroupButton: React.FC<{
  loading: boolean;
  onClick: () => void;
  className?: string;
}> = ({ loading, onClick, className = '' }) => (
  <ActionButton
    loading={loading}
    onClick={onClick}
    variant="default"
    size="sm"
    className={`bg-blue-600 hover:bg-blue-700 ${className}`}
    loadingText="Entrando..."
  >
    Entrar
  </ActionButton>
);

// Botão para sair de grupo
export const LeaveGroupButton: React.FC<{
  loading: boolean;
  onClick: () => void;
  className?: string;
}> = ({ loading, onClick, className = '' }) => (
  <ActionButton
    loading={loading}
    onClick={onClick}
    variant="outline"
    size="sm"
    className={`border-red-300 text-red-600 hover:bg-red-50 ${className}`}
    loadingText="Saindo..."
  >
    Sair
  </ActionButton>
);
