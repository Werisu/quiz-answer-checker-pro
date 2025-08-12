import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCadernos } from '@/hooks/useCadernos';
import { useQuiz } from '@/hooks/useQuiz';
import { format, subDays, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Award, BarChart3, PieChart as PieChartIcon, Target, TrendingUp } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

interface AdvancedStatsProps {
  onBack: () => void;
}

type TimeRange = '7d' | '30d' | '3m' | '1y';

// Cores para os gráficos
const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#10b981',
  accent: '#8b5cf6',
  warning: '#f59e0b',
  danger: '#ef4444',
  neutral: '#6b7280',
};

export const AdvancedStats: React.FC<AdvancedStatsProps> = ({ onBack }) => {
  const { quizHistory, fetchQuizHistory } = useQuiz();
  const { cadernos } = useCadernos();
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('30d');
  const [selectedCaderno, setSelectedCaderno] = useState<string>('all');
  const [activeChart, setActiveChart] = useState<'progress' | 'cadernos' | 'legendas'>('progress');

  // Buscar histórico quando o componente for montado
  React.useEffect(() => {
    fetchQuizHistory();
  }, []); // Array vazio para executar apenas uma vez

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
        fullDate: date,
      });
    }
    
    return data;
  }, [filteredData, selectedTimeRange]);

  // Dados para comparação entre cadernos
  const cadernosData = useMemo(() => {
    const cadernoStats = new Map<string, { 
      total: number; 
      avgPercentage: number; 
      quizzes: number;
      correctAnswers: number;
      wrongAnswers: number;
      totalQuestions: number;
      difficulty: 'facil' | 'medio' | 'dificil';
    }>();
    
    filteredData.forEach(result => {
      const cadernoId = result.quiz?.caderno_id || 'sem-caderno';
      
      if (!cadernoStats.has(cadernoId)) {
        cadernoStats.set(cadernoId, { 
          total: 0, 
          avgPercentage: 0, 
          quizzes: 0,
          correctAnswers: 0,
          wrongAnswers: 0,
          totalQuestions: 0,
          difficulty: 'medio'
        });
      }
      
      const stats = cadernoStats.get(cadernoId)!;
      stats.total += result.correct_answers + result.wrong_answers;
      stats.avgPercentage += result.percentage;
      stats.quizzes += 1;
      stats.correctAnswers += result.correct_answers;
      stats.wrongAnswers += result.wrong_answers;
      stats.totalQuestions += result.total_questions;
    });

    // Calcular dificuldade baseada na média de acertos
    return Array.from(cadernoStats.entries()).map(([id, stats]) => {
      const avgPercentage = Math.round((stats.avgPercentage / stats.quizzes) * 10) / 10;
      const accuracy = stats.totalQuestions > 0 ? (stats.correctAnswers / stats.totalQuestions) * 100 : 0;
      
      // Classificar dificuldade
      let difficulty: 'facil' | 'medio' | 'dificil';
      if (avgPercentage >= 70) {
        difficulty = 'facil';
      } else if (avgPercentage >= 50) {
        difficulty = 'medio';
      } else {
        difficulty = 'dificil';
      }

      return {
        id,
        name: id === 'sem-caderno' ? 'Sem Caderno' : cadernos.find(c => c.id === id)?.nome || 'Desconhecido',
        media: avgPercentage,
        totalQuestoes: stats.total,
        quizzes: stats.quizzes,
        correctAnswers: stats.correctAnswers,
        wrongAnswers: stats.wrongAnswers,
        accuracy: Math.round(accuracy * 10) / 10,
        difficulty,
        // Calcular pontos líquidos (acertos - erros)
        pontosLiquidos: stats.correctAnswers - stats.wrongAnswers,
        // Calcular taxa de erro
        taxaErro: stats.totalQuestions > 0 ? Math.round(((stats.wrongAnswers / stats.totalQuestions) * 100) * 10) / 10 : 0
      };
    }).sort((a, b) => b.media - a.media); // Ordenar por melhor performance
  }, [filteredData, cadernos]);

  // Análise de dificuldade geral
  const dificuldadeAnalysis = useMemo(() => {
    if (cadernosData.length === 0) return null;

    const facil = cadernosData.filter(c => c.difficulty === 'facil');
    const medio = cadernosData.filter(c => c.difficulty === 'medio');
    const dificil = cadernosData.filter(c => c.difficulty === 'dificil');

    const melhorCaderno = cadernosData[0]; // Já está ordenado por performance
    const piorCaderno = cadernosData[cadernosData.length - 1];

    return {
      facil: facil.length,
      medio: medio.length,
      dificil: dificil.length,
      melhorCaderno,
      piorCaderno,
      totalCadernos: cadernosData.length
    };
  }, [cadernosData]);

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
      { name: 'Estrela (Certeza)', value: legendas.star, color: CHART_COLORS.warning },
      { name: 'Interrogação (Dúvida)', value: legendas.question, color: CHART_COLORS.primary },
      { name: 'Círculo (Sem Conhecimento)', value: legendas.circle, color: CHART_COLORS.neutral },
      { name: 'Exclamação (Tempo)', value: legendas.exclamation, color: CHART_COLORS.danger },
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

  // Custom Tooltip para o gráfico de progresso
  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ value: number; dataKey: string }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{`Data: ${label}`}</p>
          <p className="text-blue-600">{`Média: ${payload[0].value}%`}</p>
          <p className="text-green-600">{`Quizzes: ${payload[1]?.value || 0}`}</p>
        </div>
      );
    }
    return null;
  };

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
                {progressData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line 
                        type="monotone" 
                        dataKey="percentage" 
                        stroke={CHART_COLORS.primary} 
                        strokeWidth={3}
                        dot={{ fill: CHART_COLORS.primary, strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: CHART_COLORS.primary, strokeWidth: 2 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="quizzes" 
                        stroke={CHART_COLORS.secondary} 
                        strokeWidth={2}
                        dot={{ fill: CHART_COLORS.secondary, strokeWidth: 2, r: 3 }}
                        activeDot={{ r: 5, stroke: CHART_COLORS.secondary, strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Nenhum dado para exibir</p>
                      <p className="text-sm text-gray-500">Complete quizzes no período selecionado</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Gráfico de Cadernos */}
          {activeChart === 'cadernos' && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Análise de Performance por Caderno</h3>
              
              {/* Resumo de Dificuldade */}
              {dificuldadeAnalysis && (
                <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-800">Fácil</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">{dificuldadeAnalysis.facil}</div>
                    <div className="text-xs text-green-600">cadernos</div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm font-medium text-yellow-800">Médio</span>
                    </div>
                    <div className="text-2xl font-bold text-yellow-600">{dificuldadeAnalysis.medio}</div>
                    <div className="text-xs text-yellow-600">cadernos</div>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-medium text-red-800">Difícil</span>
                    </div>
                    <div className="text-2xl font-bold text-red-600">{dificuldadeAnalysis.dificil}</div>
                    <div className="text-xs text-red-600">cadernos</div>
                  </div>
                </div>
              )}

              {/* Melhor e Pior Caderno */}
              {dificuldadeAnalysis && (
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">🥇</span>
                      </div>
                      <span className="text-sm font-semibold text-green-800">Melhor Performance</span>
                    </div>
                    <div className="text-lg font-bold text-green-700">{dificuldadeAnalysis.melhorCaderno.name}</div>
                    <div className="text-sm text-green-600">
                      {dificuldadeAnalysis.melhorCaderno.media}% • {dificuldadeAnalysis.melhorCaderno.quizzes} quizzes
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">⚠️</span>
                      </div>
                      <span className="text-sm font-semibold text-red-800">Precisa Melhorar</span>
                    </div>
                    <div className="text-lg font-bold text-red-700">{dificuldadeAnalysis.piorCaderno.name}</div>
                    <div className="text-sm text-red-600">
                      {dificuldadeAnalysis.piorCaderno.media}% • {dificuldadeAnalysis.piorCaderno.quizzes} quizzes
                    </div>
                  </div>
                </div>
              )}

              <div className="h-96 w-full">
                {cadernosData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cadernosData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis 
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                <p className="font-semibold text-gray-800 mb-2">{label}</p>
                                <div className="space-y-1 text-sm">
                                  <p className="text-gray-600">
                                    <span className="font-medium">Média:</span> {data.media}%
                                  </p>
                                  <p className="text-gray-600">
                                    <span className="font-medium">Quizzes:</span> {data.quizzes}
                                  </p>
                                  <p className="text-gray-600">
                                    <span className="font-medium">Acertos:</span> {data.correctAnswers}/{data.totalQuestoes}
                                  </p>
                                  <p className="text-gray-600">
                                    <span className="font-medium">Taxa de Erro:</span> {data.taxaErro}%
                                  </p>
                                  <p className="text-gray-600">
                                    <span className="font-medium">Pontos Líquidos:</span> {data.pontosLiquidos}
                                  </p>
                                  <p className={`font-medium ${
                                    data.difficulty === 'facil' ? 'text-green-600' : 
                                    data.difficulty === 'medio' ? 'text-yellow-600' : 'text-red-600'
                                  }`}>
                                    <span>Dificuldade:</span> {
                                      data.difficulty === 'facil' ? 'Fácil' : 
                                      data.difficulty === 'medio' ? 'Médio' : 'Difícil'
                                    }
                                  </p>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar 
                        dataKey="media" 
                        fill={CHART_COLORS.primary}
                        radius={[4, 4, 0, 0]}
                        name="Média"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Nenhum dado para exibir</p>
                      <p className="text-sm text-gray-500">Complete quizzes no período selecionado</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tabela detalhada de cadernos */}
              {cadernosData.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Detalhamento por Caderno</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 font-medium text-gray-700">Caderno</th>
                          <th className="text-center py-2 font-medium text-gray-700">Média</th>
                          <th className="text-center py-2 font-medium text-gray-700">Quizzes</th>
                          <th className="text-center py-2 font-medium text-gray-700">Acertos</th>
                          <th className="text-center py-2 font-medium text-gray-700">Taxa Erro</th>
                          <th className="text-center py-2 font-medium text-gray-700">Pontos</th>
                          <th className="text-center py-2 font-medium text-gray-700">Dificuldade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cadernosData.map((caderno) => (
                          <tr key={caderno.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-2 font-medium text-gray-800">{caderno.name}</td>
                            <td className="text-center py-2">
                              <span className={`font-semibold ${
                                caderno.media >= 70 ? 'text-green-600' : 
                                caderno.media >= 50 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {caderno.media}%
                              </span>
                            </td>
                            <td className="text-center py-2 text-gray-600">{caderno.quizzes}</td>
                            <td className="text-center py-2 text-gray-600">
                              {caderno.correctAnswers}/{caderno.totalQuestoes}
                            </td>
                            <td className="text-center py-2">
                              <span className={`font-medium ${
                                caderno.taxaErro <= 20 ? 'text-green-600' : 
                                caderno.taxaErro <= 40 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {caderno.taxaErro}%
                              </span>
                            </td>
                            <td className="text-center py-2">
                              <span className={`font-semibold ${
                                caderno.pontosLiquidos >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {caderno.pontosLiquidos >= 0 ? '+' : ''}{caderno.pontosLiquidos}
                              </span>
                            </td>
                            <td className="text-center py-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                caderno.difficulty === 'facil' ? 'bg-green-100 text-green-800' : 
                                caderno.difficulty === 'medio' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {caderno.difficulty === 'facil' ? 'Fácil' : 
                                 caderno.difficulty === 'medio' ? 'Médio' : 'Difícil'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Gráfico de Legendas */}
          {activeChart === 'legendas' && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribuição de Legendas</h3>
              <div className="h-96 w-full">
                {legendasData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={legendasData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {legendasData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [value, 'Questões']}
                        labelStyle={{ color: '#374151' }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <PieChartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Nenhum dado para exibir</p>
                      <p className="text-sm text-gray-500">Complete quizzes no período selecionado</p>
                    </div>
                  </div>
                )}
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
