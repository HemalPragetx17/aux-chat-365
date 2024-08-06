import { getMessaging, getToken, onMessage } from '@firebase/messaging';
import { initializeApp } from 'firebase/app';

import { dispatch } from '../store/Store';
import { setToken } from '../store/customizer/CustomizerSlice';

const firebaseApp = initializeApp({
  apiKey: 'AIzaSyDK9LRE2Ht0k3VGKQBVb6bMiAJhs_2zgeg',
  authDomain: 'aux365-49786.firebaseapp.com',
  projectId: 'aux365-49786',
  storageBucket: 'aux365-49786.appspot.com',
  messagingSenderId: '915023845200',
  appId: '1:915023845200:web:84b23c02ec952021783e55',
  measurementId: 'G-WDSR6BG6QD',
});
const messaging =
  typeof window !== 'undefined' ? getMessaging(firebaseApp) : null;
export const onMessageListener = () => {
  return new Promise((resolve) => {
    messaging &&
      onMessage(messaging, (payload) => {
        resolve(payload);
      });
  });
};

const registerWorker = async () => {
  return await new Promise((resolve, reject) => {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
          resolve(registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
          reject(error);
        });
    });
  });
};

export const getFirebaseToken = async () => {
  try {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    });

    setTimeout(async () => {
      const messaging = getMessaging(firebaseApp);
      const permission = await Notification.requestPermission();
      if (permission && permission === 'granted') {
        const tokenInLocalForage = await localStorage.getItem('fcm_token');
        if (!!tokenInLocalForage) {
          dispatch(setToken(tokenInLocalForage));
        } else {
          const token = await getToken(messaging, {
            vapidKey: process.env.FIREBASE_VAPI_KEY,
          });
          if (token) {
            localStorage.setItem('fcm_token', token);
            dispatch(setToken(token));
          }
        }
      }
    }, 2000);
  } catch (e) {
    console.log(e);
    return null;
  }
};
