import { Grid } from '@mui/material';
import Image from 'next/image';
import { useEffect } from 'react';

const FacebookForm = () => {
  useEffect(() => {
    // API Call
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid
        item
        xs={12}
        textAlign={'center'}
        position={'relative'}
        height={300}
      >
        <Image
          fill={true}
          src="/images/backgrounds/website-under-construction.png"
          alt={'construction'}
        />
      </Grid>
    </Grid>
  );
};

export default FacebookForm;
