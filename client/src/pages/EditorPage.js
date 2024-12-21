import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Button,
  Typography,
  Alert,
  Collapse,
  IconButton,
  Snackbar,
  TextField,
  CircularProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  PlayArrow as RunIcon,
  Save as SaveIcon,
  Share as ShareIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import AnimatedPage from '../components/AnimatedPage';
import MonacoEditor from '../components/CodeEditor/MonacoEditor';
import executionService from '../services/executionService';

const DEFAULT_CODE = `Algorithme ExempleSimple
Variable x, y: Entier
Debut
    x = 10
    y = 5
    
    Si x > y Alors
        Ecrire("x est plus grand que y")
    Sinon
        Ecrire("y est plus grand ou égal à x")
    FinSi
Fin
`;

const EditorPage = () => {
  const { isAuthenticated } = useAuth();
  const [code, setCode] = useState(DEFAULT_CODE);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showAuthBanner, setShowAuthBanner] = useState(!isAuthenticated);
  const [showFeatureAlert, setShowFeatureAlert] = useState(false);

  const handleRunCode = async () => {
    try {
      setIsExecuting(true);
      setError(null);
      setOutput('');

      const result = await executionService.executeCode(code, input);

      if (result.success) {
        setOutput(result.output);
      } else {
        setError(result.error || 'Échec de l\'exécution');
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'exécution du code');
      console.error('Code execution error:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSaveCode = () => {
    if (!isAuthenticated) {
      setShowFeatureAlert(true);
      return;
    }
    // Implement save logic for authenticated users
  };

  const handleShareCode = () => {
    if (!isAuthenticated) {
      setShowFeatureAlert(true);
      return;
    }
    // Implement share logic for authenticated users
  };

  return (
    <AnimatedPage>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Auth Banner */}
        <Collapse in={showAuthBanner}>
          <Alert
            severity="info"
            action={
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <IconButton
                  color="inherit"
                  size="small"
                  onClick={() => setShowAuthBanner(false)}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              </Box>
            }
            sx={{ mb: 2 }}
          >
            <Typography variant="body1">
              Mode test : Vous pouvez tester l'éditeur et exécuter du code. 
              Connectez-vous pour sauvegarder vos projets et accéder à toutes les fonctionnalités !
            </Typography>
          </Alert>
        </Collapse>

        {/* Editor Container */}
        <Paper 
          elevation={3}
          component={motion.div}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          sx={{ mb: 2 }}
        >
          <Box sx={{ p: 2, display: 'flex', gap: 1, borderBottom: 1, borderColor: 'divider' }}>
            <Button
              variant="contained"
              startIcon={isExecuting ? <CircularProgress size={20} /> : <RunIcon />}
              onClick={handleRunCode}
              disabled={isExecuting}
            >
              {isExecuting ? 'Exécution...' : 'Exécuter'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<SaveIcon />}
              onClick={handleSaveCode}
              disabled={!isAuthenticated}
            >
              Sauvegarder
            </Button>
            <Button
              variant="outlined"
              startIcon={<ShareIcon />}
              onClick={handleShareCode}
              disabled={!isAuthenticated}
            >
              Partager
            </Button>
          </Box>
          <Box sx={{ p: 2 }}>
            <MonacoEditor
              value={code}
              onChange={setCode}
            />
          </Box>
        </Paper>

        {/* Input/Output Container */}
        <Paper 
          elevation={3}
          component={motion.div}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {/* Input Section */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6" gutterBottom>Entrée</Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Entrez les données d'entrée ici..."
              variant="outlined"
              size="small"
              disabled={isExecuting}
            />
          </Box>

          {/* Output Section */}
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Sortie</Typography>
            <Box 
              sx={{ 
                p: 2, 
                minHeight: '150px', 
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                bgcolor: (theme) => 
                  theme.palette.mode === 'dark' 
                    ? 'grey.900' 
                    : 'grey.100',
                borderRadius: 1,
                border: 1,
                borderColor: 'divider'
              }}
            >
              {error ? (
                <Typography color="error.main" sx={{ whiteSpace: 'pre-wrap' }}>
                  {error}
                </Typography>
              ) : output ? (
                output
              ) : (
                <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  La sortie de votre code apparaîtra ici
                </Typography>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Feature Alert */}
        <Snackbar
          open={showFeatureAlert}
          autoHideDuration={6000}
          onClose={() => setShowFeatureAlert(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setShowFeatureAlert(false)}
            severity="info"
            sx={{ width: '100%' }}
          >
            Cette fonctionnalité nécessite une connexion. 
            <Button
              component={RouterLink}
              to="/login"
              color="inherit"
              size="small"
              sx={{ ml: 1 }}
            >
              Se connecter
            </Button>
          </Alert>
        </Snackbar>
      </Container>
    </AnimatedPage>
  );
};

export default EditorPage;