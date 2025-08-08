import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Mail, 
  Smartphone, 
  Filter,
  Search,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { Message } from '../types';

export function MessagesView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    filterMessages();
  }, [messages, searchTerm, filterType, filterStatus]);

  const loadMessages = async () => {
    const data = await supabaseService.getMessages();
    setMessages(data.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()));
  };

  const filterMessages = () => {
    let filtered = messages;

    if (searchTerm) {
      filtered = filtered.filter(message =>
        message.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType) {
      filtered = filtered.filter(message => message.type === filterType);
    }

    if (filterStatus) {
      filtered = filtered.filter(message => message.status === filterStatus);
    }

    setFilteredMessages(filtered);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-5 h-5 text-blue-600" />;
      case 'whatsapp':
        return <Smartphone className="w-5 h-5 text-green-600" />;
      default:
        return <MessageSquare className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'enviado':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'entregue':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'lido':
        return <Eye className="w-4 h-4 text-green-600" />;
      case 'erro':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enviado':
        return 'bg-yellow-100 text-yellow-800';
      case 'entregue':
        return 'bg-blue-100 text-blue-800';
      case 'lido':
        return 'bg-green-100 text-green-800';
      case 'erro':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'enviado':
        return 'Enviado';
      case 'entregue':
        return 'Entregue';
      case 'lido':
        return 'Lido';
      case 'erro':
        return 'Erro';
      default:
        return status;
    }
  };

  const stats = {
    total: messages.length,
    email: messages.filter(m => m.type === 'email').length,
    whatsapp: messages.filter(m => m.type === 'whatsapp').length,
    read: messages.filter(m => m.status === 'lido').length
  };

  const responseRate = stats.total > 0 ? (stats.read / stats.total * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mensagens</h1>
        <p className="text-gray-600">Histórico de mensagens enviadas aos pacientes</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Enviadas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Smartphone className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">WhatsApp</p>
              <p className="text-2xl font-bold text-gray-900">{stats.whatsapp}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Mail className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">E-mail</p>
              <p className="text-2xl font-bold text-gray-900">{stats.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Eye className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Taxa de Leitura</p>
              <p className="text-2xl font-bold text-gray-900">{responseRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar mensagens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos os tipos</option>
            <option value="email">E-mail</option>
            <option value="whatsapp">WhatsApp</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos os status</option>
            <option value="enviado">Enviado</option>
            <option value="entregue">Entregue</option>
            <option value="lido">Lido</option>
            <option value="erro">Erro</option>
          </select>

          <div className="flex items-center text-sm text-gray-600">
            <Filter className="w-4 h-4 mr-2" />
            {filteredMessages.length} de {messages.length} mensagens
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="divide-y divide-gray-200">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((message) => (
              <div key={message.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getTypeIcon(message.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {message.patientName}
                        </h3>
                        <span className="text-sm text-gray-500 capitalize">
                          via {message.type === 'whatsapp' ? 'WhatsApp' : 'E-mail'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2 line-clamp-2">{message.content}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>
                          Enviado em: {new Date(message.sentAt).toLocaleString('pt-BR')}
                        </span>
                        {message.scheduledFor && (
                          <span>
                            Agendado para: {new Date(message.scheduledFor).toLocaleString('pt-BR')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getStatusColor(message.status)}`}>
                      {getStatusIcon(message.status)}
                      {getStatusLabel(message.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma mensagem encontrada</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}