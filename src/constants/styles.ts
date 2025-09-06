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
    prompt: `Your primary task is to digitally tidy this room. You must identify and remove all clutter while preserving the main furniture and the room's structure.

**Specific actions required:**
1.  **Clear all surfaces:** Remove any loose items from the floor, chairs, sofas, tables, and desks.
2.  **Make the bed:** If there is a bed, it must be neatly made, with the covers smooth and pillows arranged.
3.  **Close everything:** Ensure all drawers, cabinets, and wardrobe doors are fully closed.

**Crucial Rule:** You are an editor, not a creator. **DO NOT** add, replace, or significantly alter the existing furniture. A messy chair should become the *exact same chair*, but with the clothes removed from it. The final image must be the same room, just perfectly clean and organized.`,
    icon: 'broom',
    color: '#4CAF50',
    description: 'Espace organisé'
  },
  {
    id: 'empty',
    name: 'Vide',
    prompt: `Your task is to perform a digital cleanup of this room. You must only remove all furniture, decorations, and movable objects (like rugs, lamps, plants, wall art).

Strict instructions:
1. DO NOT ADD any new architectural elements. Do not add windows, doors, or anything that is not present in the original image.
2. PRESERVE WITH 100% FIDELITY: The original walls, floor, ceiling, windows, and doors must remain completely unchanged in their position, shape, and texture.
3. INPAINT LOGICALLY: When a piece of furniture is removed, you must fill the empty space by seamlessly extending the texture and color of the wall and floor that were behind it. The goal is to reveal what is hidden, not to invent something new.

The final image must be the empty architectural shell of the exact same room.`,
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
    icon: 'home-minus',
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
