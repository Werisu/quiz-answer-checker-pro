# Sistema de Tags Personalizadas - Documentação Completa

## 📋 Visão Geral

O sistema de tags personalizadas permite organizar e categorizar cadernos, quizzes e metas de estudo de forma flexível e intuitiva. As tags são visuais, coloridas e podem ser aplicadas a múltiplas entidades para facilitar a organização e busca.

## ✨ Funcionalidades Principais

### 🏷️ **Criação e Gerenciamento de Tags**

- **Criação**: Tags personalizadas com nome, cor e descrição
- **Edição**: Modificação de propriedades existentes
- **Exclusão**: Remoção segura com confirmação
- **Cores**: Sistema de cores personalizáveis para identificação visual

### 🔗 **Aplicação de Tags**

- **Cadernos**: Organização por matéria e subtópicos
- **Quizzes**: Categorização por tipo de conteúdo
- **Metas**: Agrupamento por área de estudo
- **Múltiplas Tags**: Até 5 tags por entidade

### 🔍 **Filtros e Busca**

- **Filtro por Tag**: Busca de entidades por tags específicas
- **Filtro por Caderno**: Combinação de filtros de caderno e tag
- **Busca Inteligente**: Interface de comando para seleção rápida

## 🚀 Como Usar

### **1. Criando Tags**

1. Acesse o **Dashboard** → Aba **"Tags"**
2. Clique em **"Nova Tag"**
3. Preencha:
   - **Nome**: Identificador da tag (ex: "Direito Constitucional")
   - **Cor**: Cor visual para identificação
   - **Descrição**: Explicação opcional da tag
4. Clique em **"Criar Tag"**

### **2. Aplicando Tags aos Cadernos**

#### **Ao Criar um Novo Caderno:**

1. Vá para **Dashboard** → **Admin** → **Cadernos**
2. Clique em **"Novo Caderno"**
3. Preencha nome e descrição
4. Use o **TagSelector** para escolher tags
5. Clique em **"Criar"**

#### **Ao Editar um Caderno Existente:**

1. Clique no botão **"Editar"** do caderno
2. Use o **TagSelector** para modificar tags
3. Clique em **"Salvar"**

### **3. Aplicando Tags aos Quizzes**

1. **Crie um novo quiz** no Header
2. **Selecione um caderno** (as tags do caderno serão automaticamente aplicadas)
3. **Adicione tags específicas** se necessário
4. **Inicie o quiz**

### **4. Visualizando e Filtrando por Tags**

#### **No Dashboard:**

- Aba **"Tags"** mostra todas as tags com contadores
- Filtros por tipo de entidade (Cadernos, Quizzes, Metas)

#### **No Histórico de Quizzes:**

- **Filtro por Tag**: Selecione uma tag específica
- **Filtro por Caderno**: Combine com filtros de caderno
- **Visualização**: Tags são exibidas em cada quiz

#### **Nos Resultados:**

- Tags do quiz são mostradas junto com informações do caderno
- Interface visual clara com cores das tags

## 🧩 Componentes Técnicos

### **Hooks Principais**

#### **`useTags`**

```typescript
const {
  tags,
  createTag,
  updateTag,
  deleteTag,
  addTagToCaderno,
  removeTagFromCaderno,
  getCadernoTags,
  // ... outras funções
} = useTags();
```

**Funcionalidades:**

- Gerenciamento completo de tags
- Relacionamentos com entidades
- Cache e sincronização automática

### **Componentes de Interface**

#### **`TagManager`**

- **Localização**: Dashboard → Aba "Tags"
- **Função**: Criação, edição e exclusão de tags
- **Recursos**: Visualização de estatísticas de uso

#### **`TagSelector`**

- **Uso**: Seleção de tags em formulários
- **Recursos**:
  - Busca e filtro
  - Criação rápida de novas tags
  - Seleção múltipla
  - Validação de limite

#### **`TagDisplay`**

- **Uso**: Exibição de tags em listas e cards
- **Recursos**:
  - Múltiplos tamanhos (sm, md, lg)
  - Opção de remoção
  - Cores personalizadas
  - Responsivo

## 🔧 Integrações Implementadas

### **1. CadernoManager**

- **TagSelector** para criação/edição de cadernos
- **TagDisplay** para mostrar tags existentes
- Sincronização automática de tags

### **2. Header (Criação de Quizzes)**

- **TagSelector** para seleção de tags
- Carregamento automático de tags do caderno
- Interface visual das tags selecionadas

### **3. QuizHistory**

- **TagDisplay** para mostrar tags de cada quiz
- **Filtro por tag** combinado com filtro de caderno
- Carregamento assíncrono de tags

### **4. Results**

- **TagDisplay** para mostrar tags do quiz
- Informações do caderno e tags
- Interface visual melhorada

