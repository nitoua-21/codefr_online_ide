import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';

const Navbar = () => {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <CodeIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{ 
                color: 'primary.main',
                fontWeight: 'bold',
                flexGrow: 1,
                textDecoration: 'none'
              }}
            >
              CodeFr IDE
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              component={RouterLink}
              to="/editor"
              color="inherit"
            >
              Éditeur
            </Button>
            <Button
              component={RouterLink}
              to="/defis"
              color="inherit"
            >
              Défis
            </Button>
            <Button
              component={RouterLink}
              to="/communaute"
              color="inherit"
            >
              Communauté
            </Button>
            <Button
              component={RouterLink}
              to="/connexion"
              color="inherit"
            >
              Connexion
            </Button>
            <Button
              variant="contained"
              component={RouterLink}
              to="/inscription"
              color="primary"
            >
              S'inscrire
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
