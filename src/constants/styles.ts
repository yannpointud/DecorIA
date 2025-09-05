export interface TransformationStyle {
  id: string;
  name: string;
  prompt: string;
  icon: string;
  color: string;
  description: string;
}

export const TRANSFORMATION_STYLES: TransformationStyle[] = [
  {
    id: 'tidy',
    name: 'Rangée',
    prompt: 'Transform this room into a perfectly organized and tidy version. Remove all clutter, organize items neatly, make the bed if present, arrange furniture properly, and make it look pristine and well-maintained.',
    icon: 'broom',
    color: '#4CAF50',
    description: 'Espace parfaitement organisé'
  },
  {
    id: 'empty',
    name: 'Vide',
    prompt: 'Remove all furniture and objects from this room, keeping only the walls, floor, ceiling, windows and doors. Show the empty architectural space.',
    icon: 'cube-outline',
    color: '#2196F3',
    description: 'Pièce sans meubles'
  },
  {
    id: 'renovated',
    name: 'Rénovée',
    prompt: 'Transform this room into a beautifully renovated modern version. Update with contemporary design, fresh paint, modern furniture, good lighting, and high-end finishes while keeping the same room layout.',
    icon: 'hammer',
    color: '#FF9800',
    description: 'Design moderne et rénové'
  },
  {
    id: 'deteriorated',
    name: 'Délabrée',
    prompt: 'Transform this room to look abandoned and deteriorated. Add wear, peeling paint, damaged walls, broken items, dust, and signs of neglect while keeping the same structure.',
    icon: 'home-broken',
    color: '#795548',
    description: 'Version abandonnée'
  },
  {
    id: 'luxury',
    name: 'Luxueuse',
    prompt: 'Transform this room into an ultra-luxury version with high-end furniture, premium materials, elegant decoration, sophisticated lighting, and exclusive designer elements.',
    icon: 'diamond',
    color: '#9C27B0',
    description: 'Version haut de gamme'
  },
  {
    id: 'minimalist',
    name: 'Minimaliste',
    prompt: 'Transform this room into a minimalist zen space with only essential furniture, clean lines, neutral colors, maximum empty space, and a peaceful atmosphere.',
    icon: 'circle-outline',
    color: '#607D8B',
    description: 'Design épuré et zen'
  }
];
