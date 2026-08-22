import { 
  PaperSizeKey, 
  IdPresetKey, 
  ImageAdjustments, 
  CutGuideStyle,
  PlacedPhotoItem,
} from '@/types/studio'
import { PAPER_DIMENSIONS, ID_PRESETS, PRINT_PACKAGES } from './studio-constants'
import { jsPDF } from 'jspdf'

/**
 * Executes high-speed client-side color-key background removal.
 * Uses Euclidean color distance with edge-feathering.
 */
export function removeColorBackground(
  imageData: ImageData,
  targetColor: { r: number; g: number; b: number },
  tolerance: number = 35,
  feather: number = 10,
  floodFromEdges: boolean = true
): ImageData {
  const data = imageData.data
  const width = imageData.width
  const height = imageData.height
  const totalPixels = width * height

  const { r: tr, g: tg, b: tb } = targetColor
  const tolSq = tolerance * tolerance
  const featherSq = (tolerance + feather) * (tolerance + feather)

  if (floodFromEdges) {
    // 8-connected flood fill from outer border pixels
    const visited = new Uint8Array(totalPixels)
    const queue: number[] = []

    const pushIfMatch = (x: number, y: number) => {
      const idx = y * width + x
      if (visited[idx]) return
      visited[idx] = 1

      const pIdx = idx * 4
      const r = data[pIdx]
      const g = data[pIdx + 1]
      const b = data[pIdx + 2]

      const distSq = (r - tr) ** 2 + (g - tg) ** 2 + (b - tb) ** 2
      if (distSq <= featherSq) {
        queue.push(idx)
        if (distSq <= tolSq) {
          data[pIdx + 3] = 0 // Fully transparent
        } else {
          // Feather alpha
          const factor = (Math.sqrt(distSq) - tolerance) / feather
          data[pIdx + 3] = Math.min(data[pIdx + 3], Math.floor(factor * 255))
        }
      }
    }

    // Seed top, bottom, left, right edges
    for (let x = 0; x < width; x++) {
      pushIfMatch(x, 0)
      pushIfMatch(x, height - 1)
    }
    for (let y = 0; y < height; y++) {
      pushIfMatch(0, y)
      pushIfMatch(width - 1, y)
    }

    let head = 0
    while (head < queue.length) {
      const idx = queue[head++]
      const x = idx % width
      const y = Math.floor(idx / width)

      if (x > 0) pushIfMatch(x - 1, y)
      if (x < width - 1) pushIfMatch(x + 1, y)
      if (y > 0) pushIfMatch(x, y - 1)
      if (y < height - 1) pushIfMatch(x, y + 1)
    }
  } else {
    // Global color threshold
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]

      const distSq = (r - tr) ** 2 + (g - tg) ** 2 + (b - tb) ** 2
      if (distSq <= tolSq) {
        data[i + 3] = 0
      } else if (distSq <= featherSq) {
        const factor = (Math.sqrt(distSq) - tolerance) / feather
        data[i + 3] = Math.min(data[i + 3], Math.floor(factor * 255))
      }
    }
  }

  return imageData
}

/**
 * Client-Side AI Background Removal wrapper using @imgly/background-removal
 */
export async function removeBackgroundWithAI(
  imageSource: string | Blob | ImageData | HTMLImageElement,
  onProgress?: (key: string, current: number, total: number) => void
): Promise<Blob> {
  if (typeof window === 'undefined') {
    throw new Error('AI Background Removal is only available in browser environments.')
  }

  const { removeBackground } = await import('@imgly/background-removal')
  
  return removeBackground(imageSource as string | ImageData | Blob | URL, {
    progress: (key: string, current: number, total: number) => {
      if (onProgress) {
        onProgress(key, current, total)
      }
    },
    debug: false,
    model: 'isnet_fp16',
  })
}

/**
 * Apply filters (brightness, contrast, saturation, sharpness) on Canvas
 */
export function applyImageFilters(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  adjustments: ImageAdjustments
): void {
  const { brightness, contrast, saturation, sharpness } = adjustments

  // Calculate CSS Filter string
  const bVal = 100 + brightness
  const cVal = 100 + contrast
  const sVal = 100 + saturation

  ctx.filter = `brightness(${bVal}%) contrast(${cVal}%) saturate(${sVal}%)`

  if (sharpness > 0) {
    // Apply sharpen convolution matrix
    const imgData = ctx.getImageData(0, 0, width, height)
    const src = imgData.data
    const dst = new Uint8ClampedArray(src.length)
    dst.set(src)

    const weight = (sharpness / 100) * 0.8
    const kernel = [
      0, -weight, 0,
      -weight, 1 + 4 * weight, -weight,
      0, -weight, 0
    ]

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const dstIdx = (y * width + x) * 4
        for (let c = 0; c < 3; c++) {
          let sum = 0
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const srcIdx = ((y + ky) * width + (x + kx)) * 4 + c
              sum += src[srcIdx] * kernel[(ky + 1) * 3 + (kx + 1)]
            }
          }
          dst[dstIdx + c] = Math.max(0, Math.min(255, sum))
        }
        dst[dstIdx + 3] = src[dstIdx + 3]
      }
    }

    ctx.putImageData(new ImageData(dst, width, height), 0, 0)
  }
}

