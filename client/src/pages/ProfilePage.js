import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Chip,
  LinearProgress,
  Card,
  CardContent,
  Divider,
  Button,
} from '@mui/material';
import {
  Code as CodeIcon,
  EmojiEvents as TrophyIcon,
  Timeline as TimelineIcon,
  Group as GroupIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import AnimatedPage from '../components/AnimatedPage';

const ProfilePage = () => {
  const { user } = useAuth();

  const stats = [
    { icon: <CodeIcon />, label: 'Défis complétés', value: '15' },
    { icon: <TrophyIcon />, label: 'Points', value: '2,450' },
    { icon: <TimelineIcon />, label: 'Niveau', value: '8' },
    { icon: <GroupIcon />, label: 'Abonnés', value: '124' },
  ];

  const recentActivities = [
    { type: 'challenge', title: 'Tri à bulles', date: '2024-12-15', points: 100 },
    { type: 'project', title: 'Calculatrice', date: '2024-12-14', likes: 12 },
    { type: 'achievement', title: 'Premier algorithme', date: '2024-12-13', badge: '🏆' },
  ];

  const skills = [
    { name: 'Algorithmes', level: 75 },
    { name: 'Structures de données', level: 60 },
    { name: 'Programmation', level: 85 },
    { name: 'Logique', level: 70 },
  ];

  return (
    <AnimatedPage>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Profile Header */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: 'primary.main',
                  fontSize: '2.5rem',
                }}
              >
                {user?.avatar}
              </Avatar>
              <Box>
                <Typography variant="h4" gutterBottom>
                  {user?.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {user?.email}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip label="Développeur CodeFr" color="primary" sx={{ mr: 1 }} />
                  <Chip label="Niveau 8" color="secondary" />
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Stats */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {stats.map((stat, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Box sx={{ color: 'primary.main' }}>{stat.icon}</Box>
                    <Typography variant="h4">{stat.value}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Skills and Activities */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Compétences
              </Typography>
              <Box sx={{ mt: 2 }}>
                {skills.map((skill, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{skill.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {skill.level}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={skill.level}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Activités récentes
              </Typography>
              <Box sx={{ mt: 2 }}>
                {recentActivities.map((activity, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <Divider sx={{ my: 2 }} />}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="subtitle1">
                          {activity.title}
                          {activity.badge && ` ${activity.badge}`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(activity.date).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </Typography>
                      </Box>
                      {activity.points && (
                        <Chip
                          label={`+${activity.points} pts`}
                          color="success"
                          size="small"
                        />
                      )}
                      {activity.likes && (
                        <Chip
                          label={`${activity.likes} ❤️`}
                          variant="outlined"
                          size="small"
                        />
                      )}
                    </Box>
                  </React.Fragment>
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Edit Profile Button */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                component={RouterLink}
                to="/settings"
                startIcon={<EditIcon />}
                sx={{ px: 4 }}
              >
                Modifier le profil
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </AnimatedPage>
  );
};

export default ProfilePage;
