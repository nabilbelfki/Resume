// contexts/UserContext.tsx
"use client";
import { createContext, useContext } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';

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
  refresh: async () => { }
});

const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status, update } = useSession();

  return (
    <UserContext.Provider value={{
      user: session?.user as User | null,
      loading: status === "loading",
      refresh: async () => { await update(); }
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <UserContextProvider>
        {children}
      </UserContextProvider>
    </SessionProvider>
  );
};

export const useUser = () => useContext(UserContext);