/**
 * Document Scan & Photocopy Enhancer Filter
 */
export function processDocumentEnhance(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  mode: 'high_contrast' | 'bw_clean' | 'grayscale' | 'magic_color',
  thresholdValue: number = 130
): void {
  const imgData = ctx.getImageData(0, 0, width, height)
  const d = imgData.data

  for (let i = 0; i < d.length; i += 4) {
    const r = d[i]
    const g = d[i + 1]
    const b = d[i + 2]

    // Standard luminosity
    const gray = 0.299 * r + 0.587 * g + 0.114 * b

    if (mode === 'bw_clean') {
      // High-contrast clean black & white
      const v = gray >= thresholdValue ? 255 : 0
      d[i] = v
      d[i + 1] = v
      d[i + 2] = v
    } else if (mode === 'high_contrast') {
      // Document text booster with smoothed background
      let boosted = (gray - thresholdValue) * 2.2 + 128
      boosted = Math.max(0, Math.min(255, boosted))
      // Whiten near-white backgrounds
      if (boosted > 220) boosted = 255
      d[i] = boosted
      d[i + 1] = boosted
      d[i + 2] = boosted
    } else if (mode === 'grayscale') {
      d[i] = gray
      d[i + 1] = gray
      d[i + 2] = gray
    } else if (mode === 'magic_color') {
      // Lift dark text, whiten dirty paper background
      const maxC = Math.max(r, g, b)
      const minC = Math.min(r, g, b)
      const isNeutral = (maxC - minC) < 20

      if (isNeutral && gray > 180) {
        d[i] = 255
        d[i + 1] = 255
        d[i + 2] = 255
      } else {
        d[i] = Math.min(255, r * 1.15)
        d[i + 1] = Math.min(255, g * 1.15)
        d[i + 2] = Math.min(255, b * 1.15)
      }
    }
  }

  ctx.putImageData(imgData, 0, 0)
}

/**
 * Calculates Gang Sheet & Imposition positions for a selected paper and package
 */
export function calculateImpositionLayout(
  paperKey: PaperSizeKey,
  orientation: 'portrait' | 'landscape',
  marginInches: number,
  gapInches: number,
  packageId: string,
  imageSrc: string,
  customItems?: { presetKey: IdPresetKey; quantity: number }[]
): {
  paperW: number
  paperH: number
  placedItems: PlacedPhotoItem[]
  isOverflow: boolean
} {
  const paper = PAPER_DIMENSIONS[paperKey]
  const baseW = paper.widthInches
  const baseH = paper.heightInches

  const paperW = orientation === 'portrait' ? Math.min(baseW, baseH) : Math.max(baseW, baseH)
  const paperH = orientation === 'portrait' ? Math.max(baseW, baseH) : Math.min(baseW, baseH)

  let itemsToPlace: { presetKey: IdPresetKey; width: number; height: number; quantity: number }[] = []

  if (packageId !== 'custom') {
    const pkg = PRINT_PACKAGES.find((p) => p.id === packageId)
    if (pkg) {
      itemsToPlace = pkg.items.map((it) => {
        const preset = ID_PRESETS[it.presetKey]
        return {
          presetKey: it.presetKey,
          width: preset.widthInches,
          height: preset.heightInches,
          quantity: it.quantity,
        }
      })
    }
  } else if (customItems && customItems.length > 0) {
    itemsToPlace = customItems.map((it) => {
      const preset = ID_PRESETS[it.presetKey]
      return {
        presetKey: it.presetKey,
        width: preset.widthInches,
        height: preset.heightInches,
        quantity: it.quantity,
      }
    })
  }

  // Shelf bin-packing algorithm
  const placedItems: PlacedPhotoItem[] = []
  let curX = marginInches
  let curY = marginInches
  let rowHeight = 0
  let isOverflow = false

  for (const group of itemsToPlace) {
    for (let q = 0; q < group.quantity; q++) {
      const itemW = group.width
      const itemH = group.height

      // Check if item fits in current shelf
      if (curX + itemW > paperW - marginInches + 0.01) {
        // Move to next shelf
        curX = marginInches
        curY += rowHeight + gapInches
        rowHeight = 0
      }

      // Check vertical bounds
      if (curY + itemH > paperH - marginInches + 0.01) {
        isOverflow = true
        break
      }

      placedItems.push({
        id: `${group.presetKey}-${q}-${Math.random().toString(36).substring(2, 6)}`,
        imageSrc,
        presetKey: group.presetKey,
        widthInches: itemW,
        heightInches: itemH,
        xInches: curX,
        yInches: curY,
      })

      curX += itemW + gapInches
      rowHeight = Math.max(rowHeight, itemH)
    }
    if (isOverflow) break
  }

  return {
    paperW,
    paperH,
    placedItems,
    isOverflow,
  }
}

