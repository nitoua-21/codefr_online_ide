import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Stack,
  FormControlLabel,
  Switch,
  Autocomplete,
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

const SaveDialog = ({ open, onClose, onSave, snippet }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [],
    isPublic: false,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (snippet) {
      setFormData({
        title: snippet.title || '',
        description: snippet.description || '',
        tags: snippet.tags || [],
        isPublic: snippet.isPublic || false,
      });
    }
  }, [snippet]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'isPublic' ? checked : value
    }));
  };

  const handleSubmit = () => {
    if (!formData.title) {
      setError('Le titre est requis');
      return;
    }
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {snippet ? 'Modifier le snippet' : 'Sauvegarder le snippet'}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          <TextField
            name="title"
            label="Titre"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={formData.tags}
            onChange={(event, newValue) => {
              setFormData(prev => ({
                ...prev,
                tags: newValue || []
              }));
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
          />
          <FormControlLabel
            control={
              <Switch
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
              />
            }
            label="Rendre public"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained">
          Sauvegarder
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const EditorPage = () => {
  const { isAuthenticated, user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState(DEFAULT_CODE);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showAuthBanner, setShowAuthBanner] = useState(!isAuthenticated);
  const [showFeatureAlert, setShowFeatureAlert] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [currentSnippet, setCurrentSnippet] = useState(null);
  const [isStarred, setIsStarred] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const loadSnippet = async () => {
      if (id) {
        try {
          const { snippet } = await codeSnippetService.getSnippetById(id);
          setCode(snippet.code);
          setCurrentSnippet(snippet);
          setIsStarred(snippet.stars.includes(user?._id));
        } catch (err) {
          setError('Erreur lors du chargement du snippet');
          console.error('Load snippet error:', err);
        }
      }
    };

    if (id) {
      loadSnippet();
    }
  }, [id, user?._id]);

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
    setSaveDialogOpen(true);
  };

  const handleSaveSubmit = async (formData) => {
    try {
      const snippetData = {
        ...formData,
        code,
        programmingLanguage: 'codefr'
      };

      if (currentSnippet) {
        await codeSnippetService.updateSnippet(currentSnippet._id, snippetData);
        setSuccessMessage('Snippet mis à jour avec succès');
      } else {
        const { snippet } = await codeSnippetService.createSnippet(snippetData);
        setCurrentSnippet(snippet);
        navigate(`/editor/${snippet._id}`);
        setSuccessMessage('Snippet créé avec succès');
      }
      setSaveDialogOpen(false);
    } catch (err) {
      setError(err.message || 'Erreur lors de la sauvegarde');
      console.error('Save snippet error:', err);
    }
  };

  const handleShareCode = () => {
    if (!currentSnippet?.isPublic) {
      setError('Le snippet doit être public pour être partagé');
      return;
    }
    
    const url = `${window.location.origin}/editor/${currentSnippet._id}`;
    navigator.clipboard.writeText(url);
    setSuccessMessage('Lien copié dans le presse-papier');
  };

  const handleStar = async () => {
    if (!isAuthenticated) {
      setShowFeatureAlert(true);
      return;
    }

    try {
      if (isStarred) {
        await codeSnippetService.unstarSnippet(currentSnippet._id);
        setIsStarred(false);
        setSuccessMessage('Snippet retiré des favoris');
      } else {
        await codeSnippetService.starSnippet(currentSnippet._id);
        setIsStarred(true);
        setSuccessMessage('Snippet ajouté aux favoris');
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'action');
      console.error('Star/unstar error:', err);
    }
  };

  const handleFork = async () => {
    if (!isAuthenticated) {
      setShowFeatureAlert(true);
      return;
    }

    try {
      const { snippet } = await codeSnippetService.forkSnippet(currentSnippet._id);
      navigate(`/editor/${snippet._id}`);
      setSuccessMessage('Snippet forké avec succès');
    } catch (err) {
      setError(err.message || 'Erreur lors du fork');
      console.error('Fork error:', err);
    }
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography>
                Connectez-vous pour sauvegarder et partager votre code
              </Typography>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                size="small"
                startIcon={<LoginIcon />}
              >
                Se connecter
              </Button>
            </Box>
          </Alert>
        </Collapse>

        {/* Editor Header */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="h1">
            {currentSnippet?.title || 'Éditeur CodeFr'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {currentSnippet && (
              <>
                <IconButton
                  color={isStarred ? 'warning' : 'default'}
                  onClick={handleStar}
                  title={isStarred ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                >
                  {isStarred ? <StarIcon /> : <StarBorderIcon />}
                </IconButton>
                <IconButton
                  onClick={handleFork}
                  title="Forker ce snippet"
                >
                  <ForkIcon />
                </IconButton>
              </>
            )}
            <Button
              variant="outlined"
              startIcon={<ShareIcon />}
              onClick={handleShareCode}
              disabled={!currentSnippet?.isPublic}
            >
              Partager
            </Button>
            <Button
              variant="outlined"
              startIcon={<SaveIcon />}
              onClick={handleSaveCode}
            >
              Sauvegarder
            </Button>
            <Button
              variant="contained"
              startIcon={<RunIcon />}
              onClick={handleRunCode}
              disabled={isExecuting}
            >
              Exécuter
            </Button>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Editor */}
          <Box sx={{ flex: 2 }}>
            <Paper sx={{ mb: 2 }}>
              <MonacoEditor
                value={code}
                onChange={setCode}
                language="codefr"
                height="60vh"
              />
            </Paper>
          </Box>

          {/* Input/Output */}
          <Box sx={{ flex: 1 }}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Entrée
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Entrez les données d'entrée ici..."
              />
            </Paper>

            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Sortie
              </Typography>
              <Box
                sx={{
                  bgcolor: 'background.default',
                  p: 2,
                  borderRadius: 1,
                  minHeight: '200px',
                  maxHeight: '400px',
                  overflow: 'auto',
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  position: 'relative',
                }}
              >
                {isExecuting ? (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                    }}
                  >
                    <CircularProgress size={24} />
                  </Box>
                ) : error ? (
                  <Typography color="error.main">{error}</Typography>
                ) : (
                  output || 'La sortie s\'affichera ici...'
                )}
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* Dialogs and Alerts */}
        <SaveDialog
          open={saveDialogOpen}
          onClose={() => setSaveDialogOpen(false)}
          onSave={handleSaveSubmit}
          snippet={currentSnippet}
        />

        <Snackbar
          open={!!successMessage}
          autoHideDuration={3000}
          onClose={() => setSuccessMessage('')}
          message={successMessage}
        />

        <Snackbar
          open={showFeatureAlert}
          autoHideDuration={3000}
          onClose={() => setShowFeatureAlert(false)}
        >
          <Alert
            onClose={() => setShowFeatureAlert(false)}
            severity="warning"
            sx={{ width: '100%' }}
          >
            Vous devez être connecté pour utiliser cette fonctionnalité
          </Alert>
        </Snackbar>
      </Container>
    </AnimatedPage>
  );
};

export default EditorPage;