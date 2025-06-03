-- Adiciona uma restrição única para impedir múltiplos resultados do mesmo quiz para o mesmo usuário
ALTER TABLE quiz_results
ADD CONSTRAINT unique_user_quiz UNIQUE (user_id, quiz_id); 