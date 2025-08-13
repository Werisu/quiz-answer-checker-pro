import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

export interface Caderno {
  id: string;
  nome: string;
  descricao?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useCadernos = () => {
  const [cadernos, setCadernos] = useState<Caderno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar cadernos existentes
  const loadCadernos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cadernos')
        .select('*')
        .order('nome');

      if (error) throw error;

      setCadernos(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar cadernos');
    } finally {
      setLoading(false);
    }
  };

  // Criar novo caderno
  const createCaderno = async (nome: string, descricao: string = '') => {
    try {
      
      // Verificar se o usuário está autenticado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      const { data, error } = await supabase
        .from('cadernos')
        .insert([{ nome, descricao }])
        .select()
        .single();


      if (error) {
        throw error;
      }

      setCadernos(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('❌ [useCadernos] Erro geral:', err);
      setError(err instanceof Error ? err.message : 'Erro ao criar caderno');
      throw err;
    }
  };

  // Atualizar caderno
  const updateCaderno = async (id: string, updates: Partial<Caderno>) => {
    try {
      const { data, error } = await supabase
        .from('cadernos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setCadernos(prev => prev.map(caderno => 
        caderno.id === id ? data : caderno
      ));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar caderno');
      throw err;
    }
  };

  // Deletar caderno
  const deleteCaderno = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cadernos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCadernos(prev => prev.filter(caderno => caderno.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar caderno');
      throw err;
    }
  };

  // Buscar caderno por ID
  const getCadernoById = (id: string) => {
    return cadernos.find(caderno => caderno.id === id);
  };

  // Carregar cadernos na inicialização
  useEffect(() => {
    loadCadernos();
  }, []);

  return {
    cadernos,
    loading,
    error,
    createCaderno,
    updateCaderno,
    deleteCaderno,
    getCadernoById,
    loadCadernos,
  };
};
