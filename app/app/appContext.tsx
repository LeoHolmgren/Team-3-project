'use client';

import { createContext, useContext, ReactNode } from 'react';

// Define the context and type
interface AppContextType {
  resetAppState: () => void;
}

// Create the context with a default empty function
const AppContext = createContext<AppContextType | undefined>(undefined);

// Create a custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Create the provider component
export const AppProvider = ({ children, resetAppState }: { children: ReactNode; resetAppState: () => void }) => {
  return (
    <AppContext.Provider value={{ resetAppState }}>
      {children}
    </AppContext.Provider>
  );
};
