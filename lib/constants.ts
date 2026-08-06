export const ORDER_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  PRINTING: 'printing',
  FINISHING: 'finishing',
  READY: 'ready',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const PAYMENT_STATUSES = {
  UNPAID: 'unpaid',
  PARTIAL: 'partial',
  PAID: 'paid',
} as const;

export const COLOR_MODES = {
  GRAYSCALE: 'grayscale',
  COLORED_LIGHT: 'colored_light',
  COLORED_HEAVY: 'colored_heavy',
  ANY: 'any',
} as const;

export const PRESET_CATEGORIES = {
  DOCUMENT: 'document',
  ID_CARD: 'id_card',
  MERCHANDISE: 'merchandise',
  LARGE_FORMAT: 'large_format',
} as const;
