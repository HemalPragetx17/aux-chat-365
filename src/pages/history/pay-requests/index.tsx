import { Grid } from '@mui/material';

import TransactionHistory from '../../../components/apps/payment/transaction-history/TransactionHistory';
import PageContainer from '../../../components/container/PageContainer';

export default function PaymentLinkHome() {
  return (
    <PageContainer>
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <TransactionHistory />
        </Grid>
      </Grid>
    </PageContainer>
  );
}
