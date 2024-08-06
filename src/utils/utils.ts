import axios from '../utils/axios';

const jwtDecode = (token: string) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join(''),
  );
  return JSON.parse(jsonPayload);
};

export const isValidToken = (accessToken: string) => {
  if (!accessToken) {
    return false;
  }
  const decoded = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000;
  return decoded.exp > currentTime;
};

export const tokenExpired = (exp: number) => {
  let expiredTimer;
  const currentTime = Date.now();
  const timeLeft = exp * 1000 - currentTime;
  clearTimeout(expiredTimer);
  expiredTimer = setTimeout(() => {
    localStorage.removeItem('accessToken');
    window.location.href = `/auth/login`;
  }, timeLeft);
};

export const setSession = (accessToken: string | null) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    const { exp } = jwtDecode(accessToken);
    tokenExpired(exp);
  } else {
    localStorage.removeItem('accessToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

export const normalizeNumber = (number: string): string => {
  if (/^(sips?|tel):/i.test(number)) {
    return number;
  } else if (/@/i.test(number)) {
    return number;
  } else {
    return number.replace(/[+1]/g, '');
  }
};

export const formatPhoneNumber = (phoneNumberString: any) => {
  const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{1,3}|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    const intlCode = match[1] ? `+${match[1]} ` : '';

    return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
  }

  return phoneNumberString;
};

export const pad = (val: number) => (val > 9 ? val : '0' + val); // eslint-disable-line prefer-template

export const getObjectCount = (obj: any) => Object.keys(obj).length;
