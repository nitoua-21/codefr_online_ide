export const registerCodeFrLanguage = (monaco) => {
  // Register language
  monaco.languages.register({ id: 'codefr' });

  // Define syntax highlighting rules
  monaco.languages.setMonarchTokensProvider('codefr', {
    ignoreCase: false,
    defaultToken: '',
    tokenPostfix: '.codefr',

    // Program structure keywords
    keywords: [
      'Algorithme', 'Debut', 'Fin',
      'Variable', 'Variables', 'Constante',
      'Si', 'Alors', 'SinonSi', 'Sinon', 'FinSi',
      'TantQue', 'Faire', 'FinTantQue',
      'Pour', 'De', 'A', 'FinPour',
      'Lire', 'Ecrire',
      'Et', 'Ou', 'Non', 'Oux',
      'Mod', 'Tableau'
    ],
  
    // Data types
    typeKeywords: [
      'Entier', 'Decimal', 'Chaine', 'Caractere', 'Logique'
    ],

    // Built-in constants
    constants: [
      'Vrai', 'Faux'
    ],

    // Built-in functions
    builtins: [
      'Racine', 'Abs', 'Log', 'Log10', 'Arrondi'
    ],

    // Operators
    operators: [
      '=', '>', '<', '!', '~', '?', ':',
      '==', '<=', '>=', '!=', '+', '-', '*', '/',
      '^', 'Mod', 'Et', 'Ou', 'Non', 'Oux'
    ],

    // Symbols
    symbols: /[=><!~?:&|+\-*\/\^%]+/,

    // The main tokenizer for our languages
    tokenizer: {
      root: [
        // Program structure - Fixed consecutive group matching
        [/^(Algorithme)(\s+)([a-zA-Z_]\w*)/, ['keyword', 'white', 'identifier']],
        [/^(Debut|Fin)/, 'keyword'],

        // Identifiers and keywords
        [/[a-zA-Z_]\w*/, {
          cases: {
            '@keywords': 'keyword',
            '@typeKeywords': 'type',
            '@constants': 'constant',
            '@builtins': 'function',
            '@default': 'identifier'
          }
        }],

        // Whitespace
        { include: '@whitespace' },

        // Delimiters and operators
        [/[{}()\[\]]/, '@brackets'],
        [/[<>](?!@symbols)/, '@brackets'],
        [/@symbols/, {
          cases: {
            '@operators': 'operator',
            '@default': ''
          }
        }],

        // Numbers
        [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
        [/\d+/, 'number'],

        // String
        [/"([^"\\]|\\.)*$/, 'string.invalid'],
        [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
      ],

      comment: [
        [/[^\/*]+/, 'comment'],
        [/\/\*/, 'comment', '@push'],
        ["\\*/", 'comment', '@pop'],
        [/[\/*]/, 'comment']
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
    }
  });

  // Define language configuration
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
    folding: {
      markers: {
        start: new RegExp('^\\s*//\\s*#region\\b'),
        end: new RegExp('^\\s*//\\s*#endregion\\b')
      }
    }
  });

  // Register completions provider
  monaco.languages.registerCompletionItemProvider('codefr', {
    provideCompletionItems: () => {
      const suggestions = [
        {
          label: 'Algorithme',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: [
            'Algorithme ${1:nom}',
            'Variables',
            '\t${2}',
            'Debut',
            '\t${3}',
            'Fin'
          ].join('\n'),
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Structure de base d\'un algorithme'
        },
        {
          label: 'Variable',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'Variable ${1:nom}: ${2:type}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Déclaration d\'une variable'
        },
        {
          label: 'Variables',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'Variables ${1:nom1}, ${2:nom2}: ${3:type}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Déclaration de plusieurs variables'
        },
        {
          label: 'Si',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: [
            'Si ${1:condition} Alors',
            '\t${2}',
            'FinSi'
          ].join('\n'),
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Structure conditionnelle Si'
        },
        {
          label: 'SiComplet',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: [
            'Si ${1:condition} Alors',
            '\t${2}',
            'SinonSi ${3:condition} Alors',
            '\t${4}',
            'Sinon',
            '\t${5}',
            'FinSi'
          ].join('\n'),
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Structure conditionnelle Si complète'
        },
        {
          label: 'Pour',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: [
            'Pour ${1:i} De ${2:debut} A ${3:fin} Faire',
            '\t${4}',
            'FinPour'
          ].join('\n'),
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Boucle Pour'
        },
        {
          label: 'TantQue',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: [
            'TantQue ${1:condition} Faire',
            '\t${2}',
            'FinTantQue'
          ].join('\n'),
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Boucle TantQue'
        },
        {
          label: 'Tableau',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'Tableau ${1:nom}[${2:taille}]: ${3:type}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Déclaration d\'un tableau'
        },
        {
          label: 'Tableau2D',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'Tableau ${1:nom}[${2:lignes}][${3:colonnes}]: ${4:type}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Déclaration d\'un tableau à deux dimensions'
        },
        {
          label: 'Lire',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'Lire(${1:variable})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Lecture d\'une entrée'
        },
        {
          label: 'Ecrire',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'Ecrire(${1:expression})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Affichage d\'une sortie'
        }
      ];
      return { suggestions };
    }
  });
};
