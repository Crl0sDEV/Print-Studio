import { useMemo } from 'react'
import { PresetWithMatrix, PricingMatrix } from '@/types/database'

export function usePricingCalculator({
  presets,
  selectedPresetId,
  quantity,
  colorMode,
  isRush
}: {
  presets: PresetWithMatrix[] | null
  selectedPresetId: string
  quantity: number
  colorMode: string
  isRush: boolean
}) {
  const selectedPreset = presets?.find(p => p.id === selectedPresetId)

  const estimatedPrice = useMemo(() => {
    if (!selectedPreset || !selectedPreset.pricing_matrices || selectedPreset.pricing_matrices.length === 0 || quantity < 1) return 0

    let applicableMatrix = selectedPreset.pricing_matrices.find((m: PricingMatrix) => {
      const qtyMatch = quantity >= m.min_quantity && (m.max_quantity === null || quantity <= m.max_quantity)
      const colorMatch = m.color_mode === colorMode || m.color_mode === 'any' || !m.color_mode
      return qtyMatch && colorMatch
    })

    if (!applicableMatrix) {
       applicableMatrix = selectedPreset.pricing_matrices[0]
    }

    if (applicableMatrix) {
       let basePrice = quantity * Number(applicableMatrix.unit_price || 0)
       if (applicableMatrix.unit === 'flat_rate') {
          basePrice = quantity * Number(applicableMatrix.unit_price || 0) 
       }
       return isRush ? basePrice * Number(applicableMatrix.rush_multiplier || 1.0) : basePrice
    }

    return 0 
  }, [selectedPreset, quantity, colorMode, isRush])

  return { estimatedPrice, selectedPreset }
}
