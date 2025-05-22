## Projet : Plateforme de Portfolio/CV pour Étudiants

### StudFolio « Student Portfoilo »

#### 📌 Nom du Projet

##### « StudFolio »

#### 🎯 Objectif Principal

##### Créer une plateforme web permettant aux étudiants de :

#####  Construire un CV professionnel à partir de templates personnalisables.

#####  Générer un site portfolio basé sur leurs données (éducation, compétences,

##### projets).

#####  Centraliser leur identité professionnelle pour partager facilement leur

##### profil (liens personnalisés, QR Code, etc.).

#### 🌍 Contexte & Public Cible

##### Problématique

##### Les étudiants ont souvent des CV mal structurés ou des portfolios techniques

##### dispersés (GitHub, LinkedIn, Behance...). Cette solution automatise et unifie leur

##### présence en ligne.

##### Utilisateurs

#####  Étudiants (en informatique, design, commerce, etc.).

#####  Écoles (pour accompagner leurs élèves dans la recherche de stage).

#####  Recruteurs (accès rapide à un profil complet).

#### ✨ Fonctionnalités Clés

##### 1. Gestion de Profil Étudiant

```
 Coordonnées (nom, email, réseaux sociaux).
 Parcours académique (écoles, diplômes, années).
 Expériences professionnelles (stages, jobs).
 Compétences (techniques et soft skills).
 Projets (description, technologies, liens GitHub/Demo).
 Langues (niveau ).
```
##### 2. Générateur de CV (PDF/HTML)

##### Templates modernes (3-5 designs au lancement).

##### Personnalisation :

#####  Choix de couleurs/polices.

#####  Sections réorganisables (drag & drop).

##### Export en PDF ou HTML.

##### 3. Générateur de Site Portfolio

#####  Templates React/Next.js optimisés SEO.

#####  Hébergement automatique (Vercel/Netlify).

#####  Lien personnalisable : monportfolio.studFolio.com/saber-mhamdi.

##### 4. Recent Activity & Analytics (Bonus)

#####  Historique des actions (ex: "CV exporté le 10/05/2024").

#####  Statistiques de visites (si partage public).

##### 5. Intégrations (Bonus avancé)

```
 GitHub : Affichage automatique des projets.
 LinkedIn : Import des données.
 IA : Suggestions d’amélioration de CV (via OpenAI).
```
#### 🛠️ Stack Technique

##### Frontend (React.js)

```
 Framework : React + Vite.
 UI : Tailwind CSS ou Material-UI.
 PDF : react-pdf pour la prévisualisation.
 State Management : Context API ou Redux Toolkit.
```
##### Backend (Node.js)

```
 API REST : Express.js.
 Base de données : MongoDB Atlas (schémas Mongoose).
 Authentification : JWT + bcrypt.
 Stockage fichiers : Cloudinary (images/PDF).
```

```
 Génération PDF : Puppeteer.
```
##### Infra

##### Hébergement :

#####  Backend : Render/Railway.

#####  Frontend : Vercel/Netlify.

##### Base de données : MongoDB Atlas.

## 🚀 Points Innovants

#####  Double export (CV + Site) depuis une seule source de données.

#####  Templates "Storytelling" pour un CV narratif.

#####  Mode collaboratif (partage avec un mentor pour feedback).

## 🔍 Comparaison avec la Concurrence

```
Fonctionnalité StudFolio Canva LinkedIn Zety
```
CV + Portfolio intégré (^) ✅ ❌ ❌ ❌
Site web auto-hébergé (^) ✅ ❌ ❌ ❌
Historique des actions (^) ✅ ❌ ⚠️ ❌

## 📅 Roadmap (Étapes de Développement)

# MVP (V1) : votre tâche à faire le V

#####  Authentification + Profil étudiant.

#####  Générateur de CV (1 template).

##### V2 : pour plus tard

#####  Générateur de site portfolio.

#####  Intégration GitHub/LinkedIn.

##### V3 : pour plus tard

#####  IA de suggestions.

#####  Marketplace de templates (contributeurs externes)

## 💡 Pourquoi ce Projet?

##### Utilité : Répond à un besoin concret (CV/portfolio professionnel).

##### Technique : Stack full-stack moderne et scalable.

##### Portfolio : Montre tes compétences en gestion de projet complexe.


## Détail Technique

#### Système d'Authentification

Voici l'implémentation complète de l'authentification, incluant :

1. Register → 2. Email de vérification → 3. Login → 4. Mot de passe oublié.

## 1️⃣ Register (Inscription)

##### Champs du Formulaire

```
 Nom complet (validation : 2 caractères minimum).
 Email (validation : format email + unique en base).
 Password (validation : 8 caractères, 1 majuscule, 1 chiffre).
 Confirm Password (doit matcher avec le password).
```
##### Flow Backend

1. Vérifier les données avec express-validator.
2. Hacher le mot de passe avec bcrypt.
3. Créer un utilisateur avec isVerified: false dans MongoDB.
4. Générer un token JWT (pour la vérification email) avec jsonwebtoken.
5. Envoyer un email avec un lien de vérification via nodemailer
6. Exemple de fichier « authRoutes.js » que vous pouvez implémenter :


##### Exemple d’email Template pour le registre et mot de passe oubliée :


### Gestion des Profils Étudiants (CRUD Complet) :

##### En utilisera des modèles Mongoose distincts (Experience, Education, Project,

##### etc.) pour une modularité optimale et simplifier le code et optimiser la

##### performance. Comme indique l’image suivante :


##### Vue Global de notre Application :


Partie FrontEND :
Backend :
Pour vous simplifier la tâche ... les modèles seront fourni dans le fichier « models.rar »
Un vidéo démonstratif sera aussi fourni pour mieux comprendre votre tâche