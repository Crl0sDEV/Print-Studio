import { createSafeActionClient, DEFAULT_SERVER_ERROR_MESSAGE } from 'next-safe-action'

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    console.error('Action Server Error:', e.message)
    return e instanceof Error ? e.message : DEFAULT_SERVER_ERROR_MESSAGE
  },
})
