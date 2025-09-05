# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DecorIA is a React Native mobile application that transforms room photos using AI via Google's Gemini API. The app allows users to capture photos, select transformation styles, and generate modified room images.

## Development Commands

### Core Development
```bash
# Start development server
npm start

# Run on specific platforms
npm run android    # Android emulator/device
npm run ios        # iOS simulator/device  
npm run web        # Web browser

# Build APKs
npm run build:preview     # Test build
npm run build:production  # Production build
```

### Code Quality
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Clean cache and dependencies
npm run clean
npm install
expo start -c
```

### Troubleshooting
```bash
expo doctor  # Check Expo setup
```

## Architecture

### Main Application Structure
- **App.tsx**: Main entry point with navigation setup (Stack Navigator)
- **src/contexts/AppContext.tsx**: Global state management for image transformation flow
- **Navigation**: Stack-based navigation with Camera → Transform → Result screens

### Core Directories
```
src/
├── components/     # Reusable UI components (LoadingOverlay, ImageComparison, StyleCard)
├── screens/        # Main app screens (Camera, Transform, Result)
├── services/       # Business logic (imageService, geminiService, storageService)  
├── contexts/       # React Context providers (AppContext)
├── hooks/          # Custom React hooks (useImageTransform, useCamera)
└── constants/      # Configuration (theme, styles, config)
```

### Key Services
- **imageService**: Handles camera, gallery, permissions, and image optimization
- **geminiService**: Manages AI transformation via Google Gemini API
- **storageService**: Handles local storage and transformation history (planned feature)

### State Management
Uses React Context (AppContext) to manage:
- Original and transformed images
- Selected transformation style
- Loading states and progress
- Error handling

## Path Aliases
The project uses TypeScript path aliases configured in both `tsconfig.json` and `babel.config.js`:
- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@screens/*` → `src/screens/*`
- `@services/*` → `src/services/*`
- `@hooks/*` → `src/hooks/*`
- `@constants/*` → `src/constants/*`
- `@contexts/*` → `src/contexts/*`

## Environment Setup
- Requires `.env` file with `GEMINI_API_KEY`
- Uses Expo SDK 53 and React Native 0.79.6
- Supports Android, iOS, and Web platforms

## Key Dependencies
- **expo**: Core platform framework
- **react-navigation**: Navigation system
- **react-native-paper**: Material Design UI components
- **expo-camera**: Camera functionality
- **expo-image-picker**: Gallery access
- **axios**: HTTP client for API calls

## Transformation Styles
Available transformation styles:
- Rangée (Organized)
- Vide (Empty/Unfurnished)
- Rénovée (Modern/Renovated)
- Délabrée (Abandoned/Deteriorated)
- Luxueuse (Luxury)
- Minimaliste (Minimalist)

## Future Features (in App.tsx comments)
The codebase includes commented code for planned v2 features:
- Drawer navigation with History and Settings screens
- Transformation history storage
- App settings (API key management, quality settings)