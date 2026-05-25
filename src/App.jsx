// src/App.jsx
import './App.css';
import { AppProvider } from './store/AppProvider';
import AppRouter from './routes/AppRouter';

function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}

export default App;