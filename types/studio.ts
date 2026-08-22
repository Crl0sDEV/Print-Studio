export type PaperSizeKey = 'A4' | 'Letter' | 'Folio' | 'Legal' | '4R' | '5R' | 'A3'

export interface PaperDimension {
  name: string
  widthInches: number
  heightInches: number
  widthMm: number
  heightMm: number
  description: string
}

export type IdPresetKey = 
  | '1x1' 
  | '2x2' 
  | 'passport_ph' 
  | 'prc_csc' 
  | 'wallet' 
  | '3R' 
  | '4R' 
  | '5R' 
  | 'custom'

export interface IdPreset {
  id: IdPresetKey
  name: string
  widthInches: number
  heightInches: number
  widthMm: number
  heightMm: number
  aspectRatio: number
  description: string
  badge?: string
}

export interface AttireTemplate {
  id: string
  name: string
  category: 'men' | 'women' | 'unisex'
  description: string
  svgPath: string
}

export interface NametagConfig {
  enabled: boolean
  fullName: string
  middleInitial: string
  designation?: string
  fontSize: number
  fontColor: string
  backgroundColor: string
  borderColor: string
  borderWidth: number
}

export interface ImageAdjustments {
  brightness: number // -100 to 100
  contrast: number   // -100 to 100
  saturation: number // -100 to 100
  sharpness: number  // 0 to 100
  smoothness: number // 0 to 100
  rotation: number   // 0, 90, 180, 270
  flipHorizontal: boolean
}

export interface AttireTransform {
  enabled: boolean
  templateId: string
  xPercent: number
  yPercent: number
  scalePercent: number
  rotateDeg: number
}

export interface PrintPackageItem {
  presetKey: IdPresetKey
  quantity: number
}

export interface PrintPackagePreset {
  id: string
  name: string
  description: string
  recommendedPaper: PaperSizeKey
  items: PrintPackageItem[]
}

export type CutGuideStyle = 'crop_ticks' | 'dashed_lines' | 'solid_lines' | 'none'

export interface PrintLayoutConfig {
  paperSize: PaperSizeKey
  orientation: 'portrait' | 'landscape'
  marginInches: number
  gapInches: number
  cutGuideStyle: CutGuideStyle
  cutGuideColor: string
  packagePresetId: string | 'custom'
  showLabels: boolean
  labelCustomText?: string
}

export interface PlacedPhotoItem {
  id: string
  imageSrc: string
  presetKey: IdPresetKey
  widthInches: number
  heightInches: number
  xInches: number
  yInches: number
}

export interface StudioImageState {
  originalSrc: string | null
  processedSrc: string | null
  fileName: string
  backgroundColor: string
  cropRect: {
    x: number
    y: number
    width: number
    height: number
  } | null
  selectedPreset: IdPresetKey
  adjustments: ImageAdjustments
  attire: AttireTransform
  nametag: NametagConfig
}
