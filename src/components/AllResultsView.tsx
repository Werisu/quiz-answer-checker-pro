
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { QuizResult } from '@/hooks/useQuiz';
import { BarChart3, Calendar, User, Target } from 'lucide-react';

interface AllResultsViewProps {
  results: QuizResult[];
  loading: boolean;
}

export const AllResultsView: React.FC<AllResultsViewProps> = ({ results, loading }) => {
  const getPerformanceBadge = (percentage: number) => {
    if (percentage >= 80) {
      return <Badge className="bg-green-100 text-green-800">Excelente</Badge>;
    } else if (percentage >= 60) {
      return <Badge className="bg-yellow-100 text-yellow-800">Bom</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800">Precisa Melhorar</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando resultados...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">
          Todos os Resultados ({results.length})
        </h3>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Nenhum resultado encontrado</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Quiz</TableHead>
              <TableHead>Acertos</TableHead>
              <TableHead>Erros</TableHead>
              <TableHead>Percentual</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result) => (
              <TableRow key={result.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    {result.profiles?.name || 'Usuário'}
                  </div>
                </TableCell>
                <TableCell>{result.quiz?.title || 'Quiz'}</TableCell>
                <TableCell>
                  <span className="text-green-600 font-medium">
                    {result.correct_answers}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-red-600 font-medium">
                    {result.wrong_answers}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">
                    {result.percentage.toFixed(1)}%
                  </span>
                </TableCell>
                <TableCell>
                  {getPerformanceBadge(result.percentage)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {new Date(result.completed_at).toLocaleDateString('pt-BR')}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
