
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useQuiz } from '@/hooks/useQuiz';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserManagement } from './UserManagement';
import { AllResultsView } from './AllResultsView';
import { Settings, Users, BarChart3 } from 'lucide-react';

interface AdminPanelProps {
  onBack: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'results'>('users');
  const { user } = useAuth();
  const { allResults, fetchAllResults, loading } = useQuiz();
  const { toast } = useToast();

  useEffect(() => {
    if (activeTab === 'results') {
      fetchAllResults();
    }
  }, [activeTab]);

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
        </div>

        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'results' && (
          <AllResultsView results={allResults} loading={loading} />
        )}
      </Card>
    </div>
  );
};