/**
 * Draws High-Resolution 300 DPI Canvas for Printing or Image Export
 */
export async function renderHighResPrintCanvas(
  paperW: number,
  paperH: number,
  placedItems: PlacedPhotoItem[],
  cutGuideStyle: CutGuideStyle,
  cutGuideColor: string = '#A0AEC0',
  dpi: number = 300
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(paperW * dpi)
  canvas.height = Math.round(paperH * dpi)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not get 2D canvas context')

  // Clean white background
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Load and cache images
  const imageCache = new Map<string, HTMLImageElement>()
  for (const item of placedItems) {
    if (!imageCache.has(item.imageSrc)) {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      await new Promise<void>((resolve) => {
        img.onload = () => resolve()
        img.onerror = () => resolve() // Continue gracefully if single image fails
        img.src = item.imageSrc
      })
      imageCache.set(item.imageSrc, img)
    }
  }

  // Render placed photos
  for (const item of placedItems) {
    const px = Math.round(item.xInches * dpi)
    const py = Math.round(item.yInches * dpi)
    const pw = Math.round(item.widthInches * dpi)
    const ph = Math.round(item.heightInches * dpi)

    const img = imageCache.get(item.imageSrc)
    if (img && img.naturalWidth > 0) {
      ctx.drawImage(img, px, py, pw, ph)
    } else {
      ctx.fillStyle = '#F3F4F6'
      ctx.fillRect(px, py, pw, ph)
    }

    // Render Cut Guides / Crop Marks
    ctx.strokeStyle = cutGuideColor
    ctx.lineWidth = Math.max(1, Math.round(dpi / 300))

    if (cutGuideStyle === 'solid_lines') {
      ctx.strokeRect(px, py, pw, ph)
    } else if (cutGuideStyle === 'dashed_lines') {
      ctx.setLineDash([dpi * 0.05, dpi * 0.05])
      ctx.strokeRect(px, py, pw, ph)
      ctx.setLineDash([])
    } else if (cutGuideStyle === 'crop_ticks') {
      const tickLen = Math.round(dpi * 0.1) // 0.1 inch tick
      // Top Left Corner
      ctx.beginPath()
      ctx.moveTo(px - tickLen, py); ctx.lineTo(px, py)
      ctx.moveTo(px, py - tickLen); ctx.lineTo(px, py)
      // Top Right Corner
      ctx.moveTo(px + pw, py); ctx.lineTo(px + pw + tickLen, py)
      ctx.moveTo(px + pw, py - tickLen); ctx.lineTo(px + pw, py)
      // Bottom Left Corner
      ctx.moveTo(px - tickLen, py + ph); ctx.lineTo(px, py + ph)
      ctx.moveTo(px, py + ph); ctx.lineTo(px, py + ph + tickLen)
      // Bottom Right Corner
      ctx.moveTo(px + pw, py + ph); ctx.lineTo(px + pw + tickLen, py + ph)
      ctx.moveTo(px + pw, py + ph); ctx.lineTo(px + pw, py + ph + tickLen)
      ctx.stroke()
    }
  }

  return canvas
}

/**
 * Generates and downloads a print-ready high-resolution PDF
 */
export async function downloadPrintPDF(
  paperW: number,
  paperH: number,
  placedItems: PlacedPhotoItem[],
  cutGuideStyle: CutGuideStyle,
  cutGuideColor: string = '#A0AEC0',
  fileName: string = 'Print_Studio_Layout.pdf'
): Promise<void> {
  const isLandscape = paperW > paperH
  const orientation = isLandscape ? 'landscape' : 'portrait'

  const doc = new jsPDF({
    orientation,
    unit: 'in',
    format: [paperW, paperH],
  })

  // Render 300 DPI canvas
  const canvas = await renderHighResPrintCanvas(paperW, paperH, placedItems, cutGuideStyle, cutGuideColor, 300)
  const imgData = canvas.toDataURL('image/jpeg', 0.98)

  doc.addImage(imgData, 'JPEG', 0, 0, paperW, paperH)
  doc.save(fileName)
}

/**
 * Resolves an image URL safely through the server image proxy if it's a remote URL or Google Drive link
 */
export function getSafeImageSource(url: string): string {
  if (!url) return ''
  // Data URLs, Blobs, and local relative paths are already safe
  if (url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('/')) {
    return url
  }
  // Remote HTTP/HTTPS URLs (including Google Drive and Supabase Storage)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return `/api/image-proxy?url=${encodeURIComponent(url)}`
  }
  return url
}

