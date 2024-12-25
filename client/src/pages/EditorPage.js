import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link as RouterLink, useParams, useNavigate, useLocation } from 'react-router-dom';
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
  Chip,
  Stack,
  FormControlLabel,
  Switch,
  Autocomplete,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  PlayArrow as RunIcon,
  Save as SaveIcon,
  Share as ShareIcon,
  Login as LoginIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  ContentCopy as ForkIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import AnimatedPage from '../components/AnimatedPage';
import MonacoEditor from '../components/CodeEditor/MonacoEditor';
import executionService from '../services/executionService';
import codeSnippetService from '../services/codeSnippetService';

const DEFAULT_CODE = `Algorithme Nom_Algorithme\n\nVariable1: Type1\nVariable2: Type2\n\nDebut\n\tInstruction1\n\tInstruction2\nFin`;

const EditorPage = () => {
  const { isAuthenticated, user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const snippetId = id || location.state?.snippetId;
  
  const [code, setCode] = useState(DEFAULT_CODE);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showAuthBanner, setShowAuthBanner] = useState(!isAuthenticated);
  const [showFeatureAlert, setShowFeatureAlert] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [snippetData, setSnippetData] = useState({
    title: '',
    description: '',
    tags: [],
    isPublic: false,
  });
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    const loadSnippet = async () => {
      if (snippetId) {
        try {
          const { snippet } = await codeSnippetService.getSnippetById(snippetId);
          setCode(snippet.code);
          setSnippetData({
            title: snippet.title || '',
            description: snippet.description || '',
            tags: snippet.tags || [],
            isPublic: snippet.isPublic || false,
          });
          setIsStarred(snippet.stars.includes(user?._id));
        } catch (err) {
          setError('Erreur lors du chargement du snippet');
          console.error('Load snippet error:', err);
        }
      }
    };

    if (snippetId) {
      loadSnippet();
    }
  }, [snippetId, user?._id]);

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

  const handleSaveCode = async () => {
    if (!isAuthenticated) {
      setShowFeatureAlert(true);
      return;
    }

    try {
      setValidationError('');

      if (!snippetData.title) {
        setValidationError('Le titre est requis');
        return;
      }

      const data = {
        ...snippetData,
        code,
        programmingLanguage: 'codefr'
      };

      if (snippetId) {
        await codeSnippetService.updateSnippet(snippetId, data);
        setSuccessMessage('Snippet mis à jour avec succès');
      } else {
        const { snippet } = await codeSnippetService.createSnippet(data);
        navigate(`/editor/${snippet._id}`);
        setSuccessMessage('Snippet créé avec succès');
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de la sauvegarde');
      console.error('Save error:', err);
    }
  };

  const handleStarSnippet = async () => {
    if (!isAuthenticated) {
      setShowFeatureAlert(true);
      return;
    }

    try {
      await codeSnippetService.toggleStar(snippetId);
      setIsStarred(!isStarred);
      setSuccessMessage(isStarred ? 'Snippet retiré des favoris' : 'Snippet ajouté aux favoris');
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'ajout/retrait des favoris');
      console.error('Star error:', err);
    }
  };

  const handleForkSnippet = async () => {
    if (!isAuthenticated) {
      setShowFeatureAlert(true);
      return;
    }

    try {
      const { snippet } = await codeSnippetService.forkSnippet(snippetId);
      navigate(`/editor/${snippet._id}`);
      setSuccessMessage('Snippet forké avec succès');
    } catch (err) {
      setError(err.message || 'Erreur lors du fork');
      console.error('Fork error:', err);
    }
  };

  const handleShareSnippet = () => {
    if (snippetId) {
      navigator.clipboard.writeText(window.location.href);
      setSuccessMessage('Lien copié dans le presse-papier');
    }
  };

  return (
    <AnimatedPage>
      <Container maxWidth="xl">
        <Box sx={{ py: 3 }}>
          {/* Auth Banner */}
          <Collapse in={showAuthBanner}>
            <Alert
              severity="info"
              action={
                <Stack direction="row" spacing={1}>
                  <Button
                    component={RouterLink}
                    to="/login"
                    size="small"
                    startIcon={<LoginIcon />}
                  >
                    Se connecter
                  </Button>
                  <IconButton
                    size="small"
                    onClick={() => setShowAuthBanner(false)}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                </Stack>
              }
            >
              Connectez-vous pour sauvegarder vos snippets et accéder à plus de fonctionnalités !
            </Alert>
          </Collapse>

          {/* Snippet Info Section */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Stack spacing={2}>
              {validationError && (
                <Alert severity="error" onClose={() => setValidationError('')}>
                  {validationError}
                </Alert>
              )}

              {snippetId && (
                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                  ID: {snippetId}
                </Typography>
              )}
              
              <TextField
                label="Titre"
                value={snippetData.title}
                onChange={(e) => setSnippetData(prev => ({ ...prev, title: e.target.value }))}
                fullWidth
                required
                disabled={!isAuthenticated}
              />
              
              <TextField
                label="Description"
                value={snippetData.description}
                onChange={(e) => setSnippetData(prev => ({ ...prev, description: e.target.value }))}
                fullWidth
                multiline
                rows={2}
                disabled={!isAuthenticated}
              />
              
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Autocomplete
                  multiple
                  freeSolo
                  options={[]}
                  value={snippetData.tags}
                  onChange={(event, newValue) => {
                    setSnippetData(prev => ({ ...prev, tags: newValue }));
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option}
                        {...getTagProps({ index })}
                        key={index}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tags"
                      placeholder="Ajouter des tags"
                    />
                  )}
                  sx={{ flex: 1 }}
                  disabled={!isAuthenticated}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={snippetData.isPublic}
                      onChange={(e) => setSnippetData(prev => ({ ...prev, isPublic: e.target.checked }))}
                      disabled={!isAuthenticated}
                    />
                  }
                  label="Public"
                />
              </Box>
            </Stack>
          </Paper>

          {/* Editor Section */}
          <Paper sx={{ mb: 2 }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<RunIcon />}
                  onClick={handleRunCode}
                  disabled={isExecuting}
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

                {snippetId && (
                  <>
                    <Button
                      variant="outlined"
                      startIcon={isStarred ? <StarIcon /> : <StarBorderIcon />}
                      onClick={handleStarSnippet}
                      disabled={!isAuthenticated}
                    >
                      {isStarred ? 'Retiré des favoris' : 'Ajouter aux favoris'}
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={<ForkIcon />}
                      onClick={handleForkSnippet}
                      disabled={!isAuthenticated}
                    >
                      Forker
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={<ShareIcon />}
                      onClick={handleShareSnippet}
                    >
                      Partager
                    </Button>
                  </>
                )}
              </Stack>
            </Box>

            <Box sx={{ height: '60vh' }}>
              <MonacoEditor
                value={code}
                onChange={setCode}
              />
            </Box>
          </Paper>

          {/* Input/Output Section */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Sortie
            </Typography>
            <Box
              sx={(theme) => ({
                bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100',
                p: 2,
                borderRadius: 1,
                minHeight: '120px',
                maxHeight: '200px',
                overflow: 'auto',
                fontFamily: 'monospace',
                position: 'relative',
                border: `1px solid ${theme.palette.divider}`,
                color: theme.palette.text.primary,
              })}
            >
              {isExecuting && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    p: 1,
                    borderRadius: '50%',
                  }}
                >
                  <CircularProgress size={24} />
                </Box>
              )}
              {error ? (
                <Typography color="error">{error}</Typography>
              ) : (
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {output || 'La sortie s\'affichera ici...'}
                </pre>
              )}
            </Box>
          </Paper>

          {/* Feature Alert */}
          <Snackbar
            open={showFeatureAlert}
            autoHideDuration={6000}
            onClose={() => setShowFeatureAlert(false)}
          >
            <Alert
              severity="warning"
              onClose={() => setShowFeatureAlert(false)}
            >
              Vous devez être connecté pour utiliser cette fonctionnalité
            </Alert>
          </Snackbar>

          {/* Success Message */}
          <Snackbar
            open={!!successMessage}
            autoHideDuration={3000}
            onClose={() => setSuccessMessage('')}
          >
            <Alert
              severity="success"
              onClose={() => setSuccessMessage('')}
            >
              {successMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Container>
    </AnimatedPage>
  );
};

export default EditorPage;