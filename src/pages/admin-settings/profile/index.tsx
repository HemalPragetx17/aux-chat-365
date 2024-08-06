import { Grid } from '@mui/material';

import ProfileForm from '../../../components/apps/admin-settings/ProfileForm';
import PageContainer from '../../../components/container/PageContainer';

export default function AdminProfile() {
  return (
    <PageContainer>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ProfileForm />
        </Grid>
      </Grid>
    </PageContainer>
  );
}
