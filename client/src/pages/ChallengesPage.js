import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Box, 
  Chip,
  IconButton,
  Tooltip,
  Fab
} from '@mui/material';
import AnimatedPage from '../components/AnimatedPage';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TimerIcon from '@mui/icons-material/Timer';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useChallenges } from '../contexts/ChallengesContext';
import ChallengeDialog from '../components/Challenges/ChallengeDialog';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const getDifficultyColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'facile':
      return 'success';
    case 'moyen':
      return 'warning';
    case 'difficile':
      return 'error';
    default:
      return 'default';
  }
};

const ChallengesPage = () => {
  const { challenges, addChallenge, updateChallenge, deleteChallenge } = useChallenges();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = true;

  const handleOpenDialog = (challenge = null) => {
    setSelectedChallenge(challenge);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedChallenge(null);
    setDialogOpen(false);
  };

  const handleSaveChallenge = (challengeData) => {
    if (selectedChallenge) {
      updateChallenge(selectedChallenge.id, challengeData);
    } else {
      addChallenge(challengeData);
    }
  };

  const handleDeleteChallenge = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce défi ?')) {
      deleteChallenge(id);
    }
  };

  const handleStartChallenge = (challenge) => {
    navigate(`/challenges/${challenge.id}`);
  };

  return (
    <AnimatedPage>
      <Box sx={{ py: 4, bgcolor: 'background.default', minHeight: '100vh' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h3" component="h1">
              Défis CodeFr
            </Typography>
            {isAdmin && (
              <Fab 
                color="primary" 
                onClick={() => handleOpenDialog()}
                sx={{ position: 'fixed', bottom: 24, right: 24 }}
              >
                <AddIcon />
              </Fab>
            )}
          </Box>
          
          <Grid container spacing={3}>
            {challenges.map((challenge) => (
              <Grid item xs={12} sm={6} md={4} key={challenge.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)'
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {challenge.title}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Chip 
                        label={challenge.difficulty} 
                        color={getDifficultyColor(challenge.difficulty)}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Chip 
                        label={challenge.category}
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                    
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                      {challenge.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TimerIcon sx={{ mr: 0.5 }} fontSize="small" />
                        <Typography variant="body2">
                          {challenge.timeEstimate}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <WorkspacePremiumIcon sx={{ mr: 0.5 }} fontSize="small" />
                        <Typography variant="body2">
                          {challenge.points} pts
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                  
                  <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={() => handleStartChallenge(challenge)}
                    >
                      Commencer
                    </Button>
                    
                    {isAdmin && (
                      <Box>
                        <Tooltip title="Modifier">
                          <IconButton 
                            size="small" 
                            onClick={() => handleOpenDialog(challenge)}
                            sx={{ mr: 1 }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteChallenge(challenge.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <ChallengeDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveChallenge}
        challenge={selectedChallenge}
      />
    </AnimatedPage>
  );
};

export default ChallengesPage;
