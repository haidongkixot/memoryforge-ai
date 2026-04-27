import { NextRequest, NextResponse } from 'next/server'
import { getAllowedExtensionIds } from './extension-auth'

/**
 * Returns allowed origin for the request if it's a chrome-extension://<id>
 * with id in EXTENSION_IDS allowlist; null otherwise.
 */
export function resolveExtensionOrigin(req: NextRequest): string | null {
  const origin = req.headers.get('origin')
  if (!origin) return null
  const m = /^chrome-extension:\/\/([a-z0-9]+)$/.exec(origin)
  if (!m) return null
  const id = m[1]
  if (!getAllowedExtensionIds().includes(id)) return null
  return origin
}

export function corsHeaders(req: NextRequest): Record<string, string> {
  const origin = resolveExtensionOrigin(req)
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-Extension-Id',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
  if (origin) {
    headers['Access-Control-Allow-Origin'] = origin
    headers['Access-Control-Allow-Credentials'] = 'false'
  }
  return headers
}

export function withCors(req: NextRequest, res: NextResponse): NextResponse {
  const headers = corsHeaders(req)
  for (const [k, v] of Object.entries(headers)) res.headers.set(k, v)
  return res
}

export function handlePreflight(req: NextRequest): NextResponse {
  return withCors(req, new NextResponse(null, { status: 204 }))
}

export function jsonCors(
  req: NextRequest,
  data: unknown,
  init?: { status?: number; headers?: Record<string, string> }
): NextResponse {
  const res = NextResponse.json(data, init)
  return withCors(req, res)
}
