import React, { useRef, useState, useCallback } from 'react';
import Editor from "@monaco-editor/react";
import { Box, Paper, IconButton, Toolbar, Typography, Button } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import EditorWrapper from './EditorWrapper';

const CodeEditor = () => {
  const editorRef = useRef(null);
  const [editorTheme, setEditorTheme] = useState('dark');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [code, setCode] = useState(
`Algorithme ExempleSimple
Variable x, y: Entier
Debut
    x = 10
    y = 5
    
    Si x > y Alors
        Ecrire("x est plus grand que y")
    Sinon
        Ecrire("y est plus grand ou égal à x")
    FinSi
Fin`
  );

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Define CodeFr language
    monaco.languages.register({ id: 'codefr' });
    monaco.languages.setMonarchTokensProvider('codefr', {
      keywords: [
        'Algorithme', 'Variable', 'Debut', 'Fin', 'Si', 'Alors', 'Sinon',
        'FinSi', 'Pour', 'Faire', 'FinPour', 'Tant', 'Que', 'FinTantQue',
        'Et', 'Ou', 'Non', 'Tableau', 'De', 'A'
      ],
      typeKeywords: ['Entier', 'Reel', 'Chaine', 'Booleen', 'Caractere'],
      operators: [
        '=', '>', '<', '>=', '<=', '<>', '+', '-', '*', '/', 'mod'
      ],
      symbols: /[=><!~?:&|+\-*\/\^%]+/,
      
      tokenizer: {
        root: [
          [/[a-zA-Z_]\w*/, {
            cases: {
              '@keywords': 'keyword',
              '@typeKeywords': 'type',
              '@default': 'variable'
            }
          }],
          [/[0-9]+/, 'number'],
          [/".*?"/, 'string'],
          [/\/\/.*$/, 'comment'],
        ]
      }
    });

    // Define themes
    monaco.editor.defineTheme('codefr-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
        { token: 'type', foreground: '4EC9B0' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'comment', foreground: '6A9955' },
        { token: 'variable', foreground: '9CDCFE' }
      ],
      colors: {
        'editor.background': '#1E1E1E',
        'editor.foreground': '#D4D4D4',
        'editor.lineHighlightBackground': '#2D2D2D',
        'editorCursor.foreground': '#FFFFFF',
        'editor.selectionBackground': '#264F78'
      }
    });

    monaco.editor.defineTheme('codefr-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '0000FF', fontStyle: 'bold' },
        { token: 'type', foreground: '267F99' },
        { token: 'string', foreground: 'A31515' },
        { token: 'number', foreground: '098658' },
        { token: 'comment', foreground: '008000' },
        { token: 'variable', foreground: '001080' }
      ],
      colors: {
        'editor.background': '#FFFFFF',
        'editor.foreground': '#000000',
        'editor.lineHighlightBackground': '#F7F7F7',
        'editorCursor.foreground': '#000000',
        'editor.selectionBackground': '#ADD6FF'
      }
    });
  };

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const toggleEditorTheme = useCallback(() => {
    setIsTransitioning(true);
    // Wait for fade out
    setTimeout(() => {
      setEditorTheme(prev => prev === 'dark' ? 'light' : 'dark');
      // Wait for theme to change and start fade in
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  }, []);

  const handleRunCode = () => {
    console.log('Running code:', code);
    // Add code execution logic here
  };

  const handleSaveCode = () => {
    console.log('Saving code:', code);
    // Add save logic here
  };

  const handleDownloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code.algo';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Paper 
      elevation={3}
      sx={{
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'grey.900'
      }}
    >
      <Toolbar
        sx={{
          bgcolor: 'grey.800',
          color: 'white',
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <Typography variant="h6" component="div">
          Éditeur CodeFr
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button
            startIcon={<PlayArrowIcon />}
            variant="contained"
            color="success"
            onClick={handleRunCode}
          >
            Exécuter
          </Button>
          <IconButton color="primary" onClick={handleSaveCode}>
            <SaveIcon />
          </IconButton>
          <IconButton color="primary" onClick={handleDownloadCode}>
            <DownloadIcon />
          </IconButton>
          <IconButton 
            onClick={toggleEditorTheme} 
            sx={{ 
              color: 'white',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'rotate(180deg)'
              }
            }}
          >
            {editorTheme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Toolbar>
      
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <EditorWrapper isTransitioning={isTransitioning} theme={editorTheme}>
          <Editor
            height="100%"
            defaultLanguage="codefr"
            defaultValue={code}
            theme={editorTheme === 'dark' ? 'codefr-dark' : 'codefr-light'}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            options={{
              fontSize: 14,
              fontFamily: "'Fira Code', monospace",
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 4,
              wordWrap: 'on',
              renderLineHighlight: 'all',
              lineNumbers: 'on',
              roundedSelection: true,
              autoClosingBrackets: 'always',
              autoClosingQuotes: 'always',
              formatOnPaste: true,
              formatOnType: true
            }}
          />
        </EditorWrapper>
      </Box>
    </Paper>
  );
};

export default CodeEditor;