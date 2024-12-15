import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, Box, Avatar, Divider } from '@mui/material';
import AnimatedPage from '../components/AnimatedPage';
import CodeIcon from '@mui/icons-material/Code';
import GroupIcon from '@mui/icons-material/Group';
import ForumIcon from '@mui/icons-material/Forum';
import ShareIcon from '@mui/icons-material/Share';

const projects = [
  {
    id: 1,
    title: "Gestionnaire de tâches",
    author: "Marie D.",
    avatar: "M",
    description: "Une application simple pour gérer vos tâches quotidiennes en CodeFr",
    likes: 24,
    comments: 8,
    shares: 5
  },
  {
    id: 2,
    title: "Jeu du Snake",
    author: "Thomas L.",
    avatar: "T",
    description: "Implémentation du célèbre jeu Snake en utilisant CodeFr",
    likes: 45,
    comments: 12,
    shares: 15
  },
  {
    id: 3,
    title: "Convertisseur de devises",
    author: "Sophie M.",
    avatar: "S",
    description: "Application de conversion de devises avec taux de change en temps réel",
    likes: 18,
    comments: 6,
    shares: 3
  }
];

const CommunityPage = () => {
  return (
    <AnimatedPage>
      <Box sx={{ py: 4, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 6 }}>
            <Typography variant="h3" component="h1" gutterBottom>
              Communauté CodeFr
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Découvrez et partagez des projets avec la communauté
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Stats Section */}
            <Grid item xs={12}>
              <Grid container spacing={3}>
                {[
                  { icon: <CodeIcon />, title: "Projets", count: "1,234" },
                  { icon: <GroupIcon />, title: "Membres", count: "5,678" },
                  { icon: <ForumIcon />, title: "Discussions", count: "892" }
                ].map((stat, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Card sx={{ textAlign: 'center', py: 2 }}>
                      <Box sx={{ color: 'primary.main', mb: 1 }}>
                        {stat.icon}
                      </Box>
                      <Typography variant="h4" component="div">
                        {stat.count}
                      </Typography>
                      <Typography color="text.secondary">
                        {stat.title}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Projects Section */}
            <Grid item xs={12}>
              <Typography variant="h4" sx={{ mb: 3 }}>
                Projets récents
              </Typography>
              <Grid container spacing={3}>
                {projects.map((project) => (
                  <Grid item xs={12} md={4} key={project.id}>
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
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ mr: 2 }}>{project.avatar}</Avatar>
                          <Typography variant="subtitle1">
                            {project.author}
                          </Typography>
                        </Box>
                        <Typography variant="h6" gutterBottom>
                          {project.title}
                        </Typography>
                        <Typography color="text.secondary" paragraph>
                          {project.description}
                        </Typography>
                      </CardContent>
                      <Divider />
                      <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Button size="small" startIcon={<CodeIcon />}>
                            Voir le code
                          </Button>
                          <Button size="small" startIcon={<ShareIcon />}>
                            Partager
                          </Button>
                        </Box>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </AnimatedPage>
  );
};

export default CommunityPage;
