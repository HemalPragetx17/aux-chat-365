import React from 'react';
import { Grid } from '@mui/material';

import PlanList from '../../../components/apps/management/plan/PlanList';
import PageContainer from '../../../components/container/PageContainer';

export default function EmailListPage() {
  return (
    <PageContainer>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <PlanList />
        </Grid>
      </Grid>
    </PageContainer>
  );
}
