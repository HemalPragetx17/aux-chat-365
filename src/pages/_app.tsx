import { CacheProvider, EmotionCache } from '@emotion/react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { NylasProvider, useNylas } from '@nylas/nylas-react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import NextNProgress from 'nextjs-progressbar';
import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import 'react-quill/dist/quill.snow.css';
import { Provider } from 'react-redux';

import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import '../../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import { CallTimerDurationProvider } from '../context/CallTimerContext';
import createEmotionCache from '../createEmotionCache';
import AuthGuard from '../guards/AuthGuard';
import BlankLayout from '../layouts/blank/BlankLayout';
import FullLayout from '../layouts/full/FullLayout';
import RTL from '../layouts/full/shared/customizer/RTL';
import Store, { AppState, useSelector } from '../store/Store';
import { ThemeSettings } from '../theme/Theme';
import '../utils/i18n';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const SERVER_URI =
  process.env.NYLAS_API_URL || 'http://localhost:7000/api/v1/email-nylas';

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const layouts: any = {
  Blank: BlankLayout,
};

const MyApp = (props: MyAppProps) => {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps,
  }: any = props;
  const nylas = useNylas();
  const theme = ThemeSettings();
  
  const customizer = useSelector((state: AppState) => state.customizer);
  const Layout = layouts[Component.layout] || FullLayout;
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  useEffect(() => {
    if (!nylas) {
      return;
    }

    // Handle the code that is passed in the query params from Nylas after a successful login
    const params = new URLSearchParams(window.location.search);
    if (params.has('code')) {
      nylas
        .exchangeCodeFromUrlForToken()
        .then((user) => {
          const { id } = JSON.parse(user);
          sessionStorage.setItem('userId', id);
        })
        .catch((error) => {
          console.error('An error occurred parsing the response:', error);
        });
    }
  }, [nylas]);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta name="theme-color" content="#8334b8" />
        <link rel="manifest" href="/manifest.json" />
        <title>Aux365</title>
      </Head>
      <AuthProvider>
        <CallTimerDurationProvider>
          <NextNProgress color={theme.palette.primary.main} />
          <ThemeProvider theme={theme}>
            <RTL direction={customizer.activeDir}>
              <CssBaseline />
              {!loading ? (
                <Layout>
                  <AuthGuard>
                    <Component {...pageProps} />
                  </AuthGuard>
                  <Toaster
                    position={'bottom-center'}
                    toastOptions={{ className: 'react-hot-toast' }}
                  />
                </Layout>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100vh',
                  }}
                >
                  <CircularProgress />
                </Box>
              )}
            </RTL>
          </ThemeProvider>
        </CallTimerDurationProvider>
      </AuthProvider>
    </CacheProvider>
  );
};

const App = (props: MyAppProps) => (
  <Provider store={Store}>
    <NylasProvider serverBaseUrl={SERVER_URI}>
      <MyApp {...props} />
    </NylasProvider>
  </Provider>
);

export default App;
