# 🏠 DecorIA

> **Transformez vos pièces avec l'intelligence artificielle**

DecorIA est une application mobile React Native qui transforme vos photos de pièces en utilisant l'API Google Gemini. Visualisez votre espace dans différents styles : rangé, vide, rénové, luxueux, minimaliste ou selon votre vision personnalisée.

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)

## 🎥 Démonstration (video faible qualité pour github)

https://github.com/user-attachments/assets/dcf1ee57-af8a-49c3-b2a8-1862fb9e0af7

## ✨ Fonctionnalités

- 📸 **Capture photo** - Caméra intégrée avec ratios personnalisables (Auto/16:9/4:3)
- 🎨 **6 styles de transformation** - Sur mesure, Vide, Rénové, Délabrée, Luxueux, Minimaliste
- 🔄 **Interface intuitive** - Navigation fluide avec comparaison avant/après
- 📱 **Design adaptatif** - Support portrait/paysage avec positionnement optimisé
- 💾 **Sauvegarde** - Export des images transformées vers la galerie
- 🚀 **Performance** - Gestion du cache et optimisation des ressources

## 🚀 Installation rapide

### Prérequis
- [Node.js](https://nodejs.org/) 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Compte [Expo](https://expo.dev/) (pour les builds)
- Clé API [Google Gemini](https://aistudio.google.com/app/apikey)

### Configuration

```bash
# 1. Cloner le projet
git clone https://github.com/votre-nom/DecorIA.git
cd DecorIA

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
cp .env.example .env
# Éditer .env avec votre clé API Gemini

# 4. Lancer en mode développement
npm start
```

## 🔑 Configuration API

### Obtenir une clé Gemini (gratuit)

1. Rendez-vous sur [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Connectez-vous avec votre compte Google
3. Cliquez sur "Create API Key"
4. Copiez la clé dans votre fichier `.env`

```bash
# .env
GEMINI_API_KEY=votre_clé_api_ici
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent
```

### Mode test (sans clé API)
```bash
# Pour tester sans clé API
GEMINI_API_KEY=TEST_MODE
```

## 📱 Utilisation

### Développement
```bash
# Démarrer le serveur de développement
npm start

# Tester sur Android
npm run android

# Tester sur iOS  
npm run ios

# Tester sur Web
npm run web
```

### Build APK
```bash
# Build de test (APK)
npm run build:preview

# Build de production (AAB pour Google Play)
npm run build:production
```

### Scripts utiles
```bash
# Vérification TypeScript
npm run type-check

# Linting
npm run lint

# Nettoyage cache
npm run clean
```

## 🏗️ Architecture

```
src/
├── components/          # Composants réutilisables
│   ├── AdaptiveImage.tsx      # Image responsive avec gestion des dimensions
│   ├── ImageComparison.tsx    # Comparaison avant/après
│   ├── LoadingOverlay.tsx     # Indicateur de chargement
│   ├── StyleCard.tsx          # Carte de sélection de style
│   └── ZoomableImage.tsx      # Image avec zoom et pan
├── screens/             # Écrans principaux
│   ├── HomeScreen.tsx         # Écran d'accueil
│   ├── CameraScreen.tsx       # Interface caméra
│   ├── TransformScreen.tsx    # Sélection de style
│   └── ResultScreen.tsx       # Résultat final
├── services/            # Logique métier
│   ├── geminiService.ts       # Interface API Gemini
│   ├── imageService.ts        # Gestion images et permissions
│   └── storageService.ts      # Stockage local (AsyncStorage)
├── hooks/               # Hooks personnalisés
│   ├── useCamera.ts           # Gestion caméra et galerie
│   ├── useImageTransform.ts   # Transformation d'images
│   └── useOrientation.ts      # Détection orientation
├── contexts/            # Gestion d'état global
│   └── AppContext.tsx         # Context principal de l'app
└── constants/           # Configuration et constantes
    ├── config.ts              # Configuration API
    ├── dimensions.ts          # Dimensions et calculs
    ├── styles.ts              # Styles de transformation
    └── theme.ts               # Thème Material Design
```

## 🎨 Styles de transformation

| Style | Description | Prompt IA |
|-------|-------------|-----------|
| **Rangée** | Organisation parfaite de la pièce | Nettoie et organise tous les éléments |
| **Vide** | Pièce sans meubles | Supprime mobilier et décorations |
| **Rénovée** | Design moderne et contemporain | Modernise avec finitions haut de gamme |
| **Délabrée** | Version abandonnée vieillie | Ajoute usure et signes de négligence |
| **Luxueuse** | Version haut de gamme | Matériaux premium et éléments design |
| **Minimaliste** | Espace épuré et zen | Lignes épurées et espace maximum |
| **Sur mesure** | Votre vision personnalisée | Prompt libre défini par l'utilisateur |

## 🔧 Développement

### Stack technique
- **React Native** 0.79.6 - Framework mobile cross-platform
- **Expo** 53+ - Plateforme de développement
- **TypeScript** - Typage statique
- **React Navigation** 7+ - Navigation
- **React Native Paper** - Composants Material Design
- **Axios** - Client HTTP
- **AsyncStorage** - Stockage local

### Path aliases
```typescript
// Imports simplifiés configurés
import { ImageService } from '@services/imageService';
import { useCamera } from '@hooks/useCamera';
import { HomeScreen } from '@screens/HomeScreen';
```

### Gestion des états
- **Context API** pour l'état global (image, style sélectionné, chargement)
- **Hooks personnalisés** pour la logique métier réutilisable
- **AsyncStorage** pour la persistance des préférences

## 📊 Performances

- **~3400 lignes de code** TypeScript/TSX
- **22 fichiers source** bien organisés  
- **Gestion mémoire** optimisée pour les images
- **Cache intelligent** avec nettoyage automatique
- **Lazy loading** des composants lourds

## 🐛 Dépannage

### Problèmes courants

**Erreur de clé API**
```bash
# Vérifier la configuration
cat .env
# La clé doit commencer par "AIza..."
```

**Cache Expo corrompu**
```bash
npm run clean
npm install
expo start --clear
```

**Permissions caméra**
```bash
# Réinitialiser les permissions dans les paramètres de l'appareil
# Ou désinstaller/réinstaller l'app
```

**Build EAS échoue**
```bash
# Se reconnecter à EAS
eas logout
eas login
```

## 📝 Contribution

1. **Fork** le projet
2. **Créer** une branche feature (`git checkout -b feature/amazing-feature`)
3. **Commit** vos changements (`git commit -m 'Add amazing feature'`)
4. **Push** vers la branche (`git push origin feature/amazing-feature`)
5. **Ouvrir** une Pull Request

### Guidelines
- Respecter la structure existante
- Ajouter des tests si nécessaire
- Suivre les conventions TypeScript
- Documenter les nouvelles fonctionnalités

## 💰 Coûts et limites

### Google Gemini API
- **Quota gratuit** pour développeurs
- **Facturation à l'usage** au-delà
- Voir [tarification officielle](https://ai.google.dev/pricing)

### Recommandations
- Utiliser le mode test pour le développement
- Monitorer la consommation API
- Informer les utilisateurs des coûts

## 📄 Licence

Ce projet est publié sous une licence propriétaire détaillée dans le fichier `LICENSE`.

En résumé, vous pouvez :
*   Utiliser, partager et modifier le code, tant que c’est **sans but commercial** et en citant l’auteur original.

Vous ne pouvez pas :
*   Utiliser ce projet, en tout ou en partie, pour des **usages commerciaux**, produits ou services payants, sans une autorisation écrite préalable.

### 👉 Clause importante
L’auteur de ce projet se réserve le droit d’utiliser et d’exploiter commercialement son propre travail. 
La restriction "NonCommercial" s’applique uniquement aux tiers.
Pour toute demande de licence commerciale, merci de me contacter directement.

## 👨‍💻 Auteur

**Yann POINTUD**
- Email: yann@pointud.fr
- GitHub: [yannpointud](https://github.com/yannpointud)


<p align="center">
  <strong>⭐ N'hésitez pas à donner une étoile si ce projet vous plaît !</strong>
</p>
