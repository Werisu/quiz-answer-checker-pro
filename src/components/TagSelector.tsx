import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tag, useTags } from '@/hooks/useTags';
import { cn } from '@/lib/utils';
import { ChevronsUpDown, Plus, X } from 'lucide-react';
import React, { useState } from 'react';

interface TagSelectorProps {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  placeholder?: string;
  className?: string;
  maxTags?: number;
  showCreateOption?: boolean;
  entityType?: 'caderno' | 'quiz' | 'goal';
  entityId?: string;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  onTagsChange,
  placeholder = "Selecionar tags...",
  className = "",
  maxTags = 10,
  showCreateOption = true,
  entityType,
  entityId
}) => {
  const { tags, createTag, addTagToCaderno, addTagToQuiz, addTagToGoal } = useTags();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTagData, setNewTagData] = useState({
    name: '',
    color: '#3b82f6',
    description: ''
  });

  // Cores predefinidas para novas tags
  const predefinedColors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
    '#06b6d4', '#f97316', '#ec4899', '#84cc16', '#6366f1'
  ];

  const handleTagToggle = (tag: Tag) => {
    const isSelected = selectedTags.some(t => t.id === tag.id);
    
    if (isSelected) {
      // Remover tag
      const newTags = selectedTags.filter(t => t.id !== tag.id);
      onTagsChange(newTags);
      
      // Remover da entidade se especificada
      if (entityType && entityId) {
        removeTagFromEntity(tag.id);
      }
    } else {
      // Adicionar tag (se não exceder o limite)
      if (selectedTags.length < maxTags) {
        const newTags = [...selectedTags, tag];
        onTagsChange(newTags);
        
        // Adicionar à entidade se especificada
        if (entityType && entityId) {
          addTagToEntity(tag.id);
        }
      }
    }
  };

  const addTagToEntity = async (tagId: string) => {
    if (!entityType || !entityId) return;

    try {
      let success = false;
      
      switch (entityType) {
        case 'caderno':
          success = await addTagToCaderno(entityId, tagId);
          break;
        case 'quiz':
          success = await addTagToQuiz(entityId, tagId);
          break;
        case 'goal':
          success = await addTagToGoal(entityId, tagId);
          break;
      }

      if (!success) {
        console.error('Erro ao adicionar tag à entidade');
      }
    } catch (error) {
      console.error('Erro ao adicionar tag:', error);
    }
  };

  const removeTagFromEntity = async (tagId: string) => {
    // Implementar remoção se necessário
    // Por enquanto, apenas remove da seleção local
  };

  const handleCreateTag = async () => {
    if (!newTagData.name.trim()) return;

    try {
      const newTag = await createTag(newTagData);
      if (newTag) {
        // Adicionar automaticamente à seleção
        const newTags = [...selectedTags, newTag];
        onTagsChange(newTags);
        
        // Adicionar à entidade se especificada
        if (entityType && entityId) {
          await addTagToEntity(newTag.id);
        }
        
        setIsCreateDialogOpen(false);
        setNewTagData({ name: '', color: '#3b82f6', description: '' });
      }
    } catch (error) {
      console.error('Erro ao criar tag:', error);
    }
  };

  const filteredTags = tags.filter(tag => 
    !selectedTags.some(selected => selected.id === tag.id) &&
    tag.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2 mb-3">
        {selectedTags.map((tag) => (
          <Badge
            key={tag.id}
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1 text-sm"
            style={{
              backgroundColor: `${tag.color}15`,
              color: tag.color,
              borderColor: `${tag.color}40`
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: tag.color }}
            />
            {tag.name}
            <button
              onClick={() => handleTagToggle(tag)}
              className="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-white dark:bg-background"
          >
            <span className="text-muted-foreground">
              {selectedTags.length === 0 ? placeholder : `${selectedTags.length} tag(s) selecionada(s)`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Buscar tags..."
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>
                <div className="p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Nenhuma tag encontrada
                  </p>
                  {showCreateOption && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsCreateDialogOpen(true)}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Nova Tag
                    </Button>
                  )}
                </div>
              </CommandEmpty>
              
              {filteredTags.length > 0 && (
                <CommandGroup>
                  {filteredTags.map((tag) => (
                    <CommandItem
                      key={tag.id}
                      onSelect={() => handleTagToggle(tag)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                      <span>{tag.name}</span>
                      {tag.description && (
                        <span className="text-xs text-muted-foreground ml-auto">
                          {tag.description}
                        </span>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              
              {showCreateOption && (
                <CommandGroup>
                  <CommandItem
                    onSelect={() => setIsCreateDialogOpen(true)}
                    className="flex items-center gap-2 cursor-pointer text-blue-600 dark:text-blue-400"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Criar Nova Tag</span>
                  </CommandItem>
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Dialog para criar nova tag */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Criar Nova Tag</DialogTitle>
            <DialogDescription>
              Crie uma tag personalizada para organizar seus estudos
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-tag-name">Nome da Tag</Label>
              <Input
                id="new-tag-name"
                value={newTagData.name}
                onChange={(e) => setNewTagData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Importante, Revisar, Fácil..."
                maxLength={50}
              />
            </div>
            
            <div>
              <Label htmlFor="new-tag-description">Descrição (opcional)</Label>
              <Input
                id="new-tag-description"
                value={newTagData.description}
                onChange={(e) => setNewTagData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o propósito desta tag..."
              />
            </div>
            
            <div>
              <Label>Cor da Tag</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-all",
                      newTagData.color === color 
                        ? "border-slate-800 scale-110 shadow-lg" 
                        : "border-slate-300 hover:scale-105"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewTagData(prev => ({ ...prev, color }))}
                    title={color}
                  />
                ))}
              </div>
              <Input
                type="color"
                value={newTagData.color}
                onChange={(e) => setNewTagData(prev => ({ ...prev, color: e.target.value }))}
                className="mt-2 w-full h-10"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateTag}>
              Criar Tag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Componente simplificado para exibição apenas
export const TagViewer: React.FC<{
  tags: Tag[];
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ tags, className = '', size = 'md' }) => {
  if (!tags || tags.length === 0) return null;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <Badge
          key={tag.id}
          variant="secondary"
          className={sizeClasses[size]}
          style={{
            backgroundColor: `${tag.color}15`,
            color: tag.color,
            borderColor: `${tag.color}40`
          }}
        >
          <div
            className="w-2 h-2 rounded-full mr-2"
            style={{ backgroundColor: tag.color }}
          />
          {tag.name}
        </Badge>
      ))}
    </div>
  );
};
