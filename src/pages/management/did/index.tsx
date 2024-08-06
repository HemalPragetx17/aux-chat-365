import { Grid } from '@mui/material';

import DidManagementList from '../../../components/apps/management/did/DidManagementList';
import PageContainer from '../../../components/container/PageContainer';

export default function DidListPage() {
  return (
    <PageContainer>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <DidManagementList />
        </Grid>
      </Grid>
    </PageContainer>
  );
}
