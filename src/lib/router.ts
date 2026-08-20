import { useEffect, useState } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'sell' }
  | { name: 'search'; query?: string; category?: string }
  | { name: 'product'; id: string }
  | { name: 'about' }
  | { name: 'login' }
  | { name: 'my-listings' };

function parseHash(): Route {
  const hash = window.location.hash.replace(/^#/, '') || '/';
  const [path, search] = hash.split('?');
  const params = new URLSearchParams(search || '');

  if (path === '/' || path === '') return { name: 'home' };
  if (path === '/sell') return { name: 'sell' };
  if (path === '/search') {
    return {
      name: 'search',
      query: params.get('q') || undefined,
      category: params.get('cat') || undefined,
    };
  }
  if (path.startsWith('/product/')) {
    return { name: 'product', id: path.slice('/product/'.length) };
  }
  if (path === '/about') return { name: 'about' };
  if (path === '/login') return { name: 'login' };
  if (path === '/my-listings') return { name: 'my-listings' };
  return { name: 'home' };
}

export function navigate(path: string) {
  window.location.hash = path;
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(parseHash);
  useEffect(() => {
    const onChange = () => {
      setRoute(parseHash());
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export function link(path: string) {
  return `#${path}`;
}
