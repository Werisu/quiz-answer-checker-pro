
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';

interface Profile {
  id: string;
  name: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('fetchUserProfile: Buscando perfil para usuário:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      console.log('fetchUserProfile: Perfil encontrado:', data);
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      console.log('fetchUserProfile: Usuário não tem perfil criado ainda');
      
      // Tentar criar o perfil se não existir
      try {
        console.log('fetchUserProfile: Tentando criar perfil para usuário:', userId);
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            name: user?.user_metadata?.name || 'Usuário',
            role: 'user', // Role padrão
          })
          .select()
          .single();
        
        if (createError) {
          console.error('Error creating profile:', createError);
          console.log('fetchUserProfile: Detalhes do erro:', createError);
        } else {
          console.log('fetchUserProfile: Perfil criado com sucesso:', newProfile);
          setUserProfile(newProfile);
        }
      } catch (createError) {
        console.error('Error creating profile:', createError);
        console.log('fetchUserProfile: Exceção ao criar perfil:', createError);
      }
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('useAuth: Sessão inicial:', session?.user?.id);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAuth: Mudança de auth:', event, session?.user?.id);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserProfile(session.user.id);
        } else {
          setUserProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });
    if (error) throw error;
    
    // Criar perfil do usuário na tabela profiles
    if (data.user) {
      try {
        console.log('signUp: Criando perfil para usuário:', data.user.id);
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name: name,
            role: 'user', // Role padrão para novos usuários
          });
        
        if (profileError) {
          console.error('Error creating user profile:', profileError);
        } else {
          console.log('signUp: Perfil criado com sucesso');
        }
      } catch (profileError) {
        console.error('Error creating user profile:', profileError);
      }
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    
    // Se o login foi bem-sucedido, buscar ou criar o perfil
    if (data.user) {
      await fetchUserProfile(data.user.id);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
