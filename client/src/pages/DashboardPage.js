import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import dashboardService from '../services/dashboardService';
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
} from '@mui/material';
import {
  Code as CodeIcon,
  EmojiEvents as TrophyIcon,
  Timeline as TimelineIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import AnimatedPage from '../components/AnimatedPage';

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
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [recommendedChallenges, setRecommendedChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, activityData, challengesData] = await Promise.all([
          dashboardService.getUserStats(),
          dashboardService.getRecentActivity(),
          dashboardService.getRecommendedChallenges(),
        ]);

        setStats(statsData);
        setActivity(activityData.activities);
        setRecommendedChallenges(challengesData.challenges);
      } catch (err) {
        setError('Error loading dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
          <Box display="flex" alignItems="center">
            <Avatar
              src={user?.avatar}
              alt={user?.username}
              sx={{ width: 64, height: 64, mr: 2 }}
            >
              {user?.username?.[0]?.toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h4" gutterBottom>
                Bienvenue, {user?.username}!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Continuez votre progression en relevant de nouveaux défis
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<CodeIcon color="primary" />}
              title="Défis Résolus"
              value={stats?.solvedChallenges || 0}
              subtitle="Total des défis complétés"
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
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<StarIcon color="primary" />}
              title="Rang"
              value={stats?.rank || 'Débutant'}
              subtitle={`Top ${stats?.rankPercentile || 0}%`}
            />
          </Grid>
        </Grid>

        {/* Recent Activity and Recommended Challenges */}
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
                            <CodeIcon />
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
                    <React.Fragment key={challenge.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar>
                            <StarIcon />
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
      </Container>
    </AnimatedPage>
  );
};

export default DashboardPage;
