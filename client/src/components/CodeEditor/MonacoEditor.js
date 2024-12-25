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
    // Register language
    registerCodeFrLanguage();

    if (containerRef.current && !editorRef.current) {
      // Create editor instance
      editorRef.current = monaco.editor.create(containerRef.current, {
        value: value || 'Algorithme Nom_Algorithme\nVariables\n\tVariable1: Type1\nDebut\n\tInstruction1\nFin',
        language: 'codefr',
        theme: mode === 'dark' ? 'vs-dark' : 'vs',
        minimap: { enabled: true },
        fontSize: 14,
        automaticLayout: true,
        lineNumbers: 'on',
        readOnly: readOnly,
        tabSize: 2,
        wordWrap: 'on',
        quickSuggestions: {
          other: true,
          comments: true,
          strings: true
        },
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnEnter: 'on',
        tabCompletion: 'on',
        wordBasedSuggestions: true,
        snippetSuggestions: 'top',
        suggest: {
          localityBonus: true,
          snippetsPreventQuickSuggestions: false,
          showIcons: true,
          maxVisibleSuggestions: 12,
          filterGraceful: true,
          showInlineDetails: true,
          preview: true
        }
      });

      // Handle changes
      editorRef.current.onDidChangeModelContent(() => {
        if (onChange) {
          onChange(editorRef.current.getValue());
        }
      });

      return () => {
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