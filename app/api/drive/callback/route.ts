import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const userId = url.searchParams.get('state') // We passed user ID in state

  if (!code || !userId) {
    return NextResponse.json({ error: 'Missing code or state' }, { status: 400 })
  }

  const host = request.headers.get('host') || 'localhost:3000'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const redirectUri = `${protocol}://${host}/api/drive/callback`

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri
  )

  try {
    const { tokens } = await oauth2Client.getToken(code)
    
    if (tokens.refresh_token) {
      const supabase = await createClient()
      
      // Save the refresh token to the shop
      const { error } = await supabase
        .from('shops')
        .update({ gdrive_refresh_token: tokens.refresh_token })
        .eq('owner_id', userId)

      if (error) {
        console.error('Error saving refresh token:', error)
        return NextResponse.redirect(new URL('/dashboard/settings?drive=error', request.url))
      }
    }

    return NextResponse.redirect(new URL('/dashboard/settings?drive=success', request.url))
  } catch (error) {
    console.error('Error getting tokens:', error)
    return NextResponse.redirect(new URL('/dashboard/settings?drive=error', request.url))
  }
}
