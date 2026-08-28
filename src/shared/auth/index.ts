export { auth, type AuthUser, type Session } from './auth';
export {
  isAdminPath,
  isProtectedPath,
  isPublicAuthPath,
  isVerifyEmailPath,
  PROTECTED_PATHS,
  PUBLIC_AUTH_PATHS,
  stripLocalePrefix,
} from './auth-routes';
export {
  CREDENTIAL_PROVIDER_ID,
  getEnabledOAuthProviders,
  OAUTH_PROVIDER_IDS,
  type OAuthProviderId,
} from './oauth-providers';
export {
  getRegisterEligibility,
  type RegisterEligibilityStatus,
} from './register-eligibility';
export {
  getSession,
  redirectIfEmailVerified,
  requireAdmin,
  requireGuest,
  requireUser,
} from './session';
