import type Stripe from 'stripe'
import { stripe } from './client'

export interface CreatePortalSessionParams { customerId: string; appUrl: string }
export interface CreatePortalSessionResult { url: string; sessionId: string }

export async function createPortalSession(params: CreatePortalSessionParams): Promise<CreatePortalSessionResult> {
  const { customerId, appUrl } = params
  const returnUrl = `${appUrl.replace(/\/$/, '')}/settings/billing`
  const session = await stripe.billingPortal.sessions.create({ customer: customerId, return_url: returnUrl })
  return { url: session.url, sessionId: session.id }
}

export async function findCustomerByEmail(email: string): Promise<Stripe.Customer | null> {
  const result = await stripe.customers.list({ email, limit: 1 })
  if (result.data.length === 0) return null
  return result.data[0]
}
