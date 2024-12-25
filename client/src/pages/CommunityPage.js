import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, Box, Avatar, Divider, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AnimatedPage from '../components/AnimatedPage';
import CodeIcon from '@mui/icons-material/Code';
import GroupIcon from '@mui/icons-material/Group';
import ForumIcon from '@mui/icons-material/Forum';
import ShareIcon from '@mui/icons-material/Share';
import VisibilityIcon from '@mui/icons-material/Visibility';
import codeSnippetService from '../services/codeSnippetService';

const CommunityPage = () => {
  const navigate = useNavigate();
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const response = await codeSnippetService.getPublicSnippets(1, 6);
        setSnippets(response.snippets);
      } catch (err) {
        setError(err.message || 'Error fetching snippets');
      } finally {
        setLoading(false);
      }
    };

    fetchSnippets();
  }, []);

  const handleViewCode = (snippet) => {
    navigate(`/editor?snippet=${snippet._id}`);
  };

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
              {loading ? (
                <Box display="flex" justifyContent="center" p={3}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Typography color="error" align="center">
                  {error}
                </Typography>
              ) : (
                <Grid container spacing={3}>
                  {snippets.map((snippet) => (
                    <Grid item xs={12} md={4} key={snippet._id}>
                      <Card 
                        sx={{ 
                          height: '100%', 
                          display: 'flex', 
                          flexDirection: 'column',
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 4
                          }
                        }}
                      >
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                              {snippet.author.username[0].toUpperCase()}
                            </Avatar>
                            <Typography variant="subtitle1">
                              {snippet.author.username}
                            </Typography>
                          </Box>
                          <Typography variant="h6" gutterBottom>
                            {snippet.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {snippet.description}
                          </Typography>
                        </CardContent>
                        <Divider />
                        <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              {snippet.likes?.length || 0} likes
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              •
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {snippet.comments?.length || 0} commentaires
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              size="small"
                              startIcon={<VisibilityIcon />}
                              onClick={() => handleViewCode(snippet)}
                            >
                              Voir
                            </Button>
                            <Button
                              size="small"
                              startIcon={<ShareIcon />}
                              onClick={() => {/* Handle share */}}
                            >
                              Partager
                            </Button>
                          </Box>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </AnimatedPage>
  );
};

export default CommunityPage;
