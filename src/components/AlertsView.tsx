import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Send, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Filter,
  Calendar,
  MessageSquare,
  Mail,
  Smartphone
} from 'lucide-react';
import { database } from '../services/database';
import { alertService } from '../services/alertService';
import { Alert } from '../types';
import toast from 'react-hot-toast';

interface AlertsViewProps {
  onDataChange: () => void;
}

export function AlertsView({ onDataChange }: AlertsViewProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAlerts();
  }, []);

  useEffect(() => {
    filterAlerts();
  }, [alerts, filterType, filterStatus]);

  const loadAlerts = async () => {
    const data = await database.getAlerts();
    setAlerts(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const filterAlerts = () => {
    let filtered = alerts;

    if (filterType) {
      filtered = filtered.filter(alert => alert.type === filterType);
    }

    if (filterStatus) {
      filtered = filtered.filter(alert => alert.status === filterStatus);
    }

    setFilteredAlerts(filtered);
  };

  const sendAlert = async (alertId: string) => {
    setIsLoading(true);
    try {
      const success = await alertService.sendAlert(alertId);
      if (success) {
        toast.success('Alerta enviado com sucesso!');
        await loadAlerts();
        onDataChange();
      } else {
        toast.error('Erro ao enviar alerta');
      }
    } catch (error) {
      toast.error('Erro ao enviar alerta');
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'checkup_reminder':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'overdue':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'urgent':
        return <Bell className="w-5 h-5 text-orange-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'checkup_reminder':
        return 'Lembrete de Check-up';
      case 'overdue':
        return 'Exame em Atraso';
      case 'urgent':
        return 'Urgente';
      default:
        return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'sent':
        return 'Enviado';
      case 'failed':
        return 'Falhou';
      default:
        return status;
    }
  };

  const stats = {
    total: alerts.length,
    pending: alerts.filter(a => a.status === 'pending').length,
    sent: alerts.filter(a => a.status === 'sent').length,
    failed: alerts.filter(a => a.status === 'failed').length
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Alertas</h1>
        <p className="text-gray-600">Gerencie os alertas automáticos do sistema</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Alertas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pendentes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Enviados</p>
              <p className="text-2xl font-bold text-gray-900">{stats.sent}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Falharam</p>
              <p className="text-2xl font-bold text-gray-900">{stats.failed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos os tipos</option>
            <option value="checkup_reminder">Lembrete de Check-up</option>
            <option value="overdue">Exame em Atraso</option>
            <option value="urgent">Urgente</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos os status</option>
            <option value="pending">Pendente</option>
            <option value="sent">Enviado</option>
            <option value="failed">Falhou</option>
          </select>

          <div className="flex items-center text-sm text-gray-600">
            <Filter className="w-4 h-4 mr-2" />
            {filteredAlerts.length} de {alerts.length} alertas
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="divide-y divide-gray-200">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => (
              <div key={alert.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getTypeIcon(alert.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {alert.patientName}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {getTypeLabel(alert.type)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{alert.message}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>
                          Agendado para: {new Date(alert.scheduledFor).toLocaleString('pt-BR')}
                        </span>
                        <span>
                          Criado em: {new Date(alert.createdAt).toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(alert.status)}`}>
                      {getStatusLabel(alert.status)}
                    </span>
                    {alert.status === 'pending' && (
                      <button
                        onClick={() => sendAlert(alert.id)}
                        disabled={isLoading}
                        className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1 text-sm"
                      >
                        {isLoading ? (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Send className="w-3 h-3" />
                        )}
                        Enviar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum alerta encontrado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}