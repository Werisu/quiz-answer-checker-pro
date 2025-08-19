import { Badge } from '@/components/ui/badge';
import { Tag } from '@/hooks/useTags';
import { X } from 'lucide-react';
import React from 'react';

interface TagDisplayProps {
  tags: Tag[];
  onRemove?: (tagId: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  clickable?: boolean;
  onTagClick?: (tag: Tag) => void;
}

export const TagDisplay: React.FC<TagDisplayProps> = ({
  tags,
  onRemove,
  className = '',
  size = 'md',
  clickable = false,
  onTagClick
}) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const handleTagClick = (tag: Tag) => {
    if (clickable && onTagClick) {
      onTagClick(tag);
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <Badge
          key={tag.id}
          variant="secondary"
          className={`
            ${sizeClasses[size]}
            ${clickable ? 'cursor-pointer hover:scale-105 transition-transform' : ''}
            border border-slate-200 dark:border-slate-600
            shadow-sm hover:shadow-md
          `}
          style={{
            backgroundColor: `${tag.color}15`,
            color: tag.color,
            borderColor: `${tag.color}40`
          }}
          onClick={() => handleTagClick(tag)}
        >
          <div
            className="w-2 h-2 rounded-full mr-2"
            style={{ backgroundColor: tag.color }}
          />
          {tag.name}
          
          {onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(tag.id);
              }}
              className="ml-2 hover:bg-black/10 rounded-full p-0.5 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </Badge>
      ))}
    </div>
  );
};

// Componente para exibir tags em um formato mais compacto
export const CompactTagDisplay: React.FC<TagDisplayProps> = ({
  tags,
  onRemove,
  className = '',
  size = 'sm'
}) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {tags.map((tag) => (
        <Badge
          key={tag.id}
          variant="outline"
          className={`
            ${sizeClasses[size]}
            border-slate-200 dark:border-slate-600
            hover:shadow-sm transition-shadow
          `}
          style={{
            color: tag.color,
            borderColor: `${tag.color}40`
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full mr-1.5"
            style={{ backgroundColor: tag.color }}
          />
          {tag.name}
          
          {onRemove && (
            <button
              onClick={() => onRemove(tag.id)}
              className="ml-1.5 hover:bg-black/10 rounded-full p-0.5 transition-colors"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          )}
        </Badge>
      ))}
    </div>
  );
};

// Componente para exibir tags como chips coloridos
export const TagChips: React.FC<TagDisplayProps> = ({
  tags,
  onRemove,
  className = '',
  size = 'md'
}) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-1 rounded-full',
    md: 'text-sm px-3 py-1.5 rounded-full',
    lg: 'text-base px-4 py-2 rounded-full'
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <div
          key={tag.id}
          className={`
            ${sizeClasses[size]}
            flex items-center gap-2
            text-white font-medium
            shadow-md hover:shadow-lg
            transition-all duration-200
            ${onRemove ? 'pr-2' : 'pr-3'}
          `}
          style={{ backgroundColor: tag.color }}
        >
          {tag.name}
          
          {onRemove && (
            <button
              onClick={() => onRemove(tag.id)}
              className="hover:bg-black/20 rounded-full p-0.5 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
