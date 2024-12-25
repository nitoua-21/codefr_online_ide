import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, Box, CircularProgress } from '@mui/material';
import AnimatedPage from '../components/AnimatedPage';
import CodeIcon from '@mui/icons-material/Code';
import GroupIcon from '@mui/icons-material/Group';
import ForumIcon from '@mui/icons-material/Forum';
import codeSnippetService from '../services/codeSnippetService';
import SnippetList from '../components/CodeSnippets/SnippetList';

const CommunityPage = () => {
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

  const handleDelete = async (snippetId) => {
    try {
      await codeSnippetService.deleteSnippet(snippetId);
      setSnippets(snippets.filter(snippet => snippet._id !== snippetId));
    } catch (err) {
      console.error('Error deleting snippet:', err);
    }
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
                  { icon: <CodeIcon />, title: "Codes", count: "1,234" },
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
                Codes récents
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
                <SnippetList snippets={snippets} onDelete={handleDelete} />
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </AnimatedPage>
  );
};

export default CommunityPage;
