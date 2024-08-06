import { Grid } from '@mui/material';
import { useCallback, useState } from 'react';

import BillingBanner from '../../components/apps/billing/Banner';
import BillingPayment from '../../components/apps/billing/payment/BillingPayment';
import BillingPlan from '../../components/apps/billing/plan/BillingPlan';
import PlanHistory from '../../components/apps/billing/plan/PlanHistory';
import PageContainer from '../../components/container/PageContainer';

export default function Billing() {
  const [route, setRoute] = useState<any>(null);

  const renderView = useCallback(() => {
    switch (route) {
      case 0:
        return <BillingPlan />;
      case 1:
        return <BillingPayment />;
      case 2:
        return <PlanHistory />;
      default:
        return <></>;
    }
  }, [route]);

  return (
    <PageContainer>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <BillingBanner handleValueChanged={setRoute} />
        </Grid>
        <Grid item xs={12}>
          {renderView()}
        </Grid>
      </Grid>
    </PageContainer>
  );
}
