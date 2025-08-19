# Sistema de Cadernos - Quiz Answer Checker Pro

## Visão Geral

O sistema de cadernos permite organizar seus quizzes por matéria/disciplina, facilitando a organização e categorização dos estudos.

## Funcionalidades

### 1. Criação de Cadernos

- **Nome**: Nome da matéria/disciplina (ex: "Direito Constitucional", "Português")
- **Descrição**: Descrição opcional para detalhar o conteúdo do caderno
- **Criação**: Pode ser feita diretamente no Header ou no painel administrativo

### 2. Gerenciamento de Cadernos

- **Visualização**: Lista todos os cadernos criados
- **Edição**: Modificar nome e descrição dos cadernos existentes
- **Exclusão**: Remover cadernos (cuidado: todos os quizzes associados serão perdidos)

### 3. Associação de Quizzes

- Cada quiz deve ser associado a um caderno
- O sistema mantém a relação entre quiz e caderno
- Histórico mostra o caderno de cada quiz realizado

## Como Usar

### Para Usuários Comuns

1. **Criar um Caderno**:

   - Clique em "Novo Caderno" no Header
   - Preencha o nome e descrição
   - Clique em "Criar"

2. **Iniciar um Quiz**:

   - Selecione um caderno existente no dropdown
   - Preencha o número de questões, nome do PDF e descrição
   - Clique em "Iniciar"

3. **Visualizar Histórico**:
   - Cada quiz no histórico mostra o caderno associado
   - Use o badge colorido para identificar rapidamente a matéria

### Para Administradores

1. **Acessar Painel Admin**:

   - Faça login com conta de administrador
   - Clique no botão "Admin"

2. **Gerenciar Cadernos**:
   - Vá para a aba "Gerenciar Cadernos"
   - Crie, edite ou exclua cadernos conforme necessário
   - Visualize todos os cadernos existentes

## Estrutura do Banco de Dados

### Tabela `cadernos`

- `id`: Identificador único (UUID)
- `nome`: Nome do caderno/matéria
- `descricao`: Descrição opcional
- `created_at`: Data de criação
- `updated_at`: Data da última atualização

### Tabela `quizzes`

- `caderno_id`: Referência ao caderno (foreign key)
- Outros campos existentes...

## Cadernos Sugeridos

### Direito

- Direito Constitucional
- Direito Administrativo
- Direito Civil
- Direito Penal
- Direito Processual Civil
- Direito Processual Penal

### Língua Portuguesa

- Gramática
- Interpretação de Texto
- Redação

### Matemática

- Raciocínio Lógico
- Matemática Básica
- Estatística

### Informática

- Informática Básica
- Pacote Office
- Internet e Redes

### Outros

- Atualidades
- Ética e Cidadania
- Legislação Específica

## Dicas de Organização

1. **Nomes Descritivos**: Use nomes claros e específicos
2. **Descrições Úteis**: Adicione detalhes sobre o conteúdo
3. **Consistência**: Mantenha um padrão de nomenclatura
4. **Revisão Regular**: Periodicamente revise e organize os cadernos

## Migração de Dados

Para implementar o sistema de cadernos em um banco existente:

1. Execute a migração SQL: `20240322000001_create_cadernos_table.sql`
2. Crie cadernos padrão para suas matérias
3. Associe quizzes existentes aos cadernos apropriados

## Suporte

Em caso de dúvidas ou problemas:

- Verifique os logs do console
- Confirme se as migrações foram executadas
- Verifique as permissões do usuário no Supabase
