import React, { useState, useMemo } from 'react';
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

const ChallengesPage = () => {
  const { challenges, deleteChallenge } = useChallenges();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = true;

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [difficulty, setDifficulty] = useState('all');
  const [category, setCategory] = useState('all');
  const [timeRange, setTimeRange] = useState('all');
  const [pointsRange, setPointsRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedTags, setSelectedTags] = useState([]);

  // Extract unique categories and tags from challenges
  const categories = useMemo(() => {
    const uniqueCategories = new Set(challenges.map(c => c.category));
    return Array.from(uniqueCategories);
  }, [challenges]);

  const tags = useMemo(() => {
    const uniqueTags = new Set(challenges.flatMap(c => c.tags || []));
    return Array.from(uniqueTags);
  }, [challenges]);

  const handleOpenDialog = (challenge = null) => {
    setSelectedChallenge(challenge);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedChallenge(null);
    setOpenDialog(false);
  };

  const handleStartChallenge = (challenge) => {
    navigate(`/challenges/${challenge.id}`);
  };

  const handleDeleteChallenge = (challengeId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce défi ?')) {
      deleteChallenge(challengeId);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setDifficulty('all');
    setCategory('all');
    setTimeRange('all');
    setPointsRange('all');
    setSortBy('newest');
    setSelectedTags([]);
  };

  const filteredChallenges = useMemo(() => {
    let filtered = [...challenges];

    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(challenge =>
        challenge.title.toLowerCase().includes(query) ||
        challenge.description.toLowerCase().includes(query) ||
        challenge.code.toLowerCase().includes(query) ||
        (challenge.tags && challenge.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    // Difficulty filter
    if (difficulty !== 'all') {
      filtered = filtered.filter(challenge => challenge.difficulty === difficulty);
    }

    // Category filter
    if (category !== 'all') {
      filtered = filtered.filter(challenge => challenge.category === category);
    }

    // Time range filter
    if (timeRange !== 'all') {
      const [min, max] = timeRange.split('-').map(Number);
      filtered = filtered.filter(challenge => {
        const time = parseInt(challenge.timeEstimate);
        return time >= min && (!max || time <= max);
      });
    }

    // Points range filter
    if (pointsRange !== 'all') {
      const [min, max] = pointsRange.split('-').map(Number);
      filtered = filtered.filter(challenge => {
        const points = challenge.points;
        return points >= min && (!max || points <= max);
      });
    }

    // Tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(challenge =>
        selectedTags.every(tag => challenge.tags && challenge.tags.includes(tag))
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'points-high':
          return b.points - a.points;
        case 'points-low':
          return a.points - b.points;
        case 'time-short':
          return parseInt(a.timeEstimate) - parseInt(b.timeEstimate);
        case 'time-long':
          return parseInt(b.timeEstimate) - parseInt(a.timeEstimate);
        default:
          return 0;
      }
    });

    return filtered;
  }, [challenges, searchQuery, difficulty, category, timeRange, pointsRange, sortBy, selectedTags]);

  return (
    <AnimatedPage>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1">
              Défis CodeFr
            </Typography>
            {isAdmin && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
              >
                Nouveau Défi
              </Button>
            )}
          </Box>

          <Paper sx={{ p: 2 }}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  placeholder="Rechercher par titre, description, code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setSearchQuery('')}>
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  endIcon={showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  Filtres
                </Button>
                {(searchQuery || difficulty !== 'all' || category !== 'all' || timeRange !== 'all' || pointsRange !== 'all' || selectedTags.length > 0) && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<ClearIcon />}
                    onClick={handleClearFilters}
                  >
                    Réinitialiser
                  </Button>
                )}
              </Box>

              <Collapse in={showFilters}>
                <Stack spacing={2} sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Difficulté</InputLabel>
                        <Select
                          value={difficulty}
                          onChange={(e) => setDifficulty(e.target.value)}
                          label="Difficulté"
                        >
                          <MenuItem value="all">Toutes</MenuItem>
                          <MenuItem value="Facile">Facile</MenuItem>
                          <MenuItem value="Moyen">Moyen</MenuItem>
                          <MenuItem value="Difficile">Difficile</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Catégorie</InputLabel>
                        <Select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          label="Catégorie"
                        >
                          <MenuItem value="all">Toutes</MenuItem>
                          {categories.map((cat) => (
                            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Temps estimé</InputLabel>
                        <Select
                          value={timeRange}
                          onChange={(e) => setTimeRange(e.target.value)}
                          label="Temps estimé"
                        >
                          <MenuItem value="all">Tous</MenuItem>
                          <MenuItem value="0-15">≤ 15 min</MenuItem>
                          <MenuItem value="15-30">15-30 min</MenuItem>
                          <MenuItem value="30-60">30-60 min</MenuItem>
                          <MenuItem value="60-">60+ min</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Points</InputLabel>
                        <Select
                          value={pointsRange}
                          onChange={(e) => setPointsRange(e.target.value)}
                          label="Points"
                        >
                          <MenuItem value="all">Tous</MenuItem>
                          <MenuItem value="0-100">0-100</MenuItem>
                          <MenuItem value="100-300">100-300</MenuItem>
                          <MenuItem value="300-500">300-500</MenuItem>
                          <MenuItem value="500-">500+</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Box>
                    <Autocomplete
                      multiple
                      size="small"
                      options={tags}
                      value={selectedTags}
                      onChange={(event, newValue) => setSelectedTags(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Tags"
                          placeholder="Sélectionner des tags"
                        />
                      )}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            label={option}
                            {...getTagProps({ index })}
                            size="small"
                          />
                        ))
                      }
                    />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                      <InputLabel>Trier par</InputLabel>
                      <Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        label="Trier par"
                      >
                        <MenuItem value="newest">Plus récent</MenuItem>
                        <MenuItem value="oldest">Plus ancien</MenuItem>
                        <MenuItem value="points-high">Points (décroissant)</MenuItem>
                        <MenuItem value="points-low">Points (croissant)</MenuItem>
                        <MenuItem value="time-short">Temps (plus court)</MenuItem>
                        <MenuItem value="time-long">Temps (plus long)</MenuItem>
                      </Select>
                    </FormControl>

                    <Typography variant="body2" color="text.secondary">
                      {filteredChallenges.length} défi{filteredChallenges.length !== 1 ? 's' : ''} trouvé{filteredChallenges.length !== 1 ? 's' : ''}
                    </Typography>
                  </Box>
                </Stack>
              </Collapse>
            </Stack>
          </Paper>
        </Box>

        <Grid container spacing={3}>
          {filteredChallenges.map((challenge) => (
            <Grid item xs={12} sm={6} md={4} key={challenge.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {challenge.title}
                    </Typography>
                    {isAdmin && (
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(challenge)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteChallenge(challenge.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip
                      label={challenge.difficulty}
                      color={
                        challenge.difficulty === 'Facile'
                          ? 'success'
                          : challenge.difficulty === 'Moyen'
                          ? 'warning'
                          : 'error'
                      }
                      size="small"
                    />
                    <Chip label={challenge.category} variant="outlined" size="small" />
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {challenge.description}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2, color: 'text.secondary', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TimerIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="body2">{challenge.timeEstimate}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <WorkspacePremiumIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="body2">{challenge.points} pts</Typography>
                    </Box>
                  </Box>

                  {challenge.tags && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {challenge.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      ))}
                    </Box>
                  )}
                </CardContent>

                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleStartChallenge(challenge)}
                  >
                    Commencer
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        <ChallengeDialog
          open={openDialog}
          onClose={handleCloseDialog}
          challenge={selectedChallenge}
        />
      </Container>
    </AnimatedPage>
  );
};

export default ChallengesPage;
