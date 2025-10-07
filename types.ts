export enum Quality {
  Standard = 'Standard',
  High = '2K - 4K (High)',
  Ultra = '8K (Ultra)',
}

export enum CameraAngle {
  FullBody = 'FullBody',
  Portrait = 'Portrait',
  HighAngle = 'HighAngle',
  LowAngle = 'LowAngle',
  WideShot = 'WideShot',
  EyeLevel = 'EyeLevel',
  OverTheShoulder = 'OverTheShoulder',
  CloseUp = 'CloseUp',
  DutchAngle = 'DutchAngle',
}

// FIX: Add RestorationStyle enum to define options for photo restoration.
export enum RestorationStyle {
  Colorize = 'Colorize',
  Enhance = 'Enhance',
  FixDamage = 'FixDamage',
}

export type LogoPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface FormState {
  images: File[];
  productImage: File | null;
  removeBackground: boolean;
  lockFace: boolean;
  characterDesc: string[];
  characterNotes: string;
  sceneDesc: string[];
  sceneNotes: string;
  actionDesc: string[];
  actionNotes: string;
  cameraAngle: CameraAngle;
  styleDesc: string[];
  outfitImages: File[];
  outfitNotes: string;
  celebrityImage: File | null;
  quality: Quality;
  aspectRatio: string;
  numberOfImages: number;
  logoImage: File | null;
  logoPosition: LogoPosition;
  useSignature: boolean;
  signatureFont: string;
  signaturePosition: LogoPosition;
}

export interface PromptFormState {
  images: File[];
  prompt: string;
  numberOfImages: number;
}

export interface VideoFormState {
  image: File | null;
  prompt: string;
  aspectRatio: string;
}

// FIX: Add RestoreFormState interface for the photo restoration form state.
export interface RestoreFormState {
  image: File | null;
  quality: Quality;
  style: RestorationStyle[];
}

export type MediaType = 'image' | 'video';

export interface GeneratedMedia {
  id: string;
  src: string;
  type: MediaType;
}