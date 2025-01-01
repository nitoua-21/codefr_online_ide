import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  useTheme
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoIcon from '@mui/icons-material/Info';
import { Link as RouterLink} from 'react-router-dom';
import MonacoEditor from '../components/CodeEditor/MonacoEditor';


const DEFAULT_CODE = `Algorithme SommeTableau
Variable somme, i: Entier
Tableau T[5]: Entier
Debut
    Pour i De 0 A 4 Faire
        T[i] = i * 2
    FinPour

    somme = 0
    Pour i De 0 A 4 Faire
        somme = somme + T[i]
    FinPour

    Ecrire("Somme:", somme)
Fin
`
const Hero = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.grey[900]} 0%, ${theme.palette.grey[800]} 100%)`,
        color: 'white',
        py: 8,
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            flexDirection: { xs: 'column', md: 'row' }
          }}
        >
          <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                mb: 3,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontWeight: 'bold'
              }}
            >
              Écrivez, Exécutez et Partagez des algorithmes en Ligne
            </Typography>
            <Typography
              variant="h5"
              sx={{ mb: 4, color: 'grey.400' }}
            >
              Un IDE en ligne puissant pour le langage de programmation CodeFr avec exécution en temps réel et fonctionnalités collaboratives.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <Button
                component={RouterLink}
                to="/editor"
                variant="contained"
                size="large"
                startIcon={<PlayArrowIcon />}
              >
                Essayer
              </Button>
              <Button
                component={RouterLink}
                to="/about"
                variant="outlined"
                size="large"
                startIcon={<InfoIcon />}
                sx={{ color: 'white', borderColor: 'white' }}
              >
                En Savoir Plus
              </Button>
            </Box>
          </Box>

          <Paper
            sx={{
              flex: 1,
              p: 3,
              borderRadius: 2,
              maxWidth: { xs: '100%', md: '500px' }
            }}
          >
            <MonacoEditor
              language="c"
              theme="vs-dark"
              readOnly = {true}
              height='350px'
              showMap = {false}
              value={DEFAULT_CODE}
            />
            {/*<Typography
              component="pre"
              sx={{
                fontFamily: 'Fira Code, monospace',
                fontSize: '1rem',
                color: 'grey.300',
                overflow: 'auto'
              }}
            >
              <code>
{`Algorithme SommeTableau
Variable somme, i: Entier
Tableau T[5]: Entier
Debut
    Pour i De 0 A 4 Faire
        T[i] = i * 2
    FinPour

    somme = 0
    Pour i De 0 A 4 Faire
        somme = somme + T[i]
    FinPour

    Ecrire("Somme:", somme)
Fin
`}
              </code>
            </Typography>*/}
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
