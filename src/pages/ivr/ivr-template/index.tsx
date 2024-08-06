import { Grid } from '@mui/material';

import IvrTemplate from '../../../components/apps/ivr/template/IvrTemplate';
import PageContainer from '../../../components/container/PageContainer';

export default function SendMessage() {
  return (
    <PageContainer>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <IvrTemplate />
        </Grid>
      </Grid>
    </PageContainer>
  );
}
