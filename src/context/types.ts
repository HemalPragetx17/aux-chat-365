export type ErrCallbackType = (err: { [key: string]: string }) => void;

export type ActionMapType<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export type AuthUserType = null | Record<string, any>;

export type AuthStateType = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUserType;
  dashboard?: any;
};

// ----------------------------------------------------------------------

export type JWTContextType = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUserType;
  dashboard: any;
  login: (email: string, password: string) => Promise<void>;
  loginAsKey: (email: string, token: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => Promise<void>;
  logout: () => void;
};

export type LoginParams = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type LoginOTPParams = {
  token: string;
};

export type ResendOTPParams = {
  mobileNo: string;
};

export type ForgotPasswordParams = {
  email: string;
};

export type ResetPasswordParams = {
  code: string;
  password: string;
  confirmPassword: string;
};

export type UserDataType = {
  id: number;
  role: {
    id?: number;
    name: string;
    role: string;
    roleId?: number;
  };
  email: string;
  name: string;
  uid: string;
  phone?: string | number;
};

export type UserSettingsType = {
  id: string;
  defaultDid: any;
  textPreviewFlag: boolean;
  configuration: any;
  user_settings: any;
  pbx_details: any;
};

export type AuthValuesType = {
  loading: boolean;
  logout: () => void;
  user: UserDataType | null;
  settings: UserSettingsType | null | undefined;
  setLoading: (value: boolean) => void;
  setUser: (value: UserDataType | null) => void;
  setSettings: (value: UserSettingsType | null | undefined) => void;
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void;
  loginOTP: (params: LoginOTPParams, errorCallback?: ErrCallbackType) => void;
  forgotPassword: (
    params: ForgotPasswordParams,
    errorCallback?: ErrCallbackType,
  ) => void;
  resetPassword: (
    params: ResetPasswordParams,
    errorCallback?: ErrCallbackType,
  ) => void;
  loginToAccount: (email: string, errorCallback?: ErrCallbackType) => void;
  userDetails: any;
  setUserDetails: (value: any) => void;
};
