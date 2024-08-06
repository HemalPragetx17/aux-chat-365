import { Grid } from '@mui/material';
import React, { useCallback } from 'react';

import GoogleReview from '../../components/apps/reviews/GoogleReview';
import NegativeReview from '../../components/apps/reviews/NegativeReview';
import YelpReview from '../../components/apps/reviews/YelpReview';
import PageContainer from '../../components/container/PageContainer';
import CustomBanner from '../../components/custom/CustomBanner';

export default function Reviews() {
  const [route, setRoute] = React.useState<any>(null);

  const tabs = [
    {
      label: 'Google',
    },
    {
      label: 'Yelp',
    },
    {
      label: 'Negative',
    },
  ];

  const renderView = useCallback(() => {
    switch (route) {
      case 0:
        return <GoogleReview />;
      case 1:
        return <YelpReview />;
      case 2:
        return <NegativeReview />;
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
