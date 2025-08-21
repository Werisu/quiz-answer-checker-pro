import { Loader2 } from 'lucide-react';
import React from 'react';
import { LoadingButton } from './GlobalLoading';

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

  return (
    <LoadingButton
      loading={loading}
      className={className}
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={onClick}
    >
      {buttonContent}
    </LoadingButton>
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
