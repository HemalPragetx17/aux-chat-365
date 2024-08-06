import { useRouter } from 'next/router';

import CustomSpinner from '../components/custom/CustomSpinner';
import { useAuth } from '../hooks/useAuth';
import Custom404 from '../pages/404';

const AuthGuard = (props: any) => {
  const { children } = props;
  const auth = useAuth();
  const router = useRouter();

  if (router.route.includes('/auth/') || router.route.includes('/contract/')) {
    return children;
  }

  if (auth.loading) {
    return <CustomSpinner />;
  }

  if (auth.user) {
    return children;
  }

  if (!auth.user) {
    router.replace('/auth/login');
    return false;
  }

  return <Custom404 />;
};

export default AuthGuard;
