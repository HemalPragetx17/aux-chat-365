import React from 'react';
import { Grid } from '@mui/material';

import PlanForm from '../../../../components/apps/management/plan/PlanForm';
import PageContainer from '../../../../components/container/PageContainer';

export default function EmailListPage() {
  return (
    <PageContainer>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <PlanForm />
        </Grid>
      </Grid>
    </PageContainer>
  );
}
