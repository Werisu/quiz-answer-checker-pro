-- Adiciona a coluna legend na tabela user_answers
ALTER TABLE user_answers
ADD COLUMN legend text;

-- Atualiza os tipos no TypeScript
COMMENT ON COLUMN user_answers.legend IS 'Tipo de legenda da questão (circle, star, question, exclamation)'; 