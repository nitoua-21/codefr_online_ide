import React, { memo } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Box,
  IconButton,
  Stack,
  Paper,
} from '@mui/material';
import {
  Timer as TimerIcon,
  WorkspacePremium as WorkspacePremiumIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const ChallengesGrid = memo(({
  challenges,
  loading,
  error,
  canManageChallenge,
  onOpenChallenge,
  onEditChallenge,
  onDeleteChallenge,
}) => {
  if (!loading && challenges.length === 0) {
    return (
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
    );
  }

  return (
    <Grid container spacing={3}>
      {challenges.map((challenge) => (
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
                onClick={() => onOpenChallenge(challenge)}
              >
                Commencer
              </Button>
              
              {canManageChallenge(challenge) && (
                <Box>
                  <IconButton
                    size="small"
                    onClick={() => onEditChallenge(challenge)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onDeleteChallenge(challenge)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
});

ChallengesGrid.displayName = 'ChallengesGrid';

export default ChallengesGrid;
