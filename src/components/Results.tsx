
import { TagDisplay } from '@/components/TagDisplay';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, ArrowLeft, Tag as TagIcon, Target, Trophy } from 'lucide-react';
import React from 'react';

interface ResultsProps {
  results: {
    correct: number;
    incorrect: number;
    unanswered: number;
    total: number;
  };
  onBack: () => void;
  tags?: Array<{
    id: string;
    name: string;
    color: string;
    description?: string | null;
  }>;
  cadernoName?: string;
}

export const Results: React.FC<ResultsProps> = ({ results, onBack, tags, cadernoName }) => {
  const percentage = Math.round((results.correct / results.total) * 100);
  
  const getPerformanceMessage = () => {
    if (percentage >= 90) return { message: "Excelente! 🎉", color: "text-green-600", icon: Trophy };
    if (percentage >= 70) return { message: "Bom trabalho! 👍", color: "text-blue-600", icon: Target };
    if (percentage >= 50) return { message: "Continue estudando! 📚", color: "text-yellow-600", icon: AlertCircle };
    return { message: "Precisa revisar! 💪", color: "text-red-600", icon: AlertCircle };
  };

  const performance = getPerformanceMessage();
  const Icon = performance.icon;

  return (
    <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-2xl font-bold text-gray-800">Resultados</h2>
        <div></div>
      </div>

      {/* Informações do Quiz */}
      {(cadernoName || tags) && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 dark:from-blue-950/20 dark:to-indigo-950/20 dark:border-blue-800">
          <div className="flex flex-col sm:flex-row gap-4">
            {cadernoName && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Target className="w-3 h-3 text-white" />
                </div>
                <div>
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Caderno:</span>
                  <div className="text-sm font-semibold text-blue-800 dark:text-blue-200">{cadernoName}</div>
                </div>
              </div>
            )}
            
            {tags && tags.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <TagIcon className="w-3 h-3 text-white" />
                </div>
                <div>
                  <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Tags:</span>
                  <div className="mt-1">
                    <TagDisplay tags={tags} size="sm" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <span className="text-3xl font-bold text-white">{percentage}%</span>
        </div>
        <div className={`flex items-center justify-center gap-2 mb-2 ${performance.color}`}>
          <Icon className="w-6 h-6" />
          <h3 className="text-xl font-semibold">{performance.message}</h3>
        </div>
        <p className="text-gray-600">
          Você acertou {results.correct} de {results.total} questões
        </p>
      </div>

      <div className="space-y-6 mb-8">
        {/* Barra de Progresso */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Aproveitamento</span>
            <span className="text-sm font-bold text-gray-800">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-3" />
        </div>

        {/* Estatísticas Detalhadas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center dark:bg-green-950/20 dark:border-green-800">
            <div className="w-3 h-3 rounded-full bg-green-500 mx-auto mb-2"></div>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">{results.correct}</div>
            <div className="text-sm text-green-600 dark:text-green-400">Acertos</div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center dark:bg-red-950/20 dark:border-red-800">
            <div className="w-3 h-3 rounded-full bg-red-500 mx-auto mb-2"></div>
            <div className="text-2xl font-bold text-red-700 dark:text-red-300">{results.incorrect}</div>
            <div className="text-sm text-red-600 dark:text-red-400">Erros</div>
          </div>
          
          {results.unanswered > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center dark:bg-gray-950/20 dark:border-gray-800">
              <div className="w-3 h-3 rounded-full bg-gray-400 mx-auto mb-2"></div>
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{results.unanswered}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Não respondidas</div>
            </div>
          )}
        </div>

        {/* Análise de Performance */}
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-4 rounded-lg border border-slate-200 dark:from-slate-800/20 dark:to-gray-800/20 dark:border-slate-700">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Análise de Performance</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Taxa de acerto:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{percentage}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Questões respondidas:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{results.correct + results.incorrect}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Eficiência:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {results.total > 0 ? Math.round(((results.correct + results.incorrect) / results.total) * 100) : 0}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Saldo de pontos:</span>
              <span className={`font-medium ${results.correct - results.incorrect >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {results.correct - results.incorrect}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Button onClick={onBack} className="px-8">
          Voltar ao Gabarito
        </Button>
      </div>
    </Card>
  );
};
