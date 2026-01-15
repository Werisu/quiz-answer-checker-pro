export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          role: "user" | "admin";
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id: string;
          name: string;
          role?: "user" | "admin";
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          role?: "user" | "admin";
          updated_at?: string;
        };
        Relationships: [];
      };

      // Tabela de metas
      goals: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          type: "daily" | "weekly" | "monthly";
          target: number;
          unit: "questions" | "quizzes" | "percentage";
          caderno_id: string | null;
          deadline: string;
          points: number;
          current: number;
          completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          type: "daily" | "weekly" | "monthly";
          target: number;
          unit: "questions" | "quizzes" | "percentage";
          caderno_id?: string | null;
          deadline: string;
          points: number;
          current?: number;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          type?: "daily" | "weekly" | "monthly";
          target?: number;
          unit?: "questions" | "quizzes" | "percentage";
          caderno_id?: string | null;
          deadline?: string;
          points?: number;
          current?: number;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "goals_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "goals_caderno_id_fkey";
            columns: ["caderno_id"];
            isOneToOne: false;
            referencedRelation: "cadernos";
            referencedColumns: ["id"];
          }
        ];
      };

      // Tabela de desafios
      challenges: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          target_percentage: number;
          caderno_id: string;
          deadline: string;
          points: number;
          completed: boolean;
          current_percentage: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          target_percentage: number;
          caderno_id: string;
          deadline: string;
          points: number;
          completed?: boolean;
          current_percentage?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          target_percentage?: number;
          caderno_id?: string;
          deadline?: string;
          points?: number;
          completed?: boolean;
          current_percentage?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "challenges_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "challenges_caderno_id_fkey";
            columns: ["caderno_id"];
            isOneToOne: false;
            referencedRelation: "cadernos";
            referencedColumns: ["id"];
          }
        ];
      };

      // Tabela de cadernos
      cadernos: {
        Row: {
          id: string;
          nome: string;
          descricao: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          descricao?: string | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          descricao?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cadernos_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      // Tabela para registrar conquistas de metas (histórico)
      goal_achievements: {
        Row: {
          id: string;
          goal_id: string;
          user_id: string;
          achieved_at: string;
          points_earned: number;
          progress_value: number;
        };
        Insert: {
          id?: string;
          goal_id: string;
          user_id: string;
          achieved_at?: string;
          points_earned: number;
          progress_value: number;
        };
        Update: {
          id?: string;
          goal_id?: string;
          user_id?: string;
          achieved_at?: string;
          points_earned?: number;
          progress_value?: number;
        };
        Relationships: [
          {
            foreignKeyName: "goal_achievements_goal_id_fkey";
            columns: ["goal_id"];
            isOneToOne: false;
            referencedRelation: "goals";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "goal_achievements_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      // Tabela para registrar conquistas de desafios (histórico)
      challenge_achievements: {
        Row: {
          id: string;
          challenge_id: string;
          user_id: string;
          achieved_at: string;
          points_earned: number;
          final_percentage: number;
        };
        Insert: {
          id?: string;
          challenge_id: string;
          user_id: string;
          achieved_at?: string;
          points_earned: number;
          final_percentage: number;
        };
        Update: {
          id?: string;
          challenge_id?: string;
          user_id?: string;
          achieved_at?: string;
          points_earned?: number;
          final_percentage?: number;
        };
        Relationships: [
          {
            foreignKeyName: "challenge_achievements_challenge_id_fkey";
            columns: ["challenge_id"];
            isOneToOne: false;
            referencedRelation: "challenges";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "challenge_achievements_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      // Tabelas de Chat
      chat_rooms: {
        Row: {
          id: string;
          name: string | null;
          type: "private" | "group";
          group_id: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name?: string | null;
          type: "private" | "group";
          group_id?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          type?: "private" | "group";
          group_id?: string | null;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chat_rooms_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chat_rooms_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "study_groups";
            referencedColumns: ["id"];
          }
        ];
      };

      chat_messages: {
        Row: {
          id: string;
          room_id: string;
          user_id: string;
          content: string;
          message_type: "text" | "image" | "file";
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          user_id: string;
          content: string;
          message_type?: "text" | "image" | "file";
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          room_id?: string;
          user_id?: string;
          content?: string;
          message_type?: "text" | "image" | "file";
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chat_messages_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "chat_rooms";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };

      chat_participants: {
        Row: {
          id: string;
          room_id: string;
          user_id: string;
          joined_at: string;
          last_read_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          user_id: string;
          joined_at?: string;
          last_read_at?: string;
        };
        Update: {
          id?: string;
          room_id?: string;
          user_id?: string;
          joined_at?: string;
          last_read_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chat_participants_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "chat_rooms";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chat_participants_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };

      // Outras tabelas existentes (simplificadas)
      quiz_results: {
        Row: {
          id: string;
          user_id: string;
          quiz_id: string;
          total_questions: number;
          correct_answers: number;
          wrong_answers: number;
          percentage: number;
          completed_at: string;
          reviewed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          quiz_id: string;
          total_questions: number;
          correct_answers?: number;
          wrong_answers?: number;
          percentage: number;
          completed_at?: string;
          reviewed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          quiz_id?: string;
          total_questions?: number;
          correct_answers?: number;
          wrong_answers?: number;
          percentage?: number;
          completed_at?: string;
          reviewed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "quiz_results_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "quiz_results_quiz_id_fkey";
            columns: ["quiz_id"];
            isOneToOne: false;
            referencedRelation: "quizzes";
            referencedColumns: ["id"];
          }
        ];
      };

      quizzes: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          creator_id: string;
          pdf_name: string | null;
          is_public: boolean;
          caderno_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          creator_id: string;
          pdf_name?: string | null;
          is_public?: boolean;
          caderno_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          creator_id?: string;
          pdf_name?: string | null;
          is_public?: boolean;
          caderno_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "quizzes_creator_id_fkey";
            columns: ["creator_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "quizzes_caderno_id_fkey";
            columns: ["caderno_id"];
            isOneToOne: false;
            referencedRelation: "cadernos";
            referencedColumns: ["id"];
          }
        ];
      };
    };

    Enums: {
      user_role: "user" | "admin";
    };
  };
};
