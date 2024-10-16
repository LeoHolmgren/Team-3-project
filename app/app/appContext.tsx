'use client';

import { createContext, useContext, ReactNode } from 'react';

interface AppContextType {
  resetAppState: () => void;
}

// Create the context with a default value (empty function)
const AppContext = createContext<AppContextType | undefined>(undefined);

// Hook to access the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Provider component
export const AppProvider = ({
  children,
  resetAppState,
}: {
  children: ReactNode;
  resetAppState: () => void;
}) => {
  return (
    <AppContext.Provider value={{ resetAppState }}>
      {children}
    </AppContext.Provider>
  );
};
