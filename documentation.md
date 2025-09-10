
# Documentation du Projet DecorIA

Ce document détaille les fichiers, fonctions, et classes du projet DecorIA.

---

## Fichier: /home/boby/DecorIA/App.tsx

Le fichier racine de l'application qui configure la navigation et les fournisseurs de contexte.

### Types

-   **RootStackParamList**:
    -   **Description**: Définit les écrans et les paramètres attendus pour le navigateur de pile (Stack Navigator).
    -   **Propriétés**:
        -   `Home`: Pas de paramètres.
        -   `Camera`: Pas de paramètres.
        -   `Transform`: Pas de paramètres.
        -   `Result`: Pas de paramètres.

### Fonctions

-   **App()**:
    -   **Type**: Composant React
    -   **Description**: Le composant principal de l'application. Il initialise les permissions, nettoie le cache, et met en place la navigation entre les différents écrans.
    -   **Paramètres d'entrée**: Aucun.
    -   **Sortie**: `JSX.Element` - L'interface utilisateur de l'application.

---

## Fichier: /home/boby/DecorIA/index.ts

Le point d'entrée de l'application qui enregistre le composant racine.

### Fonctions

-   **registerRootComponent(App)**:
    -   **Description**: Enregistre le composant `App` comme le composant racine de l'application, assurant que l'environnement est correctement configuré.
    -   **Paramètres d'entrée**:
        -   `App`: Le composant React racine.
    -   **Sortie**: Aucune.

---

## Fichier: /home/boby/DecorIA/src/components/AdaptiveImage.tsx

Un composant pour afficher une image qui s'adapte à des dimensions maximales tout en conservant son ratio.

### Interfaces

-   **AdaptiveImageProps**:
    -   **Description**: Propriétés pour le composant `AdaptiveImage`.
    -   **Propriétés**: `source`, `maxWidth`, `maxHeight`, `containerStyle`, `imageStyle`, `showLabel`, `showDimensions`.
-   **ImageDimensions**:
    -   **Description**: Stocke les dimensions et l'orientation d'une image.
    -   **Propriétés**: `width`, `height`, `orientation`.

### Fonctions

-   **AdaptiveImage({ source, maxWidth, maxHeight, ... })**:
    -   **Type**: Composant React
    -   **Description**: Affiche une image distante, la redimensionne pour s'adapter à un conteneur, et affiche des informations de chargement, d'erreur ou de débogage.
    -   **Paramètres d'entrée**: `AdaptiveImageProps`.
    -   **Sortie**: `JSX.Element` - Le composant image adaptatif.

---

## Fichier: /home/boby/DecorIA/src/components/CustomPromptModal.tsx

Un composant de modal pour saisir un prompt de transformation personnalisé.

### Interfaces

-   **CustomPromptModalProps**:
    -   **Description**: Propriétés pour le composant `CustomPromptModal`.
    -   **Propriétés**: `visible`, `onDismiss`, `onConfirm`, `isLoading`.

### Fonctions

-   **CustomPromptModal({ visible, onDismiss, onConfirm, isLoading })**:
    -   **Type**: Composant React
    -   **Description**: Affiche une modal avec un champ de texte pour que l'utilisateur puisse décrire une transformation personnalisée.
    -   **Paramètres d'entrée**: `CustomPromptModalProps`.
    -   **Sortie**: `JSX.Element` - Le composant modal.

---

## Fichier: /home/boby/DecorIA/src/components/ImageComparison.tsx

Un composant pour comparer deux images (avant/après).

### Interfaces

-   **ImageComparisonProps**:
    -   **Description**: Propriétés pour le composant `ImageComparison`.
    -   **Propriétés**: `beforeImage`, `afterImage`.

### Fonctions

-   **ImageComparison({ beforeImage, afterImage })**:
    -   **Type**: Composant React
    -   **Description**: Affiche l'image transformée avec une capacité de zoom. Le composant s'adapte à l'orientation de l'écran.
    -   **Paramètres d'entrée**: `ImageComparisonProps`.
    -   **Sortie**: `JSX.Element` - Le composant de comparaison d'images.

---

## Fichier: /home/boby/DecorIA/src/components/LoadingOverlay.tsx

Un composant pour afficher une superposition de chargement avec une barre de progression.

