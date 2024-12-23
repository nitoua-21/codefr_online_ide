import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Stack,
  Divider
} from '@mui/material';
import {
  Timer as TimerIcon,
  WorkspacePremium as WorkspacePremiumIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useChallenges } from '../contexts/ChallengesContext';
import { useAuth } from '../contexts/AuthContext';
import AnimatedPage from '../components/AnimatedPage';

const ChallengeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getChallenge, loading, error } = useChallenges();
  const [challenge, setChallenge] = useState(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const challengeData = await getChallenge(id);
        setChallenge(challengeData);
      } catch (err) {
        console.error('Error fetching challenge:', err);
      }
    };

    fetchChallenge();
  }, [id, getChallenge]);

  const canManageChallenge = () => {
    if (!user || !challenge) return false;
    return user.role === 'admin' || challenge.author._id === user._id;
  };

  const handleStartChallenge = () => {
    navigate(`/editor?challenge=${id}`);
  };

  const handleEditChallenge = () => {
    navigate(`/challenges/edit/${id}`);
  };

  if (loading) {
    return (
      <AnimatedPage>
        <Container>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress />
          </Box>
        </Container>
      </AnimatedPage>
    );
  }

  if (error) {
    return (
      <AnimatedPage>
        <Container>
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        </Container>
      </AnimatedPage>
    );
  }

  if (!challenge) {
    return (
      <AnimatedPage>
        <Container>
          <Alert severity="info" sx={{ mt: 3 }}>
            Challenge not found
          </Alert>
        </Container>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" gap={2} mb={4}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/challenges')}
          >
            Retour
          </Button>
          <Typography variant="h4" component="h1" flex={1}>
            {challenge.title}
          </Typography>
          {canManageChallenge() && (
            <Button
              startIcon={<EditIcon />}
              variant="outlined"
              onClick={handleEditChallenge}
            >
              Modifier
            </Button>
          )}
        </Box>

        <Grid container spacing={4}>
          {/* Challenge Info */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Stack spacing={3}>
                {/* Tags */}
                <Box display="flex" gap={1} flexWrap="wrap">
                  <Chip
                    label={challenge.difficulty}
                    color={
                      challenge.difficulty === 'Facile' ? 'success' :
                      challenge.difficulty === 'Moyen' ? 'warning' : 'error'
                    }
                  />
                  <Chip label={challenge.category} variant="outlined" />
                  {challenge.tags?.map((tag) => (
                    <Chip key={tag} label={tag} variant="outlined" size="small" />
                  ))}
                </Box>

                {/* Challenge Details */}
                <Box>
                  <Typography variant="body1" paragraph>
                    {challenge.description}
                  </Typography>
                </Box>

                <Divider />

                {/* Challenge Metadata */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={3}>
                    <Box display="flex" alignItems="center">
                      <TimerIcon sx={{ mr: 1 }} />
                      <Typography>
                        {challenge.timeLimit} minutes
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <WorkspacePremiumIcon sx={{ mr: 1 }} />
                      <Typography>
                        {challenge.points} points
                      </Typography>
                    </Box>
                  </Stack>

                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleStartChallenge}
                  >
                    Commencer le défi
                  </Button>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                À propos
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Créé par
                </Typography>
                <Typography>
                  {challenge.author?.username || 'Unknown'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Solutions soumises
                </Typography>
                <Typography>
                  {challenge.solutions?.length || 0}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </AnimatedPage>
  );
};

export default ChallengeDetailsPage;
