# User Stories & Workflows - Vroom

Document de référence décrivant les fonctionnalités de l'application Vroom du point de vue des utilisateurs et les processus métier associés.

## 👥 Rôles et Responsabilités

### 1. Employé
L'utilisateur standard qui a besoin d'un véhicule pour effectuer ses missions professionnelles.
- **Objectif** : Réserver un véhicule simplement et suivre l'état de sa demande.

### 2. Manager
Responsable d'équipe ou de département.
- **Objectif** : Superviser les demandes de son équipe et valider les réservations (si le workflow le prévoit) ou simplement avoir une visibilité sur l'utilisation.
- *Note : Dans la version actuelle, le Manager a des droits étendus de validation similaires à l'Admin pour la gestion opérationnelle.*

### 3. Administrateur
Gestionnaire de la flotte et du système.
- **Objectif** : Gérer l'inventaire des véhicules, les utilisateurs, et maintenir l'intégrité du système de réservation.

---

## 📝 User Stories

### Pour l'Employé
| ID | En tant que... | Je veux... | Afin de... |
|----|----------------|------------|------------|
| E1 | Employé | **Voir la liste des véhicules disponibles** | Choisir un véhicule adapté à ma mission. |
| E2 | Employé | **Filtrer les véhicules** | Trouver rapidement un type spécifique (ex: Pickup pour terrain difficile). |
| E3 | Employé | **Faire une demande de réservation** | Bloquer un véhicule pour une période donnée. |
| E4 | Employé | **Voir mes réservations** | Connaître le statut de mes demandes (En attente, Validée, Refusée). |
| E5 | Employé | **Annuler une réservation** | Libérer le véhicule si ma mission est annulée. |
| E6 | Employé | **Voir mon profil** | Consulter mes statistiques d'utilisation. |

### Pour le Manager
| ID | En tant que... | Je veux... | Afin de... |
|----|----------------|------------|------------|
| M1 | Manager | **Voir toutes les réservations** | Avoir une vue d'ensemble de l'utilisation de la flotte. |
| M2 | Manager | **Valider une réservation** | Autoriser le départ d'un collaborateur. |
| M3 | Manager | **Refuser une réservation** | Empêcher une utilisation non justifiée ou prioriser une autre demande. |
| M4 | Manager | **Voir les statistiques** | Analyser le taux d'occupation des véhicules. |

### Pour l'Administrateur
| ID | En tant que... | Je veux... | Afin de... |
|----|----------------|------------|------------|
| A1 | Admin | **Ajouter un véhicule** | Mettre à jour la flotte avec de nouvelles acquisitions. |
| A2 | Admin | **Modifier un véhicule** | Mettre à jour le kilométrage, l'état ou les informations. |
| A3 | Admin | **Mettre un véhicule en maintenance** | Empêcher sa réservation durant les réparations. |
| A4 | Admin | **Supprimer un véhicule** | Retirer un véhicule sorti de la flotte. |
| A5 | Admin | **Gérer les utilisateurs** | Créer des comptes ou modifier les rôles (via base de données/seed pour l'instant). |

---

## 🔄 Flux (Workflows)

### 1. Cycle de vie d'une Réservation

1.  **Création (Statut: `PENDING`)**
    *   L'employé sélectionne une plage de dates.
    *   Le système vérifie la disponibilité (pas de chevauchement avec une réservation `PENDING` ou `APPROVED` existante pour le même véhicule).
    *   L'employé soumet la demande avec le motif et la destination.

2.  **Validation (Statut: `APPROVED` ou `REJECTED`)**
    *   Le Manager ou l'Admin reçoit la demande dans l'onglet "En attente".
    *   **Action Approuver** : La réservation passe à `APPROVED`. Le véhicule est officiellement bloqué.
    *   **Action Rejeter** : La réservation passe à `REJECTED`. Le créneau est libéré pour d'autres demandes.

3.  **Utilisation (Réalité Terrain)**
    *   Le jour J, l'employé récupère le véhicule.
    *   Le système ne gère pas encore l'état "En cours" automatiquement, mais la réservation reste visible comme active.

4.  **Finalisation (Statut: `COMPLETED`)**
    *   Une fois la date de fin passée, la réservation est considérée comme terminée (historique).

5.  **Annulation (Statut: `CANCELLED`)**
    *   L'employé peut annuler sa propre réservation tant qu'elle n'est pas passée.
    *   Le manager/admin peut annuler n'importe quelle réservation.

### 2. Détection de Conflits

Le système empêche physiquement la création d'une réservation si un conflit existe.
*   **Règle** : Un véhicule ne peut pas avoir deux réservations dont les plages de dates se chevauchent, sauf si l'une d'elles est `REJECTED` ou `CANCELLED`.
*   **Feedback** : Lors de la création, si l'utilisateur tente de sélectionner un véhicule indisponible, le système l'alerte ou ne propose que les véhicules libres.

### 3. Gestion de la Flotte

*   **Statut Véhicule** :
    *   `AVAILABLE` : Réservable.
    *   `MAINTENANCE` : Non réservable, visible mais bloqué.
    *   `IN_USE` : Indique qu'il est actuellement sur le terrain (informatif).
    *   `UNAVAILABLE` : Hors service temporaire ou permanent.

---

## 🛡️ Règles de Sécurité & Accès

*   **Middleware de Protection** : Toutes les routes `/dashboard` nécessitent une authentification.
*   **Protection des Actions** :
    *   Seuls les Admins peuvent créer/modifier/supprimer des véhicules.
    *   Seuls les Admins/Managers peuvent changer le statut d'une réservation d'un tiers.
    *   Un utilisateur ne peut voir et modifier que ses propres données (sauf s'il a un rôle élevé).
