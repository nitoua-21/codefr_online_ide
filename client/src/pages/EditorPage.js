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
  Drawer,
  Avatar
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
  Comment as CommentIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import AnimatedPage from '../components/AnimatedPage';
import MonacoEditor from '../components/CodeEditor/MonacoEditor';
import CommentSection from '../components/Comments/CommentSection';
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
  const [showComments, setShowComments] = useState(false);
  const [snippetAuthor, setSnippetAuthor] = useState(null);

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
          setSnippetAuthor(snippet.author);
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

      if (result.success && result.error?.length === 0) {
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
      const response = await codeSnippetService.toggleStar(snippetId);
      if (response.success) {
        setIsStarred(response.isStarred);
        setSuccessMessage(response.message);
      } else {
        setError(response.error || 'Erreur lors de l\'ajout/retrait des favoris');
      }
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

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <AnimatedPage>
      <Container maxWidth="lg">
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Snippet Info Section */}
          <Paper sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Stack spacing={2}>
              {validationError && (
                <Alert severity="error" onClose={() => setValidationError('')}>
                  {validationError}
                </Alert>
              )}

              {snippetId && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                    ID: {snippetId}
                  </Typography>
                  {snippetAuthor && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          bgcolor: 'primary.main',
                          fontSize: '0.875rem'
                        }}
                      >
                        {snippetAuthor.username[0].toUpperCase()}
                      </Avatar>
                      <Typography variant="body2" color="text.secondary">
                        {snippetAuthor.username}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              <TextField
                label="Titre"
                value={snippetData.title}
                onChange={(e) => setSnippetData(prev => ({ ...prev, title: e.target.value }))}
                fullWidth
                required
                disabled={!isAuthenticated}
              />

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  label="Description"
                  value={snippetData.description}
                  onChange={(e) => setSnippetData(prev => ({ ...prev, description: e.target.value }))}
                  fullWidth
                  multiline
                  rows={2}
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

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
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
                    disabled={(isAuthenticated && Boolean(snippetId)) || !isAuthenticated || (Boolean(snippetId) && user?.username !== snippetAuthor?.username)}
                  >
                    Sauvegarder
                  </Button>

                  {snippetId && (
                    <>
                      <Button
                        variant="outlined"
                        startIcon={isStarred ? <StarIcon /> : <StarBorderIcon />}
                        onClick={handleStarSnippet}
                        disabled={!isAuthenticated || user?.username === snippetAuthor?.username}
                      >
                        {isStarred ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                      </Button>

                      <Button
                        variant="outlined"
                        startIcon={<ForkIcon />}
                        onClick={handleForkSnippet}
                        disabled={!isAuthenticated || user?.username === snippetAuthor?.username}
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
            </Stack>
          </Paper>

          {/* Main Content */}
          <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            {/* Editor Section */}
            <Box
              sx={{
                flex: { xs: 1, md: 2 },
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                minWidth: 0 // Prevent flex items from overflowing
              }}
            >
              <Box sx={{ flex: 1, overflow: 'hidden' }}>
                <MonacoEditor
                  value={code}
                  onChange={setCode}
                  readOnly={Boolean(snippetId) && (user?.username !== snippetAuthor?.username)}
                />
              </Box>

              {/* Output Section */}
              <Paper sx={{ height: '30%', display: 'flex', flexDirection: 'column', m: 1 }}>
                <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="subtitle1">Sortie</Typography>
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    p: 2,
                    overflow: 'auto',
                    fontFamily: 'monospace',
                    position: 'relative',
                    bgcolor: error ? 'error.light' : 'background.default',
                  }}
                >
                  {isExecuting ? (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <CircularProgress size={24} />
                    </Box>
                  ) : error ? (
                    <Typography color="error">{error}</Typography>
                  ) : (
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {output || 'La sortie s\'affichera ici...'}
                    </pre>
                  )}
                </Box>
              </Paper>
            </Box>

            {/* Comments Section */}
            {snippetId && (
              <Box
                sx={{
                  width: { xs: '100%', md: 350 },
                  display: { xs: showComments ? 'flex' : 'none', md: 'flex' },
                  position: { xs: 'absolute', md: 'relative' },
                  top: { xs: 0, md: 'auto' },
                  right: { xs: 0, md: 'auto' },
                  bottom: { xs: 0, md: 'auto' },
                  left: { xs: 0, md: 'auto' },
                  bgcolor: 'background.paper',
                  zIndex: { xs: 1200, md: 1 },
                }}
              >
                <Paper
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    ml: { xs: 0, md: 1 },
                    height: '100%',
                    overflow: 'hidden'
                  }}
                >
                  <CommentSection
                    snippetId={snippetId}
                    currentUser={user}
                    onClose={() => setShowComments(false)}
                  />
                </Paper>
              </Box>
            )}
          </Box>

          {/* Snackbars */}
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
        </Box>
      </Container>
    </AnimatedPage>
  );
};

export default EditorPage;