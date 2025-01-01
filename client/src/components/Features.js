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
      icon: <CodeIcon fontSize="large" sx={{ color: 'primary.main' }} />
    },
    {
      title: 'Exécution Sécurisée',
      description: 'Exécutez votre code en toute sécurité dans des conteneurs Docker isolés.',
      icon: <SecurityIcon fontSize="large" sx={{ color: 'primary.main' }} />
    },
    {
      title: 'Défis de Programmation',
      description: 'Pratiquez avec des défis de codage et améliorez vos compétences.',
      icon: <EmojiEventsIcon fontSize="large" sx={{ color: 'primary.main' }} />
    },
    {
      title: 'Fonctionnalités Communautaires',
      description: 'Partagez, aimez et commentez les extraits de code avec la communauté.',
      icon: <GroupsIcon fontSize="large" sx={{ color: 'primary.main' }} />
    }
  ];

  return (
    <Box 
      sx={{ 
        py: 8, 
        bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'grey.100'
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          align="center"
          sx={{ 
            mb: 6, 
            fontWeight: 'bold', 
            color: 'text.primary'
          }}
        >
          Fonctionnalités
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={theme.palette.mode === 'dark' ? 2 : 1}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  bgcolor: theme.palette.mode === 'dark' ? 'background.default' : 'background.paper',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.shadows[8]
                  },
                  borderRadius: 2
                }}
              >
                <Box 
                  sx={{ 
                    mb: 2,
                    p: 1.5,
                    borderRadius: '50%',
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.08)' : 'primary.lighter',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{ 
                    mb: 2, 
                    fontWeight: 'bold',
                    color: 'text.primary'
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ 
                    color: 'text.secondary',
                    lineHeight: 1.7
                  }}
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
