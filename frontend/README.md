# Frontend - Application Restaurant Africain

Interface utilisateur React pour l'application de gestion de restaurant africain.

## 🚀 Démarrage

### Mode Standalone (Recommandé pour le développement)
```bash
npm run dev
```

Le frontend fonctionne **indépendamment du backend** avec des données simulées.

### Mode Connecté (Avec Backend)
1. Modifier `.env` : `VITE_STANDALONE_MODE=false`
2. S'assurer que le backend est démarré
3. `npm run dev`

## 📁 Structure

```
frontend/
├── src/
│   ├── components/        # Composants réutilisables
│   │   ├── Layout/       # Header, Footer, Layout
│   │   └── UI/           # Boutons, Forms, etc.
│   ├── pages/            # Pages de l'application
│   │   ├── Admin/        # Interface administrateur
│   │   └── ...           # Pages publiques
│   ├── contexts/         # Contextes React
│   │   ├── AuthContext   # Authentification
│   │   └── CartContext   # Panier
│   ├── services/         # Services API
│   ├── config/           # Configuration
│   └── utils/            # Utilitaires
├── public/               # Assets statiques
└── ...
```

## 🎨 Design System

### Composants
- **Layout** : Structure générale de l'app
- **Cards** : Affichage des plats, commandes
- **Forms** : Authentification, commandes
- **Buttons** : Primary, Secondary, Outline

### Classes Tailwind Custom
```css
.btn-primary     /* Bouton principal */
.btn-secondary   /* Bouton secondaire */
.btn-outline     /* Bouton avec bordure */
.card           /* Carte avec ombre */
.input-field    /* Champ de saisie */
```

## 🔧 Configuration

### Variables d'environnement
Copier `.env.example` vers `.env` et ajuster :

```env
VITE_STANDALONE_MODE=true          # Mode sans backend
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Savanna Spice
```

### Mode Standalone
- ✅ Authentification simulée (3 comptes de test)
- ✅ Menu avec données statiques
- ✅ Panier fonctionnel (localStorage)
- ✅ Commandes simulées
- ✅ Interface admin complète

### Comptes de Test
- **Client** : `customer@example.com` / `password`
- **Admin** : `admin@example.com` / `admin`  
- **Staff** : `staff@example.com` / `staff`

## 📱 Pages Implémentées

### Interface Client
- `/` - Accueil avec hero et plats vedettes
- `/menu` - Catalogue complet avec filtres
- `/cart` - Panier et checkout
- `/orders` - Suivi des commandes
- `/login` - Connexion
- `/register` - Inscription

### Interface Admin
- `/admin` - Dashboard avec statistiques
- `/admin/orders` - Gestion des commandes
- `/admin/menu` - CRUD du menu
- `/admin/inventory` - Gestion des stocks

## 🛠️ Développement

### Commandes disponibles
```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run preview      # Preview du build
npm run lint         # Linting ESLint
npm run test         # Tests unitaires
```

### Ajout d'une nouvelle page
1. Créer le composant dans `src/pages/`
2. Ajouter la route dans `App.tsx`
3. Mettre à jour la navigation si nécessaire

### Ajout d'un nouveau service API
1. Définir les endpoints dans `config/api.ts`
2. Créer le service dans `services/api.ts`
3. Ajouter les données mockées pour le mode standalone

## 🎯 Fonctionnalités

### ✅ Implémentées
- Authentification avec contexte React
- Navigation responsive
- Catalogue de menu avec filtres
- Gestion du panier (localStorage)
- Interface administrative
- Gestion d'inventaire
- Suivi des commandes

### 🔮 À venir
- Intégration paiement
- Notifications push
- Mode hors ligne (PWA)
- Géolocalisation
- Chat en temps réel

## 📦 Déploiement

### Vercel (Recommandé)
```bash
npm run build
# Connecter le repo GitHub à Vercel
# Variables d'environnement à configurer sur Vercel
```

### Build manuel
```bash
npm run build
# Le dossier dist/ contient les fichiers à déployer
```

## 🐛 Debugging

### Mode Debug
Activer dans `.env` :
```env
VITE_DEBUG_MODE=true
```

### Logs
- Console du navigateur pour les erreurs frontend
- Network tab pour les appels API
- React DevTools pour l'état des composants

## 🤝 Contribution

1. Respecter la structure des dossiers
2. Utiliser TypeScript pour les nouveaux composants
3. Ajouter des tests pour les nouvelles fonctionnalités
4. Suivre les conventions de nommage

---

**Mode Standalone activé** - L'application fonctionne sans backend ! 🎉