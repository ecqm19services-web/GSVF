# Spécifications Techniques - Nouvelles Fonctionnalités

**Projet :** Collège Privé La Vision Future  
**Date :** 19 Janvier 2026  
**Version :** 1.0  

---

## 📋 Sommaire

1. [Dashboard Administrateur](#1-dashboard-administrateur-ecqm19)
2. [Notifications Email](#2-système-de-notifications-email)
3. [Page de Suivi Public](#3-page-de-suivi-public-suivi)
4. [Architecture Technique](#4-architecture-technique)
5. [Base de Données](#5-structure-base-de-données)
6. [Planning de Développement](#6-planning-de-développement)

---

## 1. Dashboard Administrateur (/ecqm19)

### 1.1 Objectif
Créer une interface d'administration sécurisée permettant aux gestionnaires de l'école de visualiser et traiter toutes les soumissions de formulaires (contact et admission).

### 1.2 Fonctionnalités

#### Authentification
- [ ] Protection par mot de passe
- [ ] Session sécurisée avec expiration (24h)
- [ ] Déconnexion manuelle
- [ ] Stockage sécurisé du mot de passe (hashé)

#### Tableau de Bord Principal
- [ ] Vue d'ensemble avec statistiques :
  - Nombre total de soumissions
  - Soumissions en attente
  - Soumissions traitées aujourd'hui
  - Graphique des soumissions par semaine
- [ ] Notifications des nouvelles soumissions

#### Gestion des Soumissions de Contact
| Colonne | Description |
|---------|-------------|
| Référence | Numéro unique (ex: CONT-2026-0001) |
| Date | Date/heure de soumission |
| Nom | Nom complet du demandeur |
| Email | Adresse email |
| Sujet | Sujet du message |
| Statut | Nouveau / En cours / Traité |
| Actions | Voir / Marquer comme traité |

#### Gestion des Demandes d'Admission
| Colonne | Description |
|---------|-------------|
| Référence | Numéro unique (ex: ADM-2026-0001) |
| Date | Date de soumission |
| Élève | Nom et prénom de l'enfant |
| Classe | Classe souhaitée |
| Parent | Nom du parent/tuteur |
| Téléphone | Contact téléphonique |
| Statut | Nouveau / En examen / Approuvé / Rejeté |
| Actions | Voir détails / Changer statut / Ajouter note |

#### Filtres et Recherche
- [ ] Filtrage par date (plage de dates)
- [ ] Filtrage par statut
- [ ] Filtrage par type (contact/admission)
- [ ] Recherche par nom, email ou référence
- [ ] Tri par colonnes

#### Export de Données
- [ ] Export CSV des soumissions filtrées
- [ ] Export Excel (optionnel)
- [ ] Sélection des colonnes à exporter

#### Vue Détaillée
- [ ] Affichage complet des informations soumises
- [ ] Historique des changements de statut
- [ ] Zone de notes internes
- [ ] Boutons d'action rapide

### 1.3 Interface Utilisateur

```
┌─────────────────────────────────────────────────────────────────┐
│  🏫 Administration - Collège Privé La Vision Future    [Déco]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │    12    │  │    5     │  │    3     │  │    4     │        │
│  │ Total    │  │ Nouveaux │  │ En cours │  │ Traités  │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│                                                                  │
│  [Contacts]  [Admissions]                                        │
│                                                                  │
│  Filtres: [Date ▼] [Statut ▼] [Recherche...    ] [Export CSV]   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Réf.        │ Date       │ Nom      │ Statut   │ Actions   ││
│  │─────────────│────────────│──────────│──────────│───────────││
│  │ ADM-2026-01 │ 19/01/2026 │ Dupont   │ 🟡 Exam  │ [Voir]    ││
│  │ CONT-2026-05│ 18/01/2026 │ Martin   │ 🟢 Traité│ [Voir]    ││
│  │ ADM-2026-02 │ 18/01/2026 │ Bernard  │ 🔴 Nouveau│ [Voir]   ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  Page 1 sur 3  [◀] [1] [2] [3] [▶]                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.4 Sécurité
- Route protégée non indexable (robots.txt)
- Mot de passe fort requis (min 12 caractères)
- Protection contre les attaques brute-force
- Logs d'accès administrateur
- HTTPS obligatoire en production

---

## 2. Système de Notifications Email (On reviendra dessusplus tard)

### 2.1 Objectif
Automatiser l'envoi d'emails lors de la soumission de formulaires et des changements de statut.

### 2.2 Types d'Emails

#### A. Confirmation de Réception (vers l'utilisateur)

**Pour les demandes de contact :**
```
Objet: Confirmation de réception - Réf. CONT-2026-0001

Bonjour [Prénom] [Nom],

Nous avons bien reçu votre message concernant "[Sujet]".

📋 Votre numéro de référence : CONT-2026-0001

Vous pouvez suivre l'état de votre demande à tout moment sur :
https://[site]/suivi

Notre équipe vous répondra dans les meilleurs délais.

Cordialement,
L'équipe du Collège Privé La Vision Future
```

**Pour les demandes d'admission :**
```
Objet: Demande d'admission reçue - Réf. ADM-2026-0001

Bonjour [Prénom Parent],

Nous avons bien reçu votre demande d'admission pour :
👤 Élève : [Prénom] [Nom]
📚 Classe demandée : [Classe]

📋 Votre numéro de référence : ADM-2026-0001

Suivez l'avancement de votre dossier sur :
https://[site]/suivi

Prochaines étapes :
1. Examen de votre dossier (3-5 jours ouvrés)
2. Entretien avec la direction (si dossier retenu)
3. Décision finale et notification

Cordialement,
Le Service des Admissions
Collège Privé La Vision Future
```

#### B. Notification Administrateur (vers l'école)

```
Objet: [NOUVEAU] Demande d'admission - ADM-2026-0001

🔔 Nouvelle demande d'admission

Élève : [Prénom] [Nom]
Classe : [Classe souhaitée]
Parent : [Nom Parent]
Téléphone : [Téléphone]
Email : [Email]

Date de naissance : [Date]
École actuelle : [École]

Message :
[Message du parent]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Accéder au dashboard : https://[site]/ecqm19
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### C. Notification de Changement de Statut (vers l'utilisateur)

```
Objet: Mise à jour de votre demande - Réf. ADM-2026-0001

Bonjour [Prénom],

Le statut de votre demande d'admission a été mis à jour :

📋 Référence : ADM-2026-0001
📊 Nouveau statut : EN EXAMEN

[Si note ajoutée]
💬 Message de l'administration :
"[Note visible]"

Suivez votre dossier : https://[site]/suivi

Cordialement,
Collège Privé La Vision Future
```

### 2.3 Service Email Recommandé

| Service | Avantages | Coût |
|---------|-----------|------|
| **Resend** | Simple, API moderne, bon avec Supabase | 3000 emails/mois gratuits |
| SendGrid | Populaire, robuste | 100 emails/jour gratuits |
| Mailgun | Fiable, bonne délivrabilité | 5000 emails/mois gratuits |

**Recommandation :** Resend (intégration native avec Supabase Edge Functions)

### 2.4 Architecture Email

```
┌─────────────┐      ┌─────────────────┐      ┌─────────────┐
│  Formulaire │ ───▶ │  Supabase DB    │ ───▶ │  Edge       │
│  Soumis     │      │  (Insert)       │      │  Function   │
└─────────────┘      └─────────────────┘      └──────┬──────┘
                                                      │
                                                      ▼
                      ┌─────────────────┐      ┌─────────────┐
                      │  Utilisateur    │ ◀─── │  Resend API │
                      │  + Admin        │      │  (Email)    │
                      └─────────────────┘      └─────────────┘
```

---

## 3. Page de Suivi Public (/suivi)

### 3.1 Objectif
Permettre aux utilisateurs de vérifier le statut de leur demande en saisissant leur numéro de référence.

### 3.2 Fonctionnalités

- [ ] Champ de saisie du numéro de référence
- [ ] Validation du format (CONT-XXXX-XXXX ou ADM-XXXX-XXXX)
- [ ] Affichage du statut actuel
- [ ] Timeline des changements de statut
- [ ] Notes publiques de l'administration
- [ ] Protection contre les tentatives abusives (rate limiting)

### 3.3 Statuts Possibles

**Pour les contacts :**
| Statut | Couleur | Description |
|--------|---------|-------------|
| Nouveau | 🔴 Rouge | Message reçu, en attente de traitement |
| En cours | 🟡 Jaune | Message en cours de traitement |
| Traité | 🟢 Vert | Réponse envoyée |

**Pour les admissions :**
| Statut | Couleur | Description |
|--------|---------|-------------|
| Nouveau | 🔴 Rouge | Dossier reçu |
| En examen | 🟡 Jaune | Dossier en cours d'analyse |
| Entretien programmé | 🔵 Bleu | RDV fixé pour entretien |
| Approuvé | 🟢 Vert | Admission acceptée |
| Rejeté | ⚫ Gris | Admission refusée |
| Liste d'attente | 🟠 Orange | En attente d'une place |

### 3.4 Interface Utilisateur

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│                    📋 Suivi de votre demande                    │
│                                                                  │
│     Entrez votre numéro de référence pour consulter             │
│     l'état de votre demande.                                    │
│                                                                  │
│     ┌─────────────────────────────────┐                         │
│     │  ADM-2026-0001                  │  [Rechercher]           │
│     └─────────────────────────────────┘                         │
│                                                                  │
│     ───────────────────────────────────────────────────         │
│                                                                  │
│     📄 Demande d'admission                                      │
│     Référence : ADM-2026-0001                                   │
│     Soumise le : 19 janvier 2026                                │
│                                                                  │
│     ┌─────────────────────────────────────────────────┐         │
│     │  ● Dossier reçu              19/01/2026 10:30  │         │
│     │  │                                              │         │
│     │  ● En cours d'examen         20/01/2026 09:15  │         │
│     │  │  "Dossier complet, en attente de la         │         │
│     │  │   commission d'admission"                    │         │
│     │  │                                              │         │
│     │  ○ Décision (en attente)                       │         │
│     └─────────────────────────────────────────────────┘         │
│                                                                  │
│     Statut actuel : 🟡 EN EXAMEN                                │
│                                                                  │
│     💬 Une question ? Contactez-nous : contact@ecole.com        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.5 Sécurité
- Rate limiting : 5 recherches max par minute par IP
- Pas d'information sensible affichée (pas de nom complet, etc.)
- Référence difficile à deviner (format avec année + numéro séquentiel)
- Logs des recherches pour audit

---

## 4. Architecture Technique

### 4.1 Stack Technologique

| Composant | Technologie |
|-----------|-------------|
| Frontend | React + TypeScript + Vite |
| Styling | TailwindCSS + shadcn/ui |
| Routing | React Router v6 |
| Backend | Supabase (PostgreSQL + Edge Functions) |
| Email | Resend API |
| Auth Admin | Supabase Auth (simple) ou JWT custom |

### 4.2 Structure des Fichiers à Créer

```
src/
├── pages/
│   ├── AdminLoginPage.tsx      # Page de connexion admin
│   ├── AdminDashboard.tsx      # Dashboard principal
│   └── SuiviPage.tsx           # Page de suivi public
├── components/
│   ├── admin/
│   │   ├── AdminLayout.tsx     # Layout admin
│   │   ├── SubmissionTable.tsx # Tableau des soumissions
│   │   ├── SubmissionDetail.tsx# Détail d'une soumission
│   │   ├── StatsCards.tsx      # Cartes statistiques
│   │   └── ExportButton.tsx    # Bouton export CSV
│   └── suivi/
│       ├── ReferenceInput.tsx  # Input de référence
│       └── StatusTimeline.tsx  # Timeline de statut
├── hooks/
│   ├── useAdminAuth.ts         # Hook auth admin
│   └── useSubmissions.ts       # Hook gestion soumissions
├── lib/
│   └── supabase.ts             # Client Supabase (existant)
└── types/
    └── submissions.ts          # Types TypeScript

supabase/
└── functions/
    ├── send-confirmation/      # Edge function email confirmation
    └── send-notification/      # Edge function notification admin
```

### 4.3 Routes

| Route | Accès | Description |
|-------|-------|-------------|
| `/suivi` | Public | Page de suivi de demande |
| `/ecqm19` | Protégé | Redirection vers login si non connecté |
| `/ecqm19/login` | Public | Page de connexion admin |
| `/ecqm19/dashboard` | Protégé | Dashboard admin |
| `/ecqm19/contacts` | Protégé | Liste des contacts |
| `/ecqm19/admissions` | Protégé | Liste des admissions |
| `/ecqm19/submission/:id` | Protégé | Détail d'une soumission |

---

## 5. Structure Base de Données

### 5.1 Tables Supabase

#### Table `contact_submissions`

```sql
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference VARCHAR(20) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Informations du formulaire
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  
  -- Gestion administrative
  status VARCHAR(20) DEFAULT 'new', -- new, in_progress, processed
  admin_notes TEXT,
  processed_by UUID REFERENCES auth.users(id),
  processed_at TIMESTAMP WITH TIME ZONE
);
```

#### Table `admission_submissions`

```sql
CREATE TABLE admission_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference VARCHAR(20) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Informations de l'élève
  student_first_name VARCHAR(100) NOT NULL,
  student_last_name VARCHAR(100) NOT NULL,
  student_birthdate DATE NOT NULL,
  student_gender VARCHAR(10),
  current_school VARCHAR(200),
  desired_class VARCHAR(50) NOT NULL,
  
  -- Informations du parent/tuteur
  parent_first_name VARCHAR(100) NOT NULL,
  parent_last_name VARCHAR(100) NOT NULL,
  parent_email VARCHAR(255) NOT NULL,
  parent_phone VARCHAR(20) NOT NULL,
  parent_address TEXT,
  relationship VARCHAR(50), -- père, mère, tuteur
  
  -- Informations complémentaires
  message TEXT,
  documents JSONB, -- URLs des documents uploadés
  
  -- Gestion administrative
  status VARCHAR(30) DEFAULT 'new', 
  -- new, under_review, interview_scheduled, approved, rejected, waitlist
  admin_notes TEXT,
  public_notes TEXT, -- Notes visibles par le parent
  processed_by UUID REFERENCES auth.users(id),
  processed_at TIMESTAMP WITH TIME ZONE,
  interview_date TIMESTAMP WITH TIME ZONE
);
```

#### Table `status_history`

```sql
CREATE TABLE status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  submission_type VARCHAR(20) NOT NULL, -- contact, admission
  submission_id UUID NOT NULL,
  old_status VARCHAR(30),
  new_status VARCHAR(30) NOT NULL,
  note TEXT,
  changed_by UUID REFERENCES auth.users(id)
);
```

#### Table `admin_users`

```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin', -- admin, super_admin
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);
```

### 5.2 Fonctions de Génération de Référence

```sql
CREATE OR REPLACE FUNCTION generate_contact_reference()
RETURNS VARCHAR(20) AS $$
DECLARE
  year_part VARCHAR(4);
  seq_num INTEGER;
  new_ref VARCHAR(20);
BEGIN
  year_part := TO_CHAR(CURRENT_DATE, 'YYYY');
  
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(reference FROM 11 FOR 4) AS INTEGER)
  ), 0) + 1
  INTO seq_num
  FROM contact_submissions
  WHERE reference LIKE 'CONT-' || year_part || '-%';
  
  new_ref := 'CONT-' || year_part || '-' || LPAD(seq_num::TEXT, 4, '0');
  RETURN new_ref;
END;
$$ LANGUAGE plpgsql;
```

---

## 6. Planning de Développement

### Phase 1 : Base de données et API (2-3 heures)
- [ ] Créer les tables Supabase
- [ ] Configurer les politiques de sécurité (RLS)
- [ ] Créer les fonctions de génération de référence
- [ ] Mettre à jour les formulaires existants pour sauvegarder en DB

### Phase 2 : Page de Suivi Public (1-2 heures)
- [ ] Créer la page `/suivi`
- [ ] Implémenter la recherche par référence
- [ ] Afficher le statut et la timeline
- [ ] Ajouter le rate limiting

### Phase 3 : Dashboard Admin (3-4 heures)
- [ ] Créer la page de login admin
- [ ] Implémenter l'authentification
- [ ] Créer le layout admin
- [ ] Développer les tableaux de soumissions
- [ ] Ajouter les filtres et la recherche
- [ ] Implémenter la vue détaillée
- [ ] Ajouter l'export CSV

### Phase 4 : Notifications Email (2-3 heures)
- [ ] Configurer Resend
- [ ] Créer les templates d'email
- [ ] Implémenter les Edge Functions Supabase
- [ ] Tester l'envoi automatique
- [ ] Ajouter les notifications de changement de statut

### Phase 5 : Tests et Finalisation (1-2 heures)
- [ ] Tests complets de bout en bout
- [ ] Optimisation des performances
- [ ] Documentation utilisateur admin
- [ ] Déploiement

**Durée totale estimée : 9-14 heures de développement**

---

## 7. Prérequis Avant Démarrage

### Configuration Supabase
- [ ] Accès au projet Supabase existant
- [ ] Permissions pour créer des tables
- [ ] Activation des Edge Functions

### Service Email
- [ ] Compte Resend créé
- [ ] Clé API obtenue
- [ ] Domaine email vérifié (optionnel mais recommandé)

### Informations Nécessaires
- [ ] Adresse email admin pour recevoir les notifications
- [ ] Mot de passe admin souhaité
- [ ] Logo pour les emails (optionnel)

---

## ✅ Validation

**En attente de votre accord pour commencer l'implémentation.**

Confirmez si :
1. Les fonctionnalités décrites correspondent à vos attentes
2. Les statuts proposés sont corrects
3. Le planning est acceptable
4. Vous avez accès à Supabase et pouvez créer un compte Resend

---

*Document généré par Cascade - 19/01/2026*
