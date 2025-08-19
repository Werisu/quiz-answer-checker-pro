import { TagDisplay } from '@/components/TagDisplay';
import { TagSelector } from '@/components/TagSelector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tag, useTags } from '@/hooks/useTags';
import { BookOpen, Edit, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface CadernoWithTagsProps {
  cadernoId: string;
  nome: string;
  descricao?: string;
  onUpdate?: (data: { nome: string; descricao?: string }) => void;
  onDelete?: () => void;
}

export const CadernoWithTags: React.FC<CadernoWithTagsProps> = ({
  cadernoId,
  nome,
  descricao,
  onUpdate,
  onDelete
}) => {
  const { getCadernoTags, addTagToCaderno, removeTagFromCaderno } = useTags();
  const [cadernoTags, setCadernoTags] = useState<Tag[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ nome, descricao: descricao || '' });

  // Buscar tags do caderno
  useEffect(() => {
    const fetchTags = async () => {
      const tags = await getCadernoTags(cadernoId);
      setCadernoTags(tags);
    };
    
    if (cadernoId) {
      fetchTags();
    }
  }, [cadernoId, getCadernoTags]);

  // Atualizar tags quando mudarem
  const handleTagsChange = async (newTags: Tag[]) => {
    setCadernoTags(newTags);
    
    // Sincronizar com o banco de dados
    const currentTagIds = cadernoTags.map(t => t.id);
    const newTagIds = newTags.map(t => t.id);
    
    // Adicionar novas tags
    for (const tag of newTags) {
      if (!currentTagIds.includes(tag.id)) {
        await addTagToCaderno(cadernoId, tag.id);
      }
    }
    
    // Remover tags não mais selecionadas
    for (const tag of cadernoTags) {
      if (!newTagIds.includes(tag.id)) {
        await removeTagFromCaderno(cadernoId, tag.id);
      }
    }
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ nome, descricao: descricao || '' });
    setIsEditing(false);
  };

  return (
    <Card className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl border-slate-200/60 shadow-md hover:shadow-lg transition-all duration-200 dark:from-slate-700/90 dark:to-slate-600/70 dark:border-slate-500/40">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editData.nome}
                  onChange={(e) => setEditData(prev => ({ ...prev, nome: e.target.value }))}
                  className="w-full text-xl font-bold bg-transparent border-b border-slate-300 focus:border-blue-500 outline-none dark:text-foreground dark:border-slate-600"
                  placeholder="Nome do caderno"
                />
                <textarea
                  value={editData.descricao}
                  onChange={(e) => setEditData(prev => ({ ...prev, descricao: e.target.value }))}
                  className="w-full bg-transparent border border-slate-300 rounded-md p-2 focus:border-blue-500 outline-none dark:text-foreground dark:border-slate-600"
                  placeholder="Descrição do caderno"
                  rows={2}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                    Salvar
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <CardTitle className="text-xl font-bold text-slate-800 dark:text-foreground flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  {nome}
                </CardTitle>
                {descricao && (
                  <p className="text-slate-600 dark:text-muted-foreground mt-2">
                    {descricao}
                  </p>
                )}
              </div>
            )}
          </div>
          
          {!isEditing && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-600"
              >
                <Edit className="w-4 h-4" />
              </Button>
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDelete}
                  className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Tags existentes */}
        {cadernoTags.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-slate-700 dark:text-muted-foreground mb-2">
              Tags aplicadas:
            </h4>
            <TagDisplay 
              tags={cadernoTags} 
              onRemove={(tagId) => {
                const newTags = cadernoTags.filter(t => t.id !== tagId);
                handleTagsChange(newTags);
              }}
              size="sm"
            />
          </div>
        )}

        {/* Seletor de tags */}
        <div>
          <h4 className="text-sm font-medium text-slate-700 dark:text-muted-foreground mb-2">
            Gerenciar tags:
          </h4>
          <TagSelector
            selectedTags={cadernoTags}
            onTagsChange={handleTagsChange}
            placeholder="Selecionar tags para este caderno..."
            entityType="caderno"
            entityId={cadernoId}
            maxTags={5}
          />
        </div>

        {/* Estatísticas do caderno */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-600">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-3 bg-gradient-to-r from-slate-500/10 to-blue-500/10 rounded-xl border border-slate-200/50 dark:from-slate-500/20 dark:to-blue-500/20 dark:border-slate-600/40">
              <div className="text-2xl font-bold text-slate-800 dark:text-foreground">
                {cadernoTags.length}
              </div>
              <div className="text-slate-600 dark:text-muted-foreground">
                Tags
              </div>
            </div>
            <div className="text-center p-3 bg-gradient-to-r from-slate-500/10 to-green-500/10 rounded-xl border border-slate-200/50 dark:from-slate-500/20 dark:to-green-500/20 dark:border-slate-600/40">
              <div className="text-2xl font-bold text-slate-800 dark:text-foreground">
                0
              </div>
              <div className="text-slate-600 dark:text-muted-foreground">
                Quizzes
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Componente de exemplo para lista de cadernos com tags
export const CadernosList: React.FC<{ cadernos: Array<{ id: string; nome: string; descricao?: string }> }> = ({ 
  cadernos 
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-foreground">
        Meus Cadernos
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cadernos.map((caderno) => (
          <CadernoWithTags
            key={caderno.id}
            cadernoId={caderno.id}
            nome={caderno.nome}
            descricao={caderno.descricao}
            onUpdate={(data) => {
              console.log('Atualizar caderno:', data);
              // Implementar lógica de atualização
            }}
            onDelete={() => {
              console.log('Deletar caderno:', caderno.id);
              // Implementar lógica de deleção
            }}
          />
        ))}
      </div>
      
      {cadernos.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-20 h-20 text-slate-300 mx-auto mb-6 dark:text-muted-foreground" />
          <p className="text-slate-600 dark:text-muted-foreground text-lg mb-2">
            Nenhum caderno criado ainda
          </p>
          <p className="text-sm text-slate-500 dark:text-muted-foreground">
            Crie seu primeiro caderno para começar a organizar seus estudos!
          </p>
        </div>
      )}
    </div>
  );
};
