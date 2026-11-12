import { router, type Href } from 'expo-router';

/** Back like the HTML "رجوع" links: pop if possible, otherwise go to the linked screen. */
export function goBack(fallback: Href) {
  if (router.canGoBack()) router.back();
  else router.replace(fallback);
}

/** Leave the auth flow: clear the stack so "back" can't return to sign-up screens. */
export function resetTo(href: Href) {
  if (router.canDismiss()) router.dismissAll();
  router.replace(href);
}

export type Role = 'customer' | 'courier';

export const homeFor = (role: Role): Href => (role === 'courier' ? '/courier-home' : '/home');
