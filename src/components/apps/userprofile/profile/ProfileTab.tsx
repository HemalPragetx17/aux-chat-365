import { Box, Tab, Tabs } from '@mui/material';
import {
  IconActivity,
  IconLock,
  IconUserCircle,
  IconCreditCard,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

const ProfileTab = () => {
  const location = useRouter();
  const [value, setValue] = React.useState(location.pathname);
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const ProfileTabs = [
    {
      label: 'Profile',
      icon: <IconUserCircle size="20" />,
      to: '/user/profile',
    },
    {
      label: 'Business Card',
      icon: <IconCreditCard size="20" />,
      to: '/user/business',
    },
    {
      label: 'Change Password',
      icon: <IconLock size="20" />,
      to: '/user/password',
    },
    {
      label: 'Login Logs',
      icon: <IconActivity size="20" />,
      to: '/user/log',
    },
    {
      label: 'Extension Settings',
      icon: <IconActivity size="20" />,
      to: '/user/extension',
    },
  ];

  return (
    <Box sx={{ backgroundColor: (theme) => theme.palette.grey[100] }}>
      <Box display="flex" sx={{ maxWidth: { xs: 320, sm: '100%' } }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          allowScrollButtonsMobile
          aria-label="scrollable prevent tabs example"
        >
          {ProfileTabs.map((tab) => {
            return (
              <Tab
                iconPosition="start"
                label={tab.label}
                sx={{ minHeight: '50px' }}
                icon={tab.icon}
                component={Link}
                href={tab.to}
                value={tab.to}
                key={tab.label}
              />
            );
          })}
        </Tabs>
      </Box>
    </Box>
  );
};

export default ProfileTab;
