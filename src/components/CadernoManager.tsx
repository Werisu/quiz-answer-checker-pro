import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Caderno } from '@/hooks/useCadernos';
import { BookOpen, Edit, Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onCadernoCreate(formData.nome, formData.descricao);
      setFormData({ nome: '', descricao: '' });
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
      setFormData({ nome: '', descricao: '' });
      setEditingCaderno(null);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Erro ao atualizar caderno:', error);
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
          <DialogContent>
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
                  <h3 className="font-medium text-gray-900">{caderno.nome}</h3>
                </div>
                {caderno.descricao && (
                  <p className="text-sm text-gray-600 mb-2">{caderno.descricao}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Criado em: {new Date(caderno.created_at).toLocaleDateString('pt-BR')}</span>
                  {caderno.updated_at !== caderno.created_at && (
                    <span>Atualizado em: {new Date(caderno.updated_at).toLocaleDateString('pt-BR')}</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(caderno)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir o caderno "{caderno.nome}"? 
                        Esta ação não pode ser desfeita e todos os quizzes associados serão perdidos.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(caderno.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        ))}

        {cadernos.length === 0 && (
          <Card className="p-8 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum caderno criado</h3>
            <p className="text-gray-600 mb-4">
              Crie seu primeiro caderno para começar a organizar seus estudos por matéria.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Caderno
            </Button>
          </Card>
        )}
      </div>

      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Caderno</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Nome</label>
              <Input
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Nome do caderno"
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
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
