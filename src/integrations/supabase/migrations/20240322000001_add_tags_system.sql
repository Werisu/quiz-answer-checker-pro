-- Adicionar sistema de tags personalizadas
-- Criar tabela de tags
CREATE TABLE
IF NOT EXISTS tags
(
  id UUID DEFAULT gen_random_uuid
() PRIMARY KEY,
  name VARCHAR
(50) NOT NULL,
  color VARCHAR
(7) NOT NULL DEFAULT '#3b82f6', -- Cor padrão azul
  description TEXT,
  user_id UUID REFERENCES auth.users
(id) ON
DELETE CASCADE,
  created_at TIMESTAMP
WITH TIME ZONE DEFAULT NOW
(),
  updated_at TIMESTAMP
WITH TIME ZONE DEFAULT NOW
(),
  UNIQUE
(user_id, name)
);

-- Criar tabela de relacionamento entre tags e cadernos
CREATE TABLE
IF NOT EXISTS caderno_tags
(
  id UUID DEFAULT gen_random_uuid
() PRIMARY KEY,
  caderno_id UUID REFERENCES cadernos
(id) ON
DELETE CASCADE,
  tag_id UUID
REFERENCES tags
(id) ON
DELETE CASCADE,
  created_at TIMESTAMP
WITH TIME ZONE DEFAULT NOW
(),
  UNIQUE
(caderno_id, tag_id)
);

-- Criar tabela de relacionamento entre tags e quizzes
CREATE TABLE
IF NOT EXISTS quiz_tags
(
  id UUID DEFAULT gen_random_uuid
() PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes
(id) ON
DELETE CASCADE,
  tag_id UUID
REFERENCES tags
(id) ON
DELETE CASCADE,
  created_at TIMESTAMP
WITH TIME ZONE DEFAULT NOW
(),
  UNIQUE
(quiz_id, tag_id)
);

-- Criar tabela de relacionamento entre tags e metas
CREATE TABLE
IF NOT EXISTS goal_tags
(
  id UUID DEFAULT gen_random_uuid
() PRIMARY KEY,
  goal_id UUID REFERENCES goals
(id) ON
DELETE CASCADE,
  tag_id UUID
REFERENCES tags
(id) ON
DELETE CASCADE,
  created_at TIMESTAMP
WITH TIME ZONE DEFAULT NOW
(),
  UNIQUE
(goal_id, tag_id)
);

-- Criar índices para melhor performance
CREATE INDEX
IF NOT EXISTS idx_tags_user_id ON tags
(user_id);
CREATE INDEX
IF NOT EXISTS idx_caderno_tags_caderno_id ON caderno_tags
(caderno_id);
CREATE INDEX
IF NOT EXISTS idx_caderno_tags_tag_id ON caderno_tags
(tag_id);
CREATE INDEX
IF NOT EXISTS idx_quiz_tags_quiz_id ON quiz_tags
(quiz_id);
CREATE INDEX
IF NOT EXISTS idx_quiz_tags_tag_id ON quiz_tags
(tag_id);
CREATE INDEX
IF NOT EXISTS idx_goal_tags_goal_id ON goal_tags
(goal_id);
CREATE INDEX
IF NOT EXISTS idx_goal_tags_tag_id ON goal_tags
(tag_id);

-- Habilitar RLS (Row Level Security)
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE caderno_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_tags ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para tags
CREATE POLICY "Users can view their own tags" ON tags
  FOR
SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tags" ON tags
  FOR
INSERT WITH CHECK (auth.uid() =
user_id);

CREATE POLICY "Users can update their own tags" ON tags
  FOR
UPDATE USING (auth.uid()
= user_id);

CREATE POLICY "Users can delete their own tags" ON tags
  FOR
DELETE USING (auth.uid
() = user_id);

-- Políticas RLS para caderno_tags
CREATE POLICY "Users can view caderno tags for their cadernos" ON caderno_tags
  FOR
SELECT USING (
    EXISTS (
      SELECT 1
    FROM cadernos
    WHERE cadernos.id = caderno_tags.caderno_id
        AND cadernos.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage caderno tags for their cadernos" ON caderno_tags
  FOR ALL USING
(
    EXISTS
(
      SELECT 1
FROM cadernos
WHERE cadernos.id = caderno_tags.caderno_id
    AND cadernos.user_id = auth.uid()
    )
);

-- Políticas RLS para quiz_tags
CREATE POLICY "Users can view quiz tags for their quizzes" ON quiz_tags
  FOR
SELECT USING (
    EXISTS (
      SELECT 1
    FROM quizzes
    WHERE quizzes.id = quiz_tags.quiz_id
        AND quizzes.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage quiz tags for their quizzes" ON quiz_tags
  FOR ALL USING
(
    EXISTS
(
      SELECT 1
FROM quizzes
WHERE quizzes.id = quiz_tags.quiz_id
    AND quizzes.creator_id = auth.uid()
    )
);

-- Políticas RLS para goal_tags
CREATE POLICY "Users can view goal tags for their goals" ON goal_tags
  FOR
SELECT USING (
    EXISTS (
      SELECT 1
    FROM goals
    WHERE goals.id = goal_tags.goal_id
        AND goals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage goal tags for their goals" ON goal_tags
  FOR ALL USING
(
    EXISTS
(
      SELECT 1
FROM goals
WHERE goals.id = goal_tags.goal_id
    AND goals.user_id = auth.uid()
    )
);

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column
()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW
();
RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_tags_updated_at 
  BEFORE
UPDATE ON tags 
  FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column
();
