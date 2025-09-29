-- Adicionar campo question_config à tabela quizzes
-- Este campo armazenará as configurações de sequência das questões

ALTER TABLE public.quizzes 
ADD COLUMN question_config jsonb;

-- Adicionar comentário para documentar o campo
COMMENT ON COLUMN public.quizzes.question_config IS 'Configurações de sequência das questões: {sequence_type: "normal"|"odd"|"even", start_number: number}';

-- Exemplo de uso:
-- question_config: {"sequence_type": "odd", "start_number": 1} para questões ímpares começando em 1
-- question_config: {"sequence_type": "even", "start_number": 2} para questões pares começando em 2  
-- question_config: {"sequence_type": "normal", "start_number": 10} para sequência normal começando em 10
