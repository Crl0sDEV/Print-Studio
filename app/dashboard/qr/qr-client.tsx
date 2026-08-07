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
    const canvas = qrRef.current?.querySelector('canvas')
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
      let downloadLink = document.createElement('a')
      downloadLink.href = pngUrl
      downloadLink.download = `${shop.slug}-prynt-qr.png`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    }
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
