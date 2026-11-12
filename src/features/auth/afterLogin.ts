import type { Href } from 'expo-router';

import type { UserProfile } from '@/api/auth';
import { resetTo, type Role } from '@/utils/nav';

/**
 * Where a signed-in account goes (login, app start with a saved session, after accepting new terms):
 * - courier whose application needs a fix → pending screen in "needs a fix" mode with the admin's note
 *   (the token is limited to the fix endpoints; the resubmit screen isn't built yet)
 * - otherwise → the home of the account's real role (the login tab doesn't matter)
 */
export function homeAfterLogin(user: UserProfile): Href {
  if (user.role === 'courier') {
    if (user.courier?.approvalStatus === 'needs_fix') {
      return { pathname: '/courier-pending', params: { mode: 'fix', message: user.courier.reviewNote ?? '' } };
    }
    return '/courier-home';
  }
  return '/home';
}

/** Like homeAfterLogin, but a newer terms version must be accepted first (Terms screen in "update" mode). */
export function goAfterLogin(user: UserProfile) {
  if (user.termsUpToDate === false) {
    resetTo({ pathname: '/terms', params: { role: user.role as Role, mode: 'update' } });
    return;
  }
  resetTo(homeAfterLogin(user));
}
