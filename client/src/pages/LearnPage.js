import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Box, Button, LinearProgress } from '@mui/material';
import AnimatedPage from '../components/AnimatedPage';
import SchoolIcon from '@mui/icons-material/School';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const courses = [
  {
    id: 1,
    title: "Introduction à CodeFr",
    description: "Apprenez les bases de la programmation avec CodeFr",
    image: "https://source.unsplash.com/random/400x200?coding",
    progress: 100,
    completed: true,
    duration: "2h",
    lessons: 8
  },
  {
    id: 2,
    title: "Structures de contrôle",
    description: "Maîtrisez les boucles et conditions en CodeFr",
    image: "https://source.unsplash.com/random/400x200?programming",
    progress: 60,
    completed: false,
    duration: "3h",
    lessons: 12
  },
  {
    id: 3,
    title: "Algorithmes de base",
    description: "Découvrez les algorithmes fondamentaux",
    image: "https://source.unsplash.com/random/400x200?algorithm",
    progress: 0,
    completed: false,
    duration: "4h",
    lessons: 15
  },
  {
    id: 4,
    title: "Structures de données",
    description: "Explorez les différentes structures de données",
    image: "https://source.unsplash.com/random/400x200?data",
    progress: 0,
    completed: false,
    duration: "5h",
    lessons: 18
  }
];

const LearnPage = () => {
  return (
    <AnimatedPage>
      <Box sx={{ py: 4, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 6 }}>
            <Typography variant="h3" component="h1" gutterBottom>
              Apprendre CodeFr
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Parcours d'apprentissage interactif pour maîtriser CodeFr
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {courses.map((course) => (
              <Grid item xs={12} md={6} key={course.id}>
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
                  <CardMedia
                    component="img"
                    height="200"
                    image={course.image}
                    alt={course.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h5" component="h2">
                        {course.title}
                      </Typography>
                      {course.completed && (
                        <CheckCircleIcon color="success" />
                      )}
                    </Box>
                    
                    <Typography color="text.secondary" paragraph>
                      {course.description}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Progression: {course.progress}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {course.lessons} leçons • {course.duration}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={course.progress} 
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={course.progress === 0 ? <PlayArrowIcon /> : <SchoolIcon />}
                      fullWidth
                    >
                      {course.progress === 0 ? 'Commencer' : 'Continuer'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </AnimatedPage>
  );
};

export default LearnPage;
