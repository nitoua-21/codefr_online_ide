import React, { useState } from 'react';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  Avatar, 
  Menu, 
  MenuItem, 
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider
} from '@mui/material';
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
import DashboardIcon from '@mui/icons-material/Dashboard';
import { motion, AnimatePresence } from 'framer-motion';

const pages = [
  { name: 'Accueil', path: '/' },
  { name: 'Tableau de bord', path: '/dashboard', icon: <DashboardIcon sx={{ mr: 0.5 }} />, requiresAuth: true },
  { name: 'Éditeur', path: '/editor', icon: <CodeIcon sx={{ mr: 0.5 }} />, requiresAuth: true },
  { name: 'Défis', path: '/challenges', icon: <EmojiEventsIcon sx={{ mr: 0.5 }} />, requiresAuth: true },
  { name: 'Documentation', path: '/docs', icon: <SchoolIcon sx={{ mr: 0.5 }} />, requiresAuth: true },
  { name: 'Communauté', path: '/community', icon: <GroupIcon sx={{ mr: 0.5 }} />, requiresAuth: true },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
      <List>
        {pages.map((page) => (
          (!page.requiresAuth || isAuthenticated) && (
            <ListItem key={page.path} disablePadding>
              <ListItemButton
                component={RouterLink}
                to={page.path}
                selected={location.pathname === page.path}
              >
                <ListItemIcon>
                  {page.icon}
                </ListItemIcon>
                <ListItemText primary={page.name} />
              </ListItemButton>
            </ListItem>
          )
        ))}
      </List>
      <Divider />
      {isAuthenticated ? (
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => { navigate('/profile'); handleDrawerToggle(); }}>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Mon profil" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => { handleLogout(); handleDrawerToggle(); }}>
              <ListItemText primary="Se déconnecter" />
            </ListItemButton>
          </ListItem>
        </List>
      ) : (
        <List>
          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to="/login" onClick={handleDrawerToggle}>
              <ListItemText primary="Se connecter" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to="/signup" onClick={handleDrawerToggle}>
              <ListItemText primary="S'inscrire" />
            </ListItemButton>
          </ListItem>
        </List>
      )}
    </Box>
  );

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'background.paper' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Mobile Menu Icon */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
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

          {/* Mobile Logo */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            CodeFr
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 2 }}>
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

          {/* Theme Toggle and User Menu */}
          <Box sx={{ flexGrow: 0 }}>
            {isAuthenticated && (
              <>
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

                <IconButton onClick={handleOpenMenu} sx={{ p: 0, ml: 1 }}>
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
            )}

            {/* Desktop Login/Signup Buttons */}
            {!isAuthenticated && (
              <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
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

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