### Interfaces

-   **LoadingOverlayProps**:
    -   **Description**: Propriétés pour le composant `LoadingOverlay`.
    -   **Propriétés**: `visible`, `progress`, `message`.

### Fonctions

-   **LoadingOverlay({ visible, progress, message })**:
    -   **Type**: Composant React
    -   **Description**: Affiche une superposition modale avec un indicateur d'activité, un message, et une barre de progression.
    -   **Paramètres d'entrée**: `LoadingOverlayProps`.
    -   **Sortie**: `JSX.Element` | `null` - La superposition de chargement ou rien si elle n'est pas visible.

---

## Fichier: /home/boby/DecorIA/src/components/StyleCard.tsx

Un composant carte pour afficher un style de transformation sélectionnable.

### Interfaces

-   **StyleCardProps**:
    -   **Description**: Propriétés pour le composant `StyleCard`.
    -   **Propriétés**: `style`, `selected`, `onPress`, `landscapeWidth`.

### Fonctions

-   **StyleCard({ style, selected, onPress, landscapeWidth })**:
    -   **Type**: Composant React
    -   **Description**: Affiche une carte cliquable représentant un style de transformation, avec un état visuel sélectionné/non sélectionné.
    -   **Paramètres d'entrée**: `StyleCardProps`.
    -   **Sortie**: `JSX.Element` - Le composant carte de style.

---

## Fichier: /home/boby/DecorIA/src/components/ZoomableImage.tsx

Un composant qui affiche une image avec des capacités de zoom et de panoramique.

### Interfaces

-   **ZoomableImageProps**:
    -   **Description**: Propriétés pour le composant `ZoomableImage`.
    -   **Propriétés**: `source`, `maxWidth`, `maxHeight`, `containerStyle`, `showLabel`.
-   **ImageDimensions**:
    -   **Description**: Stocke les dimensions et l'orientation d'une image.
    -   **Propriétés**: `width`, `height`, `orientation`.

### Fonctions

-   **ZoomableImage({ source, maxWidth, maxHeight, ... })**:
    -   **Type**: Composant React
    -   **Description**: Affiche une image qui peut être zoomée, dézoomée et déplacée par l'utilisateur via des gestes (pincer, tapoter, faire glisser).
    -   **Paramètres d'entrée**: `ZoomableImageProps`.
    -   **Sortie**: `JSX.Element` - Le composant d'image zoomable.

---

## Fichier: /home/boby/DecorIA/src/constants/config.ts

Contient la configuration de l'API et des images.

### Constantes

-   **API_CONFIG**:
    -   **Description**: Objet de configuration pour les appels à l'API Gemini.
    -   **Propriétés**: `GEMINI_API_KEY`, `GEMINI_API_URL`, `REQUEST_TIMEOUT`, `MAX_IMAGE_SIZE`.
-   **IMAGE_CONFIG**:
    -   **Description**: Objet de configuration pour le traitement des images.
    -   **Propriétés**: `COMPRESSION_QUALITY`, `MAX_DIMENSION`, `OUTPUT_FORMAT`.

---

## Fichier: /home/boby/DecorIA/src/constants/dimensions.ts

Contient des constantes et des fonctions utilitaires liées aux dimensions des images.

### Constantes

-   **IMAGE_DIMENSIONS**:
    -   **Description**: Définit diverses constantes liées aux dimensions, ratios et seuils d'orientation des images.

### Types

-   **ImageOrientation**:
    -   **Description**: Type chaîne de caractères pour l'orientation de l'image: `'landscape' | 'portrait' | 'square'`.

### Fonctions

-   **getImageOrientation(width, height)**:
    -   **Description**: Détermine l'orientation d'une image en fonction de sa largeur et de sa hauteur.
    -   **Paramètres d'entrée**: `width` (number), `height` (number).
    -   **Sortie**: `ImageOrientation` - L'orientation de l'image.
-   **getAdaptedDimensions(originalWidth, originalHeight, maxWidth, maxHeight)**:
    -   **Description**: Calcule les nouvelles dimensions d'une image pour qu'elle s'adapte à des dimensions maximales tout en conservant son ratio.
    -   **Paramètres d'entrée**: `originalWidth`, `originalHeight`, `maxWidth`, `maxHeight` (tous des nombres).
    -   **Sortie**: `{ width: number; height: number }` - Les dimensions adaptées.

