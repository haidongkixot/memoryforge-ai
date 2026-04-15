import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id

  // Find pending referral reward for this user
  const reward = await prisma.referralReward.findUnique({
    where: { referredUserId: userId },
    include: { referralCode: true },
  })

  if (!reward) {
    return NextResponse.json({ error: 'No referral found' }, { status: 404 })
  }

  if (reward.activatedAt) {
    return NextResponse.json({ message: 'Already activated' })
  }

  // Activate the referral and grant reward to referrer
  const now = new Date()
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  await prisma.$transaction(async (tx) => {
    // Mark the referral as activated and reward granted
    await tx.referralReward.update({
      where: { id: reward.id },
      data: {
        activatedAt: now,
        rewardGranted: true,
      },
    })

    // Check referrer's current plan/subscription status
    const referrer = await tx.user.findUnique({
      where: { id: reward.referrerId },
      select: { id: true, plan: true },
    })

    if (!referrer) return

    // Check for existing active subscription to extend
    const existingSub = await tx.subscription.findFirst({
      where: {
        userId: referrer.id,
        status: 'active',
        plan: { slug: 'pro' },
      },
      include: { plan: true },
    })

    // Find the pro plan
    const proPlan = await tx.plan.findUnique({
      where: { slug: 'pro' },
    })

    if (!proPlan) {
      // If no pro plan exists, just update the user plan field
      await tx.user.update({
        where: { id: referrer.id },
        data: { plan: 'pro' },
      })
      return
    }

    if (existingSub && existingSub.currentPeriodEnd) {
      // Extend existing subscription by 30 days
      await tx.subscription.update({
        where: { id: existingSub.id },
        data: {
          currentPeriodEnd: new Date(
            existingSub.currentPeriodEnd.getTime() + 30 * 24 * 60 * 60 * 1000
          ),
          endDate: new Date(
            (existingSub.endDate || existingSub.currentPeriodEnd).getTime() +
              30 * 24 * 60 * 60 * 1000
          ),
        },
      })
    } else {
      // Create a new referral-based subscription
      await tx.subscription.create({
        data: {
          userId: referrer.id,
          planId: proPlan.id,
          status: 'active',
          period: 'monthly',
          currentPeriodStart: now,
          currentPeriodEnd: thirtyDaysFromNow,
          startDate: now,
          endDate: thirtyDaysFromNow,
        },
      })
    }

    // Update user plan
    await tx.user.update({
      where: { id: referrer.id },
      data: { plan: 'pro' },
    })
  })

  return NextResponse.json({ success: true, message: 'Referral activated' })
}
