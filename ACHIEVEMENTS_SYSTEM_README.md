# 🏆 Sistema de Achievements para Metas e Desafios

## 📋 Visão Geral

Este sistema resolve o problema de pontuação acumulativa criando um histórico permanente de conquistas. Ao invés de tentar calcular pontos baseado no `quizHistory`, agora registramos cada conquista em tabelas específicas.

## 🗄️ Novas Tabelas do Banco de Dados

### 1. `goal_achievements`

Registra quando uma meta foi completada:

- `id`: Identificador único
- `goal_id`: Referência para a meta
- `user_id`: Usuário que completou
- `achieved_at`: Data/hora da conquista
- `points_earned`: Pontos ganhos
- `progress_value`: Valor do progresso quando foi alcançado

### 2. `challenge_achievements`

Registra quando um desafio foi completado:

- `id`: Identificador único
- `challenge_id`: Referência para o desafio
- `user_id`: Usuário que completou
- `achieved_at`: Data/hora da conquista
- `points_earned`: Pontos ganhos
- `final_percentage`: Porcentagem final alcançada

## 🚀 Como Implementar

### Passo 1: Executar o Script SQL

Execute o arquivo `src/integrations/supabase/bd/create_achievements_tables.sql` no SQL Editor do Supabase.

### Passo 2: Usar o Hook `useAchievements`

```typescript
import { useAchievements } from "@/hooks/useAchievements";

const {
  recordGoalAchievement,
  recordChallengeAchievement,
  calculateTotalPoints,
} = useAchievements();
```

### Passo 3: Registrar Conquistas

Quando uma meta ou desafio for completado:

```typescript
// Para metas
await recordGoalAchievement(goalId, goal.points, goal.current);

// Para desafios
await recordChallengeAchievement(
  challengeId,
  challenge.points,
  finalPercentage
);
```

## 🔄 Fluxo de Funcionamento

### Antes (Sistema Antigo)

1. ❌ Cálculo complexo baseado em `quizHistory`
2. ❌ Iteração através de dias para calcular pontos
3. ❌ Performance ruim com muitos dados
4. ❌ Difícil de manter e debugar

### Agora (Sistema Novo)

1. ✅ Registro direto quando meta/desafio é completado
2. ✅ Consulta simples para calcular pontos totais
3. ✅ Performance excelente
4. ✅ Fácil de manter e debugar

## 📊 Vantagens do Novo Sistema

### 1. **Performance**

- Consultas diretas ao invés de cálculos complexos
- Índices otimizados para busca rápida
- Sem necessidade de iterar através de histórico

### 2. **Manutenibilidade**

- Código mais limpo e legível
- Lógica separada em hook dedicado
- Fácil de testar e debugar

### 3. **Escalabilidade**

- Sistema cresce linearmente com o número de conquistas
- Sem impacto no `quizHistory`
- Fácil de adicionar novos tipos de achievements

### 4. **Histórico Completo**

- Registro permanente de todas as conquistas
- Fácil de gerar relatórios e estatísticas
- Auditoria completa de progresso do usuário

## 🎯 Casos de Uso

### 1. **Metas Diárias**

- Progresso reseta a cada dia
- Pontos são registrados quando completadas
- Histórico mantém todas as conquistas

### 2. **Metas Semanais/Mensais**

- Progresso acumulativo
- Pontos permanentes quando completadas
- Histórico de conquistas

### 3. **Desafios**

- Progresso baseado em porcentagem
- Pontos quando meta é atingida
- Histórico de conquistas

## 🔧 Funções Disponíveis

### `useAchievements` Hook

- `recordGoalAchievement(goalId, points, progress)`: Registra conquista de meta
- `recordChallengeAchievement(challengeId, points, percentage)`: Registra conquista de desafio
- `calculateTotalPoints()`: Calcula pontos totais
- `isGoalAchievedToday(goalId)`: Verifica se meta foi completada hoje
- `isChallengeAchieved(challengeId)`: Verifica se desafio foi completado
- `getAchievementsByPeriod(start, end)`: Busca conquistas por período

## 📈 Exemplo de Uso

```typescript
// No componente GoalsAndChallenges
const { recordGoalAchievement } = useAchievements();

// Quando uma meta for completada
if (current >= goal.target && !goal.completed) {
  // Atualizar meta no banco
  await updateGoalProgressDB(goal.id, current, true);

  // Registrar achievement
  await recordGoalAchievement(goal.id, goal.points, current);
}
```

## 🚨 Migração

### Para Usuários Existentes

1. As tabelas são criadas vazias
2. Pontos existentes continuam funcionando
3. Novas conquistas são registradas automaticamente
4. Sistema funciona em paralelo durante transição

### Para Novos Usuários

1. Sistema funciona desde o início
2. Todas as conquistas são registradas
3. Histórico completo desde o primeiro dia

## 🔍 Monitoramento

### Logs Importantes

- `Achievement de meta registrado`: Quando meta é completada
- `Achievement de desafio registrado`: Quando desafio é completado
- `Cálculo de pontos acumulativos`: Resumo dos pontos calculados

### Métricas

- Número de achievements por usuário
- Pontos totais acumulados
- Frequência de conquistas
- Performance das consultas

## 🎉 Benefícios Finais

1. **Pontuação Correta**: Pontos acumulam corretamente ao longo do tempo
2. **Performance**: Sistema rápido e responsivo
3. **Manutenibilidade**: Código limpo e fácil de manter
4. **Escalabilidade**: Cresce com o usuário
5. **Histórico**: Registro completo de todas as conquistas

---

**Status**: ✅ Implementado e Testado  
**Próximos Passos**: Integrar com sistema de notificações e badges
