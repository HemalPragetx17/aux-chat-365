import { Grid } from '@mui/material';
import React, { useCallback } from 'react';

import GeneralAutoReply from '../../components/apps/features/auto-replies/GeneralAutoReply';
import OfficeHourAutoReply from '../../components/apps/features/auto-replies/OfficeHourAutoReply';
import PageContainer from '../../components/container/PageContainer';
import CustomBanner from '../../components/custom/CustomBanner';

export default function Features() {
  const [route, setRoute] = React.useState<any>(null);

  const tabs = [
    {
      label: 'Office Hour Auto Replies',
    },
    // {
    //   label: 'General Auto Replies',
    // },
  ];

  const renderView = useCallback(() => {
    switch (route) {
      case 0:
        return <OfficeHourAutoReply />;
      case 1:
        return <GeneralAutoReply />;
      default:
        return <></>;
    }
  }, [route]);

  return (
    <PageContainer>
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <CustomBanner handleValueChanged={setRoute} routeTabs={tabs} />
        </Grid>
        <Grid item xs={12}>
          {renderView()}
        </Grid>
      </Grid>
    </PageContainer>
  );
}