---

## Fichier: /home/boby/DecorIA/src/constants/styles.ts

Définit les styles de transformation disponibles dans l'application.

### Interfaces

-   **TransformationStyle**:
    -   **Description**: Définit la structure d'un style de transformation.
    -   **Propriétés**: `id`, `name`, `prompt`, `icon`, `color`, `description`.

### Constantes

-   **TRANSFORMATION_STYLES**:
    -   **Description**: Un tableau d'objets `TransformationStyle` qui représente tous les styles de transformation prédéfinis.

---

## Fichier: /home/boby/DecorIA/src/constants/theme.ts

Définit le thème de l'interface utilisateur de l'application en utilisant `react-native-paper`.

### Constantes

-   **theme**:
    -   **Description**: Objet de thème qui étend le thème par défaut de `react-native-paper` avec des polices, des couleurs et une rondeur personnalisées.

---

## Fichier: /home/boby/DecorIA/src/contexts/AppContext.tsx

Fournit un contexte global pour gérer l'état de l'application.

### Interfaces

-   **AppState**:
    -   **Description**: Définit la structure de l'état de l'application.
-   **AppContextType**:
    -   **Description**: Définit le type du contexte de l'application, y compris l'état et les fonctions de mise à jour.

### Fonctions

-   **AppProvider({ children })**:
    -   **Type**: Composant React
    -   **Description**: Fournit l'état de l'application et les fonctions de mise à jour aux composants enfants.
    -   **Paramètres d'entrée**: `children` (ReactNode).
    -   **Sortie**: `JSX.Element` - Le fournisseur de contexte.
-   **useAppContext()**:
    -   **Type**: Hook React
    -   **Description**: Un hook personnalisé pour accéder facilement au contexte de l'application.
    -   **Paramètres d'entrée**: Aucun.
    -   **Sortie**: `AppContextType` - L'état et les fonctions du contexte.

---

## Fichier: /home/boby/DecorIA/src/hooks/useCamera.ts

Un hook personnalisé pour gérer la capture de photos et la sélection d'images dans la galerie.

### Fonctions

-   **useCamera()**:
    -   **Type**: Hook React
    -   **Description**: Fournit des fonctions pour capturer une photo avec l'appareil photo ou en choisir une dans la galerie, tout en gérant l'état de capture.
    -   **Paramètres d'entrée**: Aucun.
    -   **Sortie**: `{ capturePhoto, pickFromGallery, isCapturing }`.

---

## Fichier: /home/boby/DecorIA/src/hooks/useImageTransform.ts

Un hook personnalisé pour gérer la logique de transformation d'image.

### Fonctions

-   **useImageTransform()**:
    -   **Type**: Hook React
    -   **Description**: Expose les fonctions `transformImage` et `mockTransform` du contexte de l'application et gère un état de traitement local.
    -   **Paramètres d'entrée**: Aucun.
    -   **Sortie**: `{ transformImage, mockTransform, isProcessing }`.

---

## Fichier: /home/boby/DecorIA/src/hooks/useOrientation.ts

Un hook personnalisé pour détecter l'orientation de l'appareil.

### Interfaces

-   **OrientationState**:
    -   **Description**: Définit la structure de l'état d'orientation.

### Fonctions

-   **useOrientation()**:
    -   **Type**: Hook React
    -   **Description**: Renvoie les dimensions actuelles de la fenêtre et un booléen indiquant si l'appareil est en mode paysage.
    -   **Paramètres d'entrée**: Aucun.
    -   **Sortie**: `OrientationState` - L'état d'orientation.

---

## Fichier: /home/boby/DecorIA/src/screens/CameraScreen.tsx

L'écran qui permet à l'utilisateur de prendre une photo ou d'en choisir une dans la galerie.

### Fonctions

-   **CameraScreen()**:
    -   **Type**: Composant React
    -   **Description**: Affiche l'aperçu de la caméra, gère les permissions, et fournit des contrôles pour prendre une photo, changer de caméra, sélectionner un ratio, et choisir une image dans la galerie.
    -   **Paramètres d'entrée**: Aucun.
    -   **Sortie**: `JSX.Element` - L'interface de l'écran de la caméra.

