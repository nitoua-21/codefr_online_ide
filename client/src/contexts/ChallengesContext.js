import React, { createContext, useContext, useState, useCallback } from 'react';

const ChallengesContext = createContext();

const defaultChallenges = [
  {
    id: 1,
    title: "Tri à bulles",
    difficulty: "Facile",
    timeEstimate: "20 min",
    points: 100,
    description: "Implémentez l'algorithme de tri à bulles en CodeFr",
    category: "Algorithmes",
    code: `Algorithme TriBulles
Variables
    tab: Tableau[10] d'Entiers
    i, j, temp: Entier
Debut
    // Initialisation du tableau
    tab[0] = 64
    tab[1] = 34
    tab[2] = 25
    tab[3] = 12
    tab[4] = 22
    tab[5] = 11
    tab[6] = 90
    tab[7] = 55
    tab[8] = 44
    tab[9] = 33

    // Tri à bulles
    Pour i De 0 A 8 Faire
        Pour j De 0 A 8-i Faire
            Si tab[j] > tab[j+1] Alors
                temp = tab[j]
                tab[j] = tab[j+1]
                tab[j+1] = temp
            FinSi
        FinPour
    FinPour

    // Affichage du tableau trié
    Pour i De 0 A 9 Faire
        Ecrire(tab[i])
    FinPour
Fin`
  },
  {
    id: 2,
    title: "Calculatrice",
    difficulty: "Moyen",
    timeEstimate: "45 min",
    points: 200,
    description: "Créez une calculatrice simple avec les opérations de base",
    category: "Applications",
    code: `Algorithme Calculatrice
Variables
    a, b: Decimal
    op: Caractere
    resultat: Decimal
Debut
    Ecrire("Entrez le premier nombre: ")
    Lire(a)
    Ecrire("Entrez l'opération (+, -, *, /): ")
    Lire(op)
    Ecrire("Entrez le deuxième nombre: ")
    Lire(b)

    Si op = '+' Alors
        resultat = a + b
    SinonSi op = '-' Alors
        resultat = a - b
    SinonSi op = '*' Alors
        resultat = a * b
    SinonSi op = '/' Alors
        Si b = 0 Alors
            Ecrire("Division par zéro impossible")
        Sinon
            resultat = a / b
        FinSi
    Sinon
        Ecrire("Opération invalide")
    FinSi

    Ecrire("Résultat: ", resultat)
Fin`
  },
  {
    id: 3,
    title: "Recherche binaire",
    difficulty: "Difficile",
    timeEstimate: "1h",
    points: 300,
    description: "Implémentez l'algorithme de recherche binaire",
    category: "Algorithmes",
    code: `Algorithme RechercheBinaire
Variables
    tab: Tableau[10] d'Entiers
    debut, fin, milieu, recherche: Entier
    trouve: Logique
Debut
    // Initialisation du tableau trié
    tab[0] = 11
    tab[1] = 22
    tab[2] = 33
    tab[3] = 44
    tab[4] = 55
    tab[5] = 66
    tab[6] = 77
    tab[7] = 88
    tab[8] = 99
    tab[9] = 100

    // Valeur à rechercher
    Ecrire("Entrez la valeur à rechercher: ")
    Lire(recherche)

    // Recherche binaire
    debut = 0
    fin = 9
    trouve = Faux

    TantQue debut <= fin Et Non trouve Faire
        milieu = (debut + fin) / 2
        
        Si tab[milieu] = recherche Alors
            trouve = Vrai
        SinonSi tab[milieu] > recherche Alors
            fin = milieu - 1
        Sinon
            debut = milieu + 1
        FinSi
    FinTantQue

    Si trouve Alors
        Ecrire("Valeur trouvée à l'index: ", milieu)
    Sinon
        Ecrire("Valeur non trouvée")
    FinSi
Fin`
  }
];

export const ChallengesProvider = ({ children }) => {
  const [challenges, setChallenges] = useState(defaultChallenges);

  const addChallenge = useCallback((challenge) => {
    setChallenges(prev => [...prev, { ...challenge, id: prev.length + 1 }]);
  }, []);

  const updateChallenge = useCallback((id, updatedChallenge) => {
    setChallenges(prev => 
      prev.map(challenge => 
        challenge.id === id ? { ...challenge, ...updatedChallenge } : challenge
      )
    );
  }, []);

  const deleteChallenge = useCallback((id) => {
    setChallenges(prev => prev.filter(challenge => challenge.id !== id));
  }, []);

  const getChallenge = useCallback((id) => {
    return challenges.find(challenge => challenge.id === id);
  }, [challenges]);

  return (
    <ChallengesContext.Provider value={{
      challenges,
      addChallenge,
      updateChallenge,
      deleteChallenge,
      getChallenge
    }}>
      {children}
    </ChallengesContext.Provider>
  );
};

export const useChallenges = () => {
  const context = useContext(ChallengesContext);
  if (!context) {
    throw new Error('useChallenges must be used within a ChallengesProvider');
  }
  return context;
};
