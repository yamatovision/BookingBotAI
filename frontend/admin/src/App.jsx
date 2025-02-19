import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ja } from 'date-fns/locale';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Navigation from './components/Navigation';
import PromptSettings from './pages/Settings/PromptSettings';
import ScriptGenerator from './pages/Integration/ScriptGenerator';
import ReservationList from './pages/Reservations/ReservationList';
import ReservationDetail from './pages/Reservations/ReservationDetail';
import EmailTemplates from './pages/Email/EmailTemplates';
import EmailLogs from './pages/Email/EmailLogs';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196F3',
      light: '#FF80AB',
      dark: '#F50057'
    },
    secondary: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2'
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff'
    }
  },
  typography: {
    h6: {
      fontWeight: 600
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8
        }
    }  }
  },
});






function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
        <CssBaseline />
        <Router>
          <Box sx={{ display: 'flex' }}>
            <Navigation />
            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
              <Routes>
                <Route path="/" element={<div>ダッシュボード（準備中）</div>} />
                <Route path="/reservations" element={<ReservationList />} />
                <Route path="/reservations/:id" element={<ReservationDetail />} />
                <Route path="/email/templates" element={<EmailTemplates />} />
                <Route path="/email/logs" element={<EmailLogs />} />
                <Route path="/settings/prompts" element={<PromptSettings />} />
                <Route path="/integration" element={<ScriptGenerator />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;