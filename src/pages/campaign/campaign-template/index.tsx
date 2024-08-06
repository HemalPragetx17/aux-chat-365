import { Grid } from '@mui/material';

import CampaignTemplate from '../../../components/apps/campaign/template/CampaignTemplate';
import PageContainer from '../../../components/container/PageContainer';

export default function Settings() {
  return (
    <PageContainer>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <CampaignTemplate />
        </Grid>
      </Grid>
    </PageContainer>
  );
}
