import { Grid } from '@mui/material';

import IvrList from '../../components/apps/ivr/home/IvrList';
import PageContainer from '../../components/container/PageContainer';

export default function Campaign() {
  return (
    <PageContainer>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <IvrList />
        </Grid>
      </Grid>
    </PageContainer>
  );
}
