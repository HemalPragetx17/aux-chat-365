import { Grid } from '@mui/material';

import SendMessageForm from '../../../components/apps/campaign/send-message/SendMessage';
import PageContainer from '../../../components/container/PageContainer';

export default function SendMessage() {
  return (
    <PageContainer>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <SendMessageForm />
        </Grid>
      </Grid>
    </PageContainer>
  );
}
