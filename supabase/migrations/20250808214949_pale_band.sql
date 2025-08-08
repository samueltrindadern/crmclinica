/*
  # Esquema inicial do CheckUp Fácil

  1. Novas Tabelas
    - `clinics` - Dados das clínicas
    - `users` - Usuários do sistema
    - `patients` - Pacientes cadastrados
    - `alerts` - Alertas automáticos
    - `messages` - Histórico de mensagens enviadas

  2. Segurança
    - Habilita RLS em todas as tabelas
    - Políticas para usuários autenticados
    - Controle de acesso por clínica

  3. Funcionalidades
    - Triggers para cálculo automático de próximo check-up
    - Índices para performance
    - Constraints para integridade dos dados
*/

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de clínicas
CREATE TABLE IF NOT EXISTS clinics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  cnpj text UNIQUE NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  whatsapp_number text NOT NULL,
  address text DEFAULT '',
  city text DEFAULT '',
  state text DEFAULT '',
  zip_code text DEFAULT '',
  logo text DEFAULT '',
  email_signature text DEFAULT 'Equipe da Clínica',
  whatsapp_template text DEFAULT 'Olá {nome}, é hora do seu check-up de {exame}! Agende sua consulta.',
  email_template text DEFAULT 'Prezado(a) {nome}, lembramos que está na hora do seu exame de {exame}.',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  clinic_id uuid REFERENCES clinics(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de pacientes
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid REFERENCES clinics(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  cpf text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  exam_type text NOT NULL,
  last_exam_date date NOT NULL,
  risk_profile text NOT NULL CHECK (risk_profile IN ('baixo', 'moderado', 'alto')),
  next_checkup_date date NOT NULL,
  status text DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(clinic_id, cpf)
);

-- Tabela de alertas
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid REFERENCES clinics(id) ON DELETE CASCADE NOT NULL,
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  patient_name text NOT NULL,
  type text NOT NULL CHECK (type IN ('checkup_reminder', 'overdue', 'urgent')),
  message text NOT NULL,
  scheduled_for timestamptz NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  created_at timestamptz DEFAULT now()
);

-- Tabela de mensagens
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid REFERENCES clinics(id) ON DELETE CASCADE NOT NULL,
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  patient_name text NOT NULL,
  type text NOT NULL CHECK (type IN ('email', 'whatsapp')),
  content text NOT NULL,
  status text DEFAULT 'enviado' CHECK (status IN ('enviado', 'entregue', 'lido', 'erro')),
  sent_at timestamptz DEFAULT now(),
  scheduled_for timestamptz DEFAULT NULL
);

-- Função para calcular próximo check-up
CREATE OR REPLACE FUNCTION calculate_next_checkup(last_exam date, risk text)
RETURNS date AS $$
BEGIN
  CASE risk
    WHEN 'alto' THEN RETURN last_exam + INTERVAL '3 months';
    WHEN 'moderado' THEN RETURN last_exam + INTERVAL '6 months';
    WHEN 'baixo' THEN RETURN last_exam + INTERVAL '12 months';
    ELSE RETURN last_exam + INTERVAL '12 months';
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar próximo check-up automaticamente
CREATE OR REPLACE FUNCTION update_next_checkup()
RETURNS TRIGGER AS $$
BEGIN
  NEW.next_checkup_date := calculate_next_checkup(NEW.last_exam_date, NEW.risk_profile);
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER patients_update_checkup
  BEFORE INSERT OR UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION update_next_checkup();

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER clinics_updated_at
  BEFORE UPDATE ON clinics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_patients_clinic_id ON patients(clinic_id);
CREATE INDEX IF NOT EXISTS idx_patients_next_checkup ON patients(next_checkup_date);
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);
CREATE INDEX IF NOT EXISTS idx_alerts_clinic_id ON alerts(clinic_id);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_scheduled ON alerts(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_messages_clinic_id ON messages(clinic_id);
CREATE INDEX IF NOT EXISTS idx_messages_patient_id ON messages(patient_id);

-- Habilitar RLS
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para clinics
CREATE POLICY "Users can read own clinic data"
  ON clinics
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT clinic_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update own clinic data"
  ON clinics
  FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT clinic_id FROM users WHERE id = auth.uid()
    )
  );

-- Políticas RLS para users
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- Políticas RLS para patients
CREATE POLICY "Users can manage clinic patients"
  ON patients
  FOR ALL
  TO authenticated
  USING (
    clinic_id IN (
      SELECT clinic_id FROM users WHERE id = auth.uid()
    )
  );

-- Políticas RLS para alerts
CREATE POLICY "Users can manage clinic alerts"
  ON alerts
  FOR ALL
  TO authenticated
  USING (
    clinic_id IN (
      SELECT clinic_id FROM users WHERE id = auth.uid()
    )
  );

-- Políticas RLS para messages
CREATE POLICY "Users can manage clinic messages"
  ON messages
  FOR ALL
  TO authenticated
  USING (
    clinic_id IN (
      SELECT clinic_id FROM users WHERE id = auth.uid()
    )
  );

-- Inserir dados iniciais
INSERT INTO clinics (
  id,
  name,
  cnpj,
  email,
  phone,
  whatsapp_number,
  address,
  city,
  state,
  zip_code,
  email_signature,
  whatsapp_template,
  email_template
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'Clínica Saúde Total',
  '12.345.678/0001-90',
  'contato@saudetotal.com.br',
  '(11) 3456-7890',
  '5511987654321',
  'Rua das Flores, 123',
  'São Paulo',
  'SP',
  '01234-567',
  'Equipe Clínica Saúde Total',
  'Olá {nome}, é hora do seu check-up de {exame}! Agende sua consulta conosco.',
  'Prezado(a) {nome}, lembramos que está na hora do seu exame de {exame}. Entre em contato para agendar.'
) ON CONFLICT (cnpj) DO NOTHING;

-- Inserir pacientes de exemplo
INSERT INTO patients (
  clinic_id,
  name,
  cpf,
  phone,
  email,
  exam_type,
  last_exam_date,
  risk_profile,
  status
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Maria Silva',
  '123.456.789-01',
  '(11) 99999-1111',
  'maria@email.com',
  'Ginecologia',
  '2024-01-15',
  'alto',
  'ativo'
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'João Santos',
  '987.654.321-02',
  '(11) 99999-2222',
  'joao@email.com',
  'Cardiologia',
  '2023-12-10',
  'moderado',
  'ativo'
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Carlos Oliveira',
  '456.789.123-03',
  '(11) 99999-3333',
  'carlos@email.com',
  'Urologia',
  '2023-11-20',
  'baixo',
  'ativo'
) ON CONFLICT (clinic_id, cpf) DO NOTHING;