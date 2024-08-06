import { Grid } from '@mui/material';

import TemplateList from '../../../components/apps/features/template/Template';
import PageContainer from '../../../components/container/PageContainer';

export default function Templates() {
  return (
    <PageContainer>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TemplateList />
        </Grid>
      </Grid>
    </PageContainer>
  );
}
