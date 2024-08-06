import { Grid } from '@mui/material';

import EmailManagementList from '../../../components/apps/email/EmailManagementList';
import PageContainer from '../../../components/container/PageContainer';

export default function EmailListPage() {
  return (
    <PageContainer>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <EmailManagementList />
        </Grid>
      </Grid>
    </PageContainer>
  );
}
