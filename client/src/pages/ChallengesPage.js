import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, Box, Chip } from '@mui/material';
import AnimatedPage from '../components/AnimatedPage';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TimerIcon from '@mui/icons-material/Timer';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

const challenges = [
  {
    id: 1,
    title: "Tri à bulles",
    difficulty: "Facile",
    timeEstimate: "20 min",
    points: 100,
    description: "Implémentez l'algorithme de tri à bulles en CodeFr",
    category: "Algorithmes"
  },
  {
    id: 2,
    title: "Calculatrice",
    difficulty: "Moyen",
    timeEstimate: "45 min",
    points: 200,
    description: "Créez une calculatrice simple avec les opérations de base",
    category: "Applications"
  },
  {
    id: 3,
    title: "Recherche binaire",
    difficulty: "Difficile",
    timeEstimate: "1h",
    points: 300,
    description: "Implémentez l'algorithme de recherche binaire",
    category: "Algorithmes"
  }
];

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
  return (
    <AnimatedPage>
      <Box sx={{ py: 4, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4 }}>
            Défis CodeFr
          </Typography>
          
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
                        <EmojiEventsIcon sx={{ mr: 0.5 }} fontSize="small" />
                        <Typography variant="body2">
                          {challenge.points} pts
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                  
                  <CardActions>
                    <Button 
                      size="small" 
                      color="primary" 
                      variant="contained"
                      fullWidth
                      startIcon={<WorkspacePremiumIcon />}
                    >
                      Relever le défi
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </AnimatedPage>
  );
};

export default ChallengesPage;
