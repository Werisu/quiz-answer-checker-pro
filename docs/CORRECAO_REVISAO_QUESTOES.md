# 🔧 Correção: Erro 400 ao Buscar Questões para Revisão

## 🐛 Problema Identificado

Ao tentar buscar questões para revisão, ocorre um erro 400 do Supabase. Isso acontece porque:

1. **Políticas RLS (Row Level Security)** estão bloqueando o acesso às tabelas relacionadas
2. Quando fazemos queries com relacionamentos (`quiz:quizzes`), o Supabase verifica as políticas RLS de ambas as tabelas
3. A política atual de `quizzes` pode não permitir acesso quando o usuário está acessando através de `quiz_results`

## ✅ Solução Implementada no Código

Modificamos a função `fetchQuestionsForReview` para:

- Buscar `quiz_results` sem relacionamento
- Buscar `quizzes` separadamente usando `.in()`
- Criar um mapa para associar quizzes aos resultados

Isso evita problemas de RLS, mas ainda pode falhar se as políticas não estiverem configuradas corretamente.

## 🗄️ Correção Necessária no Banco de Dados

⚠️ **IMPORTANTE**: Se você executou o script anterior e está tendo erro de recursão infinita, execute primeiro o script de correção abaixo.

### Passo 1: Remover Recursão Infinita

Execute este script PRIMEIRO para remover a política problemática:

```sql
-- Remover política que causa recursão infinita
DROP POLICY IF EXISTS "Users can access quizzes they created or have results for" ON quizzes;
DROP POLICY IF EXISTS "Users can access questions they have answered" ON questions;
```

### Passo 2: Criar Políticas Corretas (Sem Recursão)

```sql
-- ============================================
-- CORREÇÃO DE POLÍTICAS RLS PARA REVISÃO DE QUESTÕES
-- (SEM CAUSAR RECURSÃO INFINITA)
-- ============================================

-- 1. Garantir que RLS está habilitado nas tabelas
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_answers ENABLE ROW LEVEL SECURITY;

-- 2. Política SIMPLES para quizzes (sem verificar quiz_results para evitar recursão)
CREATE POLICY "Users can access quizzes they created" ON quizzes
FOR SELECT USING (creator_id = auth.uid());

-- 3. Política para questions: permitir quando o quiz pertence ao usuário
CREATE POLICY "Users can access questions from their quizzes" ON questions
FOR SELECT USING (
  quiz_id IN (
    SELECT id
    FROM quizzes
    WHERE creator_id = auth.uid()
  )
);

-- 4. Política adicional para questions: permitir quando o usuário tem respostas
-- (sem verificar quiz_results para evitar recursão)
CREATE POLICY "Users can access questions they answered" ON questions
FOR SELECT USING (
  id IN (
    SELECT question_id
    FROM user_answers
    WHERE user_id = auth.uid()
  )
);

-- 5. Garantir políticas para user_answers
CREATE POLICY IF NOT EXISTS "Users can access their own answers" ON user_answers
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can insert their own answers" ON user_answers
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can update their own answers" ON user_answers
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can delete their own answers" ON user_answers
FOR DELETE USING (user_id = auth.uid());
```

## 📋 Passo a Passo

1. **Acesse o Supabase Dashboard**

   - Vá para: `https://supabase.com/dashboard/project/[SEU_PROJETO]`
   - Clique em **SQL Editor**

2. **Execute o Script**

   - Cole o script SQL acima
   - Clique em **Run** ou pressione `Ctrl+Enter`

3. **Verifique as Políticas**

   - Vá para **Authentication > Policies**
   - Verifique se as políticas foram criadas corretamente

4. **Teste a Funcionalidade**
   - Volte para a aplicação
   - Tente acessar a funcionalidade de revisão novamente

## 🔍 Verificação

Após executar o script, você deve ver:

- ✅ Política `Users can access quizzes they created or have results for` na tabela `quizzes`
- ✅ Política `Users can access questions they have answered` na tabela `questions`
- ✅ Políticas para `user_answers` (SELECT, INSERT, UPDATE, DELETE)

## ⚠️ Nota Importante

### Por que a recursão acontece?

A política que verifica `quiz_results` dentro da política de `quizzes` causa recursão porque:

1. Query em `quiz_results` com relacionamento `quiz:quizzes` → verifica política de `quizzes`
2. Política de `quizzes` verifica `quiz_results` → verifica política de `quizzes` novamente
3. Loop infinito! 🔄

### Solução

O código já foi ajustado para fazer queries **sem relacionamento**, buscando os dados separadamente. As políticas acima são mais simples e não causam recursão porque:

- `quizzes` só verifica `creator_id` (sem consultar outras tabelas)
- `questions` verifica `quizzes` diretamente ou `user_answers` (sem consultar `quiz_results`)

### Se você já tem políticas existentes

1. Verificar políticas existentes em **Authentication > Policies**
2. Remover políticas conflitantes antes de criar as novas
3. Ou ajustar as condições das políticas existentes

## 📝 Arquivo SQL Separado

O script SQL completo também está disponível em:
`src/integrations/supabase/migrations/fix_quizzes_rls_for_review.sql`
