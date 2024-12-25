// CodeFrLanguage.js
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

// Define keywords and tokens (keeping your existing definitions)
const keywords = [
  'Algorithme', 'Debut', 'Fin',
  'Variable', 'Variables', 'Constante',
  'Si', 'Alors', 'SinonSi', 'Sinon', 'FinSi',
  'TantQue', 'Faire', 'FinTantQue',
  'Pour', 'De', 'A', 'FinPour',
  'Lire', 'Ecrire',
  'Et', 'Ou', 'Non', 'Oux',
  'Mod', 'Tableau'
];

const typeKeywords = [
  'Entier', 'Decimal', 'Chaine', 'Caractere', 'Logique'
];

const constants = [
  'Vrai', 'Faux'
];

const builtins = [
  'Racine', 'Abs', 'Log', 'Log10', 'Arrondi'
];

const operators = [
  '=', '>', '<', '!', '~', '?', ':',
  '==', '<=', '>=', '!=', '+', '-', '*', '/',
  '^', 'Mod', 'Et', 'Ou', 'Non', 'Oux'
];

// Create completion items
const createCompletionItem = (label, kind, insertText, documentation = '') => ({
  label,
  kind,
  insertText,
  documentation: { value: documentation },
  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
});

// Register language
export const registerCodeFrLanguage = () => {
  // Register the language first
  monaco.languages.register({ id: 'codefr' });

  // Set the tokens provider
  monaco.languages.setMonarchTokensProvider('codefr', {
    ignoreCase: false,
    defaultToken: '',
    tokenPostfix: '.codefr',
    keywords,
    typeKeywords,
    constants,
    builtins,
    operators,
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    
    tokenizer: {
      root: [
        [/^(Algorithme)(\s+)([a-zA-Z_]\w*)/, ['keyword', 'white', 'identifier']],
        [/^(Debut|Fin)/, 'keyword'],
        [/[a-zA-Z_]\w*/, {
          cases: {
            '@keywords': 'keyword',
            '@typeKeywords': 'type',
            '@constants': 'constant',
            '@builtins': 'function',
            '@default': 'identifier'
          }
        }],
        { include: '@whitespace' },
        [/[{}()\[\]]/, '@brackets'],
        [/[<>](?!@symbols)/, '@brackets'],
        [/@symbols/, {
          cases: {
            '@operators': 'operator',
            '@default': ''
          }
        }],
        [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
        [/\d+/, 'number'],
        [/"([^"\\]|\\.)*$/, 'string.invalid'],
        [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
      ],
      string: [
        [/[^\\"]+/, 'string'],
        [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
      ],
      whitespace: [
        [/[ \t\r\n]+/, 'white'],
        [/\/\*/, 'comment', '@comment'],
        [/\/\/.*$/, 'comment'],
      ],
      comment: [
        [/[^\/*]+/, 'comment'],
        [/\/\*/, 'comment', '@push'],
        ["\\*/", 'comment', '@pop'],
        [/[\/*]/, 'comment']
      ],
    }
  });

  // Register completion item provider
  monaco.languages.registerCompletionItemProvider('codefr', {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      };

      const suggestions = [
        // Keywords
        ...keywords.map(keyword => 
          createCompletionItem(keyword, monaco.languages.CompletionItemKind.Keyword, keyword)
        ),
        // Types
        ...typeKeywords.map(type => 
          createCompletionItem(type, monaco.languages.CompletionItemKind.Class, type)
        ),
        // Constants
        ...constants.map(constant => 
          createCompletionItem(constant, monaco.languages.CompletionItemKind.Constant, constant)
        ),
        // Built-in functions
        ...builtins.map(func => 
          createCompletionItem(func, monaco.languages.CompletionItemKind.Function, func)
        ),
        // Snippets
        createCompletionItem(
          'Algorithme',
          monaco.languages.CompletionItemKind.Snippet,
          'Algorithme ${1:nom}\nVariables\n\t${2}\nDebut\n\t${3}\nFin',
          'Structure de base d\'un algorithme'
        ),
        createCompletionItem(
          'Si',
          monaco.languages.CompletionItemKind.Snippet,
          'Si ${1:condition} Alors\n\t${2}\nFinSi',
          'Structure conditionnelle Si'
        ),
        createCompletionItem(
          'Pour',
          monaco.languages.CompletionItemKind.Snippet,
          'Pour ${1:i} De ${2:debut} A ${3:fin} Faire\n\t${4}\nFinPour',
          'Boucle Pour'
        ),
        createCompletionItem(
          'TantQue',
          monaco.languages.CompletionItemKind.Snippet,
          'TantQue ${1:condition} Faire\n\t${2}\nFinTantQue',
          'Boucle TantQue'
        )
      ];

      return {
        suggestions: suggestions.map(s => ({
          ...s,
          range: range
        }))
      };
    },
    triggerCharacters: [' ', '\n', ':', '.', '(', '[', 'A']
  });

  // Register language configuration
  monaco.languages.setLanguageConfiguration('codefr', {
    comments: {
      lineComment: '//',
      blockComment: ['/*', '*/']
    },
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')']
    ],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"', notIn: ['string'] },
      { open: "'", close: "'", notIn: ['string', 'comment'] }
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" }
    ],
  });
};