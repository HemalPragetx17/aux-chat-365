import { Grid } from '@mui/material';

import BlockKeywordList from '../../../components/apps/features/block/BlockKeyword';
import PageContainer from '../../../components/container/PageContainer';

export default function Keywords() {
  return (
    <PageContainer>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <BlockKeywordList />
        </Grid>
      </Grid>
    </PageContainer>
  );
}
