import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { findCustomerByEmail, createPortalSession } from '@/lib/stripe/portal'

export const dynamic = 'force-dynamic'

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!process.env.STRIPE_SECRET_KEY) return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  try {
    const customer = await findCustomerByEmail(session.user.email)
    if (!customer) return NextResponse.json({ error: 'No billing account found. Please upgrade first.' }, { status: 404 })
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://memoryforge.app'
    const portal = await createPortalSession({ customerId: customer.id, appUrl })
    return NextResponse.json({ url: portal.url })
  } catch (err: any) {
    console.error('[billing/portal]', err)
    return NextResponse.json({ error: err.message ?? 'Portal error' }, { status: 500 })
  }
}
