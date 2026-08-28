import { prisma } from "./prisma"

export interface AuditInput {
  actorId?: string | null
  action: string
  entity: string
  entityId?: string | null
  metadata?: Record<string, unknown>
}

/**
 * Write an audit log entry. Designed to be called inside/around critical
 * business actions (state changes, admin operations).
 */
export async function audit(input: AuditInput) {
  await prisma.auditLog.create({
    data: {
      actorId: input.actorId ?? null,
      action: input.action,
      entity: input.entity,
      entityId: input.entityId ?? null,
      metadata: (input.metadata ?? {}) as object,
    },
  })
}
