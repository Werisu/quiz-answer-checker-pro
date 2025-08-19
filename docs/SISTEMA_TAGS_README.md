# 🏷️ Sistema de Tags Personalizadas - EstudaPro

## 📋 Visão Geral

O sistema de tags personalizadas permite organizar e categorizar seus estudos de forma eficiente. Você pode criar tags coloridas e aplicá-las a cadernos, quizzes e metas para melhor organização e busca.

## ✨ Funcionalidades Principais

### 🎨 Criação de Tags

- **Nome personalizado**: Até 50 caracteres
- **Cores personalizadas**: 10 cores predefinidas + seletor de cor personalizada
- **Descrição opcional**: Adicione contexto sobre o propósito da tag
- **Validação**: Nomes únicos por usuário

### 🔗 Aplicação de Tags

- **Cadernos**: Organize matérias por temas
- **Quizzes**: Categorize por dificuldade, assunto ou prioridade
- **Metas**: Agrupe objetivos relacionados

### 📊 Gerenciamento

- **Edição**: Modifique nome, cor e descrição
- **Remoção**: Delete tags não utilizadas
- **Visualização**: Veja estatísticas de uso por categoria

## 🚀 Como Usar

### 1. Criando Sua Primeira Tag

1. Acesse o **Dashboard** → aba **Tags**
2. Clique em **"Nova Tag"**
3. Preencha:
   - **Nome**: Ex: "Importante", "Revisar", "Fácil"
   - **Descrição**: Opcional, para contexto
   - **Cor**: Escolha entre cores predefinidas ou personalizada
4. Clique em **"Criar Tag"**

### 2. Aplicando Tags

#### Em Cadernos:

- Use o **TagSelector** para adicionar/remover tags
- As tags aparecem visualmente no caderno
- Filtre cadernos por tags específicas

#### Em Quizzes:

- Selecione tags relevantes ao criar/editar quizzes
- Organize por dificuldade, matéria ou prioridade
- Facilite a busca por conteúdo específico

#### Em Metas:

- Agrupe metas relacionadas com tags
- Visualize progresso por categoria
- Mantenha foco em objetivos específicos

### 3. Gerenciando Tags

- **Editar**: Clique no ícone de edição (✏️)
- **Remover**: Clique no ícone de lixeira (🗑️)
- **Visualizar**: Veja estatísticas de uso em cada aba

## 🎯 Exemplos de Uso

### 📚 Organização por Matéria

```
🔵 Matemática
🔴 Física
🟢 Química
🟡 Biologia
```

### 📝 Organização por Prioridade

```
🔴 Urgente - Revisar antes da prova
🟡 Importante - Estudar esta semana
🟢 Normal - Revisar quando possível
```

### 🎯 Organização por Status

```
🟢 Concluído
🟡 Em andamento
🔴 Pendente
🟣 Revisar
```

## 🛠️ Componentes Técnicos

### Hooks

- **`useTags`**: Gerenciamento completo de tags
- **Operações CRUD**: Criar, ler, atualizar, deletar
- **Relacionamentos**: Conectar tags a entidades

### Componentes

- **`TagManager`**: Interface principal de gerenciamento
- **`TagSelector`**: Seletor de tags para entidades
- **`TagDisplay`**: Exibição visual de tags
- **`TagViewer`**: Visualização somente leitura

### Banco de Dados

- **Tabela `tags`**: Armazena informações das tags
- **Tabelas de relacionamento**: Conectam tags a entidades
- **RLS**: Segurança por usuário
- **Índices**: Performance otimizada

## 📱 Interface do Usuário

### Dashboard - Aba Tags

- **Visão geral**: Todas as tags criadas
- **Filtros**: Por tipo de uso (cadernos, quizzes, metas)
- **Estatísticas**: Contadores de uso por tag
- **Ações**: Criar, editar, remover

### Seleção de Tags

- **Popover**: Interface compacta para seleção
- **Busca**: Filtre tags por nome
- **Criação rápida**: Crie tags diretamente do seletor
- **Visualização**: Cores e nomes claros

### Exibição de Tags

- **Badges coloridos**: Visual atrativo e informativo
- **Tamanhos**: Pequeno, médio e grande
- **Interatividade**: Clique para ações (quando aplicável)
- **Responsividade**: Adapta-se a diferentes telas

## 🔧 Configuração

### Migração do Banco

```sql
-- Execute a migração para criar as tabelas
-- Arquivo: src/integrations/supabase/migrations/20240322000001_add_tags_system.sql
```

### Dependências

- **Supabase**: Banco de dados e autenticação
- **React**: Interface do usuário
- **Tailwind CSS**: Estilização
- **Lucide React**: Ícones

## 📊 Estatísticas e Insights

### Métricas Disponíveis

- **Total de tags**: Quantidade criadas pelo usuário
- **Uso por categoria**: Quantas vezes cada tag foi aplicada
- **Tags mais populares**: Ranking de uso
- **Distribuição por cor**: Análise visual

### Relatórios

- **Performance**: Como as tags melhoram a organização
- **Eficiência**: Uso efetivo do sistema
- **Tendências**: Padrões de categorização

## 🚀 Melhorias Futuras

### Funcionalidades Planejadas

- **Tags aninhadas**: Hierarquia de categorias
- **Tags automáticas**: Sugestões baseadas em IA
- **Exportação**: Backup e compartilhamento
- **Templates**: Conjuntos predefinidos de tags

### Integrações

- **Calendário**: Agendamento por tags
- **Notificações**: Lembretes baseados em tags
- **Relatórios**: Análises avançadas
- **API**: Integração com sistemas externos

## 🐛 Solução de Problemas

### Problemas Comuns

#### Tag não aparece

- Verifique se foi criada corretamente
- Confirme se está associada à entidade
- Recarregue a página

#### Erro ao criar tag

- Verifique se o nome é único
- Confirme conexão com o banco
- Tente novamente em alguns segundos

#### Tags não sincronizam

- Verifique conexão com Supabase
- Confirme permissões do usuário
- Limpe cache do navegador

### Logs e Debug

- **Console**: Mensagens de erro detalhadas
- **Network**: Verifique requisições ao banco
- **Auth**: Confirme autenticação do usuário

## 📚 Recursos Adicionais

### Documentação

- **API Reference**: Endpoints e parâmetros
- **Componentes**: Props e eventos
- **Hooks**: Estados e métodos

### Exemplos

- **Código**: Implementações práticas
- **Casos de uso**: Cenários reais
- **Melhores práticas**: Padrões recomendados

### Suporte

- **Issues**: Reporte bugs e solicite features
- **Discussões**: Compartilhe experiências
- **Wiki**: Documentação colaborativa

---

## 🎉 Conclusão

O sistema de tags personalizadas transforma a organização dos estudos, oferecendo:

- **Flexibilidade**: Categorização personalizada
- **Eficiência**: Busca e filtros rápidos
- **Visualização**: Interface intuitiva e atrativa
- **Escalabilidade**: Cresce com suas necessidades

Comece criando suas primeiras tags e descubra como elas podem revolucionar sua experiência de estudo! 🚀
