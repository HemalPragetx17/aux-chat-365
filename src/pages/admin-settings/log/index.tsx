import { Grid } from '@mui/material';

import LoginLogList from '../../../components/apps/admin-settings/LoginLogList';
import PageContainer from '../../../components/container/PageContainer';

export default function AdminLogs() {
  return (
    <PageContainer>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <LoginLogList />
        </Grid>
      </Grid>
    </PageContainer>
  );
}
