-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

-- Tabela para registrar conquistas de metas (histórico)
CREATE TABLE public.goal_achievements
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    goal_id uuid NOT NULL,
    user_id uuid NOT NULL,
    achieved_at timestamp
    with time zone NOT NULL DEFAULT now
    (),
    points_earned integer NOT NULL,
    progress_value integer NOT NULL, -- valor do progresso quando foi alcançado
    CONSTRAINT goal_achievements_pkey PRIMARY KEY
    (id),
    CONSTRAINT goal_achievements_goal_id_fkey FOREIGN KEY
    (goal_id) REFERENCES public.goals
    (id) ON
    DELETE CASCADE,
    CONSTRAINT goal_achievements_user_id_fkey FOREIGN KEY
    (user_id) REFERENCES auth.users
    (id) ON
    DELETE CASCADE
);

    -- Tabela para registrar conquistas de desafios (histórico)
    CREATE TABLE public.challenge_achievements
    (
        id uuid NOT NULL DEFAULT gen_random_uuid(),
        challenge_id uuid NOT NULL,
        user_id uuid NOT NULL,
        achieved_at timestamp
        with time zone NOT NULL DEFAULT now
        (),
    points_earned integer NOT NULL,
    final_percentage integer NOT NULL, -- porcentagem final quando foi alcançado
    CONSTRAINT challenge_achievements_pkey PRIMARY KEY
        (id),
    CONSTRAINT challenge_achievements_challenge_id_fkey FOREIGN KEY
        (challenge_id) REFERENCES public.challenges
        (id) ON
        DELETE CASCADE,
    CONSTRAINT challenge_achievements_user_id_fkey FOREIGN KEY
        (user_id) REFERENCES auth.users
        (id) ON
        DELETE CASCADE
);

        -- Índices para melhorar performance das consultas
        CREATE INDEX idx_goal_achievements_user_id ON public.goal_achievements(user_id);
        CREATE INDEX idx_goal_achievements_goal_id ON public.goal_achievements(goal_id);
        CREATE INDEX idx_goal_achievements_achieved_at ON public.goal_achievements(achieved_at);

        CREATE INDEX idx_challenge_achievements_user_id ON public.challenge_achievements(user_id);
        CREATE INDEX idx_challenge_achievements_challenge_id ON public.challenge_achievements(challenge_id);
        CREATE INDEX idx_challenge_achievements_achieved_at ON public.challenge_achievements(achieved_at);

        CREATE TABLE public.caderno_tags
        (
            caderno_id uuid,
            tag_id uuid,
            id uuid NOT NULL DEFAULT gen_random_uuid(),
            created_at timestamp
            with time zone DEFAULT now
            (),
  CONSTRAINT caderno_tags_pkey PRIMARY KEY
            (id),
  CONSTRAINT caderno_tags_caderno_id_fkey FOREIGN KEY
            (caderno_id) REFERENCES public.cadernos
            (id),
  CONSTRAINT caderno_tags_tag_id_fkey FOREIGN KEY
            (tag_id) REFERENCES public.tags
            (id)
);
            CREATE TABLE public.cadernos
            (
                nome character varying NOT NULL,
                descricao text,
                id uuid NOT NULL DEFAULT gen_random_uuid(),
                created_at timestamp
                with time zone DEFAULT now
                (),
  updated_at timestamp
                with time zone DEFAULT now
                (),
  user_id uuid,
  CONSTRAINT cadernos_pkey PRIMARY KEY
                (id),
  CONSTRAINT cadernos_user_id_fkey FOREIGN KEY
                (user_id) REFERENCES auth.users
                (id)
);
                CREATE TABLE public.challenges
                (
                    user_id uuid NOT NULL,
                    title character varying NOT NULL,
                    description text,
                    target_percentage integer NOT NULL CHECK (target_percentage >= 0 AND target_percentage <= 100),
                    caderno_id uuid NOT NULL,
                    deadline timestamp
                    with time zone NOT NULL,
  points integer NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid
                    (),
  completed boolean DEFAULT false,
  current_percentage integer DEFAULT 0,
  created_at timestamp
                    with time zone DEFAULT now
                    (),
  updated_at timestamp
                    with time zone DEFAULT now
                    (),
  CONSTRAINT challenges_pkey PRIMARY KEY
                    (id),
  CONSTRAINT challenges_user_id_fkey FOREIGN KEY
                    (user_id) REFERENCES auth.users
                    (id),
  CONSTRAINT challenges_caderno_id_fkey FOREIGN KEY
                    (caderno_id) REFERENCES public.cadernos
                    (id)
);
                    CREATE TABLE public.chat_messages
                    (
                        room_id uuid NOT NULL,
                        user_id uuid NOT NULL,
                        content text NOT NULL,
                        metadata jsonb,
                        id uuid NOT NULL DEFAULT gen_random_uuid(),
                        message_type
                        USER-DEFINED NOT NULL DEFAULT 'text'::message_type,
  created_at timestamp
                        with time zone DEFAULT now
                        (),
  updated_at timestamp
                        with time zone DEFAULT now
                        (),
  CONSTRAINT chat_messages_pkey PRIMARY KEY
                        (id),
  CONSTRAINT chat_messages_user_id_fkey FOREIGN KEY
                        (user_id) REFERENCES public.profiles
                        (id),
  CONSTRAINT chat_messages_room_id_fkey FOREIGN KEY
                        (room_id) REFERENCES public.chat_rooms
                        (id)
);
                        CREATE TABLE public.chat_participants
                        (
                            room_id uuid NOT NULL,
                            user_id uuid NOT NULL,
                            id uuid NOT NULL DEFAULT gen_random_uuid(),
                            joined_at timestamp
                            with time zone DEFAULT now
                            (),
  last_read_at timestamp
                            with time zone DEFAULT now
                            (),
  CONSTRAINT chat_participants_pkey PRIMARY KEY
                            (id),
  CONSTRAINT chat_participants_user_id_fkey FOREIGN KEY
                            (user_id) REFERENCES public.profiles
                            (id),
  CONSTRAINT chat_participants_room_id_fkey FOREIGN KEY
                            (room_id) REFERENCES public.chat_rooms
                            (id)
);
                            CREATE TABLE public.chat_rooms
                            (
                                id uuid NOT NULL DEFAULT gen_random_uuid(),
                                created_at timestamp
                                with time zone DEFAULT now
                                (),
  name character varying,
  type USER-DEFINED NOT NULL,
  group_id uuid,
  created_by uuid NOT NULL,
  updated_at timestamp
                                with time zone DEFAULT now
                                (),
  CONSTRAINT chat_rooms_pkey PRIMARY KEY
                                (id),
  CONSTRAINT chat_rooms_group_id_fkey FOREIGN KEY
                                (group_id) REFERENCES public.study_groups
                                (id),
  CONSTRAINT chat_rooms_created_by_fkey FOREIGN KEY
                                (created_by) REFERENCES public.profiles
                                (id)
);
                                CREATE TABLE public.friendships
                                (
                                    requester_id uuid NOT NULL,
                                    addressee_id uuid NOT NULL,
                                    id uuid NOT NULL DEFAULT gen_random_uuid(),
                                    status
                                    USER-DEFINED NOT NULL DEFAULT 'pending'::friendship_status,
  created_at timestamp
                                    with time zone DEFAULT now
                                    (),
  updated_at timestamp
                                    with time zone DEFAULT now
                                    (),
  CONSTRAINT friendships_pkey PRIMARY KEY
                                    (id),
  CONSTRAINT friendships_requester_id_fkey FOREIGN KEY
                                    (requester_id) REFERENCES public.profiles
                                    (id),
  CONSTRAINT friendships_addressee_id_fkey FOREIGN KEY
                                    (addressee_id) REFERENCES public.profiles
                                    (id)
);
                                    CREATE TABLE public.goal_tags
                                    (
                                        goal_id uuid,
                                        tag_id uuid,
                                        id uuid NOT NULL DEFAULT gen_random_uuid(),
                                        created_at timestamp
                                        with time zone DEFAULT now
                                        (),
  CONSTRAINT goal_tags_pkey PRIMARY KEY
                                        (id),
  CONSTRAINT goal_tags_goal_id_fkey FOREIGN KEY
                                        (goal_id) REFERENCES public.goals
                                        (id),
  CONSTRAINT goal_tags_tag_id_fkey FOREIGN KEY
                                        (tag_id) REFERENCES public.tags
                                        (id)
);
                                        CREATE TABLE public.goals
                                        (
                                            user_id uuid NOT NULL,
                                            title character varying NOT NULL,
                                            description text,
                                            type character varying NOT NULL CHECK (type::text = ANY (ARRAY['daily'::character varying, 'weekly'::character varying, 'monthly'::character varying]::text[])
                                        )
                                        ,
  target integer NOT NULL,
  unit character varying NOT NULL CHECK
                                        (unit::text = ANY
                                        (ARRAY['questions'::character varying, 'quizzes'::character varying, 'percentage'::character varying]::text[])),
  caderno_id uuid,
  deadline timestamp
                                        with time zone NOT NULL,
  points integer NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid
                                        (),
  current integer DEFAULT 0,
  completed boolean DEFAULT false,
  created_at timestamp
                                        with time zone DEFAULT now
                                        (),
  updated_at timestamp
                                        with time zone DEFAULT now
                                        (),
  CONSTRAINT goals_pkey PRIMARY KEY
                                        (id),
  CONSTRAINT goals_user_id_fkey FOREIGN KEY
                                        (user_id) REFERENCES auth.users
                                        (id),
  CONSTRAINT goals_caderno_id_fkey FOREIGN KEY
                                        (caderno_id) REFERENCES public.cadernos
                                        (id)
);
                                        CREATE TABLE public.group_activities
                                        (
                                            group_id uuid NOT NULL,
                                            user_id uuid NOT NULL,
                                            type
                                            USER-DEFINED NOT NULL,
  title character varying NOT NULL,
  description text,
  metadata jsonb,
  id uuid NOT NULL DEFAULT gen_random_uuid
                                            (),
  created_at timestamp
                                            with time zone DEFAULT now
                                            (),
  CONSTRAINT group_activities_pkey PRIMARY KEY
                                            (id),
  CONSTRAINT group_activities_group_id_fkey FOREIGN KEY
                                            (group_id) REFERENCES public.study_groups
                                            (id),
  CONSTRAINT group_activities_user_id_fkey FOREIGN KEY
                                            (user_id) REFERENCES public.profiles
                                            (id)
);
                                            CREATE TABLE public.group_invitations
                                            (
                                                group_id uuid NOT NULL,
                                                inviter_id uuid NOT NULL,
                                                invitee_id uuid NOT NULL,
                                                message text,
                                                id uuid NOT NULL DEFAULT gen_random_uuid(),
                                                status
                                                USER-DEFINED NOT NULL DEFAULT 'pending'::invitation_status,
  created_at timestamp
                                                with time zone DEFAULT now
                                                (),
  expires_at timestamp
                                                with time zone DEFAULT
                                                (now
                                                () + '7 days'::interval),
  CONSTRAINT group_invitations_pkey PRIMARY KEY
                                                (id),
  CONSTRAINT group_invitations_group_id_fkey FOREIGN KEY
                                                (group_id) REFERENCES public.study_groups
                                                (id),
  CONSTRAINT group_invitations_inviter_id_fkey FOREIGN KEY
                                                (inviter_id) REFERENCES public.profiles
                                                (id),
  CONSTRAINT group_invitations_invitee_id_fkey FOREIGN KEY
                                                (invitee_id) REFERENCES public.profiles
                                                (id)
);
                                                CREATE TABLE public.group_members
                                                (
                                                    group_id uuid NOT NULL,
                                                    user_id uuid NOT NULL,
                                                    id uuid NOT NULL DEFAULT gen_random_uuid(),
                                                    role
                                                    USER-DEFINED NOT NULL DEFAULT 'member'::group_role,
  joined_at timestamp
                                                    with time zone DEFAULT now
                                                    (),
  CONSTRAINT group_members_pkey PRIMARY KEY
                                                    (id),
  CONSTRAINT group_members_group_id_fkey FOREIGN KEY
                                                    (group_id) REFERENCES public.study_groups
                                                    (id),
  CONSTRAINT group_members_user_id_fkey FOREIGN KEY
                                                    (user_id) REFERENCES public.profiles
                                                    (id)
);
                                                    CREATE TABLE public.profiles
                                                    (
                                                        id uuid NOT NULL,
                                                        name text NOT NULL,
                                                        role
                                                        USER-DEFINED NOT NULL DEFAULT 'user'::user_role,
  created_at timestamp
                                                        with time zone NOT NULL DEFAULT now
                                                        (),
  updated_at timestamp
                                                        with time zone NOT NULL DEFAULT now
                                                        (),
  CONSTRAINT profiles_pkey PRIMARY KEY
                                                        (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY
                                                        (id) REFERENCES auth.users
                                                        (id)
);
                                                        CREATE TABLE public.questions
                                                        (
                                                            quiz_id uuid NOT NULL,
                                                            question_number integer NOT NULL,
                                                            text text,
                                                            correct_answer text,
                                                            id uuid NOT NULL DEFAULT gen_random_uuid(),
                                                            created_at timestamp
                                                            with time zone NOT NULL DEFAULT now
                                                            (),
  CONSTRAINT questions_pkey PRIMARY KEY
                                                            (id),
  CONSTRAINT questions_quiz_id_fkey FOREIGN KEY
                                                            (quiz_id) REFERENCES public.quizzes
                                                            (id)
);
                                                            CREATE TABLE public.quiz_results
                                                            (
                                                                user_id uuid NOT NULL,
                                                                quiz_id uuid NOT NULL,
                                                                total_questions integer NOT NULL,
                                                                percentage numeric NOT NULL,
                                                                id uuid NOT NULL DEFAULT gen_random_uuid(),
                                                                correct_answers integer NOT NULL DEFAULT 0,
                                                                wrong_answers integer NOT NULL DEFAULT 0,
                                                                completed_at timestamp
                                                                with time zone NOT NULL DEFAULT now
                                                                (),
  CONSTRAINT quiz_results_pkey PRIMARY KEY
                                                                (id),
  CONSTRAINT quiz_results_user_id_fkey FOREIGN KEY
                                                                (user_id) REFERENCES auth.users
                                                                (id),
  CONSTRAINT quiz_results_quiz_id_fkey FOREIGN KEY
                                                                (quiz_id) REFERENCES public.quizzes
                                                                (id)
);
                                                                CREATE TABLE public.quiz_tags
                                                                (
                                                                    quiz_id uuid,
                                                                    tag_id uuid,
                                                                    id uuid NOT NULL DEFAULT gen_random_uuid(),
                                                                    created_at timestamp
                                                                    with time zone DEFAULT now
                                                                    (),
  CONSTRAINT quiz_tags_pkey PRIMARY KEY
                                                                    (id),
  CONSTRAINT quiz_tags_quiz_id_fkey FOREIGN KEY
                                                                    (quiz_id) REFERENCES public.quizzes
                                                                    (id),
  CONSTRAINT quiz_tags_tag_id_fkey FOREIGN KEY
                                                                    (tag_id) REFERENCES public.tags
                                                                    (id)
);
                                                                    CREATE TABLE public.quizzes
                                                                    (
                                                                        title text NOT NULL,
                                                                        description text,
                                                                        creator_id uuid NOT NULL,
                                                                        pdf_name text,
                                                                        id uuid NOT NULL DEFAULT gen_random_uuid(),
                                                                        is_public boolean NOT NULL DEFAULT false,
                                                                        created_at timestamp
                                                                        with time zone NOT NULL DEFAULT now
                                                                        (),
  updated_at timestamp
                                                                        with time zone NOT NULL DEFAULT now
                                                                        (),
  caderno_id uuid,
  CONSTRAINT quizzes_pkey PRIMARY KEY
                                                                        (id),
  CONSTRAINT quizzes_caderno_id_fkey FOREIGN KEY
                                                                        (caderno_id) REFERENCES public.cadernos
                                                                        (id),
  CONSTRAINT quizzes_creator_id_fkey FOREIGN KEY
                                                                        (creator_id) REFERENCES auth.users
                                                                        (id)
);
                                                                        CREATE TABLE public.shared_resources
                                                                        (
                                                                            group_id uuid NOT NULL,
                                                                            user_id uuid NOT NULL,
                                                                            type
                                                                            USER-DEFINED NOT NULL,
  title character varying NOT NULL,
  description text,
  url text,
  file_path text,
  id uuid NOT NULL DEFAULT gen_random_uuid
                                                                            (),
  created_at timestamp
                                                                            with time zone DEFAULT now
                                                                            (),
  CONSTRAINT shared_resources_pkey PRIMARY KEY
                                                                            (id),
  CONSTRAINT shared_resources_user_id_fkey FOREIGN KEY
                                                                            (user_id) REFERENCES public.profiles
                                                                            (id),
  CONSTRAINT shared_resources_group_id_fkey FOREIGN KEY
                                                                            (group_id) REFERENCES public.study_groups
                                                                            (id)
);
                                                                            CREATE TABLE public.study_groups
                                                                            (
                                                                                tags ARRAY DEFAULT '{}'
                                                                                ::text[],
  owner_id uuid NOT NULL,
  visibility character varying DEFAULT false CHECK
                                                                                (visibility::text = ANY
                                                                                (ARRAY['public'::character varying, 'private'::character varying]::text[])),
  name character varying NOT NULL,
  description text,
  id uuid NOT NULL DEFAULT gen_random_uuid
                                                                                (),
  max_members integer DEFAULT 50,
  created_at timestamp
                                                                                with time zone DEFAULT now
                                                                                (),
  updated_at timestamp
                                                                                with time zone DEFAULT now
                                                                                (),
  CONSTRAINT study_groups_pkey PRIMARY KEY
                                                                                (id),
  CONSTRAINT study_groups_owner_id_fkey FOREIGN KEY
                                                                                (owner_id) REFERENCES public.profiles
                                                                                (id)
);
                                                                                CREATE TABLE public.tags
                                                                                (
                                                                                    name character varying NOT NULL,
                                                                                    description text,
                                                                                    user_id uuid,
                                                                                    id uuid NOT NULL DEFAULT gen_random_uuid(),
                                                                                    color character varying NOT NULL DEFAULT '#3b82f6'
                                                                                    ::character varying,
  created_at timestamp
                                                                                    with time zone DEFAULT now
                                                                                    (),
  updated_at timestamp
                                                                                    with time zone DEFAULT now
                                                                                    (),
  CONSTRAINT tags_pkey PRIMARY KEY
                                                                                    (id),
  CONSTRAINT tags_user_id_fkey FOREIGN KEY
                                                                                    (user_id) REFERENCES auth.users
                                                                                    (id)
);
                                                                                    CREATE TABLE public.user_answers
                                                                                    (
                                                                                        user_id uuid NOT NULL,
                                                                                        question_id uuid NOT NULL,
                                                                                        user_answer text,
                                                                                        is_correct boolean NOT NULL,
                                                                                        legend text,
                                                                                        id uuid NOT NULL DEFAULT gen_random_uuid(),
                                                                                        answered_at timestamp
                                                                                        with time zone NOT NULL DEFAULT now
                                                                                        (),
  CONSTRAINT user_answers_pkey PRIMARY KEY
                                                                                        (id),
  CONSTRAINT user_answers_user_id_fkey FOREIGN KEY
                                                                                        (user_id) REFERENCES auth.users
                                                                                        (id),
  CONSTRAINT user_answers_question_id_fkey FOREIGN KEY
                                                                                        (question_id) REFERENCES public.questions
                                                                                        (id)
);