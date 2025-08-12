
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useCadernos } from '@/hooks/useCadernos';
import { useQuiz } from '@/hooks/useQuiz';
import { BarChart3, BookOpen, Settings, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { AllResultsView } from './AllResultsView';
import { CadernoManager } from './CadernoManager';
import { UserManagement } from './UserManagement';

interface AdminPanelProps {
  onBack: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'results' | 'cadernos'>('users');
  const { user } = useAuth();
  const { allResults, fetchAllResults, loading } = useQuiz();
  const { cadernos, createCaderno, updateCaderno, deleteCaderno } = useCadernos();
  const { toast } = useToast();

  useEffect(() => {
    if (activeTab === 'results') {
      fetchAllResults();
    }
  }, [activeTab]);

  const handleCadernoCreate = async (nome: string, descricao: string) => {
    try {
      await createCaderno(nome, descricao);
      toast({
        title: "Sucesso!",
        description: `Caderno "${nome}" criado com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar o caderno.",
        variant: "destructive",
      });
    }
  };

  const handleCadernoUpdate = async (id: string, updates: any) => {
    try {
      await updateCaderno(id, updates);
      toast({
        title: "Sucesso!",
        description: "Caderno atualizado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o caderno.",
        variant: "destructive",
      });
    }
  };

  const handleCadernoDelete = async (id: string) => {
    try {
      await deleteCaderno(id);
      toast({
        title: "Sucesso!",
        description: "Caderno excluído com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o caderno.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Painel Administrativo</h2>
            <Badge variant="destructive" className="bg-red-100 text-red-800">
              ADMIN
            </Badge>
          </div>
          <Button variant="outline" onClick={onBack}>
            Voltar
          </Button>
        </div>

        <div className="flex gap-4 mb-6">
          <Button
            variant={activeTab === 'users' ? 'default' : 'outline'}
            onClick={() => setActiveTab('users')}
            className="flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Gerenciar Usuários
          </Button>
          <Button
            variant={activeTab === 'results' ? 'default' : 'outline'}
            onClick={() => setActiveTab('results')}
            className="flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Todos os Resultados
          </Button>
          <Button
            variant={activeTab === 'cadernos' ? 'default' : 'outline'}
            onClick={() => setActiveTab('cadernos')}
            className="flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Gerenciar Cadernos
          </Button>
        </div>

        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'results' && (
          <AllResultsView results={allResults} loading={loading} />
        )}
        {activeTab === 'cadernos' && (
          <CadernoManager
            cadernos={cadernos}
            onCadernoCreate={handleCadernoCreate}
            onCadernoUpdate={handleCadernoUpdate}
            onCadernoDelete={handleCadernoDelete}
          />
        )}
      </Card>
    </div>
  );
};
