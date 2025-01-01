import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import TranslateIcon from '@mui/icons-material/Translate';
import PsychologyIcon from '@mui/icons-material/Psychology';
import GroupsIcon from '@mui/icons-material/Groups';

const Benefits = () => {
  const benefits = [
    {
      icon: <SchoolIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: "Apprentissage Facilité",
      description: "Une approche pédagogique qui permet aux débutants d'apprendre la programmation dans leur langue maternelle."
    },
    {
      icon: <TranslateIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: "Transition en Douceur",
      description: "Une passerelle vers d'autres langages de programmation avec une syntaxe familière en français."
    },
    {
      icon: <PsychologyIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: "Focus sur la Logique",
      description: "Concentrez-vous sur les concepts de programmation plutôt que sur la barrière de la langue."
    },
    {
      icon: <GroupsIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: "Communauté Active",
      description: "Rejoignez une communauté francophone dynamique de programmeurs débutants et expérimentés."
    }
  ];

  return (
    <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{ mb: 6, fontWeight: 'bold' }}
        >
          Pourquoi Choisir CodeFr ?
        </Typography>
        <Grid container spacing={4}>
          {benefits.map((benefit, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  bgcolor: 'transparent'
                }}
              >
                <Box sx={{ mb: 2 }}>
                  {benefit.icon}
                </Box>
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  sx={{ fontWeight: 'bold' }}
                >
                  {benefit.title}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                >
                  {benefit.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Benefits;
