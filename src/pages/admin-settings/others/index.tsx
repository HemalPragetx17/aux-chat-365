import { Grid } from '@mui/material';

import OtherForm from '../../../components/apps/admin-settings/OtherForm';
import PageContainer from '../../../components/container/PageContainer';

export default function AdminOthers() {
  return (
    <PageContainer>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <OtherForm />
        </Grid>
      </Grid>
    </PageContainer>
  );
}
