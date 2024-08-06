import { Box, Tab, Tabs } from '@mui/material';
import {
  IconCreditCard,
  IconFileInvoice,
  IconReceipt2,
} from '@tabler/icons-react';
import { SyntheticEvent, useEffect, useState } from 'react';

import BlankCard from '../../shared/BlankCard';

interface BannerProps {
  handleValueChanged: (index: number) => void;
}

const BillingBanner = (props: BannerProps) => {
  const { handleValueChanged } = props;
  const [value, setValue] = useState<any>(0);
  const [tabData, setTabData] = useState<any>([]);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
    handleValueChanged(newValue);
  };

  const SettingTabs = [
    {
      label: 'Plans',
      icon: <IconReceipt2 size="20" />,
      to: '/billing/plans',
    },
    {
      label: 'Payment Options',
      icon: <IconCreditCard size="20" />,
      to: '/billing/payment',
    },
    {
      label: 'Plan History',
      icon: <IconFileInvoice size="20" />,
      to: '/billing/history',
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

export default BillingBanner;
