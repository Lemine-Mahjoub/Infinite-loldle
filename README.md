# 🎮 Loldle - Jeu de Devinettes League of Legends

## 📋 Vue d'ensemble du projet

Loldle est une application web full-stack inspirée de Wordle, où les joueurs doivent deviner un champion de League of Legends en utilisant des indices sur leurs caractéristiques (région, rôle, position, type de mana, année de sortie).

Le projet utilise une architecture moderne avec séparation complète entre frontend et backend, authentification des utilisateurs, système de scoring et classement en temps réel.

---

## 🏗️ Architecture générale

```
Loldle/
├── frontend/          # Application Next.js (React + TypeScript)
├── backend/           # API REST Node.js + Express + Prisma
└── README.md          # Documentation principale
```

### Stack technologique

- **Frontend** : Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend** : Node.js, Express.js, TypeScript
- **Base de données** : SQLite avec Prisma ORM
- **Authentification** : JWT (JSON Web Tokens)
- **Styling** : Tailwind CSS + Radix UI
- **Validation** : Zod + React Hook Form

---

## 🎨 Frontend (Next.js Application)

### Structure des dossiers

```
frontend/
├── app/                    # App Router (Next.js 13+)
│   ├── layout.tsx         # Layout principal avec providers
│   ├── page.tsx           # Page d'accueil (jeu principal)
│   ├── globals.css        # Styles globaux Tailwind
│   ├── login/
│   │   └── page.tsx       # Page de connexion
│   ├── register/
│   │   └── page.tsx       # Page d'inscription
│   └── leaderboard/
│       └── page.tsx       # Page du classement
├── components/            # Composants React réutilisables
│   ├── ui/               # Composants UI de base (Radix UI)
│   ├── guess-the-champion.tsx  # Composant principal du jeu
│   ├── leaderboard.tsx   # Composant du classement
│   ├── header.tsx        # En-tête avec navigation
│   ├── auth-forms.tsx    # Formulaires d'authentification
│   ├── auth-provider.tsx # Provider d'authentification
│   └── protected-layout.tsx # Layout pour pages protégées
├── hooks/                # Hooks React personnalisés
│   └── useAuth.ts        # Hook pour gestion auth
├── lib/                  # Utilitaires et services
│   └── api.ts           # Service API pour communication backend
├── styles/              # Styles additionnels
└── public/              # Assets statiques
```

### Technologies utilisées

#### Framework et outils principaux

- **Next.js 15** : Framework React avec App Router
- **React 19** : Bibliothèque UI avec hooks modernes
- **TypeScript** : Typage statique pour meilleure maintenabilité
- **Tailwind CSS** : Framework CSS utility-first

#### Bibliothèques UI et UX

- **Radix UI** : Composants UI accessibles et customisables
- **Lucide React** : Icônes modernes
- **Sonner** : Notifications toast élégantes
- **React Hook Form** : Gestion des formulaires performante
- **Zod** : Validation de schémas TypeScript

#### Gestion d'état et données

- **React Context** : Gestion de l'état d'authentification
- **localStorage** : Persistance des données de jeu
- **Axios** : Client HTTP pour les appels API

### Fonctionnalités clés

#### 1. Système d'authentification

- Inscription/connexion avec email et mot de passe
- Gestion des tokens JWT avec refresh automatique
- Protection des routes avec middleware
- Persistance de la session utilisateur

#### 2. Jeu principal

- Grille de devinettes avec 6 colonnes de caractéristiques
- Système de comparaison avec indicateurs visuels (✓/✗)
- Images des champions depuis l'API Riot Games
- Persistance de l'état du jeu par utilisateur

#### 3. Système de scoring

- Points basés sur le nombre de tentatives (100, 50, 25, 12, 6, 3)
- Affichage en temps réel du score et des points potentiels
- Sauvegarde automatique des scores

#### 4. Classement

- Leaderboard en temps réel avec classement des joueurs
- Highlighting du joueur connecté
- Rafraîchissement automatique des données

### Routage et navigation

#### Pages principales

- `/` : Jeu principal (protégé)
- `/login` : Page de connexion
- `/register` : Page d'inscription
- `/leaderboard` : Classement (protégé)

#### Système de protection

- Middleware d'authentification pour routes protégées
- Redirection automatique vers login si non connecté
- Gestion des erreurs d'authentification

---

## ⚙️ Backend (API REST Node.js)

### Structure des dossiers

