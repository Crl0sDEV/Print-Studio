import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  if (!url) {
    return new NextResponse('Missing url parameter', { status: 400 })
  }

  try {
    let targetUrl = url

    // Handle Google Drive webViewLink or view links
    // e.g. https://drive.google.com/file/d/1A2B3C/view -> https://lh3.googleusercontent.com/d/1A2B3C
    const gdriveMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/)
    if (gdriveMatch && (url.includes('drive.google.com') || url.includes('docs.google.com'))) {
      const fileId = gdriveMatch[1]
      targetUrl = `https://lh3.googleusercontent.com/d/${fileId}`
    }

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    if (!response.ok) {
      // If lh3 direct link failed, try Google Drive export=view
      if (gdriveMatch) {
        const fileId = gdriveMatch[1]
        const fallbackRes = await fetch(`https://drive.google.com/uc?export=view&id=${fileId}`)
        if (fallbackRes.ok) {
          const contentType = fallbackRes.headers.get('content-type') || 'image/png'
          const arrayBuffer = await fallbackRes.arrayBuffer()
          return new NextResponse(arrayBuffer, {
            headers: {
              'Content-Type': contentType,
              'Access-Control-Allow-Origin': '*',
              'Cache-Control': 'public, max-age=86400',
            },
          })
        }
      }
      return new NextResponse(`Failed to fetch image: ${response.statusText}`, { status: response.status })
    }

    const contentType = response.headers.get('content-type') || 'image/png'
    const arrayBuffer = await response.arrayBuffer()

    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (error) {
    console.error('Image Proxy Error:', error)
    return new NextResponse('Internal Server Error while proxying image', { status: 500 })
  }
}
