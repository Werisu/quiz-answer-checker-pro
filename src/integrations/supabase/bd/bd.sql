-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.caderno_tags
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    caderno_id uuid,
    tag_id uuid,
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
        id uuid NOT NULL DEFAULT gen_random_uuid(),
        nome character varying NOT NULL,
        descricao text,
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
            id uuid NOT NULL DEFAULT gen_random_uuid(),
            user_id uuid NOT NULL,
            title character varying NOT NULL,
            description text,
            target_percentage integer NOT NULL CHECK (target_percentage >= 0 AND target_percentage <= 100),
            caderno_id uuid NOT NULL,
            deadline timestamp
            with time zone NOT NULL,
  completed boolean DEFAULT false,
  current_percentage integer DEFAULT 0,
  points integer NOT NULL,
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
                id uuid NOT NULL DEFAULT gen_random_uuid(),
                room_id uuid NOT NULL,
                user_id uuid NOT NULL,
                content text NOT NULL,
                message_type
                USER-DEFINED NOT NULL DEFAULT 'text'::message_type,
  metadata jsonb,
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
                    id uuid NOT NULL DEFAULT gen_random_uuid(),
                    room_id uuid NOT NULL,
                    user_id uuid NOT NULL,
                    joined_at timestamp
                    with time zone DEFAULT now
                    (),
  last_read_at timestamp
                    with time zone DEFAULT now
                    (),
  CONSTRAINT chat_participants_pkey PRIMARY KEY
                    (id),
  CONSTRAINT chat_participants_room_id_fkey FOREIGN KEY
                    (room_id) REFERENCES public.chat_rooms
                    (id),
  CONSTRAINT chat_participants_user_id_fkey FOREIGN KEY
                    (user_id) REFERENCES public.profiles
                    (id)
);
                    CREATE TABLE public.chat_rooms
                    (
                        id uuid NOT NULL DEFAULT gen_random_uuid(),
                        name character varying,
                        type
                        USER-DEFINED NOT NULL,
  group_id uuid,
  created_by uuid NOT NULL,
  created_at timestamp
                        with time zone DEFAULT now
                        (),
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
                            id uuid NOT NULL DEFAULT gen_random_uuid(),
                            requester_id uuid NOT NULL,
                            addressee_id uuid NOT NULL,
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
                                id uuid NOT NULL DEFAULT gen_random_uuid(),
                                goal_id uuid,
                                tag_id uuid,
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
                                    id uuid NOT NULL DEFAULT gen_random_uuid(),
                                    user_id uuid NOT NULL,
                                    title character varying NOT NULL,
                                    description text,
                                    type character varying NOT NULL CHECK (type::text = ANY (ARRAY['daily'::character varying, 'weekly'::character varying, 'monthly'::character varying]::text[])
                                )
                                ,
  target integer NOT NULL,
  current integer DEFAULT 0,
  unit character varying NOT NULL CHECK
                                (unit::text = ANY
                                (ARRAY['questions'::character varying, 'quizzes'::character varying, 'percentage'::character varying]::text[])),
  caderno_id uuid,
  deadline timestamp
                                with time zone NOT NULL,
  completed boolean DEFAULT false,
  points integer NOT NULL,
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
                                    id uuid NOT NULL DEFAULT gen_random_uuid(),
                                    group_id uuid NOT NULL,
                                    user_id uuid NOT NULL,
                                    type
                                    USER-DEFINED NOT NULL,
  title character varying NOT NULL,
  description text,
  metadata jsonb,
  created_at timestamp
                                    with time zone DEFAULT now
                                    (),
  CONSTRAINT group_activities_pkey PRIMARY KEY
                                    (id),
  CONSTRAINT group_activities_user_id_fkey FOREIGN KEY
                                    (user_id) REFERENCES public.profiles
                                    (id),
  CONSTRAINT group_activities_group_id_fkey FOREIGN KEY
                                    (group_id) REFERENCES public.study_groups
                                    (id)
);
                                    CREATE TABLE public.group_invitations
                                    (
                                        id uuid NOT NULL DEFAULT gen_random_uuid(),
                                        group_id uuid NOT NULL,
                                        inviter_id uuid NOT NULL,
                                        invitee_id uuid NOT NULL,
                                        status
                                        USER-DEFINED NOT NULL DEFAULT 'pending'::invitation_status,
  message text,
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
                                            id uuid NOT NULL DEFAULT gen_random_uuid(),
                                            group_id uuid NOT NULL,
                                            user_id uuid NOT NULL,
                                            role
                                            USER-DEFINED NOT NULL DEFAULT 'member'::group_role,
  joined_at timestamp
                                            with time zone DEFAULT now
                                            (),
  CONSTRAINT group_members_pkey PRIMARY KEY
                                            (id),
  CONSTRAINT group_members_user_id_fkey FOREIGN KEY
                                            (user_id) REFERENCES public.profiles
                                            (id),
  CONSTRAINT group_members_group_id_fkey FOREIGN KEY
                                            (group_id) REFERENCES public.study_groups
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
                                                    id uuid NOT NULL DEFAULT gen_random_uuid(),
                                                    quiz_id uuid NOT NULL,
                                                    question_number integer NOT NULL,
                                                    text text,
                                                    correct_answer text,
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
                                                        id uuid NOT NULL DEFAULT gen_random_uuid(),
                                                        user_id uuid NOT NULL,
                                                        quiz_id uuid NOT NULL,
                                                        correct_answers integer NOT NULL DEFAULT 0,
                                                        wrong_answers integer NOT NULL DEFAULT 0,
                                                        total_questions integer NOT NULL,
                                                        percentage numeric NOT NULL,
                                                        completed_at timestamp
                                                        with time zone NOT NULL DEFAULT now
                                                        (),
  CONSTRAINT quiz_results_pkey PRIMARY KEY
                                                        (id),
  CONSTRAINT quiz_results_quiz_id_fkey FOREIGN KEY
                                                        (quiz_id) REFERENCES public.quizzes
                                                        (id),
  CONSTRAINT quiz_results_user_id_fkey FOREIGN KEY
                                                        (user_id) REFERENCES auth.users
                                                        (id)
);
                                                        CREATE TABLE public.quiz_tags
                                                        (
                                                            id uuid NOT NULL DEFAULT gen_random_uuid(),
                                                            quiz_id uuid,
                                                            tag_id uuid,
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
                                                                id uuid NOT NULL DEFAULT gen_random_uuid(),
                                                                title text NOT NULL,
                                                                description text,
                                                                creator_id uuid NOT NULL,
                                                                is_public boolean NOT NULL DEFAULT false,
                                                                created_at timestamp
                                                                with time zone NOT NULL DEFAULT now
                                                                (),
  updated_at timestamp
                                                                with time zone NOT NULL DEFAULT now
                                                                (),
  pdf_name text,
  caderno_id uuid,
  CONSTRAINT quizzes_pkey PRIMARY KEY
                                                                (id),
  CONSTRAINT quizzes_creator_id_fkey FOREIGN KEY
                                                                (creator_id) REFERENCES auth.users
                                                                (id),
  CONSTRAINT quizzes_caderno_id_fkey FOREIGN KEY
                                                                (caderno_id) REFERENCES public.cadernos
                                                                (id)
);
                                                                CREATE TABLE public.shared_resources
                                                                (
                                                                    id uuid NOT NULL DEFAULT gen_random_uuid(),
                                                                    group_id uuid NOT NULL,
                                                                    user_id uuid NOT NULL,
                                                                    type
                                                                    USER-DEFINED NOT NULL,
  title character varying NOT NULL,
  description text,
  url text,
  file_path text,
  created_at timestamp
                                                                    with time zone DEFAULT now
                                                                    (),
  CONSTRAINT shared_resources_pkey PRIMARY KEY
                                                                    (id),
  CONSTRAINT shared_resources_group_id_fkey FOREIGN KEY
                                                                    (group_id) REFERENCES public.study_groups
                                                                    (id),
  CONSTRAINT shared_resources_user_id_fkey FOREIGN KEY
                                                                    (user_id) REFERENCES public.profiles
                                                                    (id)
);
                                                                    CREATE TABLE public.study_groups
                                                                    (
                                                                        id uuid NOT NULL DEFAULT gen_random_uuid(),
                                                                        name character varying NOT NULL,
                                                                        description text,
                                                                        owner_id uuid NOT NULL,
                                                                        visibility character varying DEFAULT false CHECK (visibility::text = ANY (ARRAY['public'::character varying, 'private'::character varying]::text[])
                                                                    )
                                                                    ,
  max_members integer DEFAULT 50,
  created_at timestamp
                                                                    with time zone DEFAULT now
                                                                    (),
  updated_at timestamp
                                                                    with time zone DEFAULT now
                                                                    (),
  tags ARRAY DEFAULT '{}'::text[],
  CONSTRAINT study_groups_pkey PRIMARY KEY
                                                                    (id),
  CONSTRAINT study_groups_owner_id_fkey FOREIGN KEY
                                                                    (owner_id) REFERENCES public.profiles
                                                                    (id)
);
                                                                    CREATE TABLE public.tags
                                                                    (
                                                                        id uuid NOT NULL DEFAULT gen_random_uuid(),
                                                                        name character varying NOT NULL,
                                                                        color character varying NOT NULL DEFAULT '#3b82f6'
                                                                        ::character varying,
  description text,
  user_id uuid,
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
                                                                            id uuid NOT NULL DEFAULT gen_random_uuid(),
                                                                            user_id uuid NOT NULL,
                                                                            question_id uuid NOT NULL,
                                                                            user_answer text,
                                                                            is_correct boolean NOT NULL,
                                                                            answered_at timestamp
                                                                            with time zone NOT NULL DEFAULT now
                                                                            (),
  legend text,
  CONSTRAINT user_answers_pkey PRIMARY KEY
                                                                            (id),
  CONSTRAINT user_answers_question_id_fkey FOREIGN KEY
                                                                            (question_id) REFERENCES public.questions
                                                                            (id),
  CONSTRAINT user_answers_user_id_fkey FOREIGN KEY
                                                                            (user_id) REFERENCES auth.users
                                                                            (id)
);