'use client'

import { QRCodeCanvas } from 'qrcode.react'
import { useEffect, useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

export function QrClient({ shop }: { shop: any }) {
  const [url, setUrl] = useState('')
  const qrRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setUrl(`${window.location.origin}/${shop.slug}`)
  }, [shop.slug])

  const downloadQR = () => {
    const qrCanvas = qrRef.current?.querySelector('canvas')
    if (!qrCanvas) return

    // Create a new canvas for the "Poster"
    const poster = document.createElement('canvas')
    const ctx = poster.getContext('2d')
    if (!ctx) return

    // Set poster dimensions
    poster.width = 500
    poster.height = 650

    // Fill background with white
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, poster.width, poster.height)

    // Draw Shop Name at the top
    ctx.fillStyle = '#0f172a'
    ctx.font = 'bold 36px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(shop.name || 'Print Shop', poster.width / 2, 80)

    // Draw subtitle
    ctx.fillStyle = '#64748b'
    ctx.font = '16px sans-serif'
    ctx.fillText('Scan to upload your files for printing', poster.width / 2, 120)

    // Draw the QR Code in the middle (Scaled up)
    const qrSize = 300
    const qrX = (poster.width - qrSize) / 2
    const qrY = 170

    // The quiet zone is naturally handled by the background, but let's ensure it
    ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize)

    // Draw URL at the bottom
    ctx.fillStyle = '#0f172a'
    ctx.font = 'bold 20px sans-serif'
    ctx.fillText(url, poster.width / 2, 530)
    
    // Draw alternative instruction
    ctx.fillStyle = '#64748b'
    ctx.font = '10px sans-serif'
    ctx.fillText('Or type this link directly in your browser', poster.width / 2, 560)

    // Export to PNG and download
    const pngUrl = poster.toDataURL('image/png')
    let downloadLink = document.createElement('a')
    downloadLink.href = pngUrl
    downloadLink.download = `${shop.slug}-poster.png`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }

  if (!url) return null

  return (
    <div className="flex justify-center mt-8">
      <Card className="w-full max-w-md border-border/40 bg-card/60 backdrop-blur-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Your Store QR Code</CardTitle>
          <CardDescription>Print or share this QR code so customers can easily access your shop and upload files.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-6">
          <div 
            ref={qrRef} 
            className="bg-white p-6 rounded-xl shadow-md border"
          >
            <QRCodeCanvas 
              value={url} 
              size={250}
              bgColor={"#ffffff"}
              fgColor={"#0f172a"}
              level={"H"}
              imageSettings={{
                src: "/favicon-32x32.png",
                x: undefined,
                y: undefined,
                height: 48,
                width: 48,
                excavate: true,
              }}
            />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-xl">{shop.name}</h3>
            <p className="text-sm text-muted-foreground">{url}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={downloadQR}>
            <Download className="mr-2 h-4 w-4" />
            Download QR Image
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
