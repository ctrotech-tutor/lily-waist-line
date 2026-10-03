export type AccountDeletionResult =
  | { success: false; error: 'Unauthorized' }
  | { success: false; error: string }

/** Fail closed until Auth deletion and order-retention rules can be coordinated. */
export function getAccountDeletionResult(isAuthenticated: boolean): AccountDeletionResult {
  if (!isAuthenticated) {
    return { success: false, error: 'Unauthorized' }
  }

  return {
    success: false,
    error: 'Self-service account deletion is temporarily unavailable. Please contact support to request deletion; no account data was removed.',
  }
}
