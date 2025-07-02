import  { createContext, useState, useContext, ReactNode } from 'react';

interface ViewModeContextType {
  isDeveloperMode: boolean;
  toggleViewMode: () => void;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

export const ViewModeProvider = ({ children }: { children: ReactNode }) => {
  const [isDeveloperMode, setIsDeveloperMode] = useState(false); // Default to User View

  const toggleViewMode = () => {
    setIsDeveloperMode(prevMode => !prevMode);
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
