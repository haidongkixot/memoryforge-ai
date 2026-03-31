import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

// ── Log Levels ──

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal'

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4,
}

const MIN_PERSIST_LEVEL: LogLevel = (process.env.LOG_LEVEL as LogLevel) ?? 'info'

// ── Console Logger ──

function formatMessage(level: LogLevel, message: string, source?: string): string {
  const timestamp = new Date().toISOString()
  const prefix = source ? `[${source}]` : ''
  return `${timestamp} ${level.toUpperCase().padEnd(5)} ${prefix} ${message}`
}

function consoleLog(level: LogLevel, message: string, source?: string) {
  const formatted = formatMessage(level, message, source)
  switch (level) {
    case 'debug':
      console.debug(formatted)
      break
    case 'info':
      console.info(formatted)
      break
    case 'warn':
      console.warn(formatted)
      break
    case 'error':
    case 'fatal':
      console.error(formatted)
      break
  }
}

// ── Persistent Logger (writes to SystemLog) ──

async function persist(
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>,
  source?: string
) {
  if (LEVEL_PRIORITY[level] < LEVEL_PRIORITY[MIN_PERSIST_LEVEL]) return

  try {
    await prisma.systemLog.create({
      data: { level, message, context: context as Prisma.InputJsonValue | undefined, source },
    })
  } catch {
    console.error(`[logger] Failed to persist log: ${message}`)
  }
}

// ── Activity Logger (writes to ActivityLog) ──

export async function logActivity(params: {
  userId?: string
  action: string
  entity: string
  entityId?: string
  metadata?: Record<string, unknown>
  ip?: string
}) {
  try {
    await prisma.activityLog.create({
      data: {
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        metadata: params.metadata as Prisma.InputJsonValue | undefined,
        ip: params.ip,
        ...(params.userId ? { user: { connect: { id: params.userId } } } : {}),
      },
    })
  } catch {
    console.error(`[logger] Failed to log activity: ${params.action}`)
  }
}

// ── Public API ──

export const logger = {
  debug(message: string, context?: Record<string, unknown>, source?: string) {
    consoleLog('debug', message, source)
    persist('debug', message, context, source)
  },

  info(message: string, context?: Record<string, unknown>, source?: string) {
    consoleLog('info', message, source)
    persist('info', message, context, source)
  },

  warn(message: string, context?: Record<string, unknown>, source?: string) {
    consoleLog('warn', message, source)
    persist('warn', message, context, source)
  },

  error(message: string, context?: Record<string, unknown>, source?: string) {
    consoleLog('error', message, source)
    persist('error', message, context, source)
  },

  fatal(message: string, context?: Record<string, unknown>, source?: string) {
    consoleLog('fatal', message, source)
    persist('fatal', message, context, source)
  },
}
