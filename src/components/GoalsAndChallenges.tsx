import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCadernos } from '@/hooks/useCadernos';
import { useQuiz } from '@/hooks/useQuiz';
import {
    Calendar,
    CheckCircle2,
    Clock,
    Edit2,
    Flag,
    Plus,
    Target,
    Trash2,
    TrendingUp,
    Trophy,
    XCircle
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

interface Goal {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  target: number;
  current: number;
  unit: 'questions' | 'quizzes' | 'percentage';
  cadernoId?: string;
  deadline: string;
  completed: boolean;
  points: number;
  createdAt: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  targetPercentage: number;
  cadernoId: string;
  deadline: string;
  completed: boolean;
  currentPercentage: number;
  points: number;
  createdAt: string;
}

interface GoalsAndChallengesProps {
  onBack: () => void;
}

export const GoalsAndChallenges: React.FC<GoalsAndChallengesProps> = ({ onBack }) => {
  const { quizHistory } = useQuiz();
  const { cadernos } = useCadernos();
  
  const [goals, setGoals] = useState<Goal[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showChallengeForm, setShowChallengeForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  
  // Estados para formulários
  const [goalForm, setGoalForm] = useState({
    title: '',
    description: '',
    type: 'daily' as const,
    target: 10,
    unit: 'questions' as const,
    cadernoId: 'all',
    deadline: ''
  });

  const [challengeForm, setChallengeForm] = useState({
    title: '',
    description: '',
    targetPercentage: 80,
    cadernoId: '',
    deadline: ''
  });

  // Carregar metas e desafios do localStorage (simulação de banco)
  useEffect(() => {
    const savedGoals = localStorage.getItem('quiz-goals');
    const savedChallenges = localStorage.getItem('quiz-challenges');
    
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedChallenges) setChallenges(JSON.parse(savedChallenges));
  }, []);

  // Salvar no localStorage
  const saveToStorage = (newGoals: Goal[], newChallenges: Challenge[]) => {
    localStorage.setItem('quiz-goals', JSON.stringify(newGoals));
    localStorage.setItem('quiz-challenges', JSON.stringify(newChallenges));
  };

  // Calcular progresso das metas baseado no histórico real
  const calculateGoalProgress = (goal: Goal): number => {
    const now = new Date();
    const startDate = new Date(goal.createdAt);
    let endDate: Date;

    switch (goal.type) {
      case 'daily':
        endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'weekly':
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 7);
        break;
      case 'monthly':
        endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + 1);
        break;
    }

    const relevantHistory = quizHistory.filter(result => {
      const resultDate = new Date(result.completed_at);
      return resultDate >= startDate && resultDate <= endDate && 
             (!goal.cadernoId || result.quiz?.caderno_id === goal.cadernoId);
    });

    switch (goal.unit) {
      case 'questions':
        return relevantHistory.reduce((sum, result) => sum + result.total_questions, 0);
      case 'quizzes':
        return relevantHistory.length;
      case 'percentage':
        if (relevantHistory.length === 0) return 0;
        const totalPercentage = relevantHistory.reduce((sum, result) => sum + result.percentage, 0);
        return Math.round(totalPercentage / relevantHistory.length);
    }
  };

  // Calcular progresso dos desafios
  const calculateChallengeProgress = (challenge: Challenge): number => {
    const relevantHistory = quizHistory.filter(result => 
      result.quiz?.caderno_id === challenge.cadernoId
    );

    if (relevantHistory.length === 0) return 0;
    
    const totalPercentage = relevantHistory.reduce((sum, result) => sum + result.percentage, 0);
    return Math.round(totalPercentage / relevantHistory.length);
  };

  // Atualizar progresso automaticamente
  useEffect(() => {
    const updatedGoals = goals.map(goal => ({
      ...goal,
      current: calculateGoalProgress(goal),
      completed: calculateGoalProgress(goal) >= goal.target
    }));

    const updatedChallenges = challenges.map(challenge => ({
      ...challenge,
      currentPercentage: calculateChallengeProgress(challenge),
      completed: calculateChallengeProgress(challenge) >= challenge.targetPercentage
    }));

    setGoals(updatedGoals);
    setChallenges(updatedChallenges);
    saveToStorage(updatedGoals, updatedChallenges);
  }, [quizHistory]);

  // Criar nova meta
  const createGoal = () => {
    if (!goalForm.title.trim()) return;

    const newGoal: Goal = {
      id: Date.now().toString(),
      title: goalForm.title.trim(),
      description: goalForm.description.trim(),
      type: goalForm.type,
      target: goalForm.target,
      current: 0,
      unit: goalForm.unit,
      cadernoId: goalForm.cadernoId === 'all' ? undefined : goalForm.cadernoId,
      deadline: goalForm.deadline || new Date().toISOString(),
      completed: false,
      points: goalForm.type === 'daily' ? 10 : goalForm.type === 'weekly' ? 50 : 200,
      createdAt: new Date().toISOString()
    };

    const newGoals = [...goals, newGoal];
    setGoals(newGoals);
    saveToStorage(newGoals, challenges);
    
    // Reset form
    setGoalForm({
      title: '',
      description: '',
      type: 'daily',
      target: 10,
      unit: 'questions',
      cadernoId: 'all',
      deadline: ''
    });
    setShowGoalForm(false);
  };

  // Criar novo desafio
  const createChallenge = () => {
    if (!challengeForm.title.trim() || !challengeForm.cadernoId) return;

    const newChallenge: Challenge = {
      id: Date.now().toString(),
      title: challengeForm.title.trim(),
      description: challengeForm.description.trim(),
      targetPercentage: challengeForm.targetPercentage,
      cadernoId: challengeForm.cadernoId,
      deadline: challengeForm.deadline || new Date().toISOString(),
      completed: false,
      currentPercentage: 0,
      points: 300,
      createdAt: new Date().toISOString()
    };

    const newChallenges = [...challenges, newChallenge];
    setChallenges(newChallenges);
    saveToStorage(goals, newChallenges);
    
    // Reset form
    setChallengeForm({
      title: '',
      description: '',
      targetPercentage: 80,
      cadernoId: '',
      deadline: ''
    });
    setShowChallengeForm(false);
  };

  // Editar meta
  const editGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setGoalForm({
      title: goal.title,
      description: goal.description,
      type: goal.type,
      target: goal.target,
      unit: goal.unit,
      cadernoId: goal.cadernoId || 'all',
      deadline: goal.deadline
    });
    setShowGoalForm(true);
  };

  // Salvar edição da meta
  const saveGoalEdit = () => {
    if (!editingGoal) return;

    const updatedGoals = goals.map(goal => 
      goal.id === editingGoal.id 
        ? { ...goal, ...goalForm, current: calculateGoalProgress(goal) }
        : goal
    );

    setGoals(updatedGoals);
    saveToStorage(updatedGoals, challenges);
    setEditingGoal(null);
    setShowGoalForm(false);
    setGoalForm({
      title: '',
      description: '',
      type: 'daily',
      target: 10,
      unit: 'questions',
      cadernoId: 'all',
      deadline: ''
    });
  };

  // Deletar meta
  const deleteGoal = (goalId: string) => {
    const newGoals = goals.filter(goal => goal.id !== goalId);
    setGoals(newGoals);
    saveToStorage(newGoals, challenges);
  };

  // Deletar desafio
  const deleteChallenge = (challengeId: string) => {
    const newChallenges = challenges.filter(challenge => challenge.id !== challengeId);
    setChallenges(newChallenges);
    saveToStorage(goals, newChallenges);
  };

  // Calcular pontos totais
  const totalPoints = useMemo(() => {
    const goalPoints = goals.filter(g => g.completed).reduce((sum, g) => sum + g.points, 0);
    const challengePoints = challenges.filter(c => c.completed).reduce((sum, c) => sum + c.points, 0);
    return goalPoints + challengePoints;
  }, [goals, challenges]);

  // Calcular nível do usuário
  const userLevel = useMemo(() => {
    if (totalPoints < 100) return { level: 1, title: 'Iniciante', icon: '🌱' };
    if (totalPoints < 300) return { level: 2, title: 'Estudante', icon: '📚' };
    if (totalPoints < 600) return { level: 3, title: 'Aplicado', icon: '🎯' };
    if (totalPoints < 1000) return { level: 4, title: 'Dedicado', icon: '🏆' };
    return { level: 5, title: 'Mestre', icon: '👑' };
  }, [totalPoints]);

  // Próximo nível
  const nextLevelPoints = useMemo(() => {
    const levels = [100, 300, 600, 1000, Infinity];
    const currentLevelIndex = levels.findIndex(threshold => totalPoints < threshold);
    return levels[currentLevelIndex];
  }, [totalPoints]);

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">Metas e Desafios</h2>
          </div>
          <Button variant="outline" onClick={onBack}>
            Voltar
          </Button>
        </div>

        {/* Sistema de Níveis */}
        <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-3xl">
                {userLevel.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{userLevel.title}</h3>
                <p className="text-gray-600">Nível {userLevel.level}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">{totalPoints} pts</div>
              <div className="text-sm text-gray-600">
                {nextLevelPoints !== Infinity ? `${nextLevelPoints - totalPoints} pts para o próximo nível` : 'Nível máximo!'}
              </div>
            </div>
          </div>
          
          {/* Barra de Progresso */}
          {nextLevelPoints !== Infinity && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Nível {userLevel.level}</span>
                <span>Nível {userLevel.level + 1}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min(100, ((totalPoints % (nextLevelPoints - (nextLevelPoints === 100 ? 0 : 100))) / (nextLevelPoints - (nextLevelPoints === 100 ? 0 : 100))) * 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-3 mb-6">
          <Button
            onClick={() => setShowGoalForm(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Meta
          </Button>
          <Button
            onClick={() => setShowChallengeForm(true)}
            variant="outline"
            className="border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            <Flag className="w-4 h-4 mr-2" />
            Novo Desafio
          </Button>
        </div>

        {/* Formulário de Meta */}
        {showGoalForm && (
          <Card className="p-6 mb-6 bg-green-50 border border-green-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {editingGoal ? 'Editar Meta' : 'Criar Nova Meta'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Título da Meta</label>
                <Input
                  value={goalForm.title}
                  onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                  placeholder="Ex: Resolver 20 questões por dia"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tipo</label>
                <Select value={goalForm.type} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => 
                  setGoalForm({ ...goalForm, type: value })
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diária</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Meta</label>
                <Input
                  type="number"
                  value={goalForm.target}
                  onChange={(e) => setGoalForm({ ...goalForm, target: Number(e.target.value) })}
                  placeholder="10"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Unidade</label>
                <Select value={goalForm.unit} onValueChange={(value: 'questions' | 'quizzes' | 'percentage') => 
                  setGoalForm({ ...goalForm, unit: value })
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="questions">Questões</SelectItem>
                    <SelectItem value="quizzes">Quizzes</SelectItem>
                    <SelectItem value="percentage">Porcentagem</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Caderno (opcional)</label>
                <Select value={goalForm.cadernoId} onValueChange={setGoalForm.cadernoId}>
                  <SelectTrigger>
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
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Prazo</label>
                <Input
                  type="date"
                  value={goalForm.deadline}
                  onChange={(e) => setGoalForm({ ...goalForm, deadline: e.target.value })}
                />
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <label className="text-sm font-medium text-gray-700">Descrição (opcional)</label>
              <Textarea
                value={goalForm.description}
                onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
                placeholder="Descreva sua meta..."
                rows={2}
              />
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button
                onClick={editingGoal ? saveGoalEdit : createGoal}
                className="bg-green-600 hover:bg-green-700"
              >
                {editingGoal ? 'Salvar' : 'Criar Meta'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowGoalForm(false);
                  setEditingGoal(null);
                  setGoalForm({
                    title: '',
                    description: '',
                    type: 'daily',
                    target: 10,
                    unit: 'questions',
                    cadernoId: 'all',
                    deadline: ''
                  });
                }}
              >
                Cancelar
              </Button>
            </div>
          </Card>
        )}

        {/* Formulário de Desafio */}
        {showChallengeForm && (
          <Card className="p-6 mb-6 bg-purple-50 border border-purple-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {editingChallenge ? 'Editar Desafio' : 'Criar Novo Desafio'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Título do Desafio</label>
                <Input
                  value={challengeForm.title}
                  onChange={(e) => setChallengeForm({ ...challengeForm, title: e.target.value })}
                  placeholder="Ex: Atingir 80% em Direito Constitucional"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Caderno</label>
                <Select value={challengeForm.cadernoId} onValueChange={setChallengeForm.cadernoId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um caderno" />
                  </SelectTrigger>
                  <SelectContent>
                    {cadernos.map((caderno) => (
                      <SelectItem key={caderno.id} value={caderno.id}>
                        {caderno.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Meta de Porcentagem</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={challengeForm.targetPercentage}
                  onChange={(e) => setChallengeForm({ ...challengeForm, targetPercentage: Number(e.target.value) })}
                  placeholder="80"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Prazo</label>
                <Input
                  type="date"
                  value={challengeForm.deadline}
                  onChange={(e) => setChallengeForm({ ...challengeForm, deadline: e.target.value })}
                />
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <label className="text-sm font-medium text-gray-700">Descrição (opcional)</label>
              <Textarea
                value={challengeForm.description}
                onChange={(e) => setChallengeForm({ ...challengeForm, description: e.target.value })}
                placeholder="Descreva seu desafio..."
                rows={2}
              />
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button
                onClick={createChallenge}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Criar Desafio
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowChallengeForm(false);
                  setChallengeForm({
                    title: '',
                    description: '',
                    targetPercentage: 80,
                    cadernoId: '',
                    deadline: ''
                  });
                }}
              >
                Cancelar
              </Button>
            </div>
          </Card>
        )}

        {/* Lista de Metas */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            Minhas Metas ({goals.filter(g => !g.completed).length} ativas)
          </h3>
          
          {goals.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhuma meta criada ainda</p>
              <p className="text-sm text-gray-500">Crie sua primeira meta para começar!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {goals.map((goal) => {
                const progress = Math.min(100, (goal.current / goal.target) * 100);
                const isOverdue = new Date(goal.deadline) < new Date() && !goal.completed;
                
                return (
                  <Card key={goal.id} className={`p-4 ${goal.completed ? 'bg-green-50 border-green-200' : isOverdue ? 'bg-red-50 border-red-200' : 'bg-white'}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">{goal.title}</h4>
                        {goal.description && (
                          <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <Calendar className="w-3 h-3" />
                          <span>Prazo: {new Date(goal.deadline).toLocaleDateString('pt-BR')}</span>
                        </div>
                        {goal.cadernoId && (
                          <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block">
                            {cadernos.find(c => c.id === goal.cadernoId)?.nome}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => editGoal(goal)}
                          className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteGoal(goal.id)}
                          className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {goal.current} / {goal.target} {goal.unit === 'questions' ? 'questões' : goal.unit === 'quizzes' ? 'quizzes' : '%'}
                        </span>
                        <span className="font-medium text-gray-800">{Math.round(progress)}%</span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            goal.completed ? 'bg-green-500' : isOverdue ? 'bg-red-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs">
                          {goal.type === 'daily' && <Clock className="w-3 h-3 text-blue-500" />}
                          {goal.type === 'weekly' && <Calendar className="w-3 h-3 text-green-500" />}
                          {goal.type === 'monthly' && <TrendingUp className="w-3 h-3 text-purple-500" />}
                          <span className="text-gray-500 capitalize">{goal.type}</span>
                        </div>
                        
                        {goal.completed ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-sm font-medium">+{goal.points} pts</span>
                          </div>
                        ) : isOverdue ? (
                          <div className="flex items-center gap-1 text-red-600">
                            <XCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Atrasada</span>
                          </div>
                        ) : (
                          <div className="text-xs text-gray-500">
                            +{goal.points} pts
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Lista de Desafios */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Flag className="w-5 h-5 text-purple-600" />
            Meus Desafios ({challenges.filter(c => !c.completed).length} ativos)
          </h3>
          
          {challenges.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Flag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum desafio criado ainda</p>
              <p className="text-sm text-gray-500">Crie seu primeiro desafio para testar seus limites!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {challenges.map((challenge) => {
                const progress = Math.min(100, (challenge.currentPercentage / challenge.targetPercentage) * 100);
                const isOverdue = new Date(challenge.deadline) < new Date() && !challenge.completed;
                const caderno = cadernos.find(c => c.id === challenge.cadernoId);
                
                return (
                  <Card key={challenge.id} className={`p-4 ${challenge.completed ? 'bg-green-50 border-green-200' : isOverdue ? 'bg-red-50 border-red-200' : 'bg-white'}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">{challenge.title}</h4>
                        {challenge.description && (
                          <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <Calendar className="w-3 h-3" />
                          <span>Prazo: {new Date(challenge.deadline).toLocaleDateString('pt-BR')}</span>
                        </div>
                        {caderno && (
                          <div className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full inline-block">
                            {caderno.nome}
                          </div>
                        )}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteChallenge(challenge.id)}
                        className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {challenge.currentPercentage}% / {challenge.targetPercentage}%
                        </span>
                        <span className="font-medium text-gray-800">{Math.round(progress)}%</span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            challenge.completed ? 'bg-green-500' : isOverdue ? 'bg-red-500' : 'bg-purple-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          Desafio de {challenge.targetPercentage}%
                        </div>
                        
                        {challenge.completed ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <Trophy className="w-4 h-4" />
                            <span className="text-sm font-medium">+{challenge.points} pts</span>
                          </div>
                        ) : isOverdue ? (
                          <div className="flex items-center gap-1 text-red-600">
                            <XCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Expirado</span>
                          </div>
                        ) : (
                          <div className="text-xs text-gray-500">
                            +{challenge.points} pts
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
