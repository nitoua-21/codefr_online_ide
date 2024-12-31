import React from 'react';
import { Container, Typography, Box, Paper, Divider } from '@mui/material';
import AnimatedPage from '../components/AnimatedPage';
import MonacoEditor from '../components/CodeEditor/MonacoEditor';

const CodeBlock = ({ code }) => (
  <Box sx={{ my: 2 }}>
    <MonacoEditor
      value={code}
      readOnly={true}
      height="200px"
      showMap={false}
    />
  </Box>
);

const DocsPage = () => {
  return (
    <AnimatedPage>
      <Box sx={{ py: 4, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 6 }}>
            <Typography variant="h3" component="h1" gutterBottom>
              Documentation de CodeFr
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph>
              Guide complet pour maîtriser le langage CodeFr
            </Typography>
          </Box>

          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Vue d'ensemble
            </Typography>
            <Typography variant="body1" paragraph>
              CodeFR est un interpréteur éducatif conçu pour simplifier la programmation pour les débutants francophones. 
              Il permet d'écrire et d'exécuter des algorithmes en pseudocode français.
            </Typography>
          </Paper>

          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Structure du Programme
            </Typography>
            <Typography variant="body1" paragraph>
              Un programme CodeFR se compose de trois parties principales :
            </Typography>
            <Typography variant="body1" component="div">
              <ol>
                <li><strong>En-tête</strong> : Déclare le nom de l'algorithme avec le mot-clé "Algorithme"</li>
                <li><strong>Partie Déclarative</strong> : Déclare les constantes, variables, tableaux et autres objets</li>
                <li><strong>Corps</strong> : Contient les instructions exécutables, délimité par "Debut" et "Fin"</li>
              </ol>
            </Typography>
            <CodeBlock code={`Algorithme Exemple
    Variables a, b: Entier
Debut
    a = 10
    b = 20
    Ecrire(a + b)
Fin`} />
          </Paper>

          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Types de Données
            </Typography>
            <Typography variant="body1" component="div">
              <ul>
                <li><strong>Entier</strong> : Nombres entiers</li>
                <li><strong>Decimal</strong> : Nombres à virgule flottante</li>
                <li><strong>Chaine</strong> : Chaînes de caractères</li>
                <li><strong>Caractere</strong> : Caractère unique</li>
                <li><strong>Logique</strong> : Valeurs booléennes (Vrai, Faux)</li>
              </ul>
            </Typography>
            <CodeBlock code={`Variable age: Entier
Variable nom: Chaine
Variable estEtudiant: Logique
Variable prix: Decimal
Variable lettre: Caractere

age = 25
nom = "Jean"
estEtudiant = Vrai
prix = 19.99
lettre = 'A'`} />
          </Paper>

          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Opérateurs
            </Typography>
            <Typography variant="body1" component="div">
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6">Arithmétiques :</Typography>
                <ul>
                  <li><code>+</code> (Addition)</li>
                  <li><code>-</code> (Soustraction)</li>
                  <li><code>*</code> (Multiplication)</li>
                  <li><code>/</code> (Division)</li>
                  <li><code>Mod</code> (Modulo)</li>
                  <li><code>^</code> (Puissance)</li>
                </ul>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6">Logiques :</Typography>
                <ul>
                  <li><code>Et</code> (AND)</li>
                  <li><code>Ou</code> (OR)</li>
                  <li><code>Non</code> (NOT)</li>
                  <li><code>Oux</code> (XOR)</li>
                </ul>
              </Box>
              <Box>
                <Typography variant="h6">Comparaisons :</Typography>
                <ul>
                  <li><code>==</code> (Égal à)</li>
                  <li><code>!=</code> (Différent de)</li>
                  <li><code>&lt;</code>, <code>&gt;</code> (Inférieur, Supérieur)</li>
                  <li><code>&lt;=</code>, <code>&gt;=</code> (Inférieur ou égal, Supérieur ou égal)</li>
                </ul>
              </Box>
            </Typography>
          </Paper>

          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Structures de Contrôle
            </Typography>
            <Typography variant="h6" gutterBottom>
              Conditions
            </Typography>
            <CodeBlock code={`Si condition Alors
    instruction1
SinonSi condition2 Alors
    instruction2
Sinon
    instruction3
FinSi`} />

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Boucles
            </Typography>
            <CodeBlock code={`// Boucle TantQue
TantQue condition Faire
    instructions
FinTantQue

// Boucle Pour
Pour i De 1 A 10 Faire
    instructions
FinPour`} />
          </Paper>

          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Tableaux
            </Typography>
            <Typography variant="body1" paragraph>
              Déclaration et manipulation des tableaux à une ou plusieurs dimensions.
            </Typography>
            <CodeBlock code={`// Tableau à une dimension
Tableau T[5]: Entier
T[0] = 10
T[1] = 20

// Tableau à deux dimensions
Tableau M[2][3]: Decimal
M[0][0] = 1.5
M[1][2] = 3.14`} />
          </Paper>

          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Fonctions Intégrées
            </Typography>
            <Typography variant="body1" component="div">
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6">Mathématiques :</Typography>
                <ul>
                  <li><code>Racine(x)</code> : Racine carrée</li>
                  <li><code>Abs(x)</code> : Valeur absolue</li>
                  <li><code>Log(x)</code> : Logarithme naturel</li>
                  <li><code>Arrondi(x)</code> : Arrondi</li>
                  <li><code>Alea()</code> : Nombre aléatoire</li>
                </ul>
              </Box>
              <Box>
                <Typography variant="h6">Chaînes :</Typography>
                <ul>
                  <li><code>Longueur(str)</code> : Longueur de la chaîne</li>
                  <li><code>Concatener(str1, str2)</code> : Concaténation</li>
                  <li><code>Recherche(str1, str2)</code> : Recherche</li>
                  <li><code>Copie(str, pos, n)</code> : Extraction</li>
                </ul>
              </Box>
            </Typography>
          </Paper>

          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
              Exemple Complet
            </Typography>
            <Typography variant="body1" paragraph>
              Voici un exemple de programme complet qui calcule la moyenne de trois nombres.
            </Typography>
            <CodeBlock code={`Algorithme CalculMoyenne
Variables
    n1, n2, n3, moyenne: Decimal
Debut
    Ecrire("Entrez trois nombres:")
    Lire(n1, n2, n3)
    
    moyenne = (n1 + n2 + n3) / 3
    
    Ecrire("La moyenne est:", moyenne)
    
    Si moyenne >= 10 Alors
        Ecrire("Au dessus de la moyenne")
    Sinon
        Ecrire("En dessous de la moyenne")
    FinSi
Fin`} />
          </Paper>
        </Container>
      </Box>
    </AnimatedPage>
  );
};

export default DocsPage;
