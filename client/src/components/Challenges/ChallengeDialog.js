import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Stack,
  Typography,
  Alert
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';

const defaultFormData = {
  title: '',
  description: '',
  difficulty: 'Facile',
  category: 'Algorithmes',
  initialCode: '',
  solution: '',
  points: 100,
  hints: [],
  tags: [],
  testCases: []
};

const ChallengeDialog = ({
  open,
  onClose,
  onSubmit,
  initialData,
  mode = 'create'
}) => {
  const [formData, setFormData] = useState(defaultFormData);
  const [newTag, setNewTag] = useState('');
  const [newHint, setNewHint] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData && mode === 'update') {
      setFormData({
        ...defaultFormData,
        ...initialData
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [initialData, mode, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Basic validation
      if (!formData.title || !formData.description) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddHint = () => {
    if (newHint) {
      setFormData(prev => ({
        ...prev,
        hints: [...prev.hints, newHint]
      }));
      setNewHint('');
    }
  };

  const handleRemoveHint = (index) => {
    setFormData(prev => ({
      ...prev,
      hints: prev.hints.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === 'create' ? 'Créer un nouveau défi' : 'Modifier le défi'}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Stack spacing={3}>
            <TextField
              label="Titre"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              fullWidth
            />

            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              fullWidth
              multiline
              rows={4}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Difficulté</InputLabel>
                <Select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  label="Difficulté"
                >
                  <MenuItem value="Facile">Facile</MenuItem>
                  <MenuItem value="Moyen">Moyen</MenuItem>
                  <MenuItem value="Difficile">Difficile</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Catégorie</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="Catégorie"
                >
                  <MenuItem value="Algorithmes">Algorithmes</MenuItem>
                  <MenuItem value="Structures de données">Structures de données</MenuItem>
                  <MenuItem value="Mathématiques">Mathématiques</MenuItem>
                  <MenuItem value="Logique">Logique</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box>
              <TextField
                type="number"
                label="Points"
                name="points"
                value={formData.points}
                onChange={handleChange}
                required
                inputProps={{ min: 0 }}
              />
            </Box>

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                {formData.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  label="Nouveau tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  size="small"
                />
                <IconButton onClick={handleAddTag} color="primary">
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Indices
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1 }}>
                {formData.hints.map((hint, index) => (
                  <Chip
                    key={index}
                    label={hint}
                    onDelete={() => handleRemoveHint(index)}
                    sx={{ maxWidth: '100%' }}
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  label="Nouvel indice"
                  value={newHint}
                  onChange={(e) => setNewHint(e.target.value)}
                  size="small"
                  fullWidth
                />
                <IconButton onClick={handleAddHint} color="primary">
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>

            <TextField
              label="Code initial"
              name="initialCode"
              value={formData.initialCode}
              onChange={handleChange}
              multiline
              rows={4}
            />

            <TextField
              label="Solution"
              name="solution"
              value={formData.solution}
              onChange={handleChange}
              multiline
              rows={4}
            />
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
        >
          {mode === 'create' ? 'Créer' : 'Mettre à jour'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChallengeDialog;
