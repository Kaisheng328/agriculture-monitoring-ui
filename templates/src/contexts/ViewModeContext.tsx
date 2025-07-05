import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface ViewModeContextType {
  isDeveloperMode: boolean;
  toggleViewMode: () => void;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

export const ViewModeProvider = ({ children }: { children: ReactNode }) => {
  const [isDeveloperMode, setIsDeveloperMode] = useState(() => {
    const storedMode = localStorage.getItem('isDeveloperMode');
    return storedMode ? JSON.parse(storedMode) : false; // Default to User View
  });

  useEffect(() => {
    localStorage.setItem('isDeveloperMode', JSON.stringify(isDeveloperMode));
  }, [isDeveloperMode]);

  const toggleViewMode = () => {
    setIsDeveloperMode((prevMode: boolean) => !prevMode);
  };

  return (
    <ViewModeContext.Provider value={{ isDeveloperMode, toggleViewMode }}>
      {children}
    </ViewModeContext.Provider>
  );
};

export const useViewMode = () => {
  const context = useContext(ViewModeContext);
  if (context === undefined) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }
  return context;
};