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
          role: Database["public"]["Enums"]["user_role"];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id: string;
          name: string;
          role?: Database["public"]["Enums"]["user_role"];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          role?: Database["public"]["Enums"]["user_role"];
          updated_at?: string;
        };
        Relationships: [];
      };
      tags: {
        Row: {
          id: string;
          name: string;
          color: string;
          description: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          color?: string;
          description?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          color?: string;
          description?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tags_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      caderno_tags: {
        Row: {
          id: string;
          caderno_id: string;
          tag_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          caderno_id: string;
          tag_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          caderno_id?: string;
          tag_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "caderno_tags_caderno_id_fkey";
            columns: ["caderno_id"];
            isOneToOne: false;
            referencedRelation: "cadernos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "caderno_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          }
        ];
      };
      quiz_tags: {
        Row: {
          id: string;
          quiz_id: string;
          tag_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          quiz_id: string;
          tag_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          quiz_id?: string;
          tag_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "quiz_tags_quiz_id_fkey";
            columns: ["quiz_id"];
            isOneToOne: false;
            referencedRelation: "quizzes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "quiz_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          }
        ];
      };
      goal_tags: {
        Row: {
          id: string;
          goal_id: string;
          tag_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          goal_id: string;
          tag_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          goal_id?: string;
          tag_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "goal_tags_goal_id_fkey";
            columns: ["goal_id"];
            isOneToOne: false;
            referencedRelation: "goals";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "goal_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          }
        ];
      };
      questions: {
        Row: {
          correct_answer: string | null;
          created_at: string;
          id: string;
          question_number: number;
          quiz_id: string;
          text: string | null;
        };
        Insert: {
          correct_answer?: string | null;
          created_at?: string;
          id?: string;
          question_number: number;
          quiz_id: string;
          text?: string | null;
        };
        Update: {
          correct_answer?: string | null;
          created_at?: string;
          id?: string;
          question_number?: number;
          quiz_id?: string;
          text?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "questions_quiz_id_fkey";
            columns: ["quiz_id"];
            isOneToOne: false;
            referencedRelation: "quizzes";
            referencedColumns: ["id"];
          }
        ];
      };
      quiz_results: {
        Row: {
          completed_at: string;
          correct_answers: number;
          id: string;
          percentage: number;
          quiz_id: string;
          total_questions: number;
          user_id: string;
          wrong_answers: number;
        };
        Insert: {
          completed_at?: string;
          correct_answers?: number;
          id?: string;
          percentage: number;
          quiz_id: string;
          total_questions: number;
          user_id: string;
          wrong_answers?: number;
        };
        Update: {
          completed_at?: string;
          correct_answers?: number;
          id?: string;
          percentage?: number;
          quiz_id?: string;
          total_questions?: number;
          user_id?: string;
          wrong_answers?: number;
        };
        Relationships: [
          {
            foreignKeyName: "quiz_results_quiz_id_fkey";
            columns: ["quiz_id"];
            isOneToOne: false;
            referencedRelation: "quizzes";
            referencedColumns: ["id"];
          }
        ];
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          type: "daily" | "weekly" | "monthly";
          target: number;
          current: number;
          unit: "questions" | "quizzes" | "percentage";
          caderno_id: string | null;
          deadline: string;
          completed: boolean;
          points: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          title: string;
          description?: string | null;
          type: "daily" | "weekly" | "monthly";
          target: number;
          current?: number;
          unit: "questions" | "quizzes" | "percentage";
          caderno_id?: string | null;
          deadline: string;
          completed?: boolean;
          points: number;
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
          current?: number;
          unit?: "questions" | "quizzes" | "percentage";
          caderno_id?: string | null;
          deadline?: string;
          completed?: boolean;
          points?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "goals_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
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
      challenges: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          target_percentage: number;
          caderno_id: string;
          deadline: string;
          completed: boolean;
          current_percentage: number;
          points: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          title: string;
          description?: string | null;
          target_percentage: number;
          caderno_id: string;
          deadline: string;
          completed?: boolean;
          current_percentage?: number;
          points: number;
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
          completed?: boolean;
          current_percentage?: number;
          points?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "challenges_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
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
          user_id?: string;
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
      quizzes: {
        Row: {
          created_at: string;
          creator_id: string;
          description: string | null;
          id: string;
          is_public: boolean;
          title: string;
          updated_at: string;
          pdf_name: string | null;
          caderno_id: string | null;
        };
        Insert: {
          created_at?: string;
          creator_id: string;
          description?: string | null;
          id?: string;
          is_public?: boolean;
          title: string;
          updated_at?: string;
          pdf_name?: string | null;
          caderno_id?: string | null;
        };
        Update: {
          created_at?: string;
          creator_id?: string;
          description?: string | null;
          id?: string;
          is_public?: boolean;
          title?: string;
          updated_at?: string;
          pdf_name?: string | null;
          caderno_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "quizzes_caderno_id_fkey";
            columns: ["caderno_id"];
            isOneToOne: false;
            referencedRelation: "cadernos";
            referencedColumns: ["id"];
          }
        ];
      };
      user_answers: {
        Row: {
          answered_at: string;
          id: string;
          is_correct: boolean;
          question_id: string;
          user_answer: string | null;
          user_id: string;
          legend: string | null;
        };
        Insert: {
          answered_at?: string;
          id?: string;
          is_correct: boolean;
          question_id: string;
          user_answer?: string | null;
          user_id: string;
          legend?: string | null;
        };
        Update: {
          answered_at?: string;
          id?: string;
          is_correct?: boolean;
          question_id?: string;
          user_answer?: string | null;
          user_id?: string;
          legend?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_answers_question_id_fkey";
            columns: ["question_id"];
            isOneToOne: false;
            referencedRelation: "questions";
            referencedColumns: ["id"];
          }
        ];
      };
      friendships: {
        Row: {
          id: string;
          requester_id: string;
          addressee_id: string;
          status: Database["public"]["Enums"]["friendship_status"];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          requester_id: string;
          addressee_id: string;
          status?: Database["public"]["Enums"]["friendship_status"];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          requester_id?: string;
          addressee_id?: string;
          status?: Database["public"]["Enums"]["friendship_status"];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "friendships_requester_id_fkey";
            columns: ["requester_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "friendships_addressee_id_fkey";
            columns: ["addressee_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: "admin" | "user";
      friendship_status: "pending" | "accepted" | "rejected" | "blocked";
      group_role: "admin" | "moderator" | "member";
      invitation_status: "pending" | "accepted" | "declined" | "expired";
      chat_room_type: "private" | "group" | "study";
      message_type: "text" | "image" | "file" | "system";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "user"],
      friendship_status: ["pending", "accepted", "rejected", "blocked"],
      group_role: ["admin", "moderator", "member"],
      invitation_status: ["pending", "accepted", "declined", "expired"],
      chat_room_type: ["private", "group", "study"],
      message_type: ["text", "image", "file", "system"],
    },
  },
} as const;
