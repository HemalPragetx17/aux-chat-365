import { Box, BoxProps, styled, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import CallFeature from '../../components/callfeatures/CallFeature';
import { useAuth } from '../../hooks/useAuth';

import Customizer from './shared/customizer/Customizer';
import Header from './vertical/header/Header';
import Sidebar from './vertical/sidebar/Sidebar';

const MainWrapper = styled('div')({
  height: '100%',
  display: 'flex',
  maxHeight: '100vh !important',
});

const PageWrapper = styled(Box)<BoxProps>({
  flexGrow: 1,
  minWidth: 0,
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
});

const ContentWrapper = styled('main')(({ theme }) => ({
  flexGrow: 1,
  width: '100%',
  transition: 'padding .25s ease-in-out',
  maxHeight: '100vh !important',
}));

interface Props {
  children: React.ReactNode;
}

const FullLayout: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [padding, setPadding] = useState<string>('6');
  const theme = useTheme();

  useEffect(() => {
    if (!router.isReady) {
      setPadding('6');
      return;
    }
    if (
      router.route.includes('/chats') ||
      router.route.includes('/emails') ||
      router.route.includes('/contacts/single') ||
      router.route.includes('/calendar')
    ) {
      setPadding('0');
    } else {
      setPadding('15px 20px 0px 20px');
    }
  }, [router.route]);

  return (
    <MainWrapper>
      <Sidebar />
      <PageWrapper className="page-wrapper">
        <Header />
        <ContentWrapper
          className="layout-page-content"
          sx={{
            padding,
            backgroundColor:theme.palette.secondary.contrastText
          }}
        >
          {children}
        </ContentWrapper>
        <Customizer />
        {user?.role.roleId !== 1 && <CallFeature />}
      </PageWrapper>
    </MainWrapper>
  );
};

export default FullLayout;
