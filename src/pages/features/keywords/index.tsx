import { Grid } from '@mui/material';
import React, { useCallback } from 'react';

import BlockKeywordList from '../../../components/apps/features/block/BlockKeyword';
import KeywordList from '../../../components/apps/features/keyword/Keyword';
import PageContainer from '../../../components/container/PageContainer';
import CustomBanner from '../../../components/custom/CustomBanner';

export default function Keywords() {
  const [route, setRoute] = React.useState<any>(null);

  const tabs = [
    {
      label: 'Keywords',
    },
    {
      label: 'Blocked-Keywords',
    },
  ];

  const renderView = useCallback(() => {
    switch (route) {
      case 0:
        return <KeywordList />;
      case 1:
        return <BlockKeywordList />;
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
        <Grid item xs={12} mt={5}>
          {renderView()}
        </Grid>
      </Grid>
    </PageContainer>
  );
}
