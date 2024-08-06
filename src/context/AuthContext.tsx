import { useRouter } from 'next/router';
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import axios from '../utils/axios';
import { isValidToken, setSession } from '../utils/utils';

import {
  AuthValuesType,
  ErrCallbackType,
  ForgotPasswordParams,
  LoginOTPParams,
  LoginParams,
  ResetPasswordParams,
  UserDataType,
  UserSettingsType,
} from './types';

const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  loginOTP: () => Promise.resolve(),
  forgotPassword: () => Promise.resolve(),
  resetPassword: () => Promise.resolve(),
  loginToAccount: () => Promise.resolve(),
  settings: null,
  setSettings: () => null,
  userDetails: null,
  setUserDetails: () => null,
};

const AuthContext = createContext(defaultProvider);

type Props = {
  children: ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user);
  const [userDetails, setUserDetails] = useState<any>(
    defaultProvider.userDetails,
  );
  const [settings, setSettings] = useState<UserSettingsType | null | undefined>(
    defaultProvider.settings,
  );
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading);
  const router = useRouter();

  const initAuth = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem('accessToken');
      if (user === null && storedToken) {
        if (isValidToken(storedToken)) {
          setLoading(true);
          setSession(storedToken);
          const response = await axios.get(`/auth/myaccount`);
          const user = response.data;
          setUser(user);
          await handleFetchSettings();
          localStorage.setItem('user', JSON.stringify(user));
          setLoading(false);
        } else {
          throw new Error('Invalid Token');
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      setUser(null);
      setLoading(false);
      if (!router.pathname.includes('login')) {
        router.replace('/auth/login');
      }
    }
  }, [user, router]);

  useEffect(() => {
    initAuth();
  }, [user, router]);

  useEffect(() => {
    if (settings === undefined) {
      handleFetchSettings();
    }
  }, [settings]);

  const handleFetchSettings = async () => {
    const response = await axios.get(`/auth/mysettings`);
    const settings = response.data;
    setSettings(settings);
  };

  const handleLogin = (
    params: LoginParams,
    errorCallback?: ErrCallbackType,
  ) => {
    axios
      .post('/auth/login', params)
      .then(async (response) => {
        if (Boolean(response.data)) {
          const { access_token } = response.data;
          if (access_token) {
            localStorage.setItem('accessToken', access_token);
            setLoading(true);
            router.replace('/');
            localStorage.removeItem('otp_data');
            return false;
          } else {
            const otp_data = {
              ...response.data?.OtpRetries,
              email: params?.email,
            };
            localStorage.setItem('otp_data', JSON.stringify(otp_data));
            router.replace('/auth/two-steps');
          }
        } else {
          throw new Error('Something went wrong');
        }
      })
      .catch((err) => {
        if (errorCallback) {
          console.log(err);
          errorCallback(err);
        }
      });
  };

  const handleLoginOTP = (
    params: LoginOTPParams,
    errorCallback?: ErrCallbackType,
  ) => {
    axios
      .post('/auth/login/verify/token', params)
      .then(async (response) => {
        if (Boolean(response.data)) {
          const { access_token } = response.data;
          localStorage.setItem('accessToken', access_token);
          setLoading(true);
          router.replace('/');
          localStorage.removeItem('otp_data');
          return false;
        } else {
          throw new Error('Something went wrong');
        }
      })
      .catch((err) => {
        console.log(err);
        if (errorCallback) errorCallback(err);
      });
  };

  const handleLogout = async () => {
    axios.get('/auth/logout');
    router.push('/auth/login');
  };

  const handleForgotPassword = (
    params: ForgotPasswordParams,
    errorCallback?: ErrCallbackType,
  ) => {
    axios
      .post('/auth/forgot-password', params)
      .then(async (response) => {
        if (Boolean(response.data)) {
          router.replace('/auth/reset-password/');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .catch((err) => {
        console.log(err);
        if (errorCallback) errorCallback(err);
      });
  };

  const handleResetPassword = (
    params: ResetPasswordParams,
    errorCallback?: ErrCallbackType,
  ) => {
    axios
      .post('/auth/reset-password', params)
      .then(async (response) => {
        if (Boolean(response.data)) {
          router.replace('/auth/login/');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .catch((err) => {
        console.log(err);
        if (errorCallback) errorCallback(err);
      });
  };

  const handleLoginToAccount = (
    email: string,
    errorCallback?: ErrCallbackType,
  ) => {
    axios
      .post('/auth/login-user', { email })
      .then(async (response) => {
        if (Boolean(response.data)) {
          const { access_token } = response.data;
          localStorage.setItem('accessToken', access_token);
          setLoading(true);
          setUser(null);
          router.replace('/');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .catch((err) => {
        console.log(err);
        if (errorCallback) errorCallback(err);
      });
  };

  const memoizedValue = useMemo(
    () => ({
      user,
      userDetails,
      settings,
      loading,
      setUser,
      setSettings,
      setUserDetails,
      setLoading,
      login: handleLogin,
      logout: handleLogout,
      loginOTP: handleLoginOTP,
      forgotPassword: handleForgotPassword,
      resetPassword: handleResetPassword,
      loginToAccount: handleLoginToAccount,
    }),
    [
      user,
      settings,
      userDetails,
      handleLogin,
      handleLogout,
      handleLoginOTP,
      handleResetPassword,
      handleLoginToAccount,
    ],
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
