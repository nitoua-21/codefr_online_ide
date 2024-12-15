import React, { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor';
import { useTheme } from '../../contexts/ThemeContext';
import { Box } from '@mui/material';

// Define CodeFr language
monaco.languages.register({ id: 'codefr' });

// Define syntax highlighting rules for CodeFr
monaco.languages.setMonarchTokensProvider('codefr', {
  tokenizer: {
    root: [
      // Keywords
      [/\b(si|sinon|pour|tant que|fonction|retourner|vrai|faux|nul)\b/, 'keyword'],
      
      // Types
      [/\b(entier|reel|chaine|booleen|tableau)\b/, 'type'],
      
      // Numbers
      [/\b\d+(\.\d+)?\b/, 'number'],
      
      // Strings
      [/"[^"]*"/, 'string'],
      [/'[^']*'/, 'string'],
      
      // Comments
      [/\/\/.*$/, 'comment'],
      [/\/\*/, 'comment', '@comment'],
      
      // Operators
      [/[+\-*/<>=!&|^~]/, 'operator'],
      
      // Identifiers
      [/[a-zA-Z_]\w*/, 'identifier'],
      
      // Brackets
      [/[{}()\[\]]/, '@brackets'],
      
      // Whitespace
      [/[ \t\r\n]+/, 'white'],
    ],
    comment: [
      [/[^/*]+/, 'comment'],
      [/\*\//, 'comment', '@pop'],
      [/[/*]/, 'comment'],
    ],
  },
});

// Define code completion for CodeFr
monaco.languages.setLanguageConfiguration('codefr', {
  comments: {
    lineComment: '//',
    blockComment: ['/*', '*/'],
  },
  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')'],
  ],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
  surroundingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
});

const MonacoEditor = ({ value, onChange, readOnly = false }) => {
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const { mode } = useTheme();

  useEffect(() => {
    if (containerRef.current) {
      editorRef.current = monaco.editor.create(containerRef.current, {
        value: value || '// Écrivez votre code CodeFr ici\n',
        language: 'codefr',
        theme: mode === 'dark' ? 'vs-dark' : 'vs',
        minimap: { enabled: true },
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: true,
        scrollBeyondLastLine: false,
        readOnly: readOnly,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: 'on',
        suggestOnTriggerCharacters: true,
        snippetSuggestions: 'inline',
        scrollbar: {
          useShadows: false,
          verticalHasArrows: true,
          horizontalHasArrows: true,
          vertical: 'visible',
          horizontal: 'visible',
          verticalScrollbarSize: 10,
          horizontalScrollbarSize: 10,
        },
      });

      // Handle changes
      editorRef.current.onDidChangeModelContent(() => {
        if (onChange) {
          onChange(editorRef.current.getValue());
        }
      });

      // Add custom CodeFr snippets
      monaco.languages.registerCompletionItemProvider('codefr', {
        provideCompletionItems: () => {
          const suggestions = [
            {
              label: 'fonction',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'fonction ${1:nom}(${2:params}) {\n\t${3}\n}',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Définir une fonction',
            },
            {
              label: 'si',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'si (${1:condition}) {\n\t${2}\n}',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Condition si',
            },
            {
              label: 'pour',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'pour (${1:i} de 0 à ${2:n}) {\n\t${3}\n}',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Boucle pour',
            },
          ];
          return { suggestions };
        },
      });
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
      }
    };
  }, [value, readOnly]);

  // Update theme when mode changes
  useEffect(() => {
    if (editorRef.current) {
      monaco.editor.setTheme(mode === 'dark' ? 'vs-dark' : 'vs');
    }
  }, [mode]);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        height: '400px',
        '& .monaco-editor': {
          paddingTop: 1,
        },
      }}
    />
  );
};

export default MonacoEditor;
