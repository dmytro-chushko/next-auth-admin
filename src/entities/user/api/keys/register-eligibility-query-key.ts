export function registerEligibilityQueryKey(email: string) {
  return ['registration', 'eligibility', email.trim().toLowerCase()] as const;
}
