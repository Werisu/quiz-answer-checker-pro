# Correção do Sistema de Cadernos

## Problema Identificado

O sistema de cadernos não está funcionando porque:

1. **Falta a coluna `user_id`** na tabela `cadernos`
2. **Políticas RLS incorretas** que não verificam a propriedade do caderno
3. **Falta de trigger** para definir automaticamente o `user_id` do usuário autenticado

## Solução

### Passo 1: Execute este script no SQL Editor do Supabase

```sql
-- 1. Adicionar coluna user_id se não existir
ALTER TABLE cadernos ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Criar índice para user_id se não existir
CREATE INDEX IF NOT EXISTS idx_cadernos_user_id ON cadernos(user_id);

-- 3. Remover políticas RLS antigas
DROP POLICY IF EXISTS "Users can create cadernos" ON cadernos;
DROP POLICY IF EXISTS "Users can update their own cadernos" ON cadernos;
DROP POLICY IF EXISTS "Users can delete their own cadernos" ON cadernos;

-- 4. Criar novas políticas RLS corretas
CREATE POLICY "Users can create cadernos" ON cadernos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cadernos" ON cadernos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cadernos" ON cadernos
  FOR DELETE USING (auth.uid() = user_id);

-- 5. Criar função para definir user_id automaticamente
CREATE OR REPLACE FUNCTION set_user_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id = auth.uid();
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Criar trigger para definir user_id automaticamente
DROP TRIGGER IF EXISTS set_cadernos_user_id ON cadernos;
CREATE TRIGGER set_cadernos_user_id
  BEFORE INSERT ON cadernos
  FOR EACH ROW
EXECUTE FUNCTION set_user_id();
```

### Passo 2: Se você já tem cadernos existentes

Se você já criou cadernos antes, você precisa atribuir um `user_id` a eles:

```sql
-- Substitua 'SEU_USER_ID_AQUI' pelo seu ID de usuário real
-- Para descobrir seu ID, execute: SELECT auth.uid();
UPDATE cadernos SET user_id = 'SEU_USER_ID_AQUI' WHERE user_id IS NULL;

-- Depois torne a coluna obrigatória
ALTER TABLE cadernos ALTER COLUMN user_id SET NOT NULL;
```

### Passo 3: Teste o sistema

1. Acesse o painel administrativo
2. Vá para a aba "Gerenciar Cadernos"
3. Use o componente de debug para testar a criação
4. Tente criar um novo caderno

## O que foi corrigido

1. **Coluna `user_id`**: Agora cada caderno é associado ao usuário que o criou
2. **Políticas RLS**: Agora verificam se o usuário é o proprietário do caderno
3. **Trigger automático**: Define automaticamente o `user_id` ao criar um caderno
4. **Segurança**: Usuários só podem modificar seus próprios cadernos

## Verificação

Após executar o script, você deve ver:

- ✅ Criação de cadernos funcionando
- ✅ Edição apenas dos seus próprios cadernos
- ✅ Exclusão apenas dos seus próprios cadernos
- ✅ Visualização de todos os cadernos (para organização)

## Problemas comuns

- **Erro "new row violates row-level security policy"**: Execute o script de correção
- **Erro "column user_id does not exist"**: Execute o ALTER TABLE primeiro
- **Erro de permissão**: Verifique se as políticas RLS foram criadas corretamente
