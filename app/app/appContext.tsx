'use client';  // Ensure this is a client component since it deals with state

import { createContext, useContext, ReactNode } from 'react';

interface AppContextType {
  resetAppState: () => void;  // Define the function type
}

// Create the context with a default value (empty function)
const AppContext = createContext<AppContextType | undefined>(undefined);

// Create a custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Create a provider component
export const AppProvider = ({
  children,
  resetAppState,
}: {
  children: ReactNode;
  resetAppState: () => void;  // Expect resetAppState as a prop
}) => {
  return (
    <AppContext.Provider value={{ resetAppState }}>
      {children}
    </AppContext.Provider>
  );
};
