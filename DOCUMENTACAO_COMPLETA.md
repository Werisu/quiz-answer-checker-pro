# 📚 Gabarito Digital - Documentação Completa

## 🎯 Visão Geral do Projeto

O **Gabarito Digital** é uma aplicação web moderna desenvolvida em React.js com TypeScript, projetada para auxiliar estudantes na organização e acompanhamento de seus estudos através de quizzes personalizados, sistema de cadernos por matéria, estatísticas avançadas e metas de estudo.

### ✨ Funcionalidades Principais

- **Sistema de Quizzes**: Criação e gerenciamento de gabaritos personalizados
- **Organização por Cadernos**: Classificação de quizzes por matérias/cadernos
- **Dashboard Personalizado**: Visão geral do progresso e desempenho
- **Sistema de Metas e Desafios**: Gamificação para motivação dos estudos
- **Estatísticas Avançadas**: Análise detalhada do progresso ao longo do tempo
- **Modo Escuro/Claro**: Interface adaptável com tema personalizável
- **Sistema de Autenticação**: Login e cadastro de usuários
- **Painel Administrativo**: Gerenciamento de usuários e sistema

---

## 🏗️ Arquitetura e Tecnologias

### Frontend

- **React.js 18+**: Biblioteca principal para construção da interface
- **TypeScript**: Tipagem estática para maior segurança e produtividade
- **Tailwind CSS**: Framework CSS utility-first para estilização
- **Radix UI**: Componentes acessíveis e customizáveis
- **Lucide React**: Biblioteca de ícones modernos
- **Vite**: Build tool rápido para desenvolvimento

### Backend e Banco de Dados

- **Supabase**: Backend-as-a-Service com PostgreSQL
- **Row Level Security (RLS)**: Controle de acesso granular aos dados
- **Autenticação**: Sistema de login/cadastro integrado
- **Real-time**: Atualizações em tempo real dos dados

### Gerenciamento de Estado

- **React Hooks**: useState, useEffect, useMemo, useCallback
- **Context API**: Gerenciamento global de tema e autenticação
- **Custom Hooks**: Lógica reutilizável para diferentes funcionalidades

---

## 📁 Estrutura do Projeto

```
quiz-answer-checker-pro/
├── src/
│   ├── components/           # Componentes React reutilizáveis
│   │   ├── ui/              # Componentes base (Radix UI)
│   │   ├── Header.tsx       # Cabeçalho com criação de quizzes
│   │   ├── Dashboard.tsx    # Dashboard principal personalizado
│   │   ├── QuestionCard.tsx # Cards de questões individuais
│   │   ├── QuestionTracker.tsx # Rastreador de progresso
│   │   ├── Results.tsx      # Exibição de resultados
│   │   ├── QuizHistory.tsx  # Histórico de quizzes
│   │   ├── AdvancedStats.tsx # Estatísticas avançadas
│   │   ├── GoalsAndChallenges.tsx # Sistema de metas
│   │   ├── AdminPanel.tsx   # Painel administrativo
│   │   ├── ThemeToggle.tsx  # Alternador de tema
│   │   └── ThemeProvider.tsx # Provedor de contexto de tema
│   ├── hooks/               # Custom hooks React
│   │   ├── useAuth.tsx      # Gerenciamento de autenticação
│   │   ├── useQuiz.tsx      # Lógica de quizzes
│   │   ├── useCadernos.tsx  # Gerenciamento de cadernos
│   │   └── useGoalsAndChallenges.tsx # Sistema de metas
│   ├── pages/               # Páginas principais
│   │   ├── Index.tsx        # Página principal com roteamento
│   │   └── NotFound.tsx     # Página 404
│   ├── integrations/        # Integrações externas
│   │   └── supabase/        # Configuração e tipos do Supabase
│   ├── lib/                 # Utilitários e helpers
│   └── index.css            # Estilos globais e variáveis CSS
├── public/                  # Arquivos estáticos
├── supabase/                # Configurações do Supabase
└── package.json             # Dependências e scripts
```

---

## 🚀 Funcionalidades Detalhadas

### 1. Sistema de Quizzes

#### Criação de Quiz

- **Configuração**: Número de questões, nome do PDF, descrição
- **Seleção de Caderno**: Organização por matéria
- **Interface Intuitiva**: Formulário com validação em tempo real

#### Marcação de Respostas

- **Sistema de Legendas**:
  - 🔵 **Círculo**: Não sabe, não responde
  - ⭐ **Estrela**: Tem certeza, responde
  - ❓ **Interrogação**: Em dúvida, mas sabe a matéria
  - ⚠️ **Alerta**: Sabe, mas precisa de mais tempo

#### Salvamento e Histórico

- **Persistência**: Dados salvos no Supabase
- **Rastreamento**: Histórico completo de todos os quizzes
- **Filtros**: Por caderno, período e status

### 2. Sistema de Cadernos

#### Estrutura

