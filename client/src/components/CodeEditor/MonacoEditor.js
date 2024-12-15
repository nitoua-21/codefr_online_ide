import React, { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { useTheme } from '../../contexts/ThemeContext';
import { Box } from '@mui/material';
import { registerCodeFrLanguage } from './CodeFrLanguage';

const MonacoEditor = ({ value, onChange, readOnly = false }) => {
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const { mode } = useTheme();

  useEffect(() => {
    if (!monaco.languages.getLanguages().some(({ id }) => id === 'codefr')) {
      registerCodeFrLanguage(monaco);
    }

    if (containerRef.current && !editorRef.current) {
      const model = monaco.editor.createModel(
        value || '// Écrivez votre code CodeFr ici\n',
        'codefr'
      );

      editorRef.current = monaco.editor.create(containerRef.current, {
        model: model,
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
      const disposable = editorRef.current.onDidChangeModelContent(() => {
        if (onChange) {
          onChange(editorRef.current.getValue());
        }
      });

      return () => {
        disposable.dispose();
        model.dispose();
        if (editorRef.current) {
          editorRef.current.dispose();
          editorRef.current = null;
        }
      };
    }
  }, []);

  // Update value when prop changes
  useEffect(() => {
    if (editorRef.current && value !== undefined && value !== editorRef.current.getValue()) {
      editorRef.current.setValue(value);
    }
  }, [value]);

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
