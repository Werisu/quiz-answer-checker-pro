-- Script para criar as tabelas de achievements no Supabase
-- Execute este script no SQL Editor do Supabase

-- Tabela para registrar conquistas de metas (histórico)
CREATE TABLE IF NOT EXISTS public.goal_achievements (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    goal_id uuid NOT NULL,
    user_id uuid NOT NULL,
    achieved_at timestamp with time zone NOT NULL DEFAULT now(),
    points_earned integer NOT NULL,
    progress_value integer NOT NULL, -- valor do progresso quando foi alcançado
    CONSTRAINT goal_achievements_pkey PRIMARY KEY (id),
    CONSTRAINT goal_achievements_goal_id_fkey FOREIGN KEY (goal_id) REFERENCES public.goals(id) ON DELETE CASCADE,
    CONSTRAINT goal_achievements_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tabela para registrar conquistas de desafios (histórico)
CREATE TABLE IF NOT EXISTS public.challenge_achievements (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    challenge_id uuid NOT NULL,
    user_id uuid NOT NULL,
    achieved_at timestamp with time zone NOT NULL DEFAULT now(),
    points_earned integer NOT NULL,
    final_percentage integer NOT NULL, -- porcentagem final quando foi alcançado
    CONSTRAINT challenge_achievements_pkey PRIMARY KEY (id),
    CONSTRAINT challenge_achievements_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) ON DELETE CASCADE,
    CONSTRAINT challenge_achievements_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Índices para melhorar performance das consultas
CREATE INDEX IF NOT EXISTS idx_goal_achievements_user_id ON public.goal_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_goal_achievements_goal_id ON public.goal_achievements(goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_achievements_achieved_at ON public.goal_achievements(achieved_at);

CREATE INDEX IF NOT EXISTS idx_challenge_achievements_user_id ON public.challenge_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_achievements_challenge_id ON public.challenge_achievements(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_achievements_achieved_at ON public.challenge_achievements(achieved_at);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.goal_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_achievements ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para goal_achievements
CREATE POLICY "Users can view their own goal achievements" ON public.goal_achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goal achievements" ON public.goal_achievements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goal achievements" ON public.goal_achievements
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goal achievements" ON public.goal_achievements
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas de segurança para challenge_achievements
CREATE POLICY "Users can view their own challenge achievements" ON public.challenge_achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own challenge achievements" ON public.challenge_achievements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own challenge achievements" ON public.challenge_achievements
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own challenge achievements" ON public.challenge_achievements
    FOR DELETE USING (auth.uid() = user_id);

-- Comentários para documentação
COMMENT ON TABLE public.goal_achievements IS 'Histórico de conquistas de metas dos usuários';
COMMENT ON TABLE public.challenge_achievements IS 'Histórico de conquistas de desafios dos usuários';
COMMENT ON COLUMN public.goal_achievements.progress_value IS 'Valor do progresso quando a meta foi alcançada';
COMMENT ON COLUMN public.challenge_achievements.final_percentage IS 'Porcentagem final quando o desafio foi alcançado';