```
backend/
├── src/
│   ├── index.ts          # Point d'entrée du serveur
│   ├── Routes/           # Définition des routes API
│   │   ├── auth.ts       # Routes d'authentification
│   │   └── users.ts      # Routes utilisateurs et jeu
│   ├── middleware/       # Middlewares Express
│   ├── utils/           # Utilitaires (JWT, validation, etc.)
│   └── data/
│       └── Champs.json   # Base de données des champions LoL
├── prisma/              # Configuration Prisma
│   ├── schema.prisma    # Schéma de base de données
│   ├── migrations/      # Migrations de la DB
│   └── dev.db          # Base de données SQLite
├── dist/               # Code compilé TypeScript
├── package.json        # Dépendances et scripts
└── tsconfig.json       # Configuration TypeScript
```

### Technologies utilisées

#### Runtime et framework

- **Node.js** : Runtime JavaScript côté serveur
- **Express.js** : Framework web minimaliste
- **TypeScript** : Typage statique pour Node.js
- **ts-node-dev** : Développement avec hot reload

#### Base de données et ORM

- **Prisma** : ORM moderne pour TypeScript
- **SQLite** : Base de données locale légère
- **@prisma/client** : Client généré automatiquement

#### Sécurité et authentification

- **bcryptjs** : Hachage des mots de passe
- **jsonwebtoken** : Génération et validation JWT
- **cors** : Gestion des requêtes cross-origin

#### Utilitaires

- **dotenv** : Gestion des variables d'environnement
- **axios** : Client HTTP pour APIs externes

### API Endpoints

#### Authentification (`/auth`)

```
POST /auth/register     # Inscription utilisateur
POST /auth/login        # Connexion utilisateur
GET  /auth/verify       # Vérification token JWT
POST /auth/refresh      # Rafraîchissement token
```

#### Utilisateurs et jeu (`/users`)

```
GET  /users            # Récupération du leaderboard
GET  /users/me         # Profil utilisateur connecté
POST /users/check      # Vérification réponse champion
PUT  /users/score      # Mise à jour du score
POST /users/new-champion # Récupération nouveau champion
```

#### Système

```
GET  /health           # Vérification santé du serveur
```

### Fonctionnalités backend

#### 1. Gestion des utilisateurs

- Inscription avec validation email/mot de passe
- Hachage sécurisé des mots de passe (bcrypt)
- Gestion des doublons (email/username uniques)

#### 2. Authentification JWT

- Génération de tokens sécurisés
- Middleware de vérification pour routes protégées
- Système de refresh token pour sessions longues

#### 3. Logique de jeu

- Sélection aléatoire de champions
- Comparaison des caractéristiques
- Calcul automatique des scores
- Persistance par utilisateur

#### 4. Système de scoring

- Attribution des points basée sur le nombre de tentatives
- Sauvegarde en base de données
- Classement en temps réel

### Configuration serveur

#### CORS

```typescript
cors({
  origin: [
    "http://localhost:3001", // Next.js dev
    "http://localhost:3000", // Alternative port
    process.env.FRONTEND_URL,
  ],
  credentials: true,
});
```

#### Middleware

- `express.json()` : Parsing JSON des requêtes
- `cors()` : Gestion des requêtes cross-origin
- `authenticateToken()` : Vérification JWT pour routes protégées

---

## 🗄️ Base de données (SQLite + Prisma)

### Schéma de données

```prisma
model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  email     String   @unique
  password  String
  score     Int      @default(0)
  champ     String   # Champion actuel assigné
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Structure des données

#### Table Users

- **id** : Identifiant unique auto-incrémenté
- **username** : Nom d'utilisateur unique
- **email** : Adresse email unique
- **password** : Mot de passe haché (bcrypt)
- **score** : Score total du joueur
- **champ** : Champion actuel assigné au joueur
- **createdAt/updatedAt** : Timestamps de création/modification

#### Champions (Champs.json)

```json
{
  "id": "Aatrox",
  "name": "Aatrox",
  "region": "Shurima",
  "role": "Fighter",
  "position": "Top",
  "manaType": "Manaless",
  "releaseYear": 2013,
  "imageUrl": "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Aatrox.png"
}
```

### Prisma ORM

#### Avantages de Prisma

- **Type Safety** : Génération automatique de types TypeScript
- **Migrations** : Gestion versionnée des changements de schéma
- **Query Builder** : API intuitive pour les requêtes
- **Introspection** : Synchronisation automatique avec la DB

#### Commandes principales

```bash
npx prisma migrate dev    # Créer/appliquer migrations
npx prisma generate      # Générer le client Prisma
npx prisma studio        # Interface d'administration web
npx prisma db seed       # Seeding de données
```

#### Configuration

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

---

## 🔐 Sécurité et authentification

### Stratégie de sécurité

#### 1. Hachage des mots de passe

```typescript
// Inscription
const hashedPassword = await bcrypt.hash(password, 10);

