import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import { IconMail } from '@tabler/icons-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { CustomStyledBadge } from '../../../../components/shared/CustomStyledBadge';
import { useAuth } from '../../../../hooks/useAuth';
import useCallFeature from '../../../../hooks/useCallFeature';
import { useSelector } from '../../../../store/Store';
import { getInitials } from '../../../../utils/get-initials';

import { profile } from './data';

const Profile = () => {
  const auth = useAuth();
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [profileItem, setProfileItem] = useState<any>([]);
  const { connected } = useSelector((state) => state.callsReducer);
  const { disconnectPbx } = useCallFeature();
  const user = auth.user as any;

  useEffect(() => {
    const roleId = user?.role?.roleId;
    const filteredData = profile?.filter(
      (item) => item.roles.indexOf(roleId) > -1,
    );
    setProfileItem(filteredData);
  }, [user]);

  const handleClick2 = (event: any) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleLogout = () => {
    disconnectPbx();
    auth.logout();
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === 'object' && {
            color: 'primary.main',
          }),
        }}
        onClick={handleClick2}
      >
        <CustomStyledBadge
          overlap="circular"
          isconnected={connected ? 'connected' : 'disconnected'}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          variant={user?.role.id !== 1 ?? connected ? 'dot' : undefined}
        >
          <Avatar
            sx={{
              bgcolor: '#F72B73',
              width: 35,
              height: 35,
              fontSize: 16,
            }}
          >
            {user?.name ? getInitials(user?.name) : ''}
          </Avatar>
        </CustomStyledBadge>
      </IconButton>
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '360px',
            p: 4,
          },
        }}
      >
        <Typography variant="h5">User Profile</Typography>
        <Stack direction="row" py={3} spacing={2} alignItems="center">
          <Box>
            <Typography
              variant="subtitle2"
              color="textPrimary"
              fontWeight={600}
            >
              {user?.name}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {user?.role?.name}
            </Typography>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <IconMail width={15} height={15} />
              {user?.email}
            </Typography>
          </Box>
        </Stack>
        <Divider />
        {profileItem?.map((profile: any) => (
          <Box key={profile.title}>
            <Box sx={{ py: 0, px: 0 }} className="hover-text-primary">
              <Link href={profile.href}>
                <Stack direction="row" spacing={2}>
                  <Box
                    width="45px"
                    height="45px"
                    bgcolor="transparent"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink="0"
                  >
                    <Avatar
                      src={profile.icon}
                      alt={profile.icon}
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: 0,
                      }}
                    />
                  </Box>
                  <Box
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                  >
                    <Typography
                      variant="body2"
                      fontSize={14}
                      fontWeight={600}
                      color="textPrimary"
                      className="text-hover"
                      noWrap
                    >
                      {profile.title}
                    </Typography>
                  </Box>
                </Stack>
              </Link>
            </Box>
          </Box>
        ))}
        <Box mt={2}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleLogout}
            fullWidth
          >
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
