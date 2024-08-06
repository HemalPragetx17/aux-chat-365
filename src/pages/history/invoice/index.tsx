import { Grid } from '@mui/material';

import InvoiceList from '../../../components/apps/payment/invoice/InvoiceList';
import PageContainer from '../../../components/container/PageContainer';

export default function PaymentLinkHome() {
  return (
    <PageContainer>
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <InvoiceList />
        </Grid>
      </Grid>
    </PageContainer>
  );
}