// Connexion
const isValid = await bcrypt.compare(password, user.password);
```

#### 2. Tokens JWT

```typescript
// Génération
const token = jwt.sign(
  { userId: user.id, username: user.username },
  process.env.JWT_SECRET!,
  { expiresIn: "24h" }
);

// Vérification
const decoded = jwt.verify(token, process.env.JWT_SECRET!);
```

#### 3. Protection des routes

```typescript
// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
```

#### 4. Validation des données

- Validation côté client avec Zod
- Validation côté serveur avec checks manuels
- Sanitization des inputs utilisateur

---

## 🚀 Déploiement et développement

### Scripts de développement

#### Frontend

```bash
npm run dev     # Serveur de développement (port 3001)
npm run build   # Build de production
npm run start   # Serveur de production
npm run lint    # Linting du code
```

#### Backend

```bash
npm run dev     # Serveur de développement avec hot reload
npm run build   # Compilation TypeScript
npm run start   # Serveur de production
```

### Variables d'environnement

#### Backend (.env)

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
PORT=3000
FRONTEND_URL="http://localhost:3001"
```

#### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### Processus de démarrage

1. **Installation des dépendances**

```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

2. **Configuration de la base de données**

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

3. **Démarrage des serveurs**

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

---

## 🔄 Flux de données et intégrations

### Communication Frontend-Backend

#### 1. Service API (frontend/lib/api.ts)

```typescript
const API_BASE_URL = 'http://localhost:3000';

// Authentification
export const login = async (email: string, password: string)
export const register = async (userData: RegisterData)
export const verifyToken = async (token: string)

// Jeu
export const checkChampionAnswer = async (championId: string)
export const updateScore = async (score: number)
export const getNewChampion = async ()

// Utilisateurs
export const getLeaderboard = async ()
export const getUserProfile = async ()
```

#### 2. Gestion des états

- **Auth Context** : État d'authentification global
- **localStorage** : Persistance des données de jeu
- **React State** : État local des composants

#### 3. Synchronisation des données

- Vérification automatique des tokens
- Rafraîchissement des données en temps réel
- Gestion des erreurs avec fallbacks

### Intégration des APIs externes

#### Riot Games API

- Images des champions depuis le CDN officiel
- URL pattern : `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/{championId}.png`

---

## 📊 Performances et optimisations

### Frontend

- **Next.js optimisations** : Static generation, code splitting
- **React optimisations** : Memoization, lazy loading
- **Tailwind CSS** : Purge des styles non utilisés
- **Images** : Optimisation automatique Next.js

### Backend

- **SQLite** : Base de données locale rapide
- **Prisma** : Requêtes optimisées avec query planning
- **Express.js** : Middleware léger et performant
- **JWT** : Tokens stateless pour la scalabilité

### Base de données

- **Indexation** : Indexes automatiques sur les clés uniques
- **Migrations** : Changements de schéma versionnés
- **Connection pooling** : Gestion automatique par Prisma

---

## 🧪 Tests et qualité

### Outils de développement

- **TypeScript** : Vérification de types à la compilation
- **ESLint** : Linting du code JavaScript/TypeScript
- **Prettier** : Formatage automatique du code
- **ts-node-dev** : Hot reload pour le développement backend

### Validation des données

- **Zod** : Validation de schémas côté frontend
- **Validation manuelle** : Checks côté backend
- **Prisma** : Validation au niveau base de données

---

## 🔧 Maintenance et extension

### Ajout de nouvelles fonctionnalités

#### 1. Nouveaux endpoints API

```typescript
// backend/src/Routes/users.ts
router.post("/new-endpoint", authenticateToken, async (req, res) => {
  // Logique métier
});
```

#### 2. Nouveaux composants React

```typescript
// frontend/components/new-component.tsx
export default function NewComponent() {
  // Logique du composant
}
```

#### 3. Migrations de base de données

```bash
npx prisma migrate dev --name add_new_feature
```

### Monitoring et logs

- Logs serveur avec console.log structuré
- Gestion des erreurs avec try/catch
- Monitoring de santé avec endpoint `/health`

---

## 📝 Conclusion

Le projet Loldle présente une architecture moderne et scalable avec :

- **Séparation claire** des responsabilités (frontend/backend/database)
- **Technologies modernes** (Next.js, Prisma, TypeScript)
- **Sécurité robuste** (JWT, hachage, validation)
- **Expérience utilisateur** optimisée (persistance, temps réel)
- **Maintenabilité** élevée (typage, structure modulaire)

Cette architecture permet une évolution facile du projet et l'ajout de nouvelles fonctionnalités tout en maintenant la performance et la sécurité.
