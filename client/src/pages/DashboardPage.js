import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import dashboardService from '../services/dashboardService';
import codeSnippetService from '../services/codeSnippetService';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  Alert,
  Tab,
  Tabs,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Code as CodeIcon,
  EmojiEvents as TrophyIcon,
  Timeline as TimelineIcon,
  Star as StarIcon,
  Add as AddIcon,
  Public as PublicIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import AnimatedPage from '../components/AnimatedPage';
import SnippetList from '../components/CodeSnippets/SnippetList';

const StatCard = ({ icon, title, value, subtitle }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" mb={2}>
        {icon}
        <Typography variant="h6" component="div" ml={1}>
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" gutterBottom>
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [recommendedChallenges, setRecommendedChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snippets, setSnippets] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snippetToDelete, setSnippetToDelete] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, activityData, challengesData, snippetsData] = await Promise.all([
          dashboardService.getUserStats(),
          dashboardService.getRecentActivity(),
          dashboardService.getRecommendedChallenges(),
          codeSnippetService.getMySnippets(),
        ]);

        setStats(statsData.stats);
        setActivity(activityData.activities);
        setRecommendedChallenges(challengesData.challenges);
        setSnippets(snippetsData.snippets);
        console.log("Fetched Snippets:", snippetsData.snippets);
      } catch (err) {
        setError('Error loading dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleNewSnippet = () => {
    navigate('/editor');
  };

  const handleDeleteSnippet = async () => {
    if (!snippetToDelete) return;

    try {
      await codeSnippetService.deleteSnippet(snippetToDelete);
      setSnippets(snippets.filter(s => s._id !== snippetToDelete));
      setDeleteDialogOpen(false);
      setSnippetToDelete(null);
    } catch (err) {
      console.error('Delete snippet error:', err);
      setError('Error deleting snippet');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredSnippets = tabValue === 0 
    ? snippets 
    : snippets.filter(s => s.isPublic === (tabValue === 1));

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AnimatedPage>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* User Welcome Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <Avatar
                sx={{ width: 56, height: 56, mr: 2 }}
                src={user?.profilePicture}
              >
                {user?.username?.[0]?.toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h5" gutterBottom>
                  Bienvenue, {user?.username}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {stats?.rank || 'Débutant'} - Top {stats?.rankPercentile || 0}%
                </Typography>
              </Box>
            </Box>
            <Button
              variant="outlined"
              startIcon={<SettingsIcon />}
              onClick={() => navigate('/settings')}
              sx={{ ml: 2 }}
            >
              Profil
            </Button>
          </Box>
        </Paper>

        {/* Stats Section */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<CodeIcon color="primary" />}
              title="Snippets"
              value={snippets.length}
              subtitle="Total de vos snippets"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<StarIcon color="primary" />}
              title="Défis"
              value={stats?.solvedChallenges || 0}
              subtitle="Défis complétés"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<TrophyIcon color="primary" />}
              title="Points"
              value={stats?.totalPoints || 0}
              subtitle="Score total"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<TimelineIcon color="primary" />}
              title="Série"
              value={stats?.currentStreak || 0}
              subtitle="Jours consécutifs"
            />
          </Grid>
        </Grid>

        {/* Code Snippets Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Mes Snippets
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleNewSnippet}
            >
              Nouveau Snippet
            </Button>
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Tous" />
              <Tab label="Public" />
              <Tab label="Privé" />
            </Tabs>
          </Box>

          {filteredSnippets.length === 0 ? (
            <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
              Aucun snippet trouvé
            </Typography>
          ) : (
            <SnippetList
              snippets={filteredSnippets}
              onDelete={(id) => {
                setSnippetToDelete(id);
                setDeleteDialogOpen(true);
              }}
            />
          )}
        </Paper>

        {/* Recent Activity Section */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Activité Récente
              </Typography>
              <List>
                {activity.length > 0 ? (
                  activity.map((item, index) => (
                    <React.Fragment key={item.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar>
                            <HistoryIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={item.title}
                          secondary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {item.type}
                              </Typography>
                              {` — ${item.description}`}
                            </>
                          }
                        />
                      </ListItem>
                      {index < activity.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                    Aucune activité récente
                  </Typography>
                )}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Défis Recommandés
              </Typography>
              <List>
                {recommendedChallenges.length > 0 ? (
                  recommendedChallenges.map((challenge, index) => (
                    <React.Fragment key={challenge._id}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar>
                            <TrophyIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={challenge.title}
                          secondary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {challenge.difficulty}
                              </Typography>
                              {` — ${challenge.description}`}
                            </>
                          }
                        />
                      </ListItem>
                      {index < recommendedChallenges.length - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                    Aucun défi recommandé pour le moment
                  </Typography>
                )}
              </List>
            </Paper>
          </Grid>
        </Grid>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogContent>
            <Typography>
              Êtes-vous sûr de vouloir supprimer ce snippet ? Cette action est irréversible.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleDeleteSnippet} color="error" variant="contained">
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </AnimatedPage>
  );
};

export default DashboardPage;
