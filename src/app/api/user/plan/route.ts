import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ planSlug: 'free' })
  }

  // TODO: When subscription model is added, look up user's active plan here.
  // For now all authenticated users default to "free".
  const planSlug = 'free'

  return NextResponse.json({ planSlug })
}
