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
  Box
} from '@mui/material';
import MonacoEditor from '../CodeEditor/MonacoEditor';

const ChallengeDialog = ({ open, onClose, onSave, challenge = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    difficulty: 'Facile',
    timeEstimate: '',
    points: '',
    description: '',
    category: '',
    code: ''
  });

  useEffect(() => {
    if (challenge) {
      setFormData(challenge);
    }
  }, [challenge]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCodeChange = (value) => {
    setFormData(prev => ({
      ...prev,
      code: value
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {challenge ? 'Modifier le défi' : 'Créer un nouveau défi'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            name="title"
            label="Titre"
            value={formData.title}
            onChange={handleChange}
            fullWidth
          />
          
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

          <TextField
            name="timeEstimate"
            label="Temps estimé"
            value={formData.timeEstimate}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            name="points"
            label="Points"
            type="number"
            value={formData.points}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            name="category"
            label="Catégorie"
            value={formData.category}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
          />

          <Box sx={{ height: 300 }}>
            <MonacoEditor
              value={formData.code}
              onChange={handleCodeChange}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {challenge ? 'Mettre à jour' : 'Créer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChallengeDialog;
