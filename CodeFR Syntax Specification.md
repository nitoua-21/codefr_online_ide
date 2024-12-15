# CodeFR Syntax Specification

## Overview
CodeFR is an educational interpreter designed to simplify programming for French-speaking beginners. It allows writing and executing algorithms in French pseudocode. Below are detailed specifications and examples of the syntax supported by CodeFR.

---

## Program Structure
A CodeFR program consists of three main parts:

1. **Header**:
   - Declares the name of the algorithm, using the keyword `Algorithme`.
   
2. **Declarative Part**:
   - Declares constants, variables, arrays, and other objects the program uses.

3. **Body**:
   - Contains the executable instructions, delimited by `Debut` and `Fin`.

### Example:
```pseudo
Algorithme Exemple
    Variables a, b: Entier
Debut
    a = 10
    b = 20
    Ecrire(a + b)
Fin
```

---

## Data Types
- `Entier`: Integers.
- `Decimal`: Floating-point numbers.
- `Chaine`: Strings.
- `Caractere`: Single alphanumeric character.
- `Logique`: Boolean values (`Vrai`, `Faux`).

### Example:
```pseudo
Variable age: Entier
Variable nom: Chaine
age = 25
nom = "Jean"
```

---

## Variables Declaration and Assignment
### Syntax:
```pseudo
Variable <Variable Name>: <Data Type>
Variables <Name 1>, <Name 2>: <Data Type>
```
### Example:
```pseudo
Variable x: Decimal
Variables a, b, c: Entier
a = 5
b = 10
c = a + b
```

---

## Constants
Constants are declared with the keyword `Constante`.
### Example:
```pseudo
Constante PI = 3.14
Constante MESSAGE = "Bonjour"
```

---

## Operators
### Arithmetic:
- `+` (Addition), `-` (Subtraction), `*` (Multiplication), `/` (Division), `Mod` (Modulo), `^` (Power).

### Logical:
- `Et` (AND), `Ou` (OR), `Non` (NOT), `Oux` (XOR).

### Comparisons:
- `<`, `>`, `<=`, `>=`, `==`, `!=`.

### Example:
```pseudo
Variable a, b: Entier
a = 5
b = 2
Ecrire(a + b, a Mod b, a ^ b)
```

---

## Arrays
### Declaration:
```pseudo
Tableau T[n]: <Type>
Tableau M[n][m]: <Type>
```
### Example:
```pseudo
Tableau T[5]: Entier
T[0] = 10
T[1] = 20
Ecrire(T[0] + T[1])

Tableau M[2][2]: Decimal
M[0][0] = 1.5
M[1][1] = 2.5
Ecrire(M[0][0] + M[1][1])
```

---

## Control Structures

### Conditional Statements:
#### Syntax:
```pseudo
Si <condition> Alors
    <instructions>
SinonSi <condition> Alors
    <instructions>
Sinon
    <instructions>
FinSi
```
#### Example:
```pseudo
Variable n: Entier
Lire(n)
Si n > 0 Alors
    Ecrire("Positif")
SinonSi n < 0 Alors
    Ecrire("Négatif")
Sinon
    Ecrire("Zéro")
FinSi
```

### Loops:
#### While Loop:
```pseudo
TantQue <condition> Faire
    <instructions>
FinTantQue
```
#### For Loop:
```pseudo
Pour <counter> De <start> A <end> Faire
    <instructions>
FinPour
```
#### Example:
```pseudo
Variable i: Entier
i = 0
TantQue i < 5 Faire
    Ecrire(i)
    i = i + 1
FinTantQue

Pour i De 1 A 10 Faire
    Ecrire(i)
FinPour
```

---

## Input and Output
- **Input**: `Lire(<variable>)`
- **Output**: `Ecrire(<expression>)`

### Example:
```pseudo
Variable nom: Chaine
Ecrire("Quel est votre nom ?")
Lire(nom)
Ecrire("Bonjour, ", nom)
```

---

## Comments
- Single-line: `// Comment`
- Multi-line: `/* Comment */`

---

## Built-in Functions
CodeFR provides several built-in functions for common operations.

### Mathematical Functions:
- `Racine(x)`: Square root of `x`.
- `Abs(x)`: Absolute value of `x`.
- `Log(x)`: Natural logarithm of `x`.
- `Log10(x)`: Base-10 logarithm of `x`.
- `Arrondi(x)`: Round `x` to the nearest integer.
- `Alea()`: Generate a random number between 0 and 1.
- `Alea(min, max)`: Generate a random number between `min` and `max`.

### String Functions:
- `Longueur(str)`: Length of the string `str`.
- `Concatener(str1, str2)`: Concatenate `str1` and `str2`.
- `Comparer(str1, str2)`: Compare `str1` and `str2` lexicographically.
- `Recherche(str1, str2)`: Find `str2` in `str1`.
- `Copie(str, pos, n)`: Extract `n` characters from `str` starting at position `pos`.

### Example:
```pseudo
Variable x: Decimal
x = Racine(25)
Ecrire("Square root of 25 is:", x)

Variable str: Chaine
str = Concatener("Bonjour", " Monde")
Ecrire(str)
```

---

## Examples of Full Programs

### Example 1: Simple Calculator
```pseudo
Algorithme Calculatrice
Variables a, b: Decimal
Variable op: Chaine
Debut
    Lire(a, b)
    Lire(op)
    Si op == "+" Alors
        Ecrire(a + b)
    SinonSi op == "-" Alors
        Ecrire(a - b)
    FinSi
Fin
```

### Example 2: Array Sum
```pseudo
Algorithme SommeTableau
Variable somme, i: Entier
Tableau T[5]: Entier
Debut
    Pour i De 0 A 4 Faire
        T[i] = i * 2
    FinPour

    somme = 0
    Pour i De 0 A 4 Faire
        somme = somme + T[i]
    FinPour

    Ecrire("Somme:", somme)
Fin
```

---

## Further Reading
- **Documentation**: [Online Documentation](https://nitoua-21.github.io/codefr_page/)
- **GitHub Repository**: [CodeFR on GitHub](https://github.com/nitoua-21/CodeFr)
