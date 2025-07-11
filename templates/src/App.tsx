import { Outlet } from 'react-router-dom';
import { ViewModeProvider } from 'contexts/ViewModeContext'; // Adjusted path based on tsconfig
import { DarkModeProvider } from 'contexts/DarkModeContext'; // Import DarkModeProvider

const App = () => {
  return (
    <ViewModeProvider>
      <DarkModeProvider> {/* Wrap with DarkModeProvider */}
        <Outlet />
      </DarkModeProvider>
    </ViewModeProvider>
  );
};

export default App;
