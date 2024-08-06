import { Grid } from '@mui/material';

import BatchUpload from '../../../components/apps/payment/batch-upload/BatchUpload';
import PageContainer from '../../../components/container/PageContainer';

export default function BatchUploadHome() {
  return (
    <PageContainer>
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <BatchUpload />
        </Grid>
      </Grid>
    </PageContainer>
  );
}
