import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  useTheme
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import SecurityIcon from '@mui/icons-material/Security';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupsIcon from '@mui/icons-material/Groups';

const Features = () => {
  const theme = useTheme();
  
  const features = [
    {
      title: 'Éditeur de Code en Ligne',
      description: 'Écrivez et modifiez du code CodeFr avec coloration syntaxique et auto-complétion.',
      icon: <CodeIcon fontSize="large" color="primary" />
    },
    {
      title: 'Exécution Sécurisée',
      description: 'Exécutez votre code en toute sécurité dans des conteneurs Docker isolés.',
      icon: <SecurityIcon fontSize="large" color="primary" />
    },
    {
      title: 'Défis de Programmation',
      description: 'Pratiquez avec des défis de codage et améliorez vos compétences.',
      icon: <EmojiEventsIcon fontSize="large" color="primary" />
    },
    {
      title: 'Fonctionnalités Communautaires',
      description: 'Partagez, aimez et commentez les extraits de code avec la communauté.',
      icon: <GroupsIcon fontSize="large" color="primary" />
    }
  ];

  return (
    <Box sx={{ py: 8, bgcolor: 'grey.100' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          align="center"
          sx={{ mb: 6, fontWeight: 'bold', color: '#333' }}
        >
          Fonctionnalités
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.shadows[8]
                  }
                }}
              >
                <Box sx={{ mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{ mb: 2, fontWeight: 'bold' }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                >
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Features;
