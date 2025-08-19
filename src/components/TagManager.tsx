import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { CreateTagData, Tag, useTags } from '@/hooks/useTags';
import { BookOpen, Edit, FileText, Plus, Tag as TagIcon, Target, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface TagManagerProps {
  className?: string;
}

export const TagManager: React.FC<TagManagerProps> = ({ className }) => {
  const { tags, loading, error, createTag, updateTag, deleteTag } = useTags();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState<CreateTagData>({
    name: '',
    color: '#3b82f6',
    description: ''
  });

  // Cores predefinidas para tags
  const predefinedColors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
    '#06b6d4', '#f97316', '#ec4899', '#84cc16', '#6366f1'
  ];

  const handleCreateTag = async () => {
    if (!formData.name.trim()) {
      toast.error('Nome da tag é obrigatório');
      return;
    }

    const success = await createTag(formData);
    if (success) {
      toast.success('Tag criada com sucesso!');
      setIsCreateDialogOpen(false);
      resetForm();
    } else {
      toast.error('Erro ao criar tag');
    }
  };

  const handleEditTag = async () => {
    if (!editingTag || !formData.name.trim()) {
      toast.error('Nome da tag é obrigatório');
      return;
    }

    const success = await updateTag(editingTag.id, formData);
    if (success) {
      toast.success('Tag atualizada com sucesso!');
      setIsEditDialogOpen(false);
      resetForm();
      setEditingTag(null);
    } else {
      toast.error('Erro ao atualizar tag');
    }
  };

  const handleDeleteTag = async (tag: Tag) => {
    const success = await deleteTag(tag.id);
    if (success) {
      toast.success('Tag removida com sucesso!');
    } else {
      toast.error('Erro ao remover tag');
    }
  };

  const openEditDialog = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      color: tag.color,
      description: tag.description || ''
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      color: '#3b82f6',
      description: ''
    });
  };

  const handleColorChange = (color: string) => {
    setFormData(prev => ({ ...prev, color }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Carregando tags...</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl border-slate-200/60 shadow-lg dark:from-slate-800/80 dark:to-slate-700/60 dark:border-slate-600/40">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-slate-800 dark:text-foreground flex items-center gap-2">
              <TagIcon className="w-5 h-5" />
              Gerenciador de Tags
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-muted-foreground">
              Organize seus estudos com tags personalizadas
            </CardDescription>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md">
                <Plus className="w-4 h-4 mr-2" />
                Nova Tag
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Criar Nova Tag</DialogTitle>
                <DialogDescription>
                  Crie uma tag personalizada para organizar seus estudos
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tag-name">Nome da Tag</Label>
                  <Input
                    id="tag-name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Importante, Revisar, Fácil..."
                    maxLength={50}
                  />
                </div>
                
                <div>
                  <Label htmlFor="tag-description">Descrição (opcional)</Label>
                  <Textarea
                    id="tag-description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descreva o propósito desta tag..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label>Cor da Tag</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {predefinedColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          formData.color === color 
                            ? 'border-slate-800 scale-110 shadow-lg' 
                            : 'border-slate-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorChange(color)}
                        title={color}
                      />
                    ))}
                  </div>
                  <Input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
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
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-100 dark:bg-muted">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="cadernos">Cadernos</TabsTrigger>
              <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
              <TabsTrigger value="goals">Metas</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tags.map((tag) => (
                  <TagCard
                    key={tag.id}
                    tag={tag}
                    onEdit={() => openEditDialog(tag)}
                    onDelete={() => handleDeleteTag(tag)}
                  />
                ))}
              </div>
              
              {tags.length === 0 && (
                <div className="text-center py-12">
                  <TagIcon className="w-20 h-20 text-slate-300 mx-auto mb-6 dark:text-muted-foreground" />
                  <p className="text-slate-600 dark:text-muted-foreground text-lg mb-2">
                    Nenhuma tag criada ainda
                  </p>
                  <p className="text-sm text-slate-500 dark:text-muted-foreground">
                    Crie sua primeira tag para começar a organizar!
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="cadernos" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tags.filter(tag => (tag.cadernos_count || 0) > 0).map((tag) => (
                  <TagCard
                    key={tag.id}
                    tag={tag}
                    onEdit={() => openEditDialog(tag)}
                    onDelete={() => handleDeleteTag(tag)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="quizzes" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tags.filter(tag => (tag.quizzes_count || 0) > 0).map((tag) => (
                  <TagCard
                    key={tag.id}
                    tag={tag}
                    onEdit={() => openEditDialog(tag)}
                    onDelete={() => handleDeleteTag(tag)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="goals" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tags.filter(tag => (tag.goals_count || 0) > 0).map((tag) => (
                  <TagCard
                    key={tag.id}
                    tag={tag}
                    onEdit={() => openEditDialog(tag)}
                    onDelete={() => handleDeleteTag(tag)}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Tag</DialogTitle>
            <DialogDescription>
              Modifique as propriedades da tag selecionada
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-tag-name">Nome da Tag</Label>
              <Input
                id="edit-tag-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome da tag"
                maxLength={50}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-tag-description">Descrição</Label>
              <Textarea
                id="edit-tag-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição da tag"
                rows={3}
              />
            </div>
            
            <div>
              <Label>Cor da Tag</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      formData.color === color 
                        ? 'border-slate-800 scale-110 shadow-lg' 
                        : 'border-slate-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(color)}
                    title={color}
                  />
                ))}
              </div>
              <Input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                className="mt-2 w-full h-10"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditTag}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface TagCardProps {
  tag: Tag & { cadernos_count?: number; quizzes_count?: number; goals_count?: number };
  onEdit: () => void;
  onDelete: () => void;
}

const TagCard: React.FC<TagCardProps> = ({ tag, onEdit, onDelete }) => {
  return (
    <Card className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl border-slate-200/60 shadow-md hover:shadow-lg transition-all duration-200 dark:from-slate-700/90 dark:to-slate-600/70 dark:border-slate-500/40">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full border border-slate-200 dark:border-slate-600"
              style={{ backgroundColor: tag.color }}
            />
            <h3 className="font-semibold text-slate-800 dark:text-foreground">
              {tag.name}
            </h3>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-600"
            >
              <Edit className="w-3 h-3" />
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remover Tag</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja remover a tag "{tag.name}"? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700">
                    Remover
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        {tag.description && (
          <p className="text-sm text-slate-600 dark:text-muted-foreground mb-3">
            {tag.description}
          </p>
        )}
        
        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            <span>{tag.cadernos_count || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            <span>{tag.quizzes_count || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-3 h-3" />
            <span>{tag.goals_count || 0}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
