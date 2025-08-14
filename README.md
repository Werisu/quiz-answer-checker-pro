# EstudaPro 🎯

Um sistema moderno e completo para preparação de concursos públicos, desenvolvido com tecnologias web atuais e focado em transformar o estudo em uma experiência gamificada e eficiente.

## 🚀 Funcionalidades Principais

### 📚 **Sistema de Cadernos (Matérias)**

- **Organização por Matérias**: Classifique quizzes por cadernos como Direito Constitucional, Direito Administrativo, Português, Raciocínio Lógico, Informática, etc.
- **Gestão de Cadernos**: Crie, edite e delete cadernos personalizados
- **Filtros Inteligentes**: Filtre histórico de quizzes por caderno específico
- **Vinculação Automática**: Cada quiz pode ser associado a um caderno específico

### 🧠 **Geração de Questões**

- **IA Integrada**: Geração automática de questões baseadas em prompts personalizados
- **Personalização**: Adicione nome e descrição aos quizzes
- **Verificação Inteligente**: Sistema de correção automática com feedback detalhado
- **Histórico Completo**: Acompanhe todos os quizzes realizados

### 📊 **Sistema de Estatísticas Avançadas**

- **Gráficos Interativos**: Visualize progresso ao longo do tempo com gráficos de linha
- **Análise por Caderno**: Compare performance entre diferentes matérias
- **Filtros Temporais**: Analise dados por período (7 dias, 30 dias, 3 meses, 1 ano)
- **Métricas Detalhadas**:
  - Taxa de acerto por matéria
  - Progresso temporal
  - Análise de dificuldade
  - Comparação entre cadernos
  - Estatísticas gerais com tendências

### 🎯 **Sistema de Metas e Desafios**

- **Metas Personalizáveis**: Crie metas diárias, semanais ou mensais
- **Tipos de Metas**: Questões resolvidas, quizzes completados ou porcentagem de acerto
- **Desafios por Matéria**: Desafios específicos para cada caderno
- **Gamificação**: Sistema de pontos, níveis e conquistas
- **Progresso Automático**: Cálculo automático baseado no histórico real
- **Níveis de Usuário**:
  - 🌱 Iniciante (0-99 pts)
  - 📚 Estudante (100-299 pts)
  - 🎯 Aplicado (300-599 pts)
  - 🏆 Dedicado (600-999 pts)
  - 👑 Mestre (1000+ pts)

### 🔐 **Sistema de Autenticação**

- **Login Seguro**: Autenticação via Supabase
- **Perfis de Usuário**: Dados personalizados e histórico individual
- **Painel Administrativo**: Gestão de usuários e cadernos

## 🛠️ Tecnologias Utilizadas

### **Frontend**

- **React 18** - Biblioteca para interfaces de usuário
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Build tool rápida e moderna
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes de UI modernos e acessíveis
- **Radix UI** - Componentes primitivos acessíveis
- **Lucide React** - Ícones modernos e consistentes
- **Recharts** - Biblioteca de gráficos para React
- **date-fns** - Utilitários para manipulação de datas

### **Backend & Banco de Dados**

- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Banco de dados relacional
- **Row Level Security (RLS)** - Segurança em nível de linha
- **Autenticação Supabase** - Sistema de auth integrado

### **Ferramentas de Desenvolvimento**

- **ESLint** - Linting de código
- **Prettier** - Formatação de código
- **Git** - Controle de versão

## 📋 Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **npm** ou **bun**
- **Conta no Supabase** para backend

## 🔧 Instalação e Configuração

### 1. **Clone o Repositório**

```bash
git clone https://github.com/seu-usuario/estudapro.git
cd estudapro
```

### 2. **Instale as Dependências**

```bash
npm install
# ou
bun install
```

### 3. **Configure o Supabase**

#### **3.1 Crie um Projeto no Supabase**

