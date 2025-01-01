import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  IconButton,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import {
  PhotoCamera,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import AnimatedPage from '../components/AnimatedPage';
import { motion } from 'framer-motion';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import userService from '../services/userService';

const TabPanel = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const SettingsPage = () => {
  const { user, updateUserData } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
    github: user?.github || '',
    website: user?.website || '',
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: user?.preferences?.emailNotifications ?? true,
    challengeNotifications: user?.preferences?.challengeNotifications ?? true,
    autoComplete: user?.preferences?.autoComplete ?? true,
    lineNumbers: user?.preferences?.lineNumbers ?? true,
    minimap: user?.preferences?.minimap ?? true,
  });

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePreferenceChange = (name) => (event) => {
    setPreferences({
      ...preferences,
      [name]: event.target.checked,
    });
  };

  const handleSecurityChange = (e) => {
    setSecurity({
      ...security,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user: updatedUser } = await userService.updateProfile(profileData);
      updateUserData(updatedUser);
      setMessage({
        type: 'success',
        text: 'Profile updated successfully',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Error updating profile',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user: updatedUser } = await userService.updatePreferences(preferences);
      updateUserData(updatedUser);
      setMessage({
        type: 'success',
        text: 'Preferences updated successfully',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Error updating preferences',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (security.newPassword !== security.confirmPassword) {
      setMessage({
        type: 'error',
        text: 'New passwords do not match',
      });
      return;
    }

    setLoading(true);
    try {
      await userService.updatePassword({
        currentPassword: security.currentPassword,
        newPassword: security.newPassword,
      });
      setMessage({
        type: 'success',
        text: 'Password updated successfully',
      });
      setSecurity({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Error updating password',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Paramètres
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

        <Paper sx={{ width: '100%', bgcolor: 'background.paper' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<Badge color="primary">👤</Badge>} label="Profil" />
            <Tab icon={<NotificationsIcon />} label="Préférences" />
            <Tab icon={<SecurityIcon />} label="Sécurité" />
            <Tab icon={<CodeIcon />} label="Éditeur" />
          </Tabs>

          <TabPanel value={activeTab} index={0}>
            <Box component="form" onSubmit={handleProfileSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} display="flex" justifyContent="center">
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="label"
                        sx={{
                          bgcolor: 'background.paper',
                          '&:hover': { bgcolor: 'background.paper' },
                        }}
                      >
                        <input hidden accept="image/*" type="file" />
                        <PhotoCamera />
                      </IconButton>
                    }
                  >
                    <Avatar
                      sx={{
                        width: 100,
                        height: 100,
                        fontSize: '2.5rem',
                        bgcolor: 'primary.main',
                      }}
                    >
                      {user?.avatar}
                    </Avatar>
                  </Badge>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Pseudo"
                    name="username"
                    value={profileData.username}
                    onChange={handleProfileChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bio"
                    name="bio"
                    multiline
                    rows={4}
                    value={profileData.bio}
                    onChange={handleProfileChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Localisation"
                    name="location"
                    value={profileData.location}
                    onChange={handleProfileChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Site web"
                    name="website"
                    value={profileData.website}
                    onChange={handleProfileChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="GitHub"
                    name="github"
                    value={profileData.github}
                    onChange={handleProfileChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{ mr: 1 }}
                  >
                    Enregistrer les modifications
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Box component="form" onSubmit={handlePreferencesSubmit}>
              <Typography variant="h6" gutterBottom>
                Notifications
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.emailNotifications}
                    onChange={handlePreferenceChange('emailNotifications')}
                  />
                }
                label="Recevoir des notifications par email"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.challengeNotifications}
                    onChange={handlePreferenceChange('challengeNotifications')}
                  />
                }
                label="Notifications de nouveaux défis"
              />
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Apparence
              </Typography>
              <motion.div
                initial={false}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={mode === 'dark'}
                      onChange={toggleTheme}
                      sx={{
                        '& .MuiSwitch-thumb': {
                          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        },
                        '& .MuiSwitch-track': {
                          transition: 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        },
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <motion.div
                        initial={false}
                        animate={{ 
                          rotate: mode === 'dark' ? 360 : 0,
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
                      </motion.div>
                      Mode sombre
                    </Box>
                  }
                />
              </motion.div>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ mt: 3 }}
              >
                Enregistrer les préférences
              </Button>
            </Box>
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <Box component="form" onSubmit={handlePasswordSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Mot de passe actuel"
                    name="currentPassword"
                    type="password"
                    value={security.currentPassword}
                    onChange={handleSecurityChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nouveau mot de passe"
                    name="newPassword"
                    type="password"
                    value={security.newPassword}
                    onChange={handleSecurityChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Confirmer le nouveau mot de passe"
                    name="confirmPassword"
                    type="password"
                    value={security.confirmPassword}
                    onChange={handleSecurityChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                  >
                    Changer le mot de passe
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            <Box component="form" onSubmit={handlePreferencesSubmit}>
              <Typography variant="h6" gutterBottom>
                Préférences de l'éditeur
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.autoComplete}
                    onChange={handlePreferenceChange('autoComplete')}
                  />
                }
                label="Auto-complétion"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.lineNumbers}
                    onChange={handlePreferenceChange('lineNumbers')}
                  />
                }
                label="Numéros de ligne"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.minimap}
                    onChange={handlePreferenceChange('minimap')}
                  />
                }
                label="Minimap"
              />

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ mt: 3 }}
              >
                Enregistrer les préférences
              </Button>
            </Box>
          </TabPanel>
        </Paper>
      </Container>
    </AnimatedPage>
  );
};

export default SettingsPage;
