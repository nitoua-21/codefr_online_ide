import React from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ChallengesProvider } from './contexts/ChallengesContext';
import { useTheme } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import EditorPage from './pages/EditorPage';
import ChallengesPage from './pages/ChallengesPage';
import CommunityPage from './pages/CommunityPage';
import LearnPage from './pages/LearnPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import ChallengeDetailsPage from './pages/ChallengeDetailsPage';
import DashboardPage from './pages/DashboardPage';
import DocsPage from './pages/DocsPage';
import NotFoundPage from './pages/NotFoundPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Footer from './components/Footer';
import AboutPage from './pages/AboutPage';
import { Box } from '@mui/material';

const getTheme = (mode) => createTheme({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
        // Light mode colors
        primary: {
          main: '#2196f3',
        },
        secondary: {
          main: '#4caf50',
        },
        background: {
          default: '#f5f5f5',
          paper: '#ffffff',
        },
      }
      : {
        // Dark mode colors
        primary: {
          main: '#61dafb',
        },
        secondary: {
          main: '#a8e6cf',
        },
        background: {
          default: '#121212',
          paper: '#1e1e1e',
        },
      }),
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out',
          scrollbarColor: mode === 'dark' ? '#6b6b6b #2b2b2b' : '#959595 #f5f5f5',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            backgroundColor: mode === 'dark' ? '#6b6b6b' : '#959595',
            border: '2px solid transparent',
            transition: 'background-color 0.3s ease-in-out',
          },
          '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
            backgroundColor: mode === 'dark' ? '#2b2b2b' : '#f5f5f5',
            borderRadius: 8,
            transition: 'background-color 0.3s ease-in-out',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease-in-out',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease-in-out',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease-in-out',
        },
      },
    },
  },
});

const ThemedApp = () => {
  const { mode } = useTheme();
  const location = useLocation();

  return (
    <MuiThemeProvider theme={getTheme(mode)}>
      <CssBaseline />
      <AuthProvider>
        <ChallengesProvider>
          <div className="App" style={{ 
            display: 'flex', 
            flexDirection: 'column',
            minHeight: '100vh'
          }}>
            <Navbar />
            <Box sx={{ flex: 1 }}>
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                  <Route path="/editor" element={<EditorPage />} />
                  <Route path="/editor/:id" element={<EditorPage />} />

                  {/* Protected Routes */}
                  <Route path="/challenges" element={
                    <ProtectedRoute>
                      <ChallengesPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/challenges/:id" element={
                    <ProtectedRoute>
                      <ChallengeDetailsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/community" element={
                    <ProtectedRoute>
                      <CommunityPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/docs" element={
                    <ProtectedRoute>
                      <DocsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/learn" element={
                    <ProtectedRoute>
                      <LearnPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } />

                  {/* 404 Route - Must be last */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </AnimatePresence>
            </Box>
            <Footer />
          </div>
        </ChallengesProvider>
      </AuthProvider>
    </MuiThemeProvider>
  );
};

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>
    </Router>
  );
};

export default App;
