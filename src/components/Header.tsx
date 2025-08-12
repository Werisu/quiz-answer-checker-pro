import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, BookOpen, Circle, HelpCircle, Play, Plus, RotateCcw, Save, Star } from 'lucide-react';
import React, { useState } from 'react';

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
    <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex flex-col gap-6 w-full">
        {!hasQuestions && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="number"
                min="1"
                max="200"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                placeholder="Nº questões"
                className="w-full"
              />
              <Input
                type="text"
                value={pdfName}
                onChange={(e) => setPdfName(e.target.value)}
                placeholder="Nome do PDF"
                className="w-full"
              />
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Selecionar Caderno:</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={selectedCadernoId} onValueChange={setSelectedCadernoId}>
                  <SelectTrigger className="w-full sm:w-64">
                    <SelectValue placeholder="Escolha um caderno" />
                  </SelectTrigger>
                  <SelectContent>
                    {cadernos.map((caderno) => (
                      <SelectItem key={caderno.id} value={caderno.id}>
                        {caderno.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewCadernoForm(!showNewCadernoForm)}
                  className="w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Caderno
                </Button>
              </div>
            </div>

            {showNewCadernoForm && (
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Criar Novo Caderno</h4>
                <div className="flex flex-col gap-3">
                  <Input
                    type="text"
                    value={newCadernoNome}
                    onChange={(e) => setNewCadernoNome(e.target.value)}
                    placeholder="Nome do caderno (ex: Direito Constitucional)"
                    className="w-full"
                  />
                  <Textarea
                    value={newCadernoDescricao}
                    onChange={(e) => setNewCadernoDescricao(e.target.value)}
                    placeholder="Descrição do caderno (opcional)"
                    className="w-full"
                  />
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={handleCreateCaderno}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Criar
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowNewCadernoForm(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição (opcional)"
              className="w-full"
            />
            <Button type="submit" className="w-full sm:w-auto" disabled={!selectedCadernoId}>
              <Play className="w-4 h-4 mr-2" />
              Iniciar
            </Button>
          </form>
        )}
        
        {hasQuestions && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 w-full">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-600">{results.correct}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-gray-600">{results.incorrect}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <span className="text-gray-600">{results.unanswered}</span>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {percentage.toFixed(1)}%
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <Button onClick={onSave} className="w-full bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
              <Button variant="outline" onClick={onReset} className="w-full">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reiniciar
              </Button>
            </div>
          </div>
        )}

        {hasQuestions && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Legenda:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Circle className="w-4 h-4 text-blue-500" />
                <span className="text-gray-600">Não sabe, não responde</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-600">Tem certeza, responde</span>
              </div>
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-500" />
                <span className="text-gray-600">Em dúvida, mas sabe a matéria</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                <span className="text-gray-600">Sabe, mas precisa de mais tempo</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
