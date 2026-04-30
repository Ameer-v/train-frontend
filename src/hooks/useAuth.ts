'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth(requiredRole?: string) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('token');
    const r = localStorage.getItem('role');

    if (!t) {
      router.push('/login');
      return;
    }

    if (requiredRole && r !== requiredRole) {
      router.push('/login');
      return;
    }

    setToken(t);
    setIsReady(true);
  }, []);

  const logout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return { isReady, token, logout };
}
