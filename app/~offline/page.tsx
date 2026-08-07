'use client'

import { WifiOff, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function OfflineFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center bg-background text-foreground">
      <div className="rounded-full bg-destructive/10 p-6 mb-6">
        <WifiOff className="h-16 w-16 text-destructive" />
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight mb-3">No Internet Connection</h1>
      <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
        You are currently offline. Don't worry, your pending actions in the background are securely saved in your browser and will automatically sync once your connection is restored.
      </p>
      
      {/* Next.js doesn't support interactive hooks in the root layout's fallback directly without 'use client', 
          but we can use a native button to refresh */}
      <button 
        onClick={() => window.location.reload()} 
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-8 py-2"
      >
        <RotateCcw className="mr-2 h-4 w-4" /> Try Again
      </button>
    </div>
  )
}
