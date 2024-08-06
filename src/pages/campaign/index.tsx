import { Grid } from '@mui/material';

import CampaignList from '../../components/apps/campaign/home/Campaign';
import PageContainer from '../../components/container/PageContainer';

export default function Campaign() {
  return (
    <PageContainer>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <CampaignList />
        </Grid>
      </Grid>
    </PageContainer>
  );
}
