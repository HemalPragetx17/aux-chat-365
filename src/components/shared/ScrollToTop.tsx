import { useRouter } from 'next/router';
import { useEffect, ReactElement } from 'react';

export default function ScrollToTop({
  children,
}: {
  children: ReactElement | null;
}) {
  const { pathname } = useRouter();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [pathname]);

  return children || null;
}
