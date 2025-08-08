import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  TrendingUp, 
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabaseService } from '../services/supabaseService';
import { alertService } from '../services/alertService';
import { Patient, Message, Alert } from '../types';
import { PatientsView } from './PatientsView';
import { MessagesView } from './MessagesView';
import { SettingsView } from './SettingsView';
import { AlertsView } from './AlertsView';

type View = 'dashboard' | 'patients' | 'messages' | 'alerts' | 'settings';

export function Dashboard() {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    activePatients: 0,
    pendingAlerts: 0,
    messagesSent: 0,
    responseRate: 0
  });

  useEffect(() => {
    loadData();
    alertService.startMonitoring();

    return () => {
      alertService.stopMonitoring();
    };
  }, []);

  const loadData = async () => {
    const [patientsData, messagesData, alertsData] = await Promise.all([
      supabaseService.getPatients(),
      supabaseService.getMessages(),
      supabaseService.getAlerts()
    ]);

    setPatients(patientsData);
    setMessages(messagesData);
    setAlerts(alertsData);

    // Calcular estatísticas
    const activePatients = patientsData.filter(p => p.status === 'ativo').length;
    const pendingAlerts = alertsData.filter(a => a.status === 'pending').length;
    const sentMessages = messagesData.length;
    const readMessages = messagesData.filter(m => m.status === 'lido').length;
    const responseRate = sentMessages > 0 ? (readMessages / sentMessages) * 100 : 0;

    setStats({
      totalPatients: patientsData.length,
      activePatients,
      pendingAlerts,
      messagesSent: sentMessages,
      responseRate
    });
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'patients', label: 'Pacientes', icon: Users },
    { id: 'alerts', label: 'Alertas', icon: Bell },
    { id: 'messages', label: 'Mensagens', icon: MessageSquare },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'patients':
        return <PatientsView onDataChange={loadData} />;
      case 'messages':
        return <MessagesView />;
      case 'alerts':
        return <AlertsView onDataChange={loadData} />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardContent stats={stats} patients={patients} alerts={alerts} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h1 className="text-xl font-bold text-blue-600">CheckUp Fácil</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id as View);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-blue-50 transition-colors ${
                  currentView === item.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell className="w-6 h-6 text-gray-500" />
              {stats.pendingAlerts > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {stats.pendingAlerts}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

function DashboardContent({ stats, patients, alerts }: { stats: any, patients: Patient[], alerts: Alert[] }) {
  const riskDistribution = {
    alto: patients.filter(p => p.riskProfile === 'alto').length,
    moderado: patients.filter(p => p.riskProfile === 'moderado').length,
    baixo: patients.filter(p => p.riskProfile === 'baixo').length,
  };

  const recentAlerts = alerts.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Pacientes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pacientes Ativos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activePatients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Alertas Pendentes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingAlerts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Taxa de Resposta</p>
              <p className="text-2xl font-bold text-gray-900">{stats.responseRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Risco</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Alto Risco</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{riskDistribution.alto}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Risco Moderado</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{riskDistribution.moderado}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Baixo Risco</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{riskDistribution.baixo}</span>
            </div>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas Recentes</h3>
          <div className="space-y-3">
            {recentAlerts.length > 0 ? (
              recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{alert.patientName}</p>
                    <p className="text-xs text-gray-600">{alert.message}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    alert.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    alert.status === 'sent' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {alert.status === 'pending' ? 'Pendente' :
                     alert.status === 'sent' ? 'Enviado' : 'Erro'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">Nenhum alerta recente</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}