import { Grid } from '@mui/material';

import ContractList from '../../../components/apps/payment/contracts/ContractList';
import PageContainer from '../../../components/container/PageContainer';

export default function PaymentLinkHome() {
  return (
    <PageContainer>
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <ContractList />
        </Grid>
      </Grid>
    </PageContainer>
  );
}
