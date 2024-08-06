import { Grid } from '@mui/material';

import PasswordForm from '../../../components/apps/admin-settings/PasswordForm';
import PageContainer from '../../../components/container/PageContainer';

export default function AdminPassword() {
  return (
    <PageContainer>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <PasswordForm />
        </Grid>
      </Grid>
    </PageContainer>
  );
}
