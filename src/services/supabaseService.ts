import { supabase } from '../lib/supabase';
import { Patient, Message, ClinicSettings, User, Alert } from '../types';

export class SupabaseService {
  // Autenticação
  async signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    // Buscar dados do usuário
    if (data.user) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (userError) throw userError;
      return userData;
    }
    
    return null;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return true;
  }

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) throw error;
    return userData;
  }

  // Pacientes
  async getPatients(): Promise<Patient[]> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(patient => ({
      id: patient.id,
      name: patient.name,
      cpf: patient.cpf,
      phone: patient.phone,
      email: patient.email,
      examType: patient.exam_type,
      lastExamDate: patient.last_exam_date,
      riskProfile: patient.risk_profile,
      nextCheckupDate: patient.next_checkup_date,
      status: patient.status,
      createdAt: patient.created_at,
      updatedAt: patient.updated_at
    }));
  }

  async getPatient(id: string): Promise<Patient | null> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    
    return {
      id: data.id,
      name: data.name,
      cpf: data.cpf,
      phone: data.phone,
      email: data.email,
      examType: data.exam_type,
      lastExamDate: data.last_exam_date,
      riskProfile: data.risk_profile,
      nextCheckupDate: data.next_checkup_date,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  async createPatient(patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Promise<Patient> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('patients')
      .insert({
        clinic_id: user.clinic_id,
        name: patient.name,
        cpf: patient.cpf,
        phone: patient.phone,
        email: patient.email,
        exam_type: patient.examType,
        last_exam_date: patient.lastExamDate,
        risk_profile: patient.riskProfile,
        status: patient.status
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      cpf: data.cpf,
      phone: data.phone,
      email: data.email,
      examType: data.exam_type,
      lastExamDate: data.last_exam_date,
      riskProfile: data.risk_profile,
      nextCheckupDate: data.next_checkup_date,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient | null> {
    const updateData: any = {};
    
    if (updates.name) updateData.name = updates.name;
    if (updates.cpf) updateData.cpf = updates.cpf;
    if (updates.phone) updateData.phone = updates.phone;
    if (updates.email) updateData.email = updates.email;
    if (updates.examType) updateData.exam_type = updates.examType;
    if (updates.lastExamDate) updateData.last_exam_date = updates.lastExamDate;
    if (updates.riskProfile) updateData.risk_profile = updates.riskProfile;
    if (updates.status) updateData.status = updates.status;

    const { data, error } = await supabase
      .from('patients')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    
    return {
      id: data.id,
      name: data.name,
      cpf: data.cpf,
      phone: data.phone,
      email: data.email,
      examType: data.exam_type,
      lastExamDate: data.last_exam_date,
      riskProfile: data.risk_profile,
      nextCheckupDate: data.next_checkup_date,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  async deletePatient(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  // Mensagens
  async getMessages(): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('sent_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(message => ({
      id: message.id,
      patientId: message.patient_id,
      patientName: message.patient_name,
      type: message.type,
      content: message.content,
      status: message.status,
      sentAt: message.sent_at,
      scheduledFor: message.scheduled_for
    }));
  }

  async createMessage(message: Omit<Message, 'id'>): Promise<Message> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('messages')
      .insert({
        clinic_id: user.clinic_id,
        patient_id: message.patientId,
        patient_name: message.patientName,
        type: message.type,
        content: message.content,
        status: message.status,
        sent_at: message.sentAt,
        scheduled_for: message.scheduledFor
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      patientId: data.patient_id,
      patientName: data.patient_name,
      type: data.type,
      content: data.content,
      status: data.status,
      sentAt: data.sent_at,
      scheduledFor: data.scheduled_for
    };
  }

  // Configurações da clínica
  async getClinicSettings(): Promise<ClinicSettings | null> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('clinics')
      .select('*')
      .eq('id', user.clinic_id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    
    return {
      id: data.id,
      name: data.name,
      cnpj: data.cnpj,
      email: data.email,
      phone: data.phone,
      whatsappNumber: data.whatsapp_number,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zip_code,
      logo: data.logo,
      emailSignature: data.email_signature,
      whatsappTemplate: data.whatsapp_template,
      emailTemplate: data.email_template
    };
  }

  async updateClinicSettings(settings: Partial<ClinicSettings>): Promise<ClinicSettings | null> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const updateData: any = {};
    
    if (settings.name) updateData.name = settings.name;
    if (settings.cnpj) updateData.cnpj = settings.cnpj;
    if (settings.email) updateData.email = settings.email;
    if (settings.phone) updateData.phone = settings.phone;
    if (settings.whatsappNumber) updateData.whatsapp_number = settings.whatsappNumber;
    if (settings.address) updateData.address = settings.address;
    if (settings.city) updateData.city = settings.city;
    if (settings.state) updateData.state = settings.state;
    if (settings.zipCode) updateData.zip_code = settings.zipCode;
    if (settings.logo) updateData.logo = settings.logo;
    if (settings.emailSignature) updateData.email_signature = settings.emailSignature;
    if (settings.whatsappTemplate) updateData.whatsapp_template = settings.whatsappTemplate;
    if (settings.emailTemplate) updateData.email_template = settings.emailTemplate;

    const { data, error } = await supabase
      .from('clinics')
      .update(updateData)
      .eq('id', user.clinic_id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      cnpj: data.cnpj,
      email: data.email,
      phone: data.phone,
      whatsappNumber: data.whatsapp_number,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zip_code,
      logo: data.logo,
      emailSignature: data.email_signature,
      whatsappTemplate: data.whatsapp_template,
      emailTemplate: data.email_template
    };
  }

  // Alertas
  async getAlerts(): Promise<Alert[]> {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(alert => ({
      id: alert.id,
      patientId: alert.patient_id,
      patientName: alert.patient_name,
      type: alert.type,
      message: alert.message,
      scheduledFor: alert.scheduled_for,
      status: alert.status,
      createdAt: alert.created_at
    }));
  }

  async createAlert(alert: Omit<Alert, 'id' | 'createdAt'>): Promise<Alert> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('alerts')
      .insert({
        clinic_id: user.clinic_id,
        patient_id: alert.patientId,
        patient_name: alert.patientName,
        type: alert.type,
        message: alert.message,
        scheduled_for: alert.scheduledFor,
        status: alert.status
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      patientId: data.patient_id,
      patientName: data.patient_name,
      type: data.type,
      message: data.message,
      scheduledFor: data.scheduled_for,
      status: data.status,
      createdAt: data.created_at
    };
  }

  async updateAlert(id: string, updates: Partial<Alert>): Promise<Alert | null> {
    const updateData: any = {};
    
    if (updates.status) updateData.status = updates.status;
    if (updates.message) updateData.message = updates.message;

    const { data, error } = await supabase
      .from('alerts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    
    return {
      id: data.id,
      patientId: data.patient_id,
      patientName: data.patient_name,
      type: data.type,
      message: data.message,
      scheduledFor: data.scheduled_for,
      status: data.status,
      createdAt: data.created_at
    };
  }
}

export const supabaseService = new SupabaseService();