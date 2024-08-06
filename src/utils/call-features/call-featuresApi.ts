import store from '../../store/Store';
import { setYeasterToken } from '../../store/apps/calls/callsSlice';
import axiosInstance from '../axios';

axiosInstance.interceptors.response.use(
  async (response: any) => {
    const orginalRequest = response;
    orginalRequest.sent = true;
    if (orginalRequest.data && orginalRequest?.data.errcode === 10004) {
      let res = null;
      if (orginalRequest.config.url === '/call-features/api-token') {
        res = await getApiAuthLoginToken();
      } else {
        res = await refreshApiToken();
      }
      if (res) {
        orginalRequest.config.data = {
          ...orginalRequest.config.params,
          access_token: res?.access_token,
        };
        return axiosInstance(orginalRequest);
      }
    } else {
      return response;
    }
  },
  (error) => {
    return Promise.reject(error || 'Something went wrong');
  },
);

export const getApiAuthLoginToken = async () => {
  try {
    const res: any = await axiosInstance.post('/call-features/token');
    if (res?.data && res?.data?.errcode === 0) {
      const { access_token, refresh_token } = res?.data;
      localStorage.setItem('yeasterAccessToken', access_token);
      localStorage.setItem('yeasterRefreshToken', refresh_token);
      const Tokens = {
        access_token,
        refresh_token,
      };
      store.dispatch(setYeasterToken(Tokens));
      return res?.data;
    }

    if (
      res?.data?.data &&
      (res?.data?.errcode === 10004 || res?.data?.errcode === 60002)
    ) {
      const refreshResponse: any = await axiosInstance.post(
        '/call-features/token',
        { refresh_token: localStorage.getItem('yeasterRefreshToken') },
      );
      if (refreshResponse?.data && refreshResponse?.data?.errcode === 0) {
        const { access_token, refresh_token } = refreshResponse?.data;
        localStorage.setItem('yeasterAccessToken', access_token);
        localStorage.setItem('yeasterRefreshToken', refresh_token);
        const Tokens = {
          access_token,
          refresh_token,
        };
        store.dispatch(setYeasterToken(Tokens));
        return refreshResponse?.data;
      }
    }
  } catch (error: any) {
    console.debug('error', error);
    return null;
  }
};

export const getYeasterApiAccessToken = async () => {
  try {
    const res: any = await axiosInstance.post('/call-features/api-token');
    if (res?.data && res?.data?.errcode === 0) {
      const { access_token, refresh_token } = res?.data;
      localStorage.setItem('yeasterApiAccessToken', access_token);
      localStorage.setItem('yeasterApiRefreshToken', refresh_token);

      const Tokens = {
        access_token,
        refresh_token,
      };
      store.dispatch(setYeasterToken(Tokens));
      return res?.data;
    }
    if (
      res?.data?.data &&
      (res?.data?.errcode === 10004 || res?.data?.errcode === 60002)
    ) {
      const refreshResponse: any = await axiosInstance.post(
        '/call-features/api-token',
        { refresh_token: localStorage.getItem('yeasterRefreshToken') },
      );
      if (refreshResponse?.data && refreshResponse?.data?.errcode === 0) {
        const { access_token, refresh_token } = refreshResponse?.data;
        localStorage.setItem('yeasterApiAccessToken', access_token);
        localStorage.setItem('yeasterApiRefreshToken', refresh_token);
        const Tokens = {
          access_token,
          refresh_token,
        };
        store.dispatch(setYeasterToken(Tokens));
        return refreshResponse?.data;
      }
    }
  } catch (error: any) {
    console.debug('error', error);
    return null;
  }
};

export const refreshApiToken = async () => {
  try {
    const res: any = await axiosInstance.post('/call-features/api-token', {
      refresh_token: localStorage.getItem('yeasterRefreshToken'),
    });
    if (res?.data && res?.data?.success) {
      const { access_token, refresh_token } = res?.data?.data;
      localStorage.setItem('yeasterAccessToken', access_token);
      localStorage.setItem('yeasterRefreshToken', refresh_token);
      return res?.data?.data;
    }
  } catch (error: any) {
    console.debug('error refreshYeasterApiToken', error);
    return null;
  }
};

export const getRecordingDetails = async (callId: string) => {
  try {
    const res: any = await axiosInstance.get('/call-features/record/' + callId);
    if (res?.data && res?.data?.success) {
      return { token: res?.data?.token, data: res?.data?.data };
    }
  } catch (error: any) {
    console.debug('error', error);
  }
};
