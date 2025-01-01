import React from 'react';
import { Box, Container, Typography, Paper, Grid } from '@mui/material';
import MonacoEditor from './CodeEditor/MonacoEditor';

const CodeDemo = () => {
  const demoCode = `Algorithme CalculMoyenne
Variables
    notes: Tableau[3] de Decimal
    moyenne: Decimal
    i: Entier
Debut
    // Saisie des notes
    Pour i De 0 A 2 Faire
        Ecrire("Entrez la note ", i + 1, ": ")
        Lire(notes[i])
    FinPour
    
    // Calcul de la moyenne
    moyenne = 0
    Pour i De 0 A 2 Faire
        moyenne = moyenne + notes[i]
    FinPour
    moyenne = moyenne / 3
    
    // Affichage du résultat
    Ecrire("La moyenne est: ", moyenne)
    
    Si moyenne >= 10 Alors
        Ecrire("Félicitations !")
    Sinon
        Ecrire("Continuez vos efforts !")
    FinSi
Fin`;

  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={5}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 'bold', color: 'text.primary' }}
            >
              Codez en Français
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              paragraph
              sx={{ mb: 4 }}
            >
              CodeFr utilise une syntaxe intuitive en français, permettant aux débutants de se concentrer sur la logique de programmation plutôt que sur la barrière de la langue.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Cet exemple montre comment calculer la moyenne de trois notes et afficher un message d'encouragement, le tout avec une syntaxe claire et compréhensible en français.
            </Typography>
          </Grid>
          <Grid item xs={12} md={7}>
            <Paper elevation={3} sx={{ overflow: 'hidden' }}>
              <MonacoEditor
                value={demoCode}
                readOnly={true}
                height="400px"
                showMap={false}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CodeDemo;
