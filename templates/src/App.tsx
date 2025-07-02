import { Outlet } from 'react-router-dom';
import { ViewModeProvider } from 'contexts/ViewModeContext'; // Adjusted path based on tsconfig

const App = () => {
  return (
    <ViewModeProvider>
      <Outlet />
    </ViewModeProvider>
  );
};

export default App;
