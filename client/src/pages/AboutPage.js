import React from 'react';
import { Container, Typography, Box, Paper, Grid } from '@mui/material';
import AnimatedPage from '../components/AnimatedPage';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import TranslateIcon from '@mui/icons-material/Translate';
import TerminalIcon from '@mui/icons-material/Terminal';

const features = [
  {
    icon: <CodeIcon fontSize="large" color="primary" />,
    title: "Programmation en Français",
    description: "CodeFr permet d'écrire des algorithmes en utilisant des mots-clés en français, rendant la programmation plus accessible aux francophones."
  },
  {
    icon: <SchoolIcon fontSize="large" color="primary" />,
    title: "Outil Éducatif",
    description: "Conçu pour l'apprentissage, CodeFr aide les débutants à comprendre les concepts fondamentaux de la programmation dans leur langue maternelle."
  },
  {
    icon: <TranslateIcon fontSize="large" color="primary" />,
    title: "Transition Facilitée",
    description: "Une passerelle vers d'autres langages de programmation en permettant aux apprenants de se concentrer sur la logique plutôt que sur la syntaxe anglaise."
  },
  {
    icon: <TerminalIcon fontSize="large" color="primary" />,
    title: "Interface Interactive",
    description: "Un environnement de développement intégré en ligne qui permet d'écrire, tester et exécuter du code facilement."
  }
];

const AboutPage = () => {
  return (
    <AnimatedPage>
      <Box sx={{ py: 6, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          {/* Hero Section */}
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant="h2" component="h1" gutterBottom>
              À Propos de CodeFr
            </Typography>
            <Typography variant="h5" color="text.secondary" paragraph>
              Un langage de programmation éducatif en français
            </Typography>
          </Box>

          {/* Main Content */}
          <Paper elevation={3} sx={{ p: 4, mb: 6 }}>
            <Typography variant="h4" gutterBottom>
              Qu'est-ce que CodeFr ?
            </Typography>
            <Typography variant="body1" paragraph>
              CodeFr est un langage de programmation pédagogique conçu pour les francophones débutants en programmation. 
              Il permet d'écrire des algorithmes en utilisant une syntaxe simple et intuitive en français, facilitant ainsi 
              l'apprentissage des concepts fondamentaux de la programmation.
            </Typography>
            <Typography variant="body1" paragraph>
              Notre objectif est de rendre la programmation plus accessible aux francophones en éliminant la barrière 
              de la langue anglaise, permettant ainsi aux apprenants de se concentrer sur l'apprentissage de la logique 
              de programmation plutôt que sur la compréhension de la syntaxe en anglais.
            </Typography>
          </Paper>

          {/* Features Grid */}
          <Grid container spacing={4} sx={{ mb: 6 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 3, 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Target Audience */}
          <Paper elevation={3} sx={{ p: 4, mb: 6 }}>
            <Typography variant="h4" gutterBottom>
              Pour Qui est CodeFr ?
            </Typography>
            <Typography variant="body1" paragraph>
              CodeFr est particulièrement adapté pour :
            </Typography>
            <Box component="ul" sx={{ pl: 4 }}>
              <Typography component="li" variant="body1" paragraph>
                Les débutants en programmation qui souhaitent apprendre dans leur langue maternelle
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                Les étudiants francophones qui veulent comprendre les concepts de base de la programmation
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                Les enseignants qui cherchent un outil pédagogique pour introduire la programmation
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                Toute personne intéressée par l'apprentissage de la programmation en français
              </Typography>
            </Box>
          </Paper>

          {/* Getting Started */}
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
              Comment Commencer ?
            </Typography>
            <Typography variant="body1" paragraph>
              Pour commencer à utiliser CodeFr, vous pouvez :
            </Typography>
            <Box component="ul" sx={{ pl: 4 }}>
              <Typography component="li" variant="body1" paragraph>
                Explorer la documentation pour comprendre la syntaxe
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                Essayer l'éditeur en ligne pour écrire et exécuter du code
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                Participer aux défis pour tester vos connaissances
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                Rejoindre la communauté pour échanger avec d'autres apprenants
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </AnimatedPage>
  );
};

export default AboutPage;
