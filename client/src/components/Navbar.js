import React from 'react';
import { AppBar, Box, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import CodeIcon from '@mui/icons-material/Code';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';

const pages = [
  { name: 'Accueil', path: '/' },
  { name: 'Éditeur', path: '/editor', icon: <CodeIcon sx={{ mr: 0.5 }} /> },
  { name: 'Défis', path: '/challenges', icon: <EmojiEventsIcon sx={{ mr: 0.5 }} /> },
  { name: 'Apprendre', path: '/learn', icon: <SchoolIcon sx={{ mr: 0.5 }} /> },
  { name: 'Communauté', path: '/community', icon: <GroupIcon sx={{ mr: 0.5 }} /> },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'background.paper' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <CodeIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            CodeFr
          </Typography>

          <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
            {pages.map((page) => (
              <Button
                key={page.path}
                component={RouterLink}
                to={page.path}
                sx={{
                  color: 'text.primary',
                  display: 'flex',
                  alignItems: 'center',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '2px',
                    bgcolor: 'primary.main',
                    transform: location.pathname === page.path ? 'scaleX(1)' : 'scaleX(0)',
                    transition: 'transform 0.3s ease-in-out',
                  },
                  '&:hover::after': {
                    transform: 'scaleX(1)',
                  },
                }}
              >
                {page.icon}
                {page.name}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Button 
              variant="contained" 
              color="primary"
              sx={{ ml: 2 }}
            >
              Se connecter
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
