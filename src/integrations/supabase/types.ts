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
      // ... existing code ...
      
      // Tabelas de Chat adicionadas
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
      
      // ... rest of existing code ...
