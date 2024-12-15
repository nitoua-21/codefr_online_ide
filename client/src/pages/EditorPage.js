import React from 'react';
import { Container, Box } from '@mui/material';
import CodeEditor from '../components/CodeEditor/CodeEditor';
import AnimatedPage from '../components/AnimatedPage';

const EditorPage = () => {
  return (
    <AnimatedPage>
      <Box sx={{ py: 3 }}>
        <Container maxWidth="xl">
          <CodeEditor />
        </Container>
      </Box>
    </AnimatedPage>
  );
};

export default EditorPage;