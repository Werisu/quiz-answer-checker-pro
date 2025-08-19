# 🎯 **Configuração do Sistema de Metas e Desafios**

## 📋 **Passo a Passo para Configurar no Supabase**

### **1. Executar a Migração SQL**

1. Acesse o **Supabase Dashboard** do seu projeto
2. Vá para **SQL Editor**
3. Crie um novo query e cole o seguinte código:

```sql
-- Criar tabela de metas
CREATE TABLE IF NOT EXISTS goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(20) NOT NULL CHECK (type IN ('daily', 'weekly', 'monthly')),
  target INTEGER NOT NULL,
  current INTEGER DEFAULT 0,
  unit VARCHAR(20) NOT NULL CHECK (unit IN ('questions', 'quizzes', 'percentage')),
  caderno_id UUID REFERENCES cadernos(id) ON DELETE SET NULL,
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  points INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de desafios
CREATE TABLE IF NOT EXISTS challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_percentage INTEGER NOT NULL CHECK (target_percentage >= 0 AND target_percentage <= 100),
  caderno_id UUID REFERENCES cadernos(id) ON DELETE CASCADE NOT NULL,
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  current_percentage INTEGER DEFAULT 0,
  points INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para goals
CREATE POLICY "Users can view their own goals" ON goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals" ON goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals" ON goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals" ON goals
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para challenges
CREATE POLICY "Users can view their own challenges" ON challenges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own challenges" ON challenges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own challenges" ON challenges
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own challenges" ON challenges
  FOR DELETE USING (auth.uid() = user_id);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON challenges
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para definir user_id automaticamente
CREATE OR REPLACE FUNCTION set_user_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.user_id = auth.uid();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para definir user_id automaticamente
CREATE TRIGGER set_goals_user_id BEFORE INSERT ON goals
  FOR EACH ROW EXECUTE FUNCTION set_user_id();

CREATE TRIGGER set_challenges_user_id BEFORE INSERT ON challenges
  FOR EACH ROW EXECUTE FUNCTION set_user_id();
```

4. Clique em **Run** para executar

### **2. Verificar se as Tabelas Foram Criadas**

1. Vá para **Table Editor** no Supabase
2. Verifique se as tabelas `goals` e `challenges` foram criadas
3. Verifique se as políticas RLS estão ativas

### **3. Testar a Funcionalidade**

1. Execute a aplicação
2. Faça login
3. Vá para **Metas e Desafios**
4. Tente criar uma nova meta
5. Tente criar um novo desafio

## 🔧 **Funcionalidades Implementadas**

### **✅ Sistema de Metas**

- **Tipos**: Diária, Semanal, Mensal
- **Unidades**: Questões, Quizzes, Porcentagem
- **Cadernos**: Específicos ou todos os cadernos
- **Progresso**: Calculado automaticamente baseado no histórico de quizzes
- **Pontos**: Sistema de gamificação (10, 50, 200 pontos)

### **✅ Sistema de Desafios**

- **Porcentagem**: Meta de performance específica
- **Caderno**: Sempre vinculado a um caderno específico
- **Progresso**: Calculado automaticamente
- **Pontos**: 300 pontos por desafio completado

### **✅ Sistema de Níveis**

- **Iniciante**: 0-99 pontos
- **Estudante**: 100-299 pontos
- **Aplicado**: 300-599 pontos
- **Dedicado**: 600-999 pontos
- **Mestre**: 1000+ pontos

## 🚀 **Próximos Passos**

Após executar a migração SQL, o sistema estará completamente funcional com:

- ✅ **Persistência no banco de dados**
- ✅ **Segurança com RLS**
- ✅ **Sincronização automática**
- ✅ **Cálculo de progresso em tempo real**
- ✅ **Sistema de gamificação completo**

## 🆘 **Solução de Problemas**

### **Erro: "relation does not exist"**

- Verifique se executou a migração SQL corretamente
- Confirme se as tabelas foram criadas no Table Editor

### **Erro: "permission denied"**

- Verifique se as políticas RLS estão ativas
- Confirme se o usuário está autenticado

### **Erro: "foreign key constraint"**

- Verifique se a tabela `cadernos` existe
- Confirme se as referências estão corretas

## 📞 **Suporte**

Se encontrar problemas, verifique:

1. Logs do console do navegador
2. Logs do Supabase
3. Status das tabelas e políticas RLS

