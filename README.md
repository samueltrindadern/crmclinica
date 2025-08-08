# CheckUp Fácil - CRM Automatizado para Clínicas

Sistema web completo para gestão automatizada de check-ups e lembretes para clínicas médicas.

## 🚀 Funcionalidades

### ✅ Sistema de Autenticação
- Login seguro com validação
- Recuperação de senha
- Sessão persistente

### 👥 Gestão de Pacientes
- Cadastro completo de pacientes (nome, CPF, telefone, e-mail)
- Tipos de exame (Ginecologia, Cardiologia, Urologia, etc.)
- Perfis de risco (Alto, Moderado, Baixo)
- Cálculo automático de próximo check-up
- Filtros e busca avançada

### 🔔 Sistema de Alertas Automáticos
- Monitoramento contínuo de datas
- Alertas baseados no perfil de risco:
  - **Alto Risco**: 3 meses
  - **Risco Moderado**: 6 meses  
  - **Baixo Risco**: 12 meses
- Lembretes 7 dias antes do vencimento
- Alertas de exames em atraso

### 📱 Integração WhatsApp e E-mail
- Envio automático via WhatsApp Business API
- Envio de e-mails personalizados
- Templates configuráveis
- Rastreamento de status (enviado, entregue, lido)

### 📊 Dashboard e Relatórios
- Métricas em tempo real
- Distribuição de pacientes por risco
- Taxa de resposta aos lembretes
- Histórico completo de mensagens
- Alertas pendentes

### ⚙️ Configurações da Clínica
- Dados da clínica (CNPJ, endereço, contatos)
- Templates personalizáveis
- Configuração de integrações
- Assinatura de e-mails

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Styling**: Tailwind CSS
- **Formulários**: React Hook Form
- **Notificações**: React Hot Toast
- **Ícones**: Lucide React
- **Datas**: date-fns
- **Build**: Vite
- **Database**: PostgreSQL com Row Level Security (RLS)
- **Authentication**: Supabase Auth

## 📋 Dados de Teste

**Configuração Inicial:**
1. Conecte-se ao Supabase clicando em "Connect to Supabase"
2. O sistema criará automaticamente o esquema do banco de dados
3. Dados de exemplo serão inseridos automaticamente
4. Use o sistema de autenticação do Supabase para criar usuários

## 🚀 Como Usar

### 1. Instalação
```bash
npm install
```

### 2. Configuração do Banco de Dados
1. Clique em "Connect to Supabase" no canto superior direito
2. O sistema criará automaticamente todas as tabelas necessárias
3. Dados de exemplo serão inseridos para demonstração

### 3. Executar o Sistema
```bash
npm run dev
```

### 4. Acesso ao Sistema
1. Crie uma conta ou faça login com Supabase Auth
2. Navegue pelo dashboard para ver as métricas
3. Cadastre novos pacientes na seção "Pacientes"
4. Configure os dados da clínica em "Configurações"
5. Monitore alertas e mensagens nas respectivas seções

### 5. Fluxo de Trabalho
1. **Cadastro**: Adicione pacientes com dados completos
2. **Monitoramento**: O sistema calcula automaticamente as datas de retorno
3. **Alertas**: Alertas são criados automaticamente 7 dias antes
4. **Envio**: Mensagens são enviadas via WhatsApp e e-mail
5. **Acompanhamento**: Monitore o status das mensagens e respostas

## 📱 Funcionalidades por Tela

### Dashboard
- Visão geral com métricas principais
- Cards de estatísticas
- Distribuição de pacientes por risco
- Alertas recentes

### Pacientes
- Lista completa com filtros
- Cadastro/edição de pacientes
- Cálculo automático de próximo check-up
- Status ativo/inativo

### Alertas
- Lista de alertas pendentes
- Envio manual de lembretes
- Métricas de alertas
- Filtros por tipo e status

### Mensagens
- Histórico completo de mensagens
- Status de entrega e leitura
- Filtros por canal (WhatsApp/E-mail)
- Taxa de resposta

### Configurações
- Dados da clínica
- Templates de mensagens
- Configuração de integrações
- Personalização de assinaturas

## 🔧 Configuração de Produção

### Variáveis de Ambiente
```env
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_supabase
```

### Deploy
O sistema está pronto para deploy em:
- Vercel
- Netlify
- Heroku
- AWS
- Qualquer provedor que suporte React

### Integrações Necessárias
1. **Supabase** - Banco de dados e autenticação (já configurado)
2. **WhatsApp Business API** - Para envio real de mensagens
3. **SMTP/SendGrid** - Para envio real de e-mails
4. **Cron Jobs/Edge Functions** - Para monitoramento automático

## 📞 Suporte

Sistema desenvolvido para uso imediato em clínicas médicas. Todas as funcionalidades estão implementadas e testadas.

**Características:**
- ✅ Interface responsiva (desktop e mobile)
- ✅ Banco de dados real (Supabase/PostgreSQL)
- ✅ Autenticação segura com RLS
- ✅ Validação completa de formulários
- ✅ Sistema de notificações
- ✅ Dados persistentes
- ✅ Triggers automáticos no banco
- ✅ Cálculos automáticos
- ✅ Filtros e buscas
- ✅ Design profissional
- ✅ Pronto para produção

---

**CheckUp Fácil** - Automatize os lembretes da sua clínica e nunca mais perca um paciente por falta de retorno!