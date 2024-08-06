import { Grid } from '@mui/material';

import GroupContactList from '../../../components/apps/contacts/groups/GroupContactList';
import PageContainer from '../../../components/container/PageContainer';

export default function Settings() {
  return (
    <PageContainer>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <GroupContactList />
        </Grid>
      </Grid>
    </PageContainer>
  );
}
