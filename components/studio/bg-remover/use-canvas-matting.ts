'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { removeColorBackground, removeBackgroundWithAI, getSafeImageSource } from '@/lib/studio-utils'
import { ToolMode } from './matting-tools-panel'

export function useCanvasMatting(imageSrc: string) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const originalImageDataRef = useRef<ImageData | null>(null)

  const [activeTool, setActiveTool] = useState<ToolMode>('ai')
  const [selectedBgColor, setSelectedBgColor] = useState<string>('#FFFFFF')
  const [tolerance, setTolerance] = useState<number>(32)
  const [feather, setFeather] = useState<number>(8)
  const [brushSize, setBrushSize] = useState<number>(24)
  const [zoom, setZoom] = useState<number>(100)
  const [isProcessingAI, setIsProcessingAI] = useState<boolean>(false)
  const [aiProgress, setAiProgress] = useState<string>('')
  const [isDrawing, setIsDrawing] = useState<boolean>(false)
  const [customHex, setCustomHex] = useState<string>('#0072CE')
  const [history, setHistory] = useState<ImageData[]>([])
  const [historyIndex, setHistoryIndex] = useState<number>(-1)

  const initializeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !imageSrc) return
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    const safeSrc = getSafeImageSource(imageSrc)
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const maxDim = 2000
      let w = img.naturalWidth || 800
      let h = img.naturalHeight || 800
      if (w > maxDim || h > maxDim) {
        const ratio = Math.min(maxDim / w, maxDim / h)
        w = Math.round(w * ratio)
        h = Math.round(h * ratio)
      }
      canvas.width = w
      canvas.height = h
      ctx.clearRect(0, 0, w, h)
      ctx.drawImage(img, 0, 0, w, h)

      const initialData = ctx.getImageData(0, 0, w, h)
      originalImageDataRef.current = new ImageData(new Uint8ClampedArray(initialData.data), w, h)
      setHistory([initialData])
      setHistoryIndex(0)
    }
    img.onerror = () => {
      const retryImg = new Image()
      retryImg.onload = () => {
        canvas.width = retryImg.naturalWidth || 800
        canvas.height = retryImg.naturalHeight || 800
        ctx.drawImage(retryImg, 0, 0)
      }
      retryImg.src = safeSrc
    }
    img.src = safeSrc
  }, [imageSrc])

  useEffect(() => {
    initializeCanvas()
  }, [initializeCanvas])

  const pushToHistory = (newImageData: ImageData) => {
    const newHist = history.slice(0, historyIndex + 1)
    newHist.push(newImageData)
    if (newHist.length > 15) newHist.shift()
    setHistory(newHist)
    setHistoryIndex(newHist.length - 1)
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIdx = historyIndex - 1
      setHistoryIndex(newIdx)
      const ctx = canvasRef.current?.getContext('2d', { willReadFrequently: true })
      if (ctx) ctx.putImageData(history[newIdx], 0, 0)
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIdx = historyIndex + 1
      setHistoryIndex(newIdx)
      const ctx = canvasRef.current?.getContext('2d', { willReadFrequently: true })
      if (ctx) ctx.putImageData(history[newIdx], 0, 0)
    }
  }

  const handleAIRemoval = async () => {
    const canvas = canvasRef.current
    if (!canvas || isProcessingAI) return

    setIsProcessingAI(true)
    setAiProgress('Loading AI cutout model in browser...')

    try {
      const blob = await removeBackgroundWithAI(canvas.toDataURL('image/png'), (_key: string, current: number, total: number) => {
        const percent = total > 0 ? Math.round((current / total) * 100) : 0
        setAiProgress(`AI Matting: ${percent}%`)
      })

      const blobUrl = URL.createObjectURL(blob)
      const resImg = new Image()
      resImg.onload = () => {
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        if (!ctx) return
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(resImg, 0, 0, canvas.width, canvas.height)
        const updated = ctx.getImageData(0, 0, canvas.width, canvas.height)
        pushToHistory(updated)
        URL.revokeObjectURL(blobUrl)
        setIsProcessingAI(false)
        setAiProgress('')
      }
      resImg.src = blobUrl
    } catch (err) {
      console.error('AI removal failed:', err)
      setIsProcessingAI(false)
      setAiProgress('AI processing failed. Try Color Key instead.')
      setTimeout(() => setAiProgress(''), 4000)
    }
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool !== 'color_key') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = Math.floor((e.clientX - rect.left) * scaleX)
    const y = Math.floor((e.clientY - rect.top) * scaleY)

    const currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pIdx = (y * canvas.width + x) * 4
    const targetColor = {
      r: currentImageData.data[pIdx],
      g: currentImageData.data[pIdx + 1],
      b: currentImageData.data[pIdx + 2],
    }

    const resultImageData = removeColorBackground(currentImageData, targetColor, tolerance, feather)
    ctx.putImageData(resultImageData, 0, 0)
    pushToHistory(resultImageData)
  }

  const drawBrushPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY
    const rad = brushSize / 2

    if (activeTool === 'eraser') {
      ctx.save()
      ctx.globalCompositeOperation = 'destination-out'
      ctx.beginPath()
      ctx.arc(x, y, rad, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    } else if (activeTool === 'restore' && originalImageDataRef.current) {
      const orig = originalImageDataRef.current
      const cur = ctx.getImageData(0, 0, canvas.width, canvas.height)
      for (let cy = Math.max(0, Math.floor(y - rad)); cy < Math.min(canvas.height, Math.ceil(y + rad)); cy++) {
        for (let cx = Math.max(0, Math.floor(x - rad)); cx < Math.min(canvas.width, Math.ceil(x + rad)); cx++) {
          if (Math.sqrt((cx - x) ** 2 + (cy - y) ** 2) <= rad) {
            const idx = (cy * canvas.width + cx) * 4
            cur.data[idx] = orig.data[idx]
            cur.data[idx + 1] = orig.data[idx + 1]
            cur.data[idx + 2] = orig.data[idx + 2]
            cur.data[idx + 3] = orig.data[idx + 3]
          }
        }
      }
      ctx.putImageData(cur, 0, 0)
    }
  }

  return {
    canvasRef, activeTool, setActiveTool, selectedBgColor, setSelectedBgColor,
    tolerance, setTolerance, feather, setFeather, brushSize, setBrushSize,
    zoom, setZoom, isProcessingAI, aiProgress, isDrawing, setIsDrawing,
    customHex, setCustomHex, history, historyIndex, initializeCanvas,
    pushToHistory, handleUndo, handleRedo, handleAIRemoval, handleCanvasClick, drawBrushPoint,
  }
}
