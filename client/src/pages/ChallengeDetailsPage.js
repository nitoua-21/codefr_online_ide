import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Chip,
  Button,
  Divider,
  Paper,
  Rating,
  Avatar,
  TextField,
  IconButton,
  Tab,
  Tabs,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  Timer as TimerIcon,
  WorkspacePremium as WorkspacePremiumIcon,
  Send as SendIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import { useChallenges } from '../contexts/ChallengesContext';
import { useAuth } from '../contexts/AuthContext';
import MonacoEditor from '../components/CodeEditor/MonacoEditor';
import AnimatedPage from '../components/AnimatedPage';

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`tabpanel-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const ChallengeDetailsPage = () => {
  const { id } = useParams();
  const { getChallenge } = useChallenges();
  const { user } = useAuth();
  const navigate = useNavigate();
  const challenge = getChallenge(parseInt(id));

  const [tabValue, setTabValue] = useState(0);
  const [code, setCode] = useState(challenge?.code || '');
  const [comment, setComment] = useState('');
  const [submissions] = useState([
    {
      id: 1,
      user: {
        name: 'Alice Martin',
        avatar: 'https://mui.com/static/images/avatar/1.jpg'
      },
      code: `Algorithme TriBulles
Variables
    tab: Tableau[5] d'Entiers
    i, j, temp: Entier
Debut
    tab[0] = 5
    tab[1] = 2
    tab[2] = 8
    tab[3] = 1
    tab[4] = 9

    Pour i De 0 A 3 Faire
        Pour j De 0 A 3-i Faire
            Si tab[j] > tab[j+1] Alors
                temp = tab[j]
                tab[j] = tab[j+1]
                tab[j+1] = temp
            FinSi
        FinPour
    FinPour
Fin`,
      rating: 4.5,
      votes: 12,
      comments: [
        {
          user: 'Bob',
          text: 'Belle implémentation, très claire !',
          timestamp: '2024-12-15T14:30:00'
        }
      ]
    },
    {
      id: 2,
      user: {
        name: 'Thomas Dubois',
        avatar: 'https://mui.com/static/images/avatar/2.jpg'
      },
      code: `Algorithme TriBulles
Variables
    tab: Tableau[5] d'Entiers
    i, j, temp: Entier
    trie: Logique
Debut
    tab[0] = 5
    tab[1] = 2
    tab[2] = 8
    tab[3] = 1
    tab[4] = 9
    
    trie = Faux
    TantQue Non trie Faire
        trie = Vrai
        Pour i De 0 A 3 Faire
            Si tab[i] > tab[i+1] Alors
                temp = tab[i]
                tab[i] = tab[i+1]
                tab[i+1] = temp
                trie = Faux
            FinSi
        FinPour
    FinTantQue
Fin`,
      rating: 4.8,
      votes: 15,
      comments: [
        {
          user: 'Claire',
          text: 'J\'aime l\'optimisation avec le booléen !',
          timestamp: '2024-12-15T15:45:00'
        }
      ]
    }
  ]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSubmit = () => {
    // TODO: Submit solution
    console.log('Submitting solution:', code);
  };

  const handleComment = () => {
    if (!comment.trim()) return;
    // TODO: Add comment
    console.log('Adding comment:', comment);
    setComment('');
  };

  if (!challenge) {
    return (
      <Container>
        <Typography variant="h4">Challenge not found</Typography>
      </Container>
    );
  }

  return (
    <AnimatedPage>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            {challenge.title}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip
              label={challenge.difficulty}
              color={
                challenge.difficulty === 'Facile'
                  ? 'success'
                  : challenge.difficulty === 'Moyen'
                  ? 'warning'
                  : 'error'
              }
            />
            <Chip label={challenge.category} variant="outlined" />
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              <TimerIcon sx={{ mr: 0.5 }} />
              <Typography variant="body2">{challenge.timeEstimate}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              <WorkspacePremiumIcon sx={{ mr: 0.5 }} />
              <Typography variant="body2">{challenge.points} pts</Typography>
            </Box>
          </Box>

          <Typography variant="body1" paragraph>
            {challenge.description}
          </Typography>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Solution" />
            <Tab label="Soumissions" />
            <Tab label="Discussion" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Box sx={{ height: 400, mb: 2 }}>
              <MonacoEditor
                value={code}
                onChange={setCode}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                startIcon={<SendIcon />}
              >
                Soumettre
              </Button>
            </Box>
          </Paper>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            {submissions.map((submission) => (
              <Grid item xs={12} key={submission.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        src={submission.user.avatar}
                        sx={{ mr: 2 }}
                      />
                      <Typography variant="h6">
                        {submission.user.name}
                      </Typography>
                      <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                        <Rating value={submission.rating} precision={0.5} readOnly />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          ({submission.votes})
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ height: 200, mb: 2 }}>
                      <MonacoEditor
                        value={submission.code}
                        readOnly={true}
                      />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      {submission.comments.map((comment, index) => (
                        <Box key={index} sx={{ mb: 1 }}>
                          <Typography variant="subtitle2" component="span">
                            {comment.user}:
                          </Typography>
                          <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                            {comment.text}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <IconButton size="small" color="primary">
                      <ThumbUpIcon />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <ThumbDownIcon />
                    </IconButton>
                    <TextField
                      size="small"
                      placeholder="Ajouter un commentaire..."
                      sx={{ ml: 2, flex: 1 }}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                    />
                    <IconButton
                      color="primary"
                      onClick={handleComment}
                      disabled={!comment.trim()}
                    >
                      <SendIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', mb: 2 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Participer à la discussion..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ ml: 2 }}
                onClick={handleComment}
                disabled={!comment.trim()}
              >
                Commenter
              </Button>
            </Box>
            <Divider sx={{ my: 2 }} />
            {/* TODO: Add discussion thread */}
          </Paper>
        </TabPanel>
      </Container>
    </AnimatedPage>
  );
};

export default ChallengeDetailsPage;
