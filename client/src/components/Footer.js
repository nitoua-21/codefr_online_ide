import React from 'react';
import { Box, Container, Typography, Link, IconButton, Stack } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary" align="center">
              {'Copyright © '}
              <Link color="inherit" href="https://github.com/nitoua-21/CodeFr">
                CodeFr
              </Link>{' '}
              {currentYear}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Créé par Nitoua Adrien
            </Typography>
          </Box>

          <Stack direction="row" spacing={2}>
            <IconButton
              href="https://github.com/nitoua-21/CodeFr"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              aria-label="github"
            >
              <GitHubIcon />
            </IconButton>
            <IconButton
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              aria-label="linkedin"
            >
              <LinkedInIcon />
            </IconButton>
            <IconButton
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              aria-label="twitter"
            >
              <TwitterIcon />
            </IconButton>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
