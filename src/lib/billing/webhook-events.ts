import { prisma } from '@/lib/prisma'
const KEY_PREFIX = 'stripe.webhook.event:'
function makeKey(eventId: string): string { return `${KEY_PREFIX}${eventId}` }
export async function hasProcessedEvent(eventId: string): Promise<boolean> {
  if (!eventId) return false
  try {
    const row = await prisma.siteSettings.findUnique({ where: { key: makeKey(eventId) } })
    return Boolean(row)
  } catch { return false }
}
export async function claimEvent(eventId: string): Promise<boolean> {
  if (!eventId) return false
  try {
    await prisma.siteSettings.create({
      data: { key: makeKey(eventId), value: { timestamp: new Date().toISOString() } },
    })
    return true
  } catch (err: any) {
    if (err?.code === 'P2002') return false
    throw err
  }
}
export async function tryClaimEvent(eventId: string): Promise<'fresh' | 'duplicate'> {
  if (await hasProcessedEvent(eventId)) return 'duplicate'
  const claimed = await claimEvent(eventId)
  return claimed ? 'fresh' : 'duplicate'
}
