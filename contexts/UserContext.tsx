// contexts/UserContext.tsx
"use client";
import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
  role: string;
}

const UserContext = createContext<{
  user: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
}>({
  user: null,
  loading: true,
  refresh: async () => {}
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<{
    user: User | null;
    loading: boolean;
  }>({
    user: null,
    loading: true
  });

  const refresh = async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const res = await fetch('/api/authorize', { credentials: 'include' });
      const data = await res.json();
      setState({
        user: data.isAuthenticated ? data.user : null,
        loading: false
      });
    } catch (error) {
      setState({
        user: null,
        loading: false
      });
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <UserContext.Provider value={{
      user: state.user,
      loading: state.loading,
      refresh
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);