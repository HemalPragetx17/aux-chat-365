// ** Next Import
import { AnyNaptrRecord } from 'dns';

import { LoadingButton } from '@mui/lab';
import Box, { BoxProps } from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Link from 'next/link';

// ** MUI Imports

// ** Icon Imports


interface Props {
  invoiceStore: any;
}

const OptionsWrapper = styled(Box)<BoxProps>(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const AddActions = (props: Props) => {
  // ** Props
  const { invoiceStore } = props;

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <LoadingButton
          fullWidth
          variant="contained"
          type="submit"
          // loading={invoiceStore.isLoading}
          sx={{
            mb: 2,
            '& svg': { mr: 2 },
            maxWidth: '8rem',
            float: 'right',
            marginRight: '4rem',
          }}
        >
          Save
        </LoadingButton>
      </Grid>
    </Grid>
  );
};

export default AddActions;
