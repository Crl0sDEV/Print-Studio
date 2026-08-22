export * from './database'

export interface AttireTemplate {
  id: string
  name: string
  category: 'barong' | 'suit_male' | 'suit_female' | 'blazer' | 'filipiniana' | 'hijab'
  gender: 'male' | 'female' | 'unisex'
  thumbnail: string
  svgOverlay: string
}

export interface PhotoSizePreset {
  id: string
  name: string
  widthMm: number
  heightMm: number
  aspectRatio: number
  description: string
  badgeText: string
}

export interface PackageCombo {
  id: string
  name: string
  description: string
  items: {
    presetId: string
    quantity: number
    label: string
  }[]
}

export interface PaperSheetFormat {
  id: string
  name: string
  widthMm: number
  heightMm: number
  marginMm: number
  spacingMm: number
  isProOnly: boolean
}

export interface StudioCanvasState {
  originalImage: string | null
  mattedImage: string | null
  selectedAttire: AttireTemplate | null
  attireScale: number
  attireOffsetX: number
  attireOffsetY: number
  backgroundColor: string
  selectedSizePreset: string
  nametagEnabled: boolean
  nametagName: string
  nametagProfession: string
  selectedSheetFormat: string
  selectedPackageCombo: string
  dpi: 150 | 300
}

export interface ActionResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}
