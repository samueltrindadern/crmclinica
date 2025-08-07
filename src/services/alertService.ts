import { database } from './database';
import { Patient, Alert } from '../types';
import { addMonths, isBefore, isAfter, subDays } from 'date-fns';

export class AlertService {
  private static instance: AlertService;
  private intervalId: NodeJS.Timeout | null = null;

  static getInstance(): AlertService {
    if (!AlertService.instance) {
      AlertService.instance = new AlertService();
    }
    return AlertService.instance;
  }

  startMonitoring() {
    // Verifica alertas a cada hora
    this.intervalId = setInterval(() => {
      this.checkAndCreateAlerts();
    }, 60 * 60 * 1000);

    // Executa imediatamente
    this.checkAndCreateAlerts();
  }

  stopMonitoring() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private async checkAndCreateAlerts() {
    const patients = await database.getPatients();
    const existingAlerts = await database.getAlerts();
    
    for (const patient of patients) {
      if (patient.status !== 'ativo') continue;

      const nextCheckupDate = new Date(patient.nextCheckupDate);
      const now = new Date();
      const reminderDate = subDays(nextCheckupDate, 7); // 7 dias antes

      // Verifica se já existe alerta para este paciente
      const hasExistingAlert = existingAlerts.some(
        alert => alert.patientId === patient.id && alert.status === 'pending'
      );

      if (hasExistingAlert) continue;

      // Cria alerta se estiver dentro do período
      if (isAfter(now, reminderDate) && isBefore(now, nextCheckupDate)) {
        await this.createCheckupReminder(patient);
      } else if (isAfter(now, nextCheckupDate)) {
        await this.createOverdueAlert(patient);
      }
    }
  }

  private async createCheckupReminder(patient: Patient) {
    await database.createAlert({
      patientId: patient.id,
      patientName: patient.name,
      type: 'checkup_reminder',
      message: `Check-up ${patient.examType.toLowerCase()} agendado para ${new Date(patient.nextCheckupDate).toLocaleDateString('pt-BR')}`,
      scheduledFor: new Date().toISOString(),
      status: 'pending'
    });
  }

  private async createOverdueAlert(patient: Patient) {
    await database.createAlert({
      patientId: patient.id,
      patientName: patient.name,
      type: 'overdue',
      message: `Check-up ${patient.examType.toLowerCase()} em atraso desde ${new Date(patient.nextCheckupDate).toLocaleDateString('pt-BR')}`,
      scheduledFor: new Date().toISOString(),
      status: 'pending'
    });
  }

  calculateNextCheckupDate(lastExamDate: string, riskProfile: string): string {
    const lastDate = new Date(lastExamDate);
    let monthsToAdd = 12; // baixo risco

    switch (riskProfile) {
      case 'alto':
        monthsToAdd = 3;
        break;
      case 'moderado':
        monthsToAdd = 6;
        break;
      case 'baixo':
        monthsToAdd = 12;
        break;
    }

    return addMonths(lastDate, monthsToAdd).toISOString().split('T')[0];
  }

  async sendAlert(alertId: string): Promise<boolean> {
    const alert = (await database.getAlerts()).find(a => a.id === alertId);
    if (!alert) return false;

    const patient = await database.getPatient(alert.patientId);
    if (!patient) return false;

    const clinicSettings = await database.getClinicSettings();
    if (!clinicSettings) return false;

    try {
      // Simula envio de WhatsApp
      await this.sendWhatsAppMessage(patient, alert, clinicSettings);
      
      // Simula envio de E-mail
      await this.sendEmailMessage(patient, alert, clinicSettings);

      // Atualiza status do alerta
      await database.updateAlert(alertId, { status: 'sent' });

      return true;
    } catch (error) {
      console.error('Erro ao enviar alerta:', error);
      await database.updateAlert(alertId, { status: 'failed' });
      return false;
    }
  }

  private async sendWhatsAppMessage(patient: Patient, alert: Alert, clinicSettings: any) {
    const message = clinicSettings.whatsappTemplate
      .replace('{nome}', patient.name)
      .replace('{exame}', patient.examType);

    // Simula envio via WhatsApp API
    await database.createMessage({
      patientId: patient.id,
      patientName: patient.name,
      type: 'whatsapp',
      content: message,
      status: 'enviado',
      sentAt: new Date().toISOString()
    });

    console.log(`WhatsApp enviado para ${patient.name}: ${message}`);
  }

  private async sendEmailMessage(patient: Patient, alert: Alert, clinicSettings: any) {
    const message = clinicSettings.emailTemplate
      .replace('{nome}', patient.name)
      .replace('{exame}', patient.examType);

    // Simula envio via E-mail API
    await database.createMessage({
      patientId: patient.id,
      patientName: patient.name,
      type: 'email',
      content: message,
      status: 'enviado',
      sentAt: new Date().toISOString()
    });

    console.log(`E-mail enviado para ${patient.name}: ${message}`);
  }
}

export const alertService = AlertService.getInstance();