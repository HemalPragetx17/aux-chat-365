import { Grid } from '@mui/material';

import PageContainer from '../../components/container/PageContainer';
import PhoneList from '../../components/phone/PhoneListing';

export default function Product() {
  return (
    <PageContainer>
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ mt: 1 }}>
          <PhoneList />
        </Grid>
      </Grid>
    </PageContainer>
  );
}
