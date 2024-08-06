import { Box, Tab, Tabs } from '@mui/material';
import {
  IconActivity,
  IconBrandGoogle,
  IconBuilding,
  IconCash,
  IconCertificate2,
  IconId,
  IconKey,
  IconMail,
  IconMapPin,
  IconPhoneOutgoing,
  IconShoppingCart,
  IconUser,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';

import BlankCard from '../../shared/BlankCard';

interface SettingsBannerProps {
  handleValueChanged: (index: number) => void;
}

const SettingsBanner = (props: SettingsBannerProps) => {
  const { handleValueChanged } = props;
  const [value, setValue] = useState<any>(0);
  const [tabData, setTabData] = useState<any>([]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    handleValueChanged(newValue);
  };

  const SettingTabs = [
    {
      label: 'DID Management',
      icon: <IconId size="20" />,
      to: '/settings/did',
    },
    {
      label: 'Email Management',
      icon: <IconId size="20" />,
      to: '/settings/did',
    },
    {
      label: 'DID Orders',
      icon: <IconShoppingCart size="20" />,
      to: '/settings/did-order',
    },
    {
      label: 'User Management',
      icon: <IconUser size="20" />,
      to: '/settings/user',
    },
    {
      label: 'API Key',
      icon: <IconKey size="20" />,
      to: '/settings/api',
    },
    {
      label: 'Departments',
      icon: <IconBuilding size="20" />,
      to: '/settings/department',
    },
    {
      label: 'Email Templates',
      icon: <IconMail size="20" />,
      to: '/settings/email',
    },
    {
      label: 'Contract Templates',
      icon: <IconCertificate2 size="20" />,
      to: '/settings/contract-template',
    },
    {
      label: 'DID Location',
      icon: <IconMapPin size="20" />,
      to: '/settings/location',
    },
    {
      label: 'Contact Us Scripts',
      icon: <IconPhoneOutgoing size="20" />,
      to: '/settings/contact-us-scripts',
    },
    {
      label: 'Payment',
      icon: <IconCash size="20" />,
      to: '/settings/payment-settings',
    },
    {
      label: 'Reviews',
      icon: <IconBrandGoogle size="20" />,
      to: '/settings/reviews-settings',
    },
    {
      label: 'User Activity',
      icon: <IconActivity size="20" />,
      to: '/settings/user-activity-log',
    },
    {
      label: 'Contact Category',
      icon: <IconId size="20" />,
      to: '/settings/contact-category',
    },
  ];

  useEffect(() => {
    setTabData(SettingTabs);
  }, []);

  useEffect(() => {
    tabData.length ? handleValueChanged(0) : handleValueChanged(1000);
  }, [tabData]);

  return (
    <>
      <BlankCard>
        <Box sx={{ backgroundColor: (theme) => theme.palette.grey[100] }}>
          <Box display="flex" sx={{ maxWidth: { xs: 320, sm: '100%' } }}>
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              allowScrollButtonsMobile
              aria-label="scrollable prevent tabs example"
            >
              {tabData.map((tab: any, index: number) => {
                return (
                  <Tab
                    iconPosition="start"
                    label={tab.label}
                    sx={{ minHeight: '50px' }}
                    icon={tab.icon}
                    value={index}
                    key={tab.label}
                  />
                );
              })}
            </Tabs>
          </Box>
        </Box>
      </BlankCard>
    </>
  );
};

export default SettingsBanner;
