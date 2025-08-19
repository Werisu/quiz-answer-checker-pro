import { TagDisplay } from '@/components/TagDisplay';
import { TagSelector } from '@/components/TagSelector';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Caderno } from '@/hooks/useCadernos';
import { Tag, useTags } from '@/hooks/useTags';
import { BookOpen, Edit, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface CadernoManagerProps {
  cadernos: Caderno[];
  onCadernoCreate: (nome: string, descricao: string) => Promise<void>;
  onCadernoUpdate: (id: string, updates: Partial<Caderno>) => Promise<void>;
  onCadernoDelete: (id: string) => Promise<void>;
}

export const CadernoManager: React.FC<CadernoManagerProps> = ({
  cadernos,
  onCadernoCreate,
  onCadernoUpdate,
  onCadernoDelete,
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCaderno, setEditingCaderno] = useState<Caderno | null>(null);
  const [formData, setFormData] = useState({ nome: '', descricao: '' });
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [editingTags, setEditingTags] = useState<Tag[]>([]);
  
  const { getCadernoTags, addTagToCaderno, removeTagFromCaderno } = useTags();

  // Carregar tags do caderno sendo editado
  useEffect(() => {
    if (editingCaderno) {
      loadCadernoTags(editingCaderno.id);
    }
  }, [editingCaderno]);

  const loadCadernoTags = async (cadernoId: string) => {
    try {
      const tags = await getCadernoTags(cadernoId);
      setEditingTags(tags);
    } catch (error) {
      console.error('Erro ao carregar tags do caderno:', error);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onCadernoCreate(formData.nome, formData.descricao);
      
      // Adicionar tags ao caderno recém-criado
      if (selectedTags.length > 0) {
        // Buscar o caderno recém-criado para obter o ID
        const newCaderno = cadernos.find(c => c.nome === formData.nome);
        if (newCaderno) {
          for (const tag of selectedTags) {
            await addTagToCaderno(newCaderno.id, tag.id);
          }
        }
      }
      
      setFormData({ nome: '', descricao: '' });
      setSelectedTags([]);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Erro ao criar caderno:', error);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCaderno) return;
    
    try {
      await onCadernoUpdate(editingCaderno.id, formData);
      
      // Sincronizar tags
      await syncCadernoTags(editingCaderno.id, editingTags);
      
      setFormData({ nome: '', descricao: '' });
      setEditingTags([]);
      setEditingCaderno(null);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Erro ao atualizar caderno:', error);
    }
  };

  const syncCadernoTags = async (cadernoId: string, newTags: Tag[]) => {
    try {
      // Obter tags atuais
      const currentTags = await getCadernoTags(cadernoId);
      
      // Remover tags que não estão mais selecionadas
      for (const currentTag of currentTags) {
        if (!newTags.find(t => t.id === currentTag.id)) {
          await removeTagFromCaderno(cadernoId, currentTag.id);
        }
      }
      
      // Adicionar novas tags
      for (const newTag of newTags) {
        if (!currentTags.find(t => t.id === newTag.id)) {
          await addTagToCaderno(cadernoId, newTag.id);
        }
      }
    } catch (error) {
      console.error('Erro ao sincronizar tags:', error);
    }
  };

  const openEditDialog = (caderno: Caderno) => {
    setEditingCaderno(caderno);
    setFormData({ nome: caderno.nome, descricao: caderno.descricao || '' });
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await onCadernoDelete(id);
    } catch (error) {
      console.error('Erro ao deletar caderno:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Gerenciar Cadernos</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Caderno
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Novo Caderno</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Nome</label>
                <Input
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex: Direito Constitucional"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Descrição (opcional)</label>
                <Textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                  placeholder="Descrição do caderno"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Tags (opcional)</label>
                <TagSelector
                  selectedTags={selectedTags}
                  onTagsChange={setSelectedTags}
                  placeholder="Selecionar tags para este caderno..."
                  maxTags={5}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Criar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {cadernos.map((caderno) => (
          <Card key={caderno.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-800">{caderno.nome}</h3>
                </div>
                {caderno.descricao && (
                  <p className="text-gray-600 mb-3">{caderno.descricao}</p>
                )}
                <CadernoTags cadernoId={caderno.id} />
              </div>
              <div className="flex gap-2 ml-4">
                <Dialog open={isEditDialogOpen && editingCaderno?.id === caderno.id} onOpenChange={(open) => {
                  if (!open) {
                    setIsEditDialogOpen(false);
                    setEditingCaderno(null);
                    setEditingTags([]);
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(caderno)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Editar Caderno</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEdit} className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Nome</label>
                        <Input
                          value={formData.nome}
                          onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                          placeholder="Ex: Direito Constitucional"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Descrição (opcional)</label>
                        <Textarea
                          value={formData.descricao}
                          onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                          placeholder="Descrição do caderno"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Tags</label>
                        <TagSelector
                          selectedTags={editingTags}
                          onTagsChange={setEditingTags}
                          placeholder="Selecionar tags para este caderno..."
                          entityType="caderno"
                          entityId={caderno.id}
                          maxTags={5}
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button type="button" variant="outline" onClick={() => {
                          setIsEditDialogOpen(false);
                          setEditingCaderno(null);
                          setEditingTags([]);
                        }}>
                          Cancelar
                        </Button>
                        <Button type="submit">Salvar</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir o caderno "{caderno.nome}"? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(caderno.id)}>
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Componente para exibir tags de um caderno específico
interface CadernoTagsProps {
  cadernoId: string;
}

const CadernoTags: React.FC<CadernoTagsProps> = ({ cadernoId }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const { getCadernoTags } = useTags();

  useEffect(() => {
    loadTags();
  }, [cadernoId]);

  const loadTags = async () => {
    try {
      const cadernoTags = await getCadernoTags(cadernoId);
      setTags(cadernoTags);
    } catch (error) {
      console.error('Erro ao carregar tags do caderno:', error);
    }
  };

  if (tags.length === 0) return null;

  return (
    <div className="mt-2">
      <TagDisplay tags={tags} size="sm" />
    </div>
  );
};