---

## Fichier: /home/boby/DecorIA/src/screens/HomeScreen.tsx

L'écran d'accueil de l'application.

### Fonctions

-   **HomeScreen()**:
    -   **Type**: Composant React
    -   **Description**: Affiche le logo de l'application et les boutons pour naviguer vers l'écran de la caméra ou la galerie d'images. Le layout s'adapte à l'orientation de l'appareil.
    -   **Paramètres d'entrée**: Aucun.
    -   **Sortie**: `JSX.Element` - L'interface de l'écran d'accueil.

---

## Fichier: /home/boby/DecorIA/src/screens/ResultScreen.tsx

L'écran qui affiche le résultat de la transformation.

### Fonctions

-   **ResultScreen()**:
    -   **Type**: Composant React
    -   **Description**: Affiche une comparaison de l'image originale et de l'image transformée. Fournit des options pour sauvegarder, réessayer ou prendre une nouvelle photo.
    -   **Paramètres d'entrée**: Aucun.
    -   **Sortie**: `JSX.Element` | `null` - L'interface de l'écran de résultat.

---

## Fichier: /home/boby/DecorIA/src/screens/TransformScreen.tsx

L'écran où l'utilisateur sélectionne un style et lance la transformation.

### Fonctions

-   **TransformScreen()**:
    -   **Type**: Composant React
    -   **Description**: Affiche l'image originale et une liste de styles de transformation. Gère la sélection de style, le lancement de la transformation, et l'affichage de la progression.
    -   **Paramètres d'entrée**: Aucun.
    -   **Sortie**: `JSX.Element` | `null` - L'interface de l'écran de transformation.

---

## Fichier: /home/boby/DecorIA/src/services/geminiService.ts

Service pour interagir avec l'API Gemini pour la transformation d'images.

### Classes

-   **GeminiService**:
    -   **Description**: Gère la préparation des images, la construction des requêtes, et la communication avec l'API Gemini.
    -   **Méthodes**:
        -   `prepareImage(imageUri)`: Compresse et prépare l'image pour l'envoi.
        -   `transformImage(imageUri, style, onProgress)`: Envoie l'image et le style à l'API Gemini et retourne l'image transformée.
        -   `mockTransform(style)`: Simule une transformation pour les tests.

---

## Fichier: /home/boby/DecorIA/src/services/imageService.ts

Service pour gérer les interactions avec les images (caméra, galerie, manipulation).

### Classes

-   **ImageService**:
    -   **Description**: Fournit des méthodes pour demander des permissions, capturer des photos, choisir des images, sauvegarder dans la galerie, et manipuler des images.
    -   **Méthodes**:
        -   `requestPermissions()`: Demande les permissions pour la caméra et la médiathèque.
        -   `capturePhoto()`: Ouvre la caméra pour prendre une photo.
        -   `pickImage()`: Ouvre la galerie pour sélectionner une image.
        -   `saveToGallery(imageUri)`: Sauvegarde une image dans la galerie de l'appareil.
        -   `optimizeImageForDisplay(imageUri)`: Optimise une image pour l'affichage.
        -   `base64ToUri(base64)`: Convertit une chaîne base64 en une URI de fichier local.
        -   `cleanCache()`: Nettoie les fichiers temporaires créés par l'application.

---

## Fichier: /home/boby/DecorIA/src/services/storageService.ts

Service pour gérer le stockage persistant sur l'appareil.

### Classes

-   **StorageService**:
    -   **Description**: Gère la sauvegarde et la récupération de l'historique des transformations et des paramètres de l'utilisateur en utilisant `AsyncStorage`.
    -   **Méthodes**:
        -   `saveTransformation(originalImage, transformedImage, style)`: Sauvegarde une transformation dans l'historique.
        -   `getHistory()`: Récupère l'historique des transformations.
        -   `clearHistory()`: Efface tout l'historique.

---

## Fichier: /home/boby/DecorIA/src/types/env.d.ts

Fichier de déclaration de types pour les variables d'environnement.

### Modules

-   **@env**:
    -   **Description**: Définit les types pour les variables d'environnement importées via `babel-plugin-dotenv-import`.
    -   **Variables**: `GEMINI_API_KEY`, `API_ENVIRONMENT`.
