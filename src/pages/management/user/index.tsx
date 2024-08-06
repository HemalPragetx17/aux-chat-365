import { Grid } from '@mui/material';

import AccountList from '../../../components/apps/management/account/AccountList';
import PageContainer from '../../../components/container/PageContainer';

export default function AccountListPage() {
  return (
    <PageContainer>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <AccountList />
        </Grid>
      </Grid>
    </PageContainer>
  );
}
