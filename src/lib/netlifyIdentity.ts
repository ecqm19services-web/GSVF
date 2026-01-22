export type NetlifyIdentityUser = {
  token: {
    access_token: string;
  };
};

export type NetlifyIdentity = {
  init: () => void;
  open: (tab?: 'login' | 'signup') => void;
  close: () => void;
  logout: () => void;
  currentUser: () => NetlifyIdentityUser | null;
  on: (
    event: 'init' | 'login' | 'logout' | 'error' | 'close',
    cb: (user?: NetlifyIdentityUser) => void
  ) => void;
};

declare global {
  interface Window {
    netlifyIdentity?: NetlifyIdentity;
  }
}

export function getNetlifyIdentity(): NetlifyIdentity | null {
  return window.netlifyIdentity || null;
}

export function getNetlifyIdentityToken(user: NetlifyIdentityUser | null): string | null {
  return user?.token?.access_token || null;
}
