import { TableContainer } from '@mui/material';
import Alert from '@mui/material/Alert';
import Box, { BoxProps } from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import { styled, useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

import { InvoiceLayoutProps } from '../../../../types/apps/invoiceTypes';

const CalcWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(2),
  },
}));

const PrintPage = ({ invoiceData }: InvoiceLayoutProps) => {
  const theme = useTheme();

  useEffect(() => {
    setTimeout(() => {
      window.print();
    }, 1000);
  }, []);

  if (invoiceData) {
    return (
      <Box sx={{ p: 12, pb: 6 }}>
        <Grid container>
          <Grid item xs={8} sx={{ mb: { sm: 0, xs: 4 } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 6,
                }}
              >
                <Image
                  src={`/images/logos/logo.png`}
                  alt="Logo"
                  width={50}
                  height={50}
                />
                {invoiceData.invoiceNumber && (
                  <Box>
                    <Typography
                      sx={{ color: 'text.secondary', fontSize: '2rem' }}
                    >
                      #{invoiceData.invoiceNumber}
                    </Typography>
                  </Box>
                )}
              </Box>
              <div>
                <Typography sx={{ mb: 2, color: 'text.secondary' }}>
                  {invoiceData?.companyName}
                </Typography>
                <Typography
                  sx={{ color: 'text.secondary' }}
                >{`${invoiceData?.companyPhoneNumber}`}</Typography>
                <Typography sx={{ mb: 2, color: 'text.secondary' }}>
                  {moment(invoiceData?.createdAt).format('MM-DD-YYYY')}
                </Typography>
              </div>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: (theme) => `${theme.spacing(6)} !important` }} />

        <Grid container>
          <Grid item xs={7} md={8} sx={{ mb: { lg: 0, xs: 4 } }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {invoiceData?.customerName}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {invoiceData?.customerPhoneNumber}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {invoiceData?.customerEmail}
            </Typography>
          </Grid>
        </Grid>

        <Divider
          sx={{
            mt: (theme) => `${theme.spacing(6)} !important`,
            mb: '0 !important',
          }}
        />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Price / Hr</TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                '& .MuiTableCell-root': {
                  fontSize: '1rem',
                  py: `${theme.spacing(2.5)} !important`,
                },
              }}
            >
              {invoiceData.items?.map((item: any, index: number) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{item.name || ''}</TableCell>
                    <TableCell>$ {item.cost || 0}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Grid container mt={8}>
          <Grid item xs={8} sm={7} lg={9}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 2, fontWeight: 600 }}>
                Signature:
              </Typography>
              <Typography variant="body2">
                {invoiceData?.companyName}
              </Typography>
            </Box>

            {/* <Typography variant='body2'>{invoiceData.message}</Typography> */}
          </Grid>
          <Grid item xs={4} sm={5} lg={3}>
            <CalcWrapper>
              <Typography variant="body2">Subtotal:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                ${invoiceData?.subtotal}
              </Typography>
            </CalcWrapper>
            <CalcWrapper>
              <Typography variant="body2">Tax:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {invoiceData?.tax}%
              </Typography>
            </CalcWrapper>
            <Divider />
            <CalcWrapper>
              <Typography variant="body2">Total:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                ${invoiceData?.total}
              </Typography>
            </CalcWrapper>
          </Grid>
        </Grid>
      </Box>
    );
  } else {
    return (
      <Box sx={{ p: 2 }}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Alert severity="error">
              This invoice does not exist. Please check the list of
              invoiceDatas: <Link href="/invoice/list">Invoice List</Link>
            </Alert>
          </Grid>
        </Grid>
      </Box>
    );
  }
};

export default PrintPage;
