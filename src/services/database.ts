import { Patient, Message, ClinicSettings, User, Alert } from '../types';

// Simulação de banco de dados local
class Database {
  private patients: Patient[] = [];
  private messages: Message[] = [];
  private clinicSettings: ClinicSettings | null = null;
  private users: User[] = [];
  private alerts: Alert[] = [];

  constructor() {
    this.loadMockData();
  }

  private loadMockData() {
    // Dados mock para demonstração
    this.clinicSettings = {
      id: '1',
      name: 'Clínica Saúde Total',
      cnpj: '12.345.678/0001-90',
      email: 'contato@saudetotal.com.br',
      phone: '(11) 3456-7890',
      whatsappNumber: '5511987654321',
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      emailSignature: 'Equipe Clínica Saúde Total',
      whatsappTemplate: 'Olá {nome}, é hora do seu check-up! Agende sua consulta.',
      emailTemplate: 'Prezado(a) {nome}, lembramos que está na hora do seu exame de {exame}.'
    };

    this.users = [
      {
        id: '1',
        email: 'admin@clinica.com',
        name: 'Administrador',
        role: 'admin',
        clinicId: '1',
        createdAt: new Date().toISOString()
      }
    ];

    // Pacientes mock
    const mockPatients: Patient[] = [
      {
        id: '1',
        name: 'Maria Silva',
        cpf: '123.456.789-01',
        phone: '(11) 99999-1111',
        email: 'maria@email.com',
        examType: 'Ginecologia',
        lastExamDate: '2024-01-15',
        riskProfile: 'alto',
        nextCheckupDate: '2024-04-15',
        status: 'ativo',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        name: 'João Santos',
        cpf: '987.654.321-02',
        phone: '(11) 99999-2222',
        email: 'joao@email.com',
        examType: 'Cardiologia',
        lastExamDate: '2023-12-10',
        riskProfile: 'moderado',
        nextCheckupDate: '2024-06-10',
        status: 'ativo',
        createdAt: '2023-12-10T14:30:00Z',
        updatedAt: '2023-12-10T14:30:00Z'
      },
      {
        id: '3',
        name: 'Carlos Oliveira',
        cpf: '456.789.123-03',
        phone: '(11) 99999-3333',
        email: 'carlos@email.com',
        examType: 'Urologia',
        lastExamDate: '2023-11-20',
        riskProfile: 'baixo',
        nextCheckupDate: '2024-11-20',
        status: 'ativo',
        createdAt: '2023-11-20T09:15:00Z',
        updatedAt: '2023-11-20T09:15:00Z'
      }
    ];

    this.patients = mockPatients;

    // Mensagens mock
    this.messages = [
      {
        id: '1',
        patientId: '1',
        patientName: 'Maria Silva',
        type: 'whatsapp',
        content: 'Olá Maria, é hora do seu check-up ginecológico!',
        status: 'entregue',
        sentAt: '2024-01-10T08:00:00Z'
      },
      {
        id: '2',
        patientId: '2',
        patientName: 'João Santos',
        type: 'email',
        content: 'Prezado João, lembramos que está na hora do seu exame cardiológico.',
        status: 'lido',
        sentAt: '2024-01-08T10:30:00Z'
      }
    ];

    // Alertas mock
    this.alerts = [
      {
        id: '1',
        patientId: '1',
        patientName: 'Maria Silva',
        type: 'checkup_reminder',
        message: 'Check-up ginecológico vencendo em 7 dias',
        scheduledFor: '2024-04-08T09:00:00Z',
        status: 'pending',
        createdAt: '2024-01-15T10:00:00Z'
      }
    ];
  }

  // Pacientes
  async getPatients(): Promise<Patient[]> {
    return [...this.patients];
  }

  async getPatient(id: string): Promise<Patient | null> {
    return this.patients.find(p => p.id === id) || null;
  }

  async createPatient(patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Promise<Patient> {
    const newPatient: Patient = {
      ...patient,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.patients.push(newPatient);
    return newPatient;
  }

  async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient | null> {
    const index = this.patients.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    this.patients[index] = {
      ...this.patients[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return this.patients[index];
  }

  async deletePatient(id: string): Promise<boolean> {
    const index = this.patients.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    this.patients.splice(index, 1);
    return true;
  }

  // Mensagens
  async getMessages(): Promise<Message[]> {
    return [...this.messages];
  }

  async createMessage(message: Omit<Message, 'id'>): Promise<Message> {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString()
    };
    this.messages.push(newMessage);
    return newMessage;
  }

  // Configurações da clínica
  async getClinicSettings(): Promise<ClinicSettings | null> {
    return this.clinicSettings;
  }

  async updateClinicSettings(settings: Partial<ClinicSettings>): Promise<ClinicSettings | null> {
    if (!this.clinicSettings) return null;
    
    this.clinicSettings = {
      ...this.clinicSettings,
      ...settings
    };
    return this.clinicSettings;
  }

  // Usuários
  async getUser(email: string): Promise<User | null> {
    return this.users.find(u => u.email === email) || null;
  }

  async authenticateUser(email: string, password: string): Promise<User | null> {
    // Simulação de autenticação - em produção, verificar hash da senha
    if (email === 'admin@clinica.com' && password === 'admin123') {
      return this.users[0];
    }
    return null;
  }

  // Alertas
  async getAlerts(): Promise<Alert[]> {
    return [...this.alerts];
  }

  async createAlert(alert: Omit<Alert, 'id' | 'createdAt'>): Promise<Alert> {
    const newAlert: Alert = {
      ...alert,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    this.alerts.push(newAlert);
    return newAlert;
  }

  async updateAlert(id: string, updates: Partial<Alert>): Promise<Alert | null> {
    const index = this.alerts.findIndex(a => a.id === id);
    if (index === -1) return null;
    
    this.alerts[index] = {
      ...this.alerts[index],
      ...updates
    };
    return this.alerts[index];
  }
}

export const database = new Database();