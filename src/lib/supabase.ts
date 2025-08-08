import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos do banco de dados
export interface Database {
  public: {
    Tables: {
      clinics: {
        Row: {
          id: string;
          name: string;
          cnpj: string;
          email: string;
          phone: string;
          whatsapp_number: string;
          address: string;
          city: string;
          state: string;
          zip_code: string;
          logo: string | null;
          email_signature: string;
          whatsapp_template: string;
          email_template: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          cnpj: string;
          email: string;
          phone: string;
          whatsapp_number: string;
          address?: string;
          city?: string;
          state?: string;
          zip_code?: string;
          logo?: string | null;
          email_signature?: string;
          whatsapp_template?: string;
          email_template?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          cnpj?: string;
          email?: string;
          phone?: string;
          whatsapp_number?: string;
          address?: string;
          city?: string;
          state?: string;
          zip_code?: string;
          logo?: string | null;
          email_signature?: string;
          whatsapp_template?: string;
          email_template?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: string;
          clinic_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role?: string;
          clinic_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: string;
          clinic_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      patients: {
        Row: {
          id: string;
          clinic_id: string;
          name: string;
          cpf: string;
          phone: string;
          email: string;
          exam_type: string;
          last_exam_date: string;
          risk_profile: 'baixo' | 'moderado' | 'alto';
          next_checkup_date: string;
          status: 'ativo' | 'inativo';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clinic_id: string;
          name: string;
          cpf: string;
          phone: string;
          email: string;
          exam_type: string;
          last_exam_date: string;
          risk_profile: 'baixo' | 'moderado' | 'alto';
          next_checkup_date?: string;
          status?: 'ativo' | 'inativo';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          clinic_id?: string;
          name?: string;
          cpf?: string;
          phone?: string;
          email?: string;
          exam_type?: string;
          last_exam_date?: string;
          risk_profile?: 'baixo' | 'moderado' | 'alto';
          next_checkup_date?: string;
          status?: 'ativo' | 'inativo';
          created_at?: string;
          updated_at?: string;
        };
      };
      alerts: {
        Row: {
          id: string;
          clinic_id: string;
          patient_id: string;
          patient_name: string;
          type: 'checkup_reminder' | 'overdue' | 'urgent';
          message: string;
          scheduled_for: string;
          status: 'pending' | 'sent' | 'failed';
          created_at: string;
        };
        Insert: {
          id?: string;
          clinic_id: string;
          patient_id: string;
          patient_name: string;
          type: 'checkup_reminder' | 'overdue' | 'urgent';
          message: string;
          scheduled_for: string;
          status?: 'pending' | 'sent' | 'failed';
          created_at?: string;
        };
        Update: {
          id?: string;
          clinic_id?: string;
          patient_id?: string;
          patient_name?: string;
          type?: 'checkup_reminder' | 'overdue' | 'urgent';
          message?: string;
          scheduled_for?: string;
          status?: 'pending' | 'sent' | 'failed';
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          clinic_id: string;
          patient_id: string;
          patient_name: string;
          type: 'email' | 'whatsapp';
          content: string;
          status: 'enviado' | 'entregue' | 'lido' | 'erro';
          sent_at: string;
          scheduled_for: string | null;
        };
        Insert: {
          id?: string;
          clinic_id: string;
          patient_id: string;
          patient_name: string;
          type: 'email' | 'whatsapp';
          content: string;
          status?: 'enviado' | 'entregue' | 'lido' | 'erro';
          sent_at?: string;
          scheduled_for?: string | null;
        };
        Update: {
          id?: string;
          clinic_id?: string;
          patient_id?: string;
          patient_name?: string;
          type?: 'email' | 'whatsapp';
          content?: string;
          status?: 'enviado' | 'entregue' | 'lido' | 'erro';
          sent_at?: string;
          scheduled_for?: string | null;
        };
      };
    };
  };
}