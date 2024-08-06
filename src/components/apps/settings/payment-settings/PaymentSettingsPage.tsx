import { Grid } from '@mui/material';

import PageContainer from '../../../container/PageContainer';

import MerchantForm from './MerchantForm';

export default function PaymentSettingsPage() {
  return (
    <PageContainer>
      <Grid container spacing={3}>
        <Grid item sm={12} xs={12} md={7}>
          <MerchantForm />
        </Grid>
      </Grid>
    </PageContainer>
  );
}
