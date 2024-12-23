import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Stack,
  Divider,
  Tabs,
  Tab,
  TextField,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondary
} from '@mui/material';
import {
  Timer as TimerIcon,
  WorkspacePremium as WorkspacePremiumIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Send as SendIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Code as CodeIcon
} from '@mui/icons-material';
import { useChallenges } from '../contexts/ChallengesContext';
import { useAuth } from '../contexts/AuthContext';
import AnimatedPage from '../components/AnimatedPage';
import MonacoEditor from '../components/CodeEditor/MonacoEditor';

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`tabpanel-${index}`}
    aria-labelledby={`tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const ChallengeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getChallenge, loading, error } = useChallenges();
  const [challenge, setChallenge] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [comment, setComment] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const challengeData = await getChallenge(id);
        setChallenge(challengeData);
        setCode(challengeData.initialCode || '');
      } catch (err) {
        console.error('Error fetching challenge:', err);
      }
    };

    fetchChallenge();
  }, [id, getChallenge]);

  const canManageChallenge = () => {
    if (!user || !challenge) return false;
    return user.role === 'admin' || challenge.author._id === user._id;
  };

  const handleStartChallenge = () => {
    navigate(`/editor?challenge=${id}`);
  };

  const handleEditChallenge = () => {
    navigate(`/challenges/edit/${id}`);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCommentSubmit = () => {
    // TODO: Implement comment submission
    console.log('Submitting comment:', comment);
    setComment('');
  };

  const handleSolutionSubmit = () => {
    // TODO: Implement solution submission
    console.log('Submitting solution:', code);
  };

  if (loading) {
    return (
      <AnimatedPage>
        <Container>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress />
          </Box>
        </Container>
      </AnimatedPage>
    );
  }

  if (error) {
    return (
      <AnimatedPage>
        <Container>
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        </Container>
      </AnimatedPage>
    );
  }

  if (!challenge) {
    return (
      <AnimatedPage>
        <Container>
          <Alert severity="info" sx={{ mt: 3 }}>
            Challenge not found
          </Alert>
        </Container>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" gap={2} mb={4}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/challenges')}
          >
            Retour
          </Button>
          <Typography variant="h4" component="h1" flex={1}>
            {challenge.title}
          </Typography>
          {canManageChallenge() && (
            <Button
              startIcon={<EditIcon />}
              variant="outlined"
              onClick={handleEditChallenge}
            >
              Modifier
            </Button>
          )}
        </Box>

        <Grid container spacing={4}>
          {/* Challenge Info */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Stack spacing={3}>
                {/* Tags */}
                <Box display="flex" gap={1} flexWrap="wrap">
                  <Chip
                    label={challenge.difficulty}
                    color={
                      challenge.difficulty === 'Facile' ? 'success' :
                      challenge.difficulty === 'Moyen' ? 'warning' : 'error'
                    }
                  />
                  <Chip label={challenge.category} variant="outlined" />
                  {challenge.tags?.map((tag) => (
                    <Chip key={tag} label={tag} variant="outlined" size="small" />
                  ))}
                </Box>

                {/* Challenge Details */}
                <Box>
                  <Typography variant="body1" paragraph>
                    {challenge.description}
                  </Typography>
                </Box>

                <Divider />

                {/* Challenge Metadata */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={3}>
                    <Box display="flex" alignItems="center">
                      <TimerIcon sx={{ mr: 1 }} />
                      <Typography>
                        {challenge.timeLimit} minutes
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <WorkspacePremiumIcon sx={{ mr: 1 }} />
                      <Typography>
                        {challenge.points} points
                      </Typography>
                    </Box>
                  </Stack>

                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleStartChallenge}
                  >
                    Commencer le défi
                  </Button>
                </Box>
              </Stack>
            </Paper>

            {/* Tabs Section */}
            <Paper sx={{ mt: 3 }}>
              <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tab label="Solutions" icon={<CodeIcon />} iconPosition="start" />
                <Tab label="Commentaires" icon={<ThumbUpIcon />} iconPosition="start" />
              </Tabs>

              {/* Solutions Tab */}
              <TabPanel value={tabValue} index={0}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Votre Solution
                  </Typography>
                  <Box sx={{ height: 300, mb: 2 }}>
                    <MonacoEditor
                      value={code}
                      onChange={setCode}
                      language="javascript"
                    />
                  </Box>
                  <Box display="flex" justifyContent="flex-end">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSolutionSubmit}
                      startIcon={<SendIcon />}
                    >
                      Soumettre
                    </Button>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>
                  Solutions Récentes
                </Typography>
                <List>
                  {challenge.latestSolutions?.map((solution, index) => (
                    <ListItem
                      key={index}
                      alignItems="flex-start"
                      secondaryAction={
                        <Box>
                          <IconButton size="small" color="primary">
                            <ThumbUpIcon />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <ThumbDownIcon />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar>{solution.author.username[0]}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={solution.author.username}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {solution.status === 'passed' ? '✅ Réussi' : solution.status === 'failed' ? '❌ Échoué' : '⏳ En cours'}
                            </Typography>
                            {' — '}{new Date(solution.createdAt).toLocaleDateString()}
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </TabPanel>

              {/* Comments Tab */}
              <TabPanel value={tabValue} index={1}>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Ajouter un commentaire..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Box display="flex" justifyContent="flex-end">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleCommentSubmit}
                      disabled={!comment.trim()}
                      startIcon={<SendIcon />}
                    >
                      Commenter
                    </Button>
                  </Box>
                </Box>

                <List>
                  {/* TODO: Replace with actual comments */}
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar>U</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Utilisateur"
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            Excellent défi ! J'ai beaucoup appris.
                          </Typography>
                          {' — Il y a 2 heures'}
                        </>
                      }
                    />
                  </ListItem>
                </List>
              </TabPanel>
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                À propos
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Créé par
                </Typography>
                <Typography>
                  {challenge.author?.username || 'Unknown'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Solutions soumises
                </Typography>
                <Typography>
                  {challenge.solutionsCount || 0}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </AnimatedPage>
  );
};

export default ChallengeDetailsPage;
