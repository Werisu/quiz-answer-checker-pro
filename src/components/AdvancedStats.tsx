import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuiz } from '@/hooks/useQuiz';
import { useCadernos } from '@/hooks/useCadernos';
import { format, subDays, subMonths, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TrendingUp, Calendar, Target, Award, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import React, { useState, useMemo } from 'react';

interface AdvancedStatsProps {
  onBack: () => void;
}

type TimeRange = '7d' | '30d' | '3m' | '1y';

export const AdvancedStats: React.FC<AdvancedStatsProps> = ({ onBack }) => {
  const { quizHistory } = useQuiz();
  const { cadernos } = useCadernos();
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('30d');
  const [selectedCaderno, setSelectedCaderno] = useState<string>('all');
  const [activeChart, setActiveChart] = useState<'progress' | 'cadernos' | 'legendas'>('progress');

  // Calcular período baseado na seleção
  const getDateRange = (range: TimeRange) => {
    const now = new Date();
    switch (range) {
      case '7d':
        return { start: subDays(now, 7), end: now };
      case '30d':
        return { start: subDays(now, 30), end: now };
      case '3m':
        return { start: subMonths(now, 3), end: now };
      case '1y':
        return { start: subMonths(now, 12), end: now };
      default:
        return { start: subDays(now, 30), end: now };
    }
  };

  // Filtrar dados por período e caderno
  const filteredData = useMemo(() => {
    const { start, end } = getDateRange(selectedTimeRange);
    
    return quizHistory.filter(result => {
      const resultDate = new Date(result.completed_at);
      const inTimeRange = resultDate >= start && resultDate <= end;
      const inCaderno = selectedCaderno === 'all' || result.quiz?.caderno_id === selectedCaderno;
      
      return inTimeRange && inCaderno;
    });
  }, [quizHistory, selectedTimeRange, selectedCaderno]);

  // Dados para gráfico de progresso ao longo do tempo
  const progressData = useMemo(() => {
    const { start, end } = getDateRange(selectedTimeRange);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    const data = [];
    for (let i = 0; i <= days; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      
      const dayResults = filteredData.filter(result => {
        const resultDate = new Date(result.completed_at);
        return resultDate.toDateString() === date.toDateString();
      });
      
      const avgPercentage = dayResults.length > 0
        ? dayResults.reduce((sum, result) => sum + result.percentage, 0) / dayResults.length
        : 0;
      
      data.push({
        date: format(date, 'dd/MM', { locale: ptBR }),
        percentage: Math.round(avgPercentage * 10) / 10,
        quizzes: dayResults.length,
      });
    }
    
    return data;
  }, [filteredData, selectedTimeRange]);

  // Dados para comparação entre cadernos
  const cadernosData = useMemo(() => {
    const cadernoStats = new Map<string, { total: number; avgPercentage: number; quizzes: number }>();
    
    filteredData.forEach(result => {
      const cadernoId = result.quiz?.caderno_id || 'sem-caderno';
      const cadernoName = result.quiz?.cadernos?.nome || 'Sem Caderno';
      
      if (!cadernoStats.has(cadernoId)) {
        cadernoStats.set(cadernoId, { total: 0, avgPercentage: 0, quizzes: 0 });
      }
      
      const stats = cadernoStats.get(cadernoId)!;
      stats.total += result.correct_answers + result.wrong_answers;
      stats.avgPercentage += result.percentage;
      stats.quizzes += 1;
    });
    
    return Array.from(cadernoStats.entries()).map(([id, stats]) => ({
      name: id === 'sem-caderno' ? 'Sem Caderno' : cadernos.find(c => c.id === id)?.nome || 'Desconhecido',
      media: Math.round((stats.avgPercentage / stats.quizzes) * 10) / 10,
      totalQuestoes: stats.total,
      quizzes: stats.quizzes,
    }));
  }, [filteredData, cadernos]);

  // Dados para distribuição de legendas
  const legendasData = useMemo(() => {
    const legendas = { star: 0, question: 0, circle: 0, exclamation: 0 };
    
    filteredData.forEach(result => {
      if (result.legendStats) {
        legendas.star += result.legendStats.star?.total || 0;
        legendas.question += result.legendStats.question?.total || 0;
        legendas.circle += result.legendStats.circle?.total || 0;
        legendas.exclamation += 0; // Implementar quando disponível
      }
    });
    
    return [
      { name: 'Estrela (Certeza)', value: legendas.star, color: '#fbbf24' },
      { name: 'Interrogação (Dúvida)', value: legendas.question, color: '#3b82f6' },
      { name: 'Círculo (Sem Conhecimento)', value: legendas.circle, color: '#6b7280' },
      { name: 'Exclamação (Tempo)', value: legendas.exclamation, color: '#f97316' },
    ].filter(item => item.value > 0);
  }, [filteredData]);

  // Métricas gerais
  const generalStats = useMemo(() => {
    if (filteredData.length === 0) return null;
    
    const totalQuizzes = filteredData.length;
    const avgPercentage = filteredData.reduce((sum, result) => sum + result.percentage, 0) / totalQuizzes;
    const totalQuestions = filteredData.reduce((sum, result) => sum + result.total_questions, 0);
    const totalCorrect = filteredData.reduce((sum, result) => sum + result.correct_answers, 0);
    
    // Calcular tendência (últimos 7 dias vs anteriores)
    const recentData = filteredData.filter(result => {
      const resultDate = new Date(result.completed_at);
      return resultDate >= subDays(new Date(), 7);
    });
    
    const olderData = filteredData.filter(result => {
      const resultDate = new Date(result.completed_at);
      return resultDate < subDays(new Date(), 7);
    });
    
    const recentAvg = recentData.length > 0 
      ? recentData.reduce((sum, result) => sum + result.percentage, 0) / recentData.length 
      : 0;
    const olderAvg = olderData.length > 0 
      ? olderData.reduce((sum, result) => sum + result.percentage, 0) / olderData.length 
      : 0;
    
    const trend = recentAvg - olderAvg;
    
    return {
      totalQuizzes,
      avgPercentage: Math.round(avgPercentage * 10) / 10,
      totalQuestions,
      totalCorrect,
      accuracy: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 1000) / 10 : 0,
      trend: Math.round(trend * 10) / 10,
    };
  }, [filteredData]);

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Estatísticas Avançadas</h2>
          </div>
          <Button variant="outline" onClick={onBack}>
            Voltar
          </Button>
        </div>

        {/* Filtros */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Período</label>
              <Select value={selectedTimeRange} onValueChange={(value: TimeRange) => setSelectedTimeRange(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Últimos 7 dias</SelectItem>
                  <SelectItem value="30d">Últimos 30 dias</SelectItem>
                  <SelectItem value="3m">Últimos 3 meses</SelectItem>
                  <SelectItem value="1y">Último ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Caderno</label>
              <Select value={selectedCaderno} onValueChange={setSelectedCaderno}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Todos os cadernos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os cadernos</SelectItem>
                  {cadernos.map((caderno) => (
                    <SelectItem key={caderno.id} value={caderno.id}>
                      {caderno.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Métricas Gerais */}
        {generalStats && (
          <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-blue-600" />
                <h5 className="font-semibold text-blue-800">Total de Quizzes</h5>
              </div>
              <div className="text-2xl font-bold text-blue-600">{generalStats.totalQuizzes}</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h5 className="font-semibold text-green-800">Média Geral</h5>
              </div>
              <div className="text-2xl font-bold text-green-600">{generalStats.avgPercentage}%</div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-purple-600" />
                <h5 className="font-semibold text-purple-800">Taxa de Acerto</h5>
              </div>
              <div className="text-2xl font-bold text-purple-600">{generalStats.accuracy}%</div>
            </div>
            
            <div className={`p-4 rounded-lg ${generalStats.trend >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className={`w-5 h-5 ${generalStats.trend >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                <h5 className={`font-semibold ${generalStats.trend >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                  Tendência
                </h5>
              </div>
              <div className={`text-2xl font-bold ${generalStats.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {generalStats.trend >= 0 ? '+' : ''}{generalStats.trend}%
              </div>
            </div>
          </div>
        )}

        {/* Seleção de Gráficos */}
        <div className="mb-6 flex gap-2">
          <Button
            variant={activeChart === 'progress' ? 'default' : 'outline'}
            onClick={() => setActiveChart('progress')}
            className="flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Progresso
          </Button>
          <Button
            variant={activeChart === 'cadernos' ? 'default' : 'outline'}
            onClick={() => setActiveChart('cadernos')}
            className="flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Cadernos
          </Button>
          <Button
            variant={activeChart === 'legendas' ? 'default' : 'outline'}
            onClick={() => setActiveChart('legendas')}
            className="flex items-center gap-2"
          >
            <PieChartIcon className="w-4 h-4" />
            Legendas
          </Button>
        </div>

        {/* Gráficos */}
        <div className="space-y-6">
          {/* Gráfico de Progresso */}
          {activeChart === 'progress' && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Progresso ao Longo do Tempo</h3>
              <div className="h-96 w-full">
                {/* Aqui vamos implementar o gráfico de linha */}
                <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Gráfico de Progresso</p>
                    <p className="text-sm text-gray-500">Implementando com Recharts...</p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Gráfico de Cadernos */}
          {activeChart === 'cadernos' && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance por Caderno</h3>
              <div className="h-96 w-full">
                {/* Aqui vamos implementar o gráfico de barras */}
                <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Gráfico de Cadernos</p>
                    <p className="text-sm text-gray-500">Implementando com Recharts...</p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Gráfico de Legendas */}
          {activeChart === 'legendas' && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribuição de Legendas</h3>
              <div className="h-96 w-full">
                {/* Aqui vamos implementar o gráfico de pizza */}
                <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <PieChartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Gráfico de Legendas</p>
                    <p className="text-sm text-gray-500">Implementando com Recharts...</p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Mensagem quando não há dados */}
        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Nenhum dado encontrado
            </h3>
            <p className="text-gray-500">
              Complete alguns quizzes no período selecionado para ver as estatísticas
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};
