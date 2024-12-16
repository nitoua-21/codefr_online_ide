import React from 'react';
import { AppBar, Box, Toolbar, Typography, Button, Container, Avatar, Menu, MenuItem, IconButton } from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import CodeIcon from '@mui/icons-material/Code';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { motion, AnimatePresence } from 'framer-motion';

const pages = [
  { name: 'Accueil', path: '/' },
  { name: 'Éditeur', path: '/editor', icon: <CodeIcon sx={{ mr: 0.5 }} />, requiresAuth: true },
  { name: 'Défis', path: '/challenges', icon: <EmojiEventsIcon sx={{ mr: 0.5 }} />, requiresAuth: true },
  { name: 'Apprendre', path: '/learn', icon: <SchoolIcon sx={{ mr: 0.5 }} />, requiresAuth: true },
  { name: 'Communauté', path: '/community', icon: <GroupIcon sx={{ mr: 0.5 }} />, requiresAuth: true },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleCloseMenu();
    logout();
    navigate('/');
  };

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
              (!page.requiresAuth || isAuthenticated) && (
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
              )
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {isAuthenticated ? (
              <>
                {/* Theme Toggle */}
                <IconButton
                  color="inherit"
                  onClick={toggleTheme}
                  sx={{ ml: 1 }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={mode}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 10
                      }}
                    >
                      {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon color='primary' />}
                    </motion.div>
                  </AnimatePresence>
                </IconButton>

                {/* User Menu */}
                <IconButton onClick={handleOpenMenu} sx={{ p: 0 }}>
                  {user?.avatar ? (
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {user.avatar}
                    </Avatar>
                  ) : (
                    <AccountCircleIcon />
                  )}
                </IconButton>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseMenu}
                >
                  <MenuItem onClick={() => { handleCloseMenu(); navigate('/profile'); }}>
                    Mon profil
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    Se déconnecter
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  color="primary"
                >
                  Se connecter
                </Button>
                <Button
                  component={RouterLink}
                  to="/signup"
                  variant="contained"
                  color="primary"
                >
                  S'inscrire
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
