import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { User, AuthState } from '@/types';

interface LoginResult {
  success: boolean;
  user: User | null;
  needsVerification?: boolean;
}

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<LoginResult>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  initialize: () => Promise<void>;
}

async function fetchUserProfile(userId: string, email: string): Promise<User | null> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  const { data: roles } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId);

  const role = roles?.some(r => r.role === 'admin') ? 'admin' : 'customer';

  return {
    id: userId,
    email: email,
    name: profile?.name || '',
    phone: profile?.phone || undefined,
    avatar: profile?.avatar_url || undefined,
    role: role as 'admin' | 'customer',
  };
}

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      const user = await fetchUserProfile(session.user.id, session.user.email || '');
      set({ user, isAuthenticated: true, isLoading: false });
    } else {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = await fetchUserProfile(session.user.id, session.user.email || '');
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    });
  },

  login: async (email: string, password: string): Promise<LoginResult> => {
    set({ isLoading: true });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      set({ isLoading: false });
      if (error.message.includes('Email not confirmed')) {
        return { success: false, user: null, needsVerification: true };
      }
      return { success: false, user: null };
    }

    if (data.user) {
      const user = await fetchUserProfile(data.user.id, data.user.email || '');
      set({ user, isAuthenticated: true, isLoading: false });
      return { success: true, user };
    }

    set({ isLoading: false });
    return { success: false, user: null };
  },

  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true });

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: window.location.origin,
      },
    });

    set({ isLoading: false });

    if (error) {
      return { success: false, message: error.message };
    }

    // If email confirmation is required, user won't be auto-logged in
    if (data.user && !data.session) {
      return { success: true, message: 'verification_needed' };
    }

    // If auto-confirmed, user is logged in
    if (data.user && data.session) {
      const user = await fetchUserProfile(data.user.id, data.user.email || '');
      set({ user, isAuthenticated: true });
      return { success: true, message: 'auto_confirmed' };
    }

    return { success: false, message: 'Terjadi kesalahan' };
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false });
  },

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },
}));
