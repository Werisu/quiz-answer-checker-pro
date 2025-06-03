-- Habilita RLS na tabela quiz_results
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Cria política para permitir que usuários vejam seus próprios resultados
CREATE POLICY "Usuários podem ver seus próprios resultados"
ON quiz_results
FOR
SELECT
    USING (auth.uid() = user_id);

-- Cria política para permitir que usuários deletem seus próprios resultados
CREATE POLICY "Usuários podem deletar seus próprios resultados"
ON quiz_results
FOR
DELETE
USING (auth.uid
() = user_id);

-- Cria política para permitir que usuários insiram seus próprios resultados
CREATE POLICY "Usuários podem inserir seus próprios resultados"
ON quiz_results
FOR
INSERT
WITH CHECK (auth.uid() =
user_id);

-- Cria política para permitir que usuários atualizem seus próprios resultados
CREATE POLICY "Usuários podem atualizar seus próprios resultados"
ON quiz_results
FOR
UPDATE
USING (auth.uid()
= user_id); 