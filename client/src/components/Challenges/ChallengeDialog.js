import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Stack,
  Chip,
  Typography,
  Alert
} from '@mui/material';
import MonacoEditor from '../CodeEditor/MonacoEditor';

const difficultyLevels = ['Facile', 'Moyen', 'Difficile'];
const categories = ['Algorithmes', 'Structures de données', 'Mathématiques', 'Logique', 'Autres'];

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

const ChallengeDialog = ({ open, onClose, onSubmit, challenge = null }) => {
  const [formData, setFormData] = useState(defaultFormData);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (challenge) {
      setFormData(challenge);
    } else {
      setFormData(defaultFormData);
    }
  }, [challenge, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCodeChange = (value, type) => {
    setFormData(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Basic validation
      if (!formData.title || !formData.description) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {challenge ? 'Modifier le défi' : 'Nouveau défi'}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Titre"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              required
            />

            <Box display="flex" gap={2}>
              <FormControl fullWidth>
                <InputLabel>Difficulté</InputLabel>
                <Select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  label="Difficulté"
                  required
                >
                  {difficultyLevels.map(level => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Catégorie</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="Catégorie"
                  required
                >
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box display="flex" gap={2}>
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
                Code initial
              </Typography>
              <MonacoEditor
                height="200px"
                language="codefr"
                value={formData.initialCode}
                onChange={(value) => handleCodeChange(value, 'initialCode')}
              />
            </Box>

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Solution
              </Typography>
              <MonacoEditor
                height="200px"
                language="codefr"
                value={formData.solution}
                onChange={(value) => handleCodeChange(value, 'solution')}
              />
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>
            Annuler
          </Button>
          <Button 
            type="submit"
            variant="contained"
            color="primary"
          >
            {challenge ? 'Mettre à jour' : 'Créer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ChallengeDialog;
