
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
  const { user, userProfile } = useAuth();
  const { allResults, fetchAllResults, loading } = useQuiz();
  const { cadernos, createCaderno, updateCaderno, deleteCaderno } = useCadernos();
  const { toast } = useToast();

  useEffect(() => {
    if (activeTab === 'results') {
      fetchAllResults();
    }
  }, [activeTab]);

  // Verificar se o usuário é admin
  if (!userProfile || userProfile.role !== 'admin') {
    console.log('AdminPanel: Usuário não é admin', { 
      userProfile, 
      userId: user?.id,
      userEmail: user?.email,
      hasProfile: !!userProfile,
      profileRole: userProfile?.role 
    });
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background/80 flex items-center justify-center">
        <Card className="p-8 bg-gradient-to-br from-white/80 via-gray-50/50 to-white/80 backdrop-blur-xl border-0 shadow-2xl rounded-3xl dark:from-slate-800/80 dark:via-slate-700/60 dark:to-slate-800/80">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500/10 to-red-600/20 rounded-full flex items-center justify-center mx-auto border border-red-200/50 dark:from-red-500/20 dark:to-red-600/30 dark:border-red-400/30 dark:bg-red-500/20">
              <Settings className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Acesso Negado</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {!userProfile 
                ? 'Perfil do usuário não foi carregado. Tente fazer login novamente.'
                : `Seu perfil atual: ${userProfile.role}. Apenas administradores podem acessar este painel.`
              }
            </p>
            <div className="text-xs text-gray-500 dark:text-gray-400 bg-gradient-to-r from-gray-500/10 to-slate-600/20 p-3 rounded border border-gray-200/50 dark:from-gray-500/20 dark:to-slate-600/30 dark:border-gray-600/40 dark:bg-gray-500/20">
              <p><strong>Debug Info:</strong></p>
              <p>User ID: {user?.id || 'N/A'}</p>
              <p>Email: {user?.email || 'N/A'}</p>
              <p>Profile: {userProfile ? 'Carregado' : 'Não carregado'}</p>
              <p>Role: {userProfile?.role || 'N/A'}</p>
            </div>
            <Button variant="outline" onClick={onBack} className="w-full bg-gradient-to-r from-white/80 to-white/60 border-slate-200/50 text-slate-700 hover:from-white hover:to-white hover:border-slate-300/70 hover:text-slate-800 shadow-sm dark:from-slate-700/80 dark:to-slate-600/60 dark:border-slate-500/40 dark:text-slate-200 dark:hover:from-slate-600/80 dark:hover:to-slate-500/60 dark:hover:border-slate-400/50 dark:hover:text-slate-100">
              Voltar
            </Button>
          </div>
        </Card>
      </div>
    );
  }

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

  const handleCadernoUpdate = async (id: string, updates: { nome?: string; descricao?: string }) => {
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
      <Card className="p-6 bg-gradient-to-br from-white/80 via-gray-50/50 to-white/80 backdrop-blur-xl border-0 shadow-2xl rounded-3xl dark:from-slate-800/80 dark:via-slate-700/60 dark:to-slate-800/80">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Painel Administrativo</h2>
            <Badge variant="destructive" className="bg-gradient-to-r from-red-500/10 to-red-600/20 text-red-800 border-red-200/50 dark:from-red-500/20 dark:to-red-600/30 dark:text-red-200 dark:border-red-400/30 dark:bg-red-500/20">
              ADMIN
            </Badge>
          </div>
          <Button variant="outline" onClick={onBack} className="bg-gradient-to-r from-white/80 to-white/60 border-slate-200/50 text-slate-700 hover:from-white hover:to-white hover:border-slate-300/70 hover:text-slate-800 shadow-sm dark:from-slate-700/80 dark:to-slate-600/60 dark:border-slate-500/40 dark:text-slate-200 dark:hover:from-slate-600/80 dark:hover:to-slate-500/60 dark:hover:border-slate-400/50 dark:hover:text-slate-100">
            Voltar
          </Button>
        </div>

        <div className="flex gap-4 mb-6">
          <Button
            variant={activeTab === 'users' ? 'default' : 'outline'}
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 ${
              activeTab === 'users' 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gradient-to-r from-white/80 to-white/60 border-slate-200/50 text-slate-700 hover:from-white hover:to-white hover:border-slate-300/70 hover:text-slate-800 shadow-sm dark:from-slate-700/80 dark:to-slate-600/60 dark:border-slate-500/40 dark:text-slate-200 dark:hover:from-slate-600/80 dark:hover:to-slate-500/60 dark:hover:border-slate-400/50 dark:hover:text-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            Gerenciar Usuários
          </Button>
          <Button
            variant={activeTab === 'results' ? 'default' : 'outline'}
            onClick={() => setActiveTab('results')}
            className={`flex items-center gap-2 ${
              activeTab === 'results' 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gradient-to-r from-white/80 to-white/60 border-slate-200/50 text-slate-700 hover:from-white hover:to-white hover:border-slate-300/70 hover:text-slate-800 shadow-sm dark:from-slate-700/80 dark:to-slate-600/60 dark:border-slate-500/40 dark:text-slate-200 dark:hover:from-slate-600/80 dark:hover:to-slate-500/60 dark:hover:border-slate-400/50 dark:hover:text-slate-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Todos os Resultados
          </Button>
          <Button
            variant={activeTab === 'cadernos' ? 'default' : 'outline'}
            onClick={() => setActiveTab('cadernos')}
            className={`flex items-center gap-2 ${
              activeTab === 'cadernos' 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gradient-to-r from-white/80 to-white/60 border-slate-200/50 text-slate-700 hover:from-white hover:to-white hover:border-slate-300/70 hover:text-slate-800 shadow-sm dark:from-slate-700/80 dark:to-slate-600/60 dark:border-slate-500/40 dark:text-slate-200 dark:hover:from-slate-600/80 dark:hover:to-slate-500/60 dark:hover:border-slate-400/50 dark:hover:text-slate-100'
            }`}
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
