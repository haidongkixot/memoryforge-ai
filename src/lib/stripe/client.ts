import Stripe from 'stripe'
const globalForStripe = globalThis as unknown as { __stripe: Stripe | undefined }
function createStripeClient(): Stripe {
  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret) {
    return new Stripe('sk_test_placeholder_for_build', {
      apiVersion: '2026-03-25.dahlia' as any,
      typescript: true,
      appInfo: { name: 'MemoryForge AI', version: '1.0.0' },
    })
  }
  return new Stripe(secret, {
    apiVersion: '2026-03-25.dahlia' as any,
    typescript: true,
    appInfo: { name: 'MemoryForge AI', version: '1.0.0' },
  })
}
export const stripe: Stripe = globalForStripe.__stripe ?? createStripeClient()
if (process.env.NODE_ENV !== 'production') globalForStripe.__stripe = stripe
export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY)
}
