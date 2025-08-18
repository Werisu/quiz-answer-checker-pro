import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { eachDayOfInterval, endOfYear, format, startOfYear } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock, Target, TrendingUp } from 'lucide-react';
import React, { useMemo } from 'react';

interface StudyCalendarProps {
  quizHistory: Array<{
    completed_at: string;
    total_questions: number;
    correct_answers: number;
    quiz?: {
      title?: string;
      caderno_id?: string;
    };
  }>;
  cadernos: Array<{
    id: string;
    nome: string;
    cor?: string;
  }>;
}

interface DayData {
  date: Date;
  quizzes: number;
  questions: number;
  correct: number;
  accuracy: number;
  intensity: number; // 0-4 para cores
}

export const StudyCalendar: React.FC<StudyCalendarProps> = ({ quizHistory, cadernos }) => {
  // Calcular sequência mais longa de dias estudando
  const calculateLongestStreak = (data: DayData[]): number => {
    let maxStreak = 0;
    let currentStreak = 0;
    
    data.forEach(day => {
      if (day.quizzes > 0) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });
    
    return maxStreak;
  };
  
  // Calcular sequência atual
  const calculateCurrentStreak = (data: DayData[]): number => {
    let currentStreak = 0;
    
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].quizzes > 0) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    return currentStreak;
  };

  // Calcular dados do calendário
  const calendarData = useMemo(() => {
    const startDate = startOfYear(new Date());
    const endDate = endOfYear(new Date());
    const allDays = eachDayOfInterval({ start: startDate, end: endDate });
    
    // Criar mapa de frequência por dia
    const frequencyMap = new Map<string, DayData>();
    
    // Inicializar todos os dias
    allDays.forEach(day => {
      frequencyMap.set(day.toDateString(), {
        date: day,
        quizzes: 0,
        questions: 0,
        correct: 0,
        accuracy: 0,
        intensity: 0
      });
    });
    
    // Preencher com dados reais
    quizHistory.forEach(quiz => {
      const quizDate = new Date(quiz.completed_at);
      const dateKey = quizDate.toDateString();
      const existing = frequencyMap.get(dateKey);
      
      if (existing) {
        existing.quizzes += 1;
        existing.questions += quiz.total_questions || 0;
        existing.correct += quiz.correct_answers || 0;
        existing.accuracy = existing.questions > 0 ? (existing.correct / existing.questions) * 100 : 0;
        
        // Calcular intensidade baseada em quizzes e questões
        existing.intensity = Math.min(4, Math.floor(existing.quizzes / 1.5) + Math.floor(existing.questions / 15));
      }
    });
    
    return Array.from(frequencyMap.values());
  }, [quizHistory]);
  
  // Calcular estatísticas
  const stats = useMemo(() => {
    const activeDays = calendarData.filter(day => day.quizzes > 0);
    const totalQuizzes = activeDays.reduce((sum, day) => sum + day.quizzes, 0);
    const totalQuestions = activeDays.reduce((sum, day) => sum + day.questions, 0);
    const averageQuizzesPerDay = activeDays.length > 0 ? totalQuizzes / activeDays.length : 0;
    const longestStreak = calculateLongestStreak(calendarData);
    const currentStreak = calculateCurrentStreak(calendarData);
    
    return {
      activeDays: activeDays.length,
      totalQuizzes,
      totalQuestions,
      averageQuizzesPerDay,
      longestStreak,
      currentStreak
    };
  }, [calendarData]);
  
  // Obter cor baseada na intensidade
  const getIntensityColor = (intensity: number) => {
    const colors = [
      'bg-slate-100 dark:bg-slate-800', // 0 - nenhum estudo
      'bg-blue-200 dark:bg-blue-800',   // 1 - pouco estudo
      'bg-blue-300 dark:bg-blue-700',   // 2 - estudo moderado
      'bg-blue-400 dark:bg-blue-600',   // 3 - muito estudo
      'bg-blue-500 dark:bg-blue-500'    // 4 - estudo intenso
    ];
    return colors[intensity] || colors[0];
  };
  
  // Agrupar por semanas para exibição
  const weeks = useMemo(() => {
    const weeks: DayData[][] = [];
    let currentWeek: DayData[] = [];
    
    calendarData.forEach((day, index) => {
      currentWeek.push(day);
      
      if ((index + 1) % 7 === 0 || index === calendarData.length - 1) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });
    
    return weeks;
  }, [calendarData]);
  
  // Obter nome do mês
  const getMonthName = (date: Date) => {
    return format(date, 'MMMM', { locale: ptBR });
  };
  
  // Obter meses únicos para legendas
  const months = useMemo(() => {
    const monthNames = new Set<string>();
    calendarData.forEach(day => {
      if (day.date.getDate() === 1) {
        monthNames.add(getMonthName(day.date));
      }
    });
    return Array.from(monthNames);
  }, [calendarData]);

  return (
    <Card className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl border-slate-200/60 shadow-lg dark:from-slate-800/80 dark:to-slate-700/60 dark:border-slate-600/40">
      <CardHeader>
        <CardTitle className="text-slate-800 dark:text-foreground flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-600" />
          Calendário de Estudos
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-muted-foreground">
          Visualize sua frequência de estudos ao longo do ano
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200/50 dark:from-blue-500/20 dark:to-blue-600/30 dark:border-blue-600/40">
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">{stats.activeDays}</div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Dias ativos</div>
          </div>
          
          <div className="text-center p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200/50 dark:from-emerald-500/20 dark:to-emerald-600/30 dark:border-emerald-600/40">
            <div className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">{stats.totalQuizzes}</div>
            <div className="text-sm text-emerald-700 dark:text-emerald-300">Total quizzes</div>
          </div>
          
          <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200/50 dark:from-purple-500/20 dark:to-purple-600/30 dark:border-purple-600/40">
            <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">{stats.longestStreak}</div>
            <div className="text-sm text-purple-700 dark:text-purple-300">Sequência máxima</div>
          </div>
          
          <div className="text-center p-3 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl border border-amber-200/50 dark:from-amber-500/20 dark:to-amber-600/30 dark:border-amber-600/40">
            <div className="text-2xl font-bold text-amber-800 dark:text-amber-200">{stats.currentStreak}</div>
            <div className="text-sm text-amber-700 dark:text-amber-300">Sequência atual</div>
          </div>
        </div>
        
        {/* Calendário Visual */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-foreground">Histórico de Estudos</h3>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-muted-foreground">
              <span>Menos</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map(intensity => (
                  <div
                    key={intensity}
                    className={`w-3 h-3 rounded-sm ${getIntensityColor(intensity)}`}
                  />
                ))}
              </div>
              <span>Mais</span>
            </div>
          </div>
          
          {/* Meses */}
          <div className="flex gap-2 text-xs text-slate-600 dark:text-muted-foreground overflow-x-auto">
            {months.map((month, index) => (
              <span key={index} className="w-12 text-center min-w-[48px]">
                {month.charAt(0).toUpperCase() + month.slice(1, 3)}
              </span>
            ))}
          </div>
          
          {/* Grid do Calendário */}
          <div className="grid grid-cols-7 gap-1 overflow-x-auto">
            {/* Dias da semana */}
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
              <div key={day} className="text-xs text-center text-slate-500 dark:text-slate-400 p-1 min-w-[24px]">
                {day}
              </div>
            ))}
            
            {/* Dias do calendário */}
            {calendarData.map((day, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-sm ${getIntensityColor(day.intensity)} hover:scale-125 transition-transform cursor-pointer relative group min-w-[24px]`}
                title={`${format(day.date, 'dd/MM/yyyy')} - ${day.quizzes} quiz${day.quizzes !== 1 ? 'es' : ''}, ${day.questions} questão${day.questions !== 1 ? 'ões' : ''}`}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  <div className="font-semibold">{format(day.date, 'dd/MM/yyyy')}</div>
                  <div>{day.quizzes} quiz{day.quizzes !== 1 ? 'es' : ''}</div>
                  <div>{day.questions} questão{day.questions !== 1 ? 'ões' : ''}</div>
                  {day.accuracy > 0 && (
                    <div className="text-emerald-300">{day.accuracy.toFixed(1)}% acerto</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Insights */}
        <div className="space-y-3">
          <h4 className="text-md font-semibold text-slate-800 dark:text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Insights
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {stats.currentStreak > 0 && (
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-50 to-green-100 border border-emerald-200/50 rounded-xl dark:from-emerald-500/20 dark:to-green-600/30 dark:border-emerald-600/40">
                <Target className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="font-semibold text-emerald-800 dark:text-emerald-200">
                    Sequência atual: {stats.currentStreak} dias
                  </div>
                  <div className="text-sm text-emerald-700 dark:text-emerald-300">
                    Continue assim! Você está no caminho certo.
                  </div>
                </div>
              </div>
            )}
            
            {stats.averageQuizzesPerDay > 0 && (
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-100 border border-blue-200/50 rounded-xl dark:from-blue-500/20 dark:to-indigo-600/30 dark:border-blue-600/40">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-semibold text-blue-800 dark:text-blue-200">
                    Média: {stats.averageQuizzesPerDay.toFixed(1)} quizzes/dia
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    {stats.averageQuizzesPerDay >= 2 ? 'Excelente consistência!' : 'Tente manter uma rotina regular.'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