```sql
CREATE TABLE cadernos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Funcionalidades

- **Criação**: Novos cadernos por usuário
- **Organização**: Hierarquia de matérias
- **Vinculação**: Quizzes associados a cadernos específicos
- **Gerenciamento**: Edição e exclusão de cadernos

### 3. Dashboard Personalizado

#### Visão Geral

- **Cards de Estatísticas**: Total de quizzes, precisão, frequência, metas ativas
- **Progresso das Metas**: Barra de progresso visual
- **Top Cadernos**: Ranking de desempenho por matéria

#### Abas de Navegação

1. **Visão Geral**: Resumo executivo do progresso
2. **Performance**: Análise detalhada de desempenho
3. **Metas**: Status e progresso das metas de estudo
4. **Insights**: Recomendações inteligentes baseadas no histórico

#### Estatísticas Calculadas

- **Precisão Geral**: Taxa de acerto em todos os quizzes
- **Frequência de Estudo**: Dias ativos e quizzes por dia
- **Performance por Caderno**: Desempenho específico por matéria
- **Tendências**: Evolução do progresso ao longo do tempo

### 4. Sistema de Metas e Desafios

#### Estrutura de Metas

```sql
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50),
  target INTEGER NOT NULL,
  current INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Tipos de Metas

- **Quantitativa**: Número específico de quizzes ou questões
- **Percentual**: Meta de precisão ou frequência
- **Temporal**: Objetivos com prazo definido

#### Sistema de Gamificação

- **Progresso Visual**: Barras de progresso animadas
- **Conquistas**: Badges e marcos de realização
- **Motivação**: Feedback positivo e sugestões

### 5. Estatísticas Avançadas

#### Filtros Disponíveis

- **Período**: Semana, mês, ano
- **Caderno**: Filtro por matéria específica
- **Tipo de Questão**: Corretas, incorretas, pendentes

#### Gráficos e Visualizações

- **Evolução da Performance**: Progresso ao longo do tempo
- **Distribuição de Respostas**: Análise de padrões
- **Atividade Recente**: Timeline de estudos
- **Comparação entre Cadernos**: Análise de dificuldades

### 6. Sistema de Autenticação

#### Funcionalidades

- **Login/Cadastro**: Interface integrada com Supabase
- **Perfis de Usuário**: Diferentes níveis de acesso
- **Segurança**: Row Level Security (RLS) implementado
- **Sessões**: Gerenciamento automático de estado de login

#### Políticas de Segurança

```sql
-- Exemplo de política RLS
CREATE POLICY "Users can only access their own data" ON quiz_results
FOR ALL USING (auth.uid() = user_id);
```

---

## 🎨 Sistema de Temas (Modo Escuro/Claro)

### Implementação Técnica

#### Context API

```typescript
interface ThemeContextType {
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
}
```

#### Variáveis CSS Personalizadas

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96%;
  --border: 214.3 31.8% 91.4%;
}

[data-theme="dark"] {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --border: 217.2 32.6% 17.5%;
}
```

#### Componente ThemeToggle

- **Localização**: Header do Dashboard
- **Funcionalidade**: Alternância entre temas
- **Persistência**: Preferência salva no localStorage
- **Detecção Automática**: Respeita preferência do sistema

### Melhorias de UX/UI no Modo Claro

#### Paleta de Cores Otimizada

- **Slate**: Elementos neutros e textos
- **Blue/Indigo**: Navegação e elementos principais
- **Emerald/Green**: Sucessos e precisão
- **Purple/Violet**: Metas e insights
- **Rose/Pink**: Elementos de destaque
- **Amber/Yellow**: Avisos e conquistas

#### Elementos Visuais

- **Gradientes Suaves**: `from-[color]-50 to-[color]-100`
- **Sombras Elegantes**: `shadow-lg hover:shadow-xl`
- **Bordas Arredondadas**: `rounded-2xl` para elementos principais
- **Transições Suaves**: `transition-all duration-300`

#### Componentes Aprimorados

- **Cards Coloridos**: Cada tipo de informação tem sua identidade visual
- **Tabs Interativos**: Gradientes coloridos quando ativos
- **Botões Temáticos**: Cores específicas para cada funcionalidade
- **Progress Bars**: Altura aumentada e cores temáticas

---

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

#### 1. Usuários (auth.users)

- Gerenciada automaticamente pelo Supabase
- Campos: id, email, created_at, updated_at

#### 2. Cadernos (cadernos)

```sql
CREATE TABLE cadernos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 3. Quizzes (quizzes)

```sql
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  caderno_id UUID REFERENCES cadernos(id),
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 4. Resultados de Quiz (quiz_results)

```sql
CREATE TABLE quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id),
  user_id UUID REFERENCES auth.users(id),
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  wrong_answers INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 5. Metas (goals)

