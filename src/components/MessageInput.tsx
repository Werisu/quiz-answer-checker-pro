import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import {
    FileText,
    Image,
    Mic,
    Plus,
    Send,
    Smile,
    X
} from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';

interface MessageInputProps {
  onSendMessage: (content: string, type: 'text' | 'image' | 'file') => void;
  onTyping?: (isTyping: boolean) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onTyping,
  placeholder = "Digite sua mensagem...",
  disabled = false,
  className = ''
}) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);
    
    // Gerenciar estado de digitação
    if (!isTyping && value.length > 0) {
      setIsTyping(true);
      onTyping?.(true);
    }
    
    // Limpar timeout anterior
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Definir novo timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      onTyping?.(false);
    }, 1000);
  };

  const handleSendMessage = useCallback(() => {
    if (!message.trim() || disabled || !user) return;

    onSendMessage(message.trim(), 'text');
    setMessage('');
    setIsTyping(false);
    onTyping?.(false);
    
    // Limpar timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  }, [message, disabled, user, onSendMessage, onTyping]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simular upload de arquivo
      const fileName = file.name;
      onSendMessage(`Arquivo: ${fileName}`, 'file');
    }
    // Limpar input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      // Simular upload de imagem
      const imageUrl = URL.createObjectURL(file);
      onSendMessage(imageUrl, 'image');
    }
    // Limpar input
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleVoiceRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simular gravação de áudio
      setTimeout(() => {
        setIsRecording(false);
        onSendMessage('🎤 Mensagem de áudio', 'text');
      }, 3000);
    }
  };

  const toggleAttachments = () => {
    setShowAttachments(!showAttachments);
  };

  const handleEmojiClick = (emoji: string) => {
    setMessage(prev => prev + emoji);
    // Focar no input após adicionar emoji
    setTimeout(() => {
      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (input) input.focus();
    }, 100);
  };

  const emojis = ['😊', '👍', '❤️', '🎉', '🔥', '💯', '👏', '🙌', '🤔', '😅'];

  return (
    <div className={`border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 ${className}`}>
      {/* Attachments Panel */}
      {showAttachments && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Anexos
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAttachments}
              className="w-6 h-6 p-0 h-auto"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-4 gap-3">
            {/* Imagem */}
            <button
              onClick={() => imageInputRef.current?.click()}
              className="flex flex-col items-center p-3 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <Image className="w-6 h-6 text-blue-500 mb-2" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Imagem</span>
            </button>
            
            {/* Arquivo */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center p-3 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <FileText className="w-6 h-6 text-green-500 mb-2" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Arquivo</span>
            </button>
            
            {/* Áudio */}
            <button
              onClick={handleVoiceRecord}
              disabled={isRecording}
              className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
                isRecording 
                  ? 'bg-red-100 dark:bg-red-900/20' 
                  : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              <Mic className={`w-6 h-6 mb-2 ${isRecording ? 'text-red-500' : 'text-purple-500'}`} />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {isRecording ? 'Gravando...' : 'Áudio'}
              </span>
            </button>
            
            {/* Emojis */}
            <button
              onClick={() => setShowAttachments(false)}
              className="flex flex-col items-center p-3 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <Smile className="w-6 h-6 text-yellow-500 mb-2" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Emojis</span>
            </button>
          </div>
        </div>
      )}

      {/* Emojis Panel */}
      {!showAttachments && (
        <div className="p-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Emojis
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAttachments(true)}
              className="w-6 h-6 p-0 h-auto"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {emojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiClick(emoji)}
                className="w-8 h-8 text-lg hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4">
        <div className="flex items-center space-x-2">
          {/* Attachment Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleAttachments}
            disabled={disabled}
            className="w-10 h-10 p-0 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Plus className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Button>

          {/* Message Input Field */}
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={handleMessageChange}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={disabled}
              className="pr-12 rounded-full border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            />
            
            {/* Send Button */}
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || disabled}
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 p-0 rounded-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>

        {/* Typing Indicator */}
        {isTyping && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 ml-4">
            Digitando...
          </p>
        )}

        {/* Recording Indicator */}
        {isRecording && (
          <div className="flex items-center space-x-2 mt-2 ml-4">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <p className="text-xs text-red-500">
              Gravando áudio... Clique novamente para parar
            </p>
          </div>
        )}
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileUpload}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.zip,.rar"
      />
      <input
        ref={imageInputRef}
        type="file"
        onChange={handleImageUpload}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
};
