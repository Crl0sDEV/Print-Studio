'use client'

import { useEffect, useRef, useState } from 'react'

interface CloudflareTurnstileProps {
  action?: string
  onVerify?: (token: string) => void
  onError?: () => void
  onExpire?: () => void
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string
          action?: string
          callback: (token: string) => void
          'error-callback'?: () => void
          'expired-callback'?: () => void
          theme?: 'light' | 'dark' | 'auto'
          size?: 'normal' | 'compact' | 'flexible'
        }
      ) => string
      reset: (widgetId?: string) => void
      remove: (widgetId?: string) => void
    }
  }
}

export function CloudflareTurnstile({
  action = 'signup',
  onVerify,
  onError,
  onExpire,
}: CloudflareTurnstileProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const widgetIdRef = useRef<string | null>(null)
  const [tokenValue, setTokenValue] = useState<string>('')
  const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY

  // Stable callback refs so typing in form inputs NEVER re-triggers widget re-renders
  const onVerifyRef = useRef(onVerify)
  const onErrorRef = useRef(onError)
  const onExpireRef = useRef(onExpire)

  useEffect(() => {
    onVerifyRef.current = onVerify
    onErrorRef.current = onError
    onExpireRef.current = onExpire
  }, [onVerify, onError, onExpire])

  const [isScriptLoaded, setIsScriptLoaded] = useState(false)

  useEffect(() => {
    if (!siteKey) return

    if (window.turnstile) {
      setIsScriptLoaded(true)
      return
    }

    const scriptId = 'cf-turnstile-script'
    let script = document.getElementById(scriptId) as HTMLScriptElement | null

    if (!script) {
      script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.async = true
      script.defer = true
      script.onload = () => setIsScriptLoaded(true)
      document.head.appendChild(script)
    } else {
      script.addEventListener('load', () => setIsScriptLoaded(true))
    }
  }, [siteKey])

  useEffect(() => {
    if (!isScriptLoaded || !siteKey || !containerRef.current || !window.turnstile) return

    // Clean up any existing widget cleanly
    if (widgetIdRef.current) {
      try {
        window.turnstile.remove(widgetIdRef.current)
      } catch {
        // Safe catch if widget already detached
      }
      widgetIdRef.current = null
    }

    try {
      const widgetId = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        action: action,
        callback: (token: string) => {
          setTokenValue(token)
          onVerifyRef.current?.(token)
        },
        'error-callback': () => onErrorRef.current?.(),
        'expired-callback': () => {
          setTokenValue('')
          onExpireRef.current?.()
        },
        theme: 'auto',
        size: 'flexible',
      })

      widgetIdRef.current = widgetId
    } catch {
      // Safe catch
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current)
        } catch {
          // Ignore
        }
        widgetIdRef.current = null
      }
    }
  }, [isScriptLoaded, siteKey, action])

  if (!siteKey) return null

  return (
    <div className="flex flex-col items-center justify-center my-2 min-h-[65px] w-full">
      <div ref={containerRef} className="w-full flex justify-center" />
      <input type="hidden" name="cf-turnstile-response" value={tokenValue} />
      <input type="hidden" name="cfTurnstileToken" value={tokenValue} />
    </div>
  )
}