### **5. Dashboard**

- Nova aba **"Tags"** com TagManager
- Estatísticas de tags no overview
- Integração completa com o sistema

## 📊 Estrutura do Banco de Dados

### **Tabelas Principais**

```sql
-- Tabela de tags
CREATE TABLE tags (
  id UUID PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  color VARCHAR(7) NOT NULL,
  description TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Relacionamentos
CREATE TABLE caderno_tags (caderno_id, tag_id);
CREATE TABLE quiz_tags (quiz_id, tag_id);
CREATE TABLE goal_tags (goal_id, tag_id);
```

### **Relacionamentos**

- **1:N**: Uma tag pode ser aplicada a múltiplas entidades
- **N:1**: Uma entidade pode ter múltiplas tags
- **RLS**: Usuários só veem suas próprias tags

## 🎨 Interface do Usuário

### **Paleta de Cores**

- **Azul**: Tags padrão (#3b82f6)
- **Verde**: Tags de sucesso
- **Vermelho**: Tags de atenção
- **Amarelo**: Tags de destaque
- **Roxo**: Tags especiais

### **Componentes Visuais**

- **Badges**: Exibição compacta de tags
- **Chips**: Visualização colorida
- **Popover**: Seleção e busca
- **Dialog**: Criação e edição

## 📱 Responsividade

### **Mobile First**

- **TagSelector**: Adaptável para telas pequenas
- **TagDisplay**: Layout flexível
- **Filtros**: Empilhamento vertical em mobile

### **Desktop**

- **Layout horizontal** para filtros
- **Grid responsivo** para exibição
- **Hover effects** para interação

## 🔒 Segurança e Performance

### **Row Level Security (RLS)**

- Usuários só acessam suas próprias tags
- Políticas de inserção, seleção e atualização
- Validação de propriedade em todas as operações

### **Otimizações**

- **Cache local** para tags frequentemente usadas
- **Carregamento assíncrono** de relacionamentos
- **Debounce** em operações de busca
- **Memoização** de componentes pesados

## 🚀 Melhorias Futuras

### **Funcionalidades Planejadas**

- **Tags aninhadas**: Hierarquia de tags
- **Tags inteligentes**: Sugestões automáticas
- **Importação/Exportação**: Backup de configurações
- **Templates**: Conjuntos pré-definidos de tags

### **Integrações Adicionais**

- **Sistema de busca**: Busca por tags em todo o conteúdo
- **Relatórios**: Análise de uso de tags
- **Sincronização**: Tags compartilhadas entre usuários
- **API**: Endpoints para integração externa

## 🐛 Solução de Problemas

### **Problemas Comuns**

#### **Tag não aparece**

- Verifique se a tag foi criada corretamente
- Confirme se está associada à entidade
- Recarregue a página

#### **Erro ao criar tag**

- Verifique se o nome é único para o usuário
- Confirme se todos os campos obrigatórios estão preenchidos
- Verifique a conexão com o banco

#### **Tags não sincronizam**

- Aguarde alguns segundos para sincronização
- Verifique se há erros no console
- Tente recarregar a página

### **Logs e Debug**

- **Console**: Mensagens de erro detalhadas
- **Network**: Verificar chamadas à API
- **Database**: Consultar tabelas diretamente

## 📚 Exemplos de Uso

### **Cenário 1: Organização por Matéria**

```
Tag: "Direito Constitucional" (Azul)
- Caderno: "Direito Constitucional"
- Quizzes: "CF/88 - Princípios", "CF/88 - Direitos"
- Metas: "Dominar CF/88"
```

### **Cenário 2: Organização por Dificuldade**

```
Tag: "Avançado" (Vermelho)
- Quizzes: "Questões Complexas", "Casos Difíceis"
- Metas: "Resolver 100 questões avançadas"
```

### **Cenário 3: Organização por Prioridade**

```
Tag: "Urgente" (Amarelo)
- Cadernos: "Revisão Final"
- Quizzes: "Simulado Final"
- Metas: "Revisar em 1 semana"
```

## 🤝 Contribuição

### **Padrões de Código**

- **TypeScript**: Tipagem estrita
- **React Hooks**: Hooks customizados
- **Tailwind CSS**: Classes utilitárias
- **Shadcn/UI**: Componentes base

### **Estrutura de Arquivos**

```
src/
├── components/
│   ├── TagManager.tsx      # Gerenciamento de tags
│   ├── TagSelector.tsx     # Seleção de tags
│   ├── TagDisplay.tsx      # Exibição de tags
│   └── ...
├── hooks/
│   └── useTags.tsx         # Lógica de tags
└── integrations/
    └── supabase/
        └── migrations/     # Schema do banco
```

---

**Sistema de Tags v1.0** - Organize seus estudos de forma inteligente e visual! 🎯
