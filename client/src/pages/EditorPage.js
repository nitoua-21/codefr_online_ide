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
  Divider,
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

const DEFAULT_CODE = `// Bienvenue dans l'éditeur CodeFr !
// Voici un exemple de programme simple :

fonction calculerFactorielle(n) {
    si (n <= 1) {
        retourner 1;
    }
    retourner n * calculerFactorielle(n - 1);
}

// Calculer la factorielle de 5
afficher(calculerFactorielle(5));
`;

const EditorPage = () => {
  const { isAuthenticated } = useAuth();
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState('');
  const [showAuthBanner, setShowAuthBanner] = useState(!isAuthenticated);
  const [showFeatureAlert, setShowFeatureAlert] = useState(false);

  const handleRunCode = () => {
    // Implement code execution logic here
    setOutput('Code exécuté avec succès!\nRésultat : 120');
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
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="contained"
                  size="small"
                  startIcon={<LoginIcon />}
                >
                  Se connecter
                </Button>
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
              startIcon={<RunIcon />}
              onClick={handleRunCode}
            >
              Exécuter
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

        {/* Output Container */}
        <Paper 
          elevation={3}
          component={motion.div}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6">Sortie</Typography>
          </Box>
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
            }}
          >
            {output || 'La sortie de votre code apparaîtra ici'}
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