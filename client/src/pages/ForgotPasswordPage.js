import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AnimatedPage from '../components/AnimatedPage';
import authService from '../services/authService';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await authService.forgotPassword(email);
      setMessage({
        type: 'success',
        text: 'Un email de réinitialisation a été envoyé à votre adresse email'
      });
      setEmail('');
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Une erreur est survenue'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            py: 4
          }}
        >
          <Paper
            elevation={theme.palette.mode === 'dark' ? 2 : 1}
            sx={{
              p: 4,
              borderRadius: 2,
              bgcolor: theme.palette.background.paper
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              align="center"
              sx={{ mb: 4 }}
            >
              Mot de passe oublié ?
            </Typography>

            {message.text && (
              <Alert
                severity={message.type}
                sx={{ mb: 3 }}
                onClose={() => setMessage({ type: '', text: '' })}
              >
                {message.text}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{ mb: 3 }}
              />

              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
                sx={{
                  py: 1.5,
                  mb: 2,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem'
                }}
              >
                {loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Link
                  to="/login"
                  style={{
                    color: theme.palette.primary.main,
                    textDecoration: 'none'
                  }}
                >
                  Retour à la connexion
                </Link>
              </Box>
            </form>
          </Paper>
        </Box>
      </Container>
    </AnimatedPage>
  );
};

export default ForgotPasswordPage;
