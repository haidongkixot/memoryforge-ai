/**
 * Stripe webhook idempotency helper.
 *
 * Uses the AppConfig table (key @unique, value Json) to store
 * processed event IDs. Key format: `stripe.webhook.event:<event.id>`.
 */
import { prisma } from '@/lib/prisma'

const KEY_PREFIX = 'stripe.webhook.event:'

function makeKey(eventId: string): string {
  return `${KEY_PREFIX}${eventId}`
}

/**
 * Returns true iff this event.id has already been recorded as processed.
 */
export async function hasProcessedEvent(eventId: string): Promise<boolean> {
  if (!eventId) return false
  try {
    const row = await prisma.appConfig.findUnique({
      where: { key: makeKey(eventId) },
    })
    return Boolean(row)
  } catch {
    return false
  }
}

/**
 * Atomically claim an event.id as "processed by us". Returns true if we
 * are the first instance to record it.
 */
export async function claimEvent(eventId: string): Promise<boolean> {
  if (!eventId) return false
  try {
    await prisma.appConfig.create({
      data: {
        key: makeKey(eventId),
        value: { timestamp: new Date().toISOString() },
      },
    })
    return true
  } catch (err: any) {
    if (err?.code === 'P2002') return false
    throw err
  }
}

/**
 * Convenience: combine hasProcessedEvent + claimEvent into one call.
 */
export async function tryClaimEvent(
  eventId: string
): Promise<'fresh' | 'duplicate'> {
  if (await hasProcessedEvent(eventId)) return 'duplicate'
  const claimed = await claimEvent(eventId)
  return claimed ? 'fresh' : 'duplicate'
}