- Acesse [supabase.com](https://supabase.com)
- Crie um novo projeto
- Anote a URL e chave anônima

#### **3.2 Configure as Variáveis de Ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

#### **3.3 Execute as Migrações SQL**

No SQL Editor do Supabase, execute os seguintes scripts:

**Tabela de Cadernos:**

```sql
-- Criar tabela cadernos
CREATE TABLE IF NOT EXISTS cadernos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar caderno_id à tabela quizzes
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS caderno_id UUID REFERENCES cadernos(id) ON DELETE SET NULL;

-- Habilitar RLS
ALTER TABLE cadernos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para cadernos
CREATE POLICY "Usuários podem ver seus próprios cadernos" ON cadernos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios cadernos" ON cadernos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios cadernos" ON cadernos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios cadernos" ON cadernos
  FOR DELETE USING (auth.uid() = user_id);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
CREATE TRIGGER update_cadernos_updated_at BEFORE UPDATE ON cadernos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para definir user_id automaticamente
CREATE OR REPLACE FUNCTION set_user_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.user_id = auth.uid();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para definir user_id
CREATE TRIGGER set_cadernos_user_id BEFORE INSERT ON cadernos
  FOR EACH ROW EXECUTE FUNCTION set_user_id();
```

**Tabelas de Metas e Desafios:**

```sql
-- Criar tabela goals
CREATE TABLE IF NOT EXISTS goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL CHECK (type IN ('daily', 'weekly', 'monthly')),
  target INTEGER NOT NULL,
  current INTEGER DEFAULT 0,
  unit VARCHAR(50) NOT NULL CHECK (unit IN ('questions', 'quizzes', 'percentage')),
  caderno_id UUID REFERENCES cadernos(id) ON DELETE SET NULL,
  deadline TIMESTAMP WITH TIME ZONE,
  completed BOOLEAN DEFAULT FALSE,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela challenges
CREATE TABLE IF NOT EXISTS challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_percentage INTEGER NOT NULL CHECK (target_percentage >= 0 AND target_percentage <= 100),
  caderno_id UUID REFERENCES cadernos(id) ON DELETE CASCADE,
  deadline TIMESTAMP WITH TIME ZONE,
  completed BOOLEAN DEFAULT FALSE,
  current_percentage INTEGER DEFAULT 0,
  points INTEGER DEFAULT 300,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para goals
CREATE POLICY "Usuários podem ver suas próprias metas" ON goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar suas próprias metas" ON goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias metas" ON goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias metas" ON goals
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para challenges
CREATE POLICY "Usuários podem ver seus próprios desafios" ON challenges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios desafios" ON challenges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios desafios" ON challenges
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios desafios" ON challenges
  FOR DELETE USING (auth.uid() = user_id);

-- Triggers para updated_at
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON challenges
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers para user_id
CREATE TRIGGER set_goals_user_id BEFORE INSERT ON goals
  FOR EACH ROW EXECUTE FUNCTION set_user_id();

CREATE TRIGGER set_challenges_user_id BEFORE INSERT ON challenges
  FOR EACH ROW EXECUTE FUNCTION set_user_id();
```

### 4. **Inicie o Servidor de Desenvolvimento**

```bash
npm run dev
# ou
bun dev
```

A aplicação estará disponível em `http://localhost:8081`

## 🏗️ Estrutura do Projeto

```
estudapro/
├── src/
│   ├── components/           # Componentes React
│   │   ├── ui/              # Componentes de UI (shadcn/ui)
│   │   ├── Header.tsx       # Cabeçalho com seleção de caderno
│   │   ├── QuestionCard.tsx # Card de questão individual
│   │   ├── QuizHistory.tsx  # Histórico de quizzes com filtros
│   │   ├── AdvancedStats.tsx # Estatísticas avançadas e gráficos
│   │   ├── GoalsAndChallenges.tsx # Sistema de metas e desafios
│   │   ├── AdminPanel.tsx   # Painel administrativo
│   │   └── CadernoManager.tsx # Gerenciador de cadernos
│   ├── hooks/               # Hooks customizados
│   │   ├── useAuth.tsx      # Hook de autenticação
│   │   ├── useQuiz.tsx      # Hook de gerenciamento de quizzes
│   │   ├── useCadernos.tsx  # Hook de gerenciamento de cadernos
│   │   └── useGoalsAndChallenges.tsx # Hook de metas e desafios
│   ├── integrations/        # Integrações externas
│   │   └── supabase/        # Cliente e tipos do Supabase
│   ├── pages/               # Páginas da aplicação
│   │   ├── Index.tsx        # Página principal
│   │   └── NotFound.tsx     # Página 404
│   └── lib/                 # Utilitários e helpers
├── supabase/                # Configurações do Supabase
├── public/                  # Arquivos estáticos
└── package.json             # Dependências e scripts
```

## 🎯 Como Usar

### **1. Primeiro Acesso**

- Faça login na aplicação
- Crie seus primeiros cadernos (matérias)
- Configure suas metas e desafios

### **2. Criando Quizzes**

- Selecione um caderno no cabeçalho
- Digite o prompt para geração de questões
- Adicione nome e descrição ao quiz
- Gere e responda as questões

### **3. Acompanhando Progresso**

- **Histórico**: Veja todos os quizzes realizados
- **Estatísticas**: Analise gráficos de progresso
- **Metas**: Acompanhe suas metas e desafios
- **Filtros**: Use filtros por caderno e período

### **4. Sistema de Metas**

- **Metas Diárias**: Ex: "Resolver 20 questões por dia"
- **Metas Semanais**: Ex: "Completar 5 quizzes por semana"
- **Metas Mensais**: Ex: "Atingir 85% de acerto no mês"
- **Desafios**: Ex: "Atingir 90% em Direito Constitucional"

## 🔍 Funcionalidades Detalhadas

### **Sistema de Cadernos**

- Organize seus estudos por matéria
- Filtre histórico e estatísticas por caderno
- Crie cadernos personalizados com descrições

### **Estatísticas Avançadas**

- **Gráficos de Progresso**: Visualize evolução ao longo do tempo
- **Análise por Matéria**: Compare performance entre cadernos
- **Filtros Temporais**: Analise períodos específicos
- **Métricas de Dificuldade**: Identifique pontos fortes e fracos

### **Gamificação**

- **Sistema de Pontos**: Ganhe pontos ao completar metas
- **Níveis de Usuário**: Evolua de Iniciante a Mestre
- **Conquistas**: Desbloqueie novos níveis
- **Progresso Visual**: Barras de progresso e indicadores

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build de produção

# Qualidade de Código
npm run lint         # Executa ESLint
npm run type-check   # Verifica tipos TypeScript

# Dependências
npm install          # Instala dependências
npm update           # Atualiza dependências
```

## 🤝 Contribuindo

1. **Fork** o projeto
2. **Clone** seu fork: `git clone https://github.com/seu-usuario/estudapro.git`
3. **Crie** uma branch: `git checkout -b feature/NovaFuncionalidade`
4. **Faça commit**: `git commit -m 'Adiciona nova funcionalidade'`
5. **Push**: `git push origin feature/NovaFuncionalidade`
6. **Abra** um Pull Request

### **Padrões de Código**

- Use TypeScript para tipagem
- Siga as convenções do ESLint
- Escreva testes para novas funcionalidades
- Documente APIs e componentes

## 🐛 Solução de Problemas

### **Erro de Conexão com Supabase**

- Verifique as variáveis de ambiente
- Confirme se o projeto está ativo
- Verifique as políticas RLS

### **Problemas de Build**

- Limpe o cache: `rm -rf node_modules/.vite`
- Reinstale dependências: `npm install`
- Verifique versão do Node.js

### **Erros de Banco de Dados**

- Execute as migrações SQL
- Verifique as políticas RLS
- Confirme a estrutura das tabelas

## 📱 Compatibilidade

- **Navegadores**: Chrome, Firefox, Safari, Edge (versões modernas)
- **Dispositivos**: Desktop, Tablet, Mobile (responsivo)
- **Sistemas**: Windows, macOS, Linux

## 🔒 Segurança

- **Autenticação**: Supabase Auth com JWT
- **RLS**: Row Level Security para isolamento de dados
- **HTTPS**: Comunicação criptografada
- **Validação**: Validação de entrada em todos os formulários

## 📈 Roadmap

### **Versão 1.1** (Próxima)

- [ ] Sistema de notificações
- [ ] Exportação de relatórios
- [ ] Modo offline
- [ ] Temas personalizáveis

### **Versão 1.2**

- [ ] Integração com calendário
- [ ] Sistema de grupos de estudo
- [ ] API pública
- [ ] Mobile app nativo

### **Versão 2.0**

- [ ] Machine Learning para recomendações
- [ ] Sistema de competição
- [ ] Integração com LMS
- [ ] Analytics avançados

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📧 Contato e Suporte

- **GitHub Issues**: [Reporte bugs e solicite features](https://github.com/seu-usuario/estudapro/issues)
- **Email**: seu-email@exemplo.com
- **Twitter**: [@seu_twitter](https://twitter.com/seu_twitter)

## 🙏 Agradecimentos

- **Supabase** pela infraestrutura backend
- **shadcn/ui** pelos componentes de UI
- **Vite** pela ferramenta de build
- **Tailwind CSS** pelo framework CSS
- **Comunidade React** pelo ecossistema

---

**⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!**

**🎯 EstudaPro - Transformando o estudo em uma experiência gamificada e eficiente!**
