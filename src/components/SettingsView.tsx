import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Settings, 
  Building, 
  Mail, 
  Phone, 
  MessageSquare,
  Save,
  Check
} from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { ClinicSettings } from '../types';
import toast from 'react-hot-toast';

interface SettingsFormData {
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  emailSignature: string;
  whatsappTemplate: string;
  emailTemplate: string;
}

export function SettingsView() {
  const [settings, setSettings] = useState<ClinicSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'clinic' | 'messages'>('clinic');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SettingsFormData>();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const data = await supabaseService.getClinicSettings();
    if (data) {
      setSettings(data);
      reset({
        name: data.name,
        cnpj: data.cnpj,
        email: data.email,
        phone: data.phone,
        whatsappNumber: data.whatsappNumber,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        emailSignature: data.emailSignature,
        whatsappTemplate: data.whatsappTemplate,
        emailTemplate: data.emailTemplate
      });
    }
  };

  const onSubmit = async (data: SettingsFormData) => {
    setIsLoading(true);
    try {
      await supabaseService.updateClinicSettings(data);
      toast.success('Configurações salvas com sucesso!');
      await loadSettings();
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'clinic', label: 'Dados da Clínica', icon: Building },
    { id: 'messages', label: 'Mensagens', icon: MessageSquare }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">Configure os dados da clínica e templates de mensagens</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'clinic' | 'messages')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          {activeTab === 'clinic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da Clínica *
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: 'Nome da clínica é obrigatório' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CNPJ *
                  </label>
                  <input
                    type="text"
                    {...register('cnpj', { required: 'CNPJ é obrigatório' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="00.000.000/0001-00"
                  />
                  {errors.cnpj && (
                    <p className="mt-1 text-sm text-red-600">{errors.cnpj.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    {...register('email', { 
                      required: 'E-mail é obrigatório',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'E-mail inválido'
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone *
                  </label>
                  <input
                    type="text"
                    {...register('phone', { required: 'Telefone é obrigatório' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(11) 3456-7890"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp *
                  </label>
                  <input
                    type="text"
                    {...register('whatsappNumber', { required: 'WhatsApp é obrigatório' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="5511987654321"
                  />
                  {errors.whatsappNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.whatsappNumber.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CEP
                  </label>
                  <input
                    type="text"
                    {...register('zipCode')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="01234-567"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Endereço
                  </label>
                  <input
                    type="text"
                    {...register('address')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Rua das Flores, 123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cidade
                  </label>
                  <input
                    type="text"
                    {...register('city')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    {...register('state')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione...</option>
                    <option value="SP">São Paulo</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="RS">Rio Grande do Sul</option>
                    <option value="PR">Paraná</option>
                    <option value="SC">Santa Catarina</option>
                    <option value="BA">Bahia</option>
                    <option value="GO">Goiás</option>
                    <option value="PE">Pernambuco</option>
                    <option value="CE">Ceará</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template WhatsApp
                </label>
                <textarea
                  {...register('whatsappTemplate')}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Olá {nome}, é hora do seu check-up de {exame}! Agende sua consulta."
                />
                <p className="mt-1 text-sm text-gray-500">
                  Use {'{nome}'} para o nome do paciente e {'{exame}'} para o tipo de exame
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template E-mail
                </label>
                <textarea
                  {...register('emailTemplate')}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Prezado(a) {nome}, lembramos que está na hora do seu exame de {exame}."
                />
                <p className="mt-1 text-sm text-gray-500">
                  Use {'{nome}'} para o nome do paciente e {'{exame}'} para o tipo de exame
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assinatura E-mail
                </label>
                <input
                  type="text"
                  {...register('emailSignature')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Equipe Clínica Saúde Total"
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Configuração de Integrações</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-800">WhatsApp Business API</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Configurado
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-800">SMTP E-mail</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Configurado
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-6 border-t">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Salvar Configurações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}