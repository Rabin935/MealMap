import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { RecipeProvider } from './contexts/RecipeContext';
import Box from '@mui/material/Box';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <RecipeProvider>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              minHeight: '100vh',
              bgcolor: 'background.default'
            }}>
              <Navbar />
              <Box component="main" sx={{ flexGrow: 1 }}>
                <AppRoutes />
              </Box>
              <Footer />
            </Box>
          </RecipeProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
