import { LoadingButton } from '@mui/lab';
import Grid from '@mui/material/Grid';

interface Props {
  invoiceStore: any;
  id: string | undefined;
  toggleAddPaymentDrawer: () => void;
  toggleSendInvoiceDrawer: () => void;
}

const EditActions = ({ invoiceStore }: Props) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <LoadingButton
          fullWidth
          variant="contained"
          type="submit"
          loading={invoiceStore?.isLoading}
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

export default EditActions;
