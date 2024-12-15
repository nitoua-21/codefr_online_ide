import React from 'react';
import { Box } from '@mui/material';

const EditorWrapper = ({ children, isTransitioning, theme }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        '& > *': {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transition: 'opacity 0.3s ease-in-out',
          opacity: isTransitioning ? 0 : 1
        }
      }}
    >
      {children}
    </Box>
  );
};

export default EditorWrapper;
