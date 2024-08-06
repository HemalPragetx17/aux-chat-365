import { Box, Tab, Tabs } from '@mui/material';
import { useEffect, useState } from 'react';

import BlankCard from '../shared/BlankCard';

interface CustomBannerProps {
  routeTabs: any;
  handleValueChanged: (index: number) => void;
}

const CustomBanner = (props: CustomBannerProps) => {
  const { routeTabs, handleValueChanged } = props;
  const [value, setValue] = useState<any>(0);
  const [tabData, setTabData] = useState<any>([]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    handleValueChanged(newValue);
  };

  useEffect(() => {
    setTabData(routeTabs);
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

export default CustomBanner;
