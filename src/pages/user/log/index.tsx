import { Grid } from '@mui/material';

import LogList from '../../../components/apps/userprofile/activityLog/LogList';
import ProfileBanner from '../../../components/apps/userprofile/profile/ProfileBanner';
import PageContainer from '../../../components/container/PageContainer';

export default function Followers() {
  return (
    <PageContainer>
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <ProfileBanner />
        </Grid>
        <Grid item sm={12}>
          <LogList />
        </Grid>
      </Grid>
    </PageContainer>
  );
}