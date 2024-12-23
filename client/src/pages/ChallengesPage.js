import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Box,
  IconButton,
  Dialog,
  Stack,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Autocomplete,
  Collapse,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Timer as TimerIcon,
  WorkspacePremium as WorkspacePremiumIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { useChallenges } from '../contexts/ChallengesContext';
import { useAuth } from '../contexts/AuthContext';
import ChallengeDialog from '../components/Challenges/ChallengeDialog';
import AnimatedPage from '../components/AnimatedPage';

const difficultyLevels = ['Facile', 'Moyen', 'Difficile'];
const categories = ['Algorithmes', 'Applications', 'Structures de données', 'Mathématiques'];

const ChallengesPage = () => {
  const {
    challenges,
    loading,
    error,
    filters,
    createChallenge,
    updateChallenge,
    deleteChallenge,
    updateFilters,
    resetFilters,
    refreshChallenges
  } = useChallenges();
  
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [challengeToDelete, setChallengeToDelete] = useState(null);
  const [viewMode, setViewMode] = useState('all'); // 'all' or 'my'
  
  const navigate = useNavigate();
  const { user } = useAuth();

  // Initial fetch
  useEffect(() => {
    console.log('ChallengesPage mounted, fetching challenges');
    refreshChallenges();
  }, [refreshChallenges]);

  // Check if user can edit/delete a challenge
  const canManageChallenge = useCallback((challenge) => {
    if (!user || !challenge) return false;
    return user.role === 'admin' || challenge.author === user._id;
  }, [user]);

  const handleSearch = useCallback((event) => {
    updateFilters({ search: event.target.value });
  }, [updateFilters]);

  const handleDifficultyChange = useCallback((event) => {
    updateFilters({ difficulty: event.target.value });
  }, [updateFilters]);

  const handleCategoryChange = useCallback((event) => {
    updateFilters({ category: event.target.value });
  }, [updateFilters]);

  const handleSortChange = useCallback((event, newSort) => {
    if (newSort !== null) {
      updateFilters({ sortBy: newSort });
    }
  }, [updateFilters]);

  const handleClearFilters = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  const handleOpenChallenge = useCallback((challenge) => {
    navigate(`/challenges/${challenge._id}`);
  }, [navigate]);

  const handleCreateChallenge = useCallback(async (challengeData) => {
    try {
      await createChallenge(challengeData);
      setOpenDialog(false);
      refreshChallenges();
    } catch (err) {
      console.error('Error creating challenge:', err);
    }
  }, [createChallenge, refreshChallenges]);

  const handleUpdateChallenge = useCallback(async (challengeData) => {
    try {
      await updateChallenge(selectedChallenge._id, challengeData);
      setOpenDialog(false);
      setSelectedChallenge(null);
      refreshChallenges();
    } catch (err) {
      console.error('Error updating challenge:', err);
    }
  }, [selectedChallenge, updateChallenge, refreshChallenges]);

  const handleDeleteChallenge = useCallback(async () => {
    try {
      await deleteChallenge(challengeToDelete._id);
      setDeleteConfirmOpen(false);
      setChallengeToDelete(null);
      refreshChallenges();
    } catch (err) {
      console.error('Error deleting challenge:', err);
    }
  }, [challengeToDelete, deleteChallenge, refreshChallenges]);

  const handleEditChallenge = useCallback((challenge) => {
    setSelectedChallenge(challenge);
    setOpenDialog(true);
  }, []);

  const handleConfirmDelete = useCallback((challenge) => {
    setChallengeToDelete(challenge);
    setDeleteConfirmOpen(true);
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AnimatedPage>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Header with search and filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Stack spacing={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" component="h1">
                Défis CodeFr
              </Typography>
              <Box display="flex" gap={2} alignItems="center">
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(e, newMode) => {
                    if (newMode !== null) {
                      setViewMode(newMode);
                      updateFilters({ author: newMode === 'my' ? user?._id : '' });
                    }
                  }}
                  size="small"
                >
                  <ToggleButton value="all">
                    Tous les défis
                  </ToggleButton>
                  <ToggleButton value="my">
                    Mes défis
                  </ToggleButton>
                </ToggleButtonGroup>
                {user && (
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                  >
                    Nouveau Défi
                  </Button>
                )}
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap={2}>
              <TextField
                fullWidth
                placeholder="Rechercher un défi..."
                value={filters.search}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
              />
              <IconButton onClick={() => setShowFilters(!showFilters)}>
                <FilterListIcon />
              </IconButton>
              {(filters.difficulty || filters.category || filters.sortBy !== '-createdAt') && (
                <IconButton onClick={handleClearFilters}>
                  <ClearIcon />
                </IconButton>
              )}
            </Box>

            <Collapse in={showFilters}>
              <Stack spacing={2} sx={{ mt: 2 }}>
                <Box display="flex" gap={2}>
                  <FormControl fullWidth>
                    <InputLabel>Difficulté</InputLabel>
                    <Select
                      value={filters.difficulty}
                      onChange={handleDifficultyChange}
                      label="Difficulté"
                    >
                      <MenuItem value="">Tous</MenuItem>
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
                      value={filters.category}
                      onChange={handleCategoryChange}
                      label="Catégorie"
                    >
                      <MenuItem value="">Toutes</MenuItem>
                      {categories.map(category => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box>
                  <ToggleButtonGroup
                    value={filters.sortBy}
                    exclusive
                    onChange={handleSortChange}
                    aria-label="Tri"
                  >
                    <ToggleButton value="-createdAt" aria-label="Plus récents">
                      Plus récents
                    </ToggleButton>
                    <ToggleButton value="difficulty" aria-label="Difficulté">
                      Difficulté
                    </ToggleButton>
                    <ToggleButton value="-points" aria-label="Points">
                      Points
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </Stack>
            </Collapse>
          </Stack>
        </Paper>

        {/* Challenges Grid */}
        <Grid container spacing={3}>
          {!loading && challenges.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  {error ? 'Erreur lors du chargement des défis' : 'Aucun défi trouvé'}
                </Typography>
                {error && (
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    {error}
                  </Typography>
                )}
              </Paper>
            </Grid>
          ) : (
            challenges.map((challenge) => (
              <Grid item xs={12} sm={6} md={4} key={challenge._id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      transition: 'transform 0.2s ease-in-out',
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {challenge.title}
                    </Typography>
                    
                    <Typography color="text.secondary" paragraph>
                      {challenge.description}
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      <Chip
                        label={challenge.difficulty}
                        color={
                          challenge.difficulty === 'Facile' ? 'success' :
                          challenge.difficulty === 'Moyen' ? 'warning' : 'error'
                        }
                        size="small"
                      />
                      <Chip
                        label={challenge.category}
                        variant="outlined"
                        size="small"
                      />
                    </Stack>

                    <Box display="flex" alignItems="center" gap={2}>
                      <Box display="flex" alignItems="center">
                        <TimerIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
                        <Typography variant="body2" color="text.secondary">
                          {challenge.timeLimit} min
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <WorkspacePremiumIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
                        <Typography variant="body2" color="text.secondary">
                          {challenge.points} pts
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>

                  <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                      size="small"
                      onClick={() => handleOpenChallenge(challenge)}
                    >
                      Commencer
                    </Button>
                    
                    {canManageChallenge(challenge) && (
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => handleEditChallenge(challenge)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleConfirmDelete(challenge)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        {/* Challenge Dialog */}
        <ChallengeDialog
          open={openDialog}
          onClose={() => {
            setOpenDialog(false);
            setSelectedChallenge(null);
          }}
          onSubmit={selectedChallenge ? handleUpdateChallenge : handleCreateChallenge}
          challenge={selectedChallenge}
          mode={selectedChallenge ? 'edit' : 'create'}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Confirmer la suppression
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Êtes-vous sûr de vouloir supprimer le défi "{challengeToDelete?.title}" ?
              Cette action est irréversible.
            </Typography>
            <Box display="flex" justifyContent="flex-end" gap={1}>
              <Button onClick={() => setDeleteConfirmOpen(false)}>
                Annuler
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteChallenge}
              >
                Supprimer
              </Button>
            </Box>
          </Box>
        </Dialog>
      </Container>
    </AnimatedPage>
  );
};

export default ChallengesPage;