```sql
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50),
  target INTEGER NOT NULL,
  current INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Políticas de Segurança (RLS)

#### Política para Cadernos

```sql
CREATE POLICY "Users can only access their own cadernos" ON cadernos
FOR ALL USING (auth.uid() = user_id);
```

#### Política para Quizzes

```sql
CREATE POLICY "Users can only access their own quizzes" ON quizzes
FOR ALL USING (auth.uid() = user_id);
```

#### Política para Resultados

```sql
CREATE POLICY "Users can only access their own quiz results" ON quiz_results
FOR ALL USING (auth.uid() = user_id);
```

#### Política para Metas

```sql
CREATE POLICY "Users can only access their own goals" ON goals
FOR ALL USING (auth.uid() = user_id);
```

---

## 🔧 Configuração e Instalação

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no Supabase

### Passos de Instalação

#### 1. Clone do Repositório

```bash
git clone [URL_DO_REPOSITORIO]
cd quiz-answer-checker-pro
```

#### 2. Instalação de Dependências

```bash
npm install
```

#### 3. Configuração do Supabase

```bash
# Copie o arquivo .env.example para .env
cp .env.example .env

# Configure as variáveis de ambiente
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

#### 4. Execução das Migrações

```sql
-- Execute no SQL Editor do Supabase
-- 1. Criação da tabela cadernos
-- 2. Criação da tabela goals
-- 3. Configuração das políticas RLS
```

#### 5. Execução da Aplicação

```bash
npm run dev
```

### Scripts Disponíveis

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  }
}
```

---

## 📱 Responsividade e Acessibilidade

### Design Responsivo

- **Mobile First**: Design otimizado para dispositivos móveis
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Grid Flexível**: Layout adaptável em diferentes tamanhos de tela

### Acessibilidade

- **Semântica HTML**: Estrutura semântica adequada
- **ARIA Labels**: Atributos de acessibilidade implementados
- **Navegação por Teclado**: Suporte completo a navegação via teclado
- **Contraste**: Relação de contraste adequada em ambos os temas

---

## 🚀 Funcionalidades Futuras

### Planejadas para Implementação

1. **Gráficos Interativos**: Integração com Recharts para visualizações avançadas
2. **Sistema de Níveis**: Gamificação com pontos e conquistas
3. **Filtros Avançados**: Busca e filtros mais sofisticados
4. **Exportação de Dados**: Relatórios em PDF/Excel
5. **Notificações**: Lembretes e notificações push
6. **Modo Offline**: Funcionalidade offline com sincronização

### Melhorias Técnicas

1. **Testes Automatizados**: Jest e React Testing Library
2. **CI/CD**: Pipeline de deploy automático
3. **Monitoramento**: Logs e métricas de performance
4. **PWA**: Progressive Web App com cache inteligente

---

## 🐛 Solução de Problemas

### Problemas Comuns

#### 1. Erro de Autenticação

```bash
# Verificar configuração do Supabase
# Confirmar variáveis de ambiente
# Verificar políticas RLS
```

#### 2. Dados Não Carregando

```bash
# Verificar conexão com banco
# Confirmar permissões de usuário
# Verificar console do navegador para erros
```

#### 3. Problemas de Tema

```bash
# Limpar localStorage
# Verificar ThemeProvider
# Confirmar variáveis CSS
```

### Debug e Logs

- **Console do Navegador**: Erros JavaScript e requisições
- **Network Tab**: Requisições HTTP e respostas
- **Supabase Dashboard**: Logs de autenticação e queries

---

## 📚 Recursos e Referências

### Documentação Oficial

- [React.js](https://reactjs.org/docs/getting-started.html)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase](https://supabase.com/docs)
- [Radix UI](https://www.radix-ui.com/docs/primitives/overview/introduction)

### Bibliotecas Utilizadas

- [Lucide React](https://lucide.dev/docs/lucide-react)
- [date-fns](https://date-fns.org/docs/Getting-Started)
- [React Router DOM](https://reactrouter.com/docs/en/v6)

### Ferramentas de Desenvolvimento

- [Vite](https://vitejs.dev/guide/)
- [ESLint](https://eslint.org/docs/user-guide/)
- [Prettier](https://prettier.io/docs/en/)

---

## 👥 Contribuição e Desenvolvimento

### Padrões de Código

- **TypeScript**: Tipagem estrita para todos os componentes
- **ESLint**: Linting automático com regras configuradas
- **Prettier**: Formatação automática de código
- **Conventional Commits**: Padrão de mensagens de commit

### Estrutura de Branches

- **main**: Código de produção
- **develop**: Desenvolvimento ativo
- **feature/**: Novas funcionalidades
- **hotfix/**: Correções urgentes

### Processo de Deploy

1. **Desenvolvimento**: Branch feature com testes
2. **Review**: Pull Request com revisão de código
3. **Merge**: Integração na branch develop
4. **Staging**: Testes em ambiente de homologação
5. **Produção**: Deploy na branch main

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 🤝 Suporte e Contato

### Canais de Suporte

- **Issues**: GitHub Issues para bugs e sugestões
- **Discussions**: GitHub Discussions para dúvidas
- **Documentação**: Este arquivo e README.md

### Equipe de Desenvolvimento

- **Desenvolvedor Principal**: [Nome]
- **Contribuidores**: Lista de contribuidores ativos
- **Mantenedores**: Responsáveis pela manutenção

---

_Última atualização: Janeiro 2025_
_Versão da documentação: 1.0.0_
