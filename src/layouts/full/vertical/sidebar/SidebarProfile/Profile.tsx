import { Box, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import { IconPower } from '@tabler/icons-react';
import { useRouter } from 'next/router';

import { useAuth } from '../../../../../hooks/useAuth';
import useCallFeature from '../../../../../hooks/useCallFeature';
import { AppState, useSelector } from '../../../../../store/Store';

export const Profile = () => {
  const auth = useAuth();
  const route = useRouter();
  const customizer = useSelector((state: AppState) => state.customizer);
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up('lg'));
  const { disconnectPbx } = useCallFeature();

  const handleLogout = () => {
    disconnectPbx();
    auth.logout();
  };

  return (
    <Tooltip title="Logout" placement="top">
      {customizer.isCollapse ? (
        <Box
          padding={0.5}
          alignItems={'center'}
          position={'relative'}
          bottom={0}
          height={50}
          onClick={handleLogout}
          sx={{
            bgcolor: customizer?.activeMode === 'dark' ? '#393b48' : '#ffffff',
            width: 66,
            textAlign: 'center',
            position: 'fixed',
            bottom: '10px',
            left: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <IconButton
            sx={{ padding: 0 }}
            style={{ color: 'red' }}
            aria-label="logout"
            size="medium"
          >
            <IconPower size="20" />
          </IconButton>
        </Box>
      ) : (
        <Box
          padding={0.5}
          alignItems={'center'}
          position={'relative'}
          bottom={0}
          display={'flex'}
          justifyContent={'center'}
          gap={1}
          height={50}
          onClick={handleLogout}
          sx={{
            bgcolor: customizer?.activeMode === 'dark' ? '#393b48' : '#ffffff',
            width: `${customizer.isCollapse ? '66px' : '180px'}`,
            textAlign: 'center',
            position: 'fixed',
            bottom: '10px',
            left: '6px',
            cursor: 'pointer',
          }}
        >
          <IconButton
            sx={{ padding: 0 }}
            style={{ color: 'red' }}
            aria-label="logout"
            size="medium"
          >
            <IconPower size="20" />
          </IconButton>
          <p style={{ marginTop: '15px', padding: '0px' }}>Logout</p>
        </Box>
      )}
    </Tooltip>
  );
};
