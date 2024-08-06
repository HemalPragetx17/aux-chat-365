import { Grid } from '@mui/material';

import VtTransactionHistory from '../../../components/apps/payment/vtTransactionHistory/VtTransactionHistory';
import PageContainer from '../../../components/container/PageContainer';

export default function PaymentLinkHome() {
  return (
    <PageContainer>
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <VtTransactionHistory />
        </Grid>
      </Grid>
    </PageContainer>
  );
}
