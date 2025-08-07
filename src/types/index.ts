export interface Patient {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  email: string;
  examType: string;
  lastExamDate: string;
  riskProfile: 'baixo' | 'moderado' | 'alto';
  nextCheckupDate: string;
  status: 'ativo' | 'inativo';
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  patientId: string;
  patientName: string;
  type: 'email' | 'whatsapp';
  content: string;
  status: 'enviado' | 'entregue' | 'lido' | 'erro';
  sentAt: string;
  scheduledFor?: string;
}

export interface ClinicSettings {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  logo?: string;
  emailSignature: string;
  whatsappTemplate: string;
  emailTemplate: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  clinicId: string;
  createdAt: string;
}

export interface Alert {
  id: string;
  patientId: string;
  patientName: string;
  type: 'checkup_reminder' | 'overdue' | 'urgent';
  message: string;
  scheduledFor: string;
  status: 'pending' | 'sent' | 'failed';
  createdAt: string;
}