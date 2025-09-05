# DecorIA - Transformation de Pièces par IA

Application mobile de transformation de photos de pièces via l'API Gemini.

## 🚀 Installation

### Prérequis
- Node.js 16+
- npm ou yarn
- Expo CLI
- Compte Expo (pour EAS Build)
- Clé API Google Gemini

### Setup Initial

```bash
# Cloner le projet
git clone [votre-repo]
cd decoria

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# Éditer .env et ajouter votre clé API Gemini

# Configurer EAS
eas login
eas build:configure
```

## 🧪 Développement

### Lancer en développement

```bash
# Démarrer Expo
npm start

# Tester sur Android
npm run android

# Tester sur iOS
npm run ios
```

### Tester avec Expo Go
1. Installer Expo Go sur votre smartphone
2. Scanner le QR code affiché dans le terminal
3. L'app se lance automatiquement

## 📱 Build APK

### Build de preview (test)

```bash
npm run build:preview
```

### Build de production

```bash
npm run build:production
```

Le build prend environ 15-20 minutes. Une fois terminé, téléchargez l'APK depuis le lien fourni.

## 🏗️ Architecture

```
src/
├── components/     # Composants réutilisables
├── screens/        # Écrans de l'application
├── services/       # Services (API, Storage, etc.)
├── contexts/       # Contextes React
├── hooks/          # Hooks personnalisés
└── constants/      # Configuration et constantes
```

## 🎨 Styles disponibles
- Rangée : Organisation parfaite
- Vide : Sans meubles
- Rénovée : Design moderne
- Délabrée : Version abandonnée
- Luxueuse : Haut de gamme
- Minimaliste : Épuré et zen

## 📝 Configuration API Gemini

1. Obtenir une clé API sur [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Ajouter la clé dans `.env`:
```
GEMINI_API_KEY=your_key_here
```

## 🐛 Debug

### Logs Expo
```bash
expo doctor
```

### Clear cache
```bash
npm run clean
npm install
expo start -c
```

## 📄 License



## 👤 Auteur

Yann POINTUD