export const ROLES = {
  JT: 'JT',
  SA: 'SA',
  S: 'S',
  IPA: 'IPA',
  IP: 'IP',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const ROLE_ORDER: Role[] = [
  ROLES.JT,
  ROLES.SA,
  ROLES.S,
  ROLES.IPA,
  ROLES.IP,
]

export const TASK_STATUSES = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
} as const

export type TaskStatus = (typeof TASK_STATUSES)[keyof typeof TASK_STATUSES]

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  [TASK_STATUSES.PENDING]: 'Pendiente',
  [TASK_STATUSES.IN_PROGRESS]: 'En proceso',
  [TASK_STATUSES.COMPLETED]: 'Terminado',
}

export const TASK_PRIORITIES = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
} as const

export type TaskPriority = (typeof TASK_PRIORITIES)[keyof typeof TASK_PRIORITIES]

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  [TASK_PRIORITIES.LOW]: 'Baja',
  [TASK_PRIORITIES.MEDIUM]: 'Media',
  [TASK_PRIORITIES.HIGH]: 'Alta',
  [TASK_PRIORITIES.CRITICAL]: 'Crítica',
}
