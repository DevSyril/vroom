# Vroom - Application de Réservation de Véhicules

## 🚗 Contexte
Vroom est une application web interne destinée à faciliter la gestion et la réservation de la flotte de véhicules d'entreprise. Elle permet aux employés de réserver des véhicules pour leurs missions professionnelles, aux managers de valider ces demandes, et aux administrateurs de gérer le parc automobile.

L'objectif est d'optimiser l'utilisation des véhicules, d'éviter les conflits de réservation et de simplifier le processus de validation.

## 🛠️ Choix Techniques

Cette application est construite sur une stack moderne et robuste :

- **Framework** : [Next.js 15](https://nextjs.org/) (App Router) pour le rendu serveur et la performance.
- **Langage** : [TypeScript](https://www.typescriptlang.org/) pour la sécurité du typage.
- **Base de Données** : [PostgreSQL](https://www.postgresql.org/) avec [Prisma ORM](https://www.prisma.io/) pour une gestion de données type-safe.
- **Authentification** : [NextAuth.js v5](https://authjs.dev/) (Auth.js) pour une gestion sécurisée des sessions et des rôles.
- **UI & Styling** : 
  - [Tailwind CSS](https://tailwindcss.com/) pour le styling utilitaire.
  - [shadcn/ui](https://ui.shadcn.com/) pour des composants accessibles et personnalisables.
  - Design System "Emerald" et "Glassmorphism" pour une interface moderne et épurée.
- **Validation** : [Zod](https://zod.dev/) pour la validation des schémas (formulaires et API).
- **Architecture** : Server Actions pour la logique backend directement intégrée aux composants.

## ✨ Fonctionnalités Principales

### 1. Gestion des Utilisateurs et Authentification
- Système de connexion sécurisé.
- Gestion des rôles : **Admin**, **Manager**, **Employé**.
- Page de profil avec statistiques personnelles.

### 2. Gestion de la Flotte (Admin)
- Ajout, modification et suppression de véhicules.
- Suivi de l'état des véhicules (Disponible, En maintenance, En cours d'utilisation).
- Caractéristiques détaillées (Kilométrage, Carburant, Transmission, etc.).

### 3. Système de Réservation
- **Recherche intelligente** : Filtrage des véhicules disponibles par date et caractéristiques.
- **Détection de conflits** : Impossible de réserver un véhicule déjà pris sur la période sélectionnée.
- **Workflow de validation** : Les demandes peuvent nécessiter une approbation (Manager/Admin).
- **Tableau de bord** : Vue synthétique des réservations en attente, approuvées et terminées.

## 📚 User Stories
Pour le détail complet des parcours utilisateurs et des règles de gestion par rôle, veuillez consulter le fichier [STORY.md](./STORY.md).

## 🚀 Installation

### Pré-requis
- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/)

### 1. Cloner et installer
```bash
git clone <votre-repo>
cd vroom
npm install
```

### 2. Configuration des Variables d'Environnement
Créez un fichier `.env` à la racine du projet et ajoutez les variables suivantes :

```env
# Connexion à la base de données PostgreSQL
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
DATABASE_URL="postgresql://root:password@localhost:5432/vroom_db?schema=public"

# Secret utilisé par Auth.js pour chiffrer les sessions
# Vous pouvez générer un secret avec : openssl rand -base64 32
NEXTAUTH_SECRET="votre_secret_super_securise"

# URL de l'application (http://localhost:3000 en développement)
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Base de Données
Initialisez la base de données et injectez les données de test (utilisateurs, véhicules) :

```bash
# Générer le client Prisma
npx prisma generate

# Pousser le schéma vers la base de données
npx prisma db push

# (Optionnel) Peupler la base avec des données de test
npx tsx prisma/seed.ts
```

### 4. Lancement
Démarrer le serveur de développement :

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000).
