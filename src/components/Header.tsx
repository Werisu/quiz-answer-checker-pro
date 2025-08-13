import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, BookOpen, CheckCircle2, Circle, Clock, HelpCircle, Play, Plus, RotateCcw, Save, Star, XCircle } from 'lucide-react';
import React, { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';

interface Caderno {
  id: string;
  nome: string;
  descricao?: string;
}

interface HeaderProps {
  onInitialize: (count: number, pdfName: string, description: string, cadernoId: string) => void;
  onReset: () => void;
  onSave: () => void;
  hasQuestions: boolean;
  results: {
    correct: number;
    incorrect: number;
    unanswered: number;
    total: number;
  };
  cadernos: Caderno[];
  onCadernoCreate: (nome: string, descricao: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onInitialize,
  onReset,
  onSave,
  hasQuestions,
  results,
  cadernos,
  onCadernoCreate,
}) => {
  const [questionCount, setQuestionCount] = useState(10);
  const [pdfName, setPdfName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCadernoId, setSelectedCadernoId] = useState('');
  const [showNewCadernoForm, setShowNewCadernoForm] = useState(false);
  const [newCadernoNome, setNewCadernoNome] = useState('');
  const [newCadernoDescricao, setNewCadernoDescricao] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCadernoId) {
      alert('Por favor, selecione um caderno');
      return;
    }
    onInitialize(questionCount, pdfName, description, selectedCadernoId);
  };

  const handleCreateCaderno = () => {
    if (!newCadernoNome.trim()) {
      alert('Por favor, insira o nome do caderno');
      return;
    }
    onCadernoCreate(newCadernoNome.trim(), newCadernoDescricao.trim());
    setNewCadernoNome('');
    setNewCadernoDescricao('');
    setShowNewCadernoForm(false);
  };

  const percentage = results.total > 0
    ? ((results.correct + results.incorrect) / results.total) * 100
    : 0;

  const allQuestionsAnswered = results.unanswered === 0 && results.total > 0;

  return (
    <Card className="p-4 sm:p-5 bg-gradient-to-br from-background via-muted/50 to-background/80 backdrop-blur-xl border-0 shadow-xl rounded-2xl">
      <div className="flex flex-col gap-4 w-full">
        {!hasQuestions && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            {/* Cabeçalho do Formulário */}
            <div className="text-center space-y-2 relative">
              <div className="absolute top-0 right-0">
                <ThemeToggle />
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Novo Quiz
              </h2>
              <p className="text-muted-foreground text-xs">Configure seu quiz e comece a estudar</p>
            </div>

            {/* Campos Principais */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  Número de Questões
                </label>
                                 <Input
                   type="number"
                   min="1"
                   max="200"
                   value={questionCount}
                   onChange={(e) => setQuestionCount(Number(e.target.value))}
                   placeholder="Ex: 20"
                   className="w-32 h-10 rounded-xl border-2 border-border focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-center text-base font-medium bg-background text-foreground"
                 />
              </div>
              
              <div className="space-y-1 flex-1">
                <label className="text-xs font-medium text-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  Nome do PDF
                </label>
                                 <Input
                   type="text"
                   value={pdfName}
                   onChange={(e) => setPdfName(e.target.value)}
                   placeholder="Ex: Direito Constitucional"
                   className="w-full h-10 rounded-xl border-2 border-border focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-200 bg-background text-foreground"
                 />
              </div>
            </div>
            
            {/* Seleção de Caderno */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <div>
                                     <h3 className="text-sm font-semibold text-foreground">Selecionar Caderno</h3>
                   <p className="text-xs text-muted-foreground">Escolha onde salvar seu quiz</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                                 <Select value={selectedCadernoId} onValueChange={setSelectedCadernoId}>
                   <SelectTrigger className="w-full sm:w-72 h-10 rounded-xl border-2 border-border focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-200 bg-background text-foreground">
                     <SelectValue placeholder="Escolha um caderno existente" />
                   </SelectTrigger>
                   <SelectContent className="rounded-xl border-2 border-border shadow-xl bg-background">
                    {cadernos.map((caderno) => (
                                             <SelectItem key={caderno.id} value={caderno.id} className="rounded-lg text-foreground hover:bg-accent">
                         <div className="flex items-center gap-2">
                           <div>
                             <div className="font-medium text-foreground text-sm">{caderno.nome}</div>
                           </div>
                         </div>
                       </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                                 <Button
                   type="button"
                   variant="outline"
                   onClick={() => setShowNewCadernoForm(!showNewCadernoForm)}
                   className="w-full sm:w-auto h-10 px-4 rounded-xl border-2 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 font-medium text-sm bg-background"
                 >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Caderno
                </Button>
              </div>
            </div>

            {/* Formulário de Novo Caderno */}
                         {showNewCadernoForm && (
               <div className="p-4 border-2 border-purple-200 rounded-2xl bg-gradient-to-br from-purple-50/50 to-background shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Plus className="w-3 h-3 text-white" />
                  </div>
                                     <h4 className="text-sm font-semibold text-foreground">Criar Novo Caderno</h4>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                                         <label className="text-xs font-medium text-foreground">Nome do Caderno</label>
                                         <Input
                       type="text"
                       value={newCadernoNome}
                       onChange={(e) => setNewCadernoNome(e.target.value)}
                       placeholder="Ex: Direito Constitucional"
                       className="w-full h-9 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-200 bg-background text-foreground"
                     />
                  </div>
                  
                  <div className="space-y-1">
                                         <label className="text-xs font-medium text-foreground">Descrição (opcional)</label>
                                         <Textarea
                       value={newCadernoDescricao}
                       onChange={(e) => setNewCadernoDescricao(e.target.value)}
                       placeholder="Descreva o conteúdo deste caderno..."
                       className="w-full rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-200 resize-none bg-background text-foreground"
                       rows={2}
                     />
                  </div>
                  
                  <div className="flex gap-2 pt-1">
                    <Button 
                      type="button" 
                      size="sm"
                      className="flex-1 h-9 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium text-sm"
                      onClick={handleCreateCaderno}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Caderno
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9 px-4 rounded-xl border-2 border-border hover:border-border hover:bg-accent transition-all duration-200 font-medium text-sm bg-background"
                      onClick={() => setShowNewCadernoForm(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Descrição */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                Descrição (opcional)
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Adicione uma descrição para seu quiz..."
                className="w-full rounded-xl border-2 border-border focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all duration-200 resize-none bg-background text-foreground"
                rows={2}
              />
            </div>

            {/* Botão Iniciar */}
            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed" 
              disabled={!selectedCadernoId}
            >
              <Play className="w-5 h-5 mr-2" />
              Iniciar Quiz
            </Button>
          </form>
        )}
        
        {/* Interface de Resultados */}
        {hasQuestions && (
          <div className="space-y-4">
            {/* Estatísticas */}
            <div className="bg-gradient-to-r from-muted to-background p-4 rounded-2xl border-2 border-border shadow-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-foreground">Progresso do Quiz</h3>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-green-600">{results.correct}</div>
                                                 <div className="text-xs text-muted-foreground">Corretas</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                        <XCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-red-600">{results.incorrect}</div>
                                                 <div className="text-xs text-muted-foreground">Incorretas</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-gray-600">{results.unanswered}</div>
                                                 <div className="text-xs text-muted-foreground">Pendentes</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-blue-600">{percentage.toFixed(1)}%</div>
                                         <div className="text-xs text-muted-foreground">de questões respondidas</div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <Button 
                    onClick={onSave} 
                    className="w-full sm:w-auto h-10 px-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-sm"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Resultados
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={onReset} 
                    className="w-full sm:w-auto h-10 px-6 rounded-xl border-2 border-border hover:border-border hover:bg-accent transition-all duration-200 font-semibold text-sm bg-background"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reiniciar Quiz
                  </Button>
                </div>
              </div>
            </div>

            {/* Legenda */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border-2 border-blue-100 shadow-lg dark:from-blue-950/20 dark:to-indigo-950/20 dark:border-blue-800">
                             <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <HelpCircle className="w-3 h-3 text-white" />
                </div>
                Legenda das Respostas
              </h3>
              
                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                   <div className="flex items-center gap-2 p-2 bg-background/60 rounded-xl">
                     <Circle className="w-4 h-4 text-blue-500" />
                     <span className="text-xs text-foreground">Não sabe, não responde</span>
                   </div>
                   <div className="flex items-center gap-2 p-2 bg-background/60 rounded-xl">
                     <Star className="w-4 h-4 text-yellow-500" />
                     <span className="text-xs text-foreground">Tem certeza, responde</span>
                   </div>
                   <div className="flex items-center gap-2 p-2 bg-background/60 rounded-xl">
                     <HelpCircle className="w-4 h-4 text-purple-500" />
                     <span className="text-xs text-foreground">Em dúvida, mas sabe a matéria</span>
                   </div>
                   <div className="flex items-center gap-2 p-2 bg-background/60 rounded-xl">
                     <AlertCircle className="w-4 h-4 text-orange-500" />
                     <span className="text-xs text-foreground">Sabe, mas precisa de mais tempo</span>
                   </div>
                 </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
