import { Icon } from '@iconify/react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import moment from 'moment';
import Link from 'next/link';

import { InvoiceType } from '../../../../types/apps/invoiceTypes';
import InvoicePDF from '../../../pdf/InvoicePDF';

interface Props {
  data: InvoiceType;
  id: string | undefined;
  toggleAddPaymentDrawer: () => void;
  toggleSendInvoiceDrawer: () => void;
}

const PreviewActions = ({ data, id, toggleSendInvoiceDrawer }: Props) => {
  // ** Hooks
  const handleDownloadFullReport = async () => {
    if (Boolean(data)) {
      const blob = await pdf(<InvoicePDF data={data} />)?.toBlob();
      saveAs(
        blob,
        `${data?.customerName || 'customer'}_InvoiceReport_${moment().format(
          'MM-DD-YYYY-HH-mm-ss',
        )}`,
      );
    }
  };

  return (
    <>
      <Card>
        <CardContent>
          {data?.status === 'PENDING' && (
            <Button
              fullWidth
              variant="contained"
              onClick={toggleSendInvoiceDrawer}
              sx={{ mb: 2, '& svg': { mr: 2 } }}
            >
              <Icon fontSize="1.125rem" icon="tabler:send" />
              Send Invoice
            </Button>
          )}
          <Button
            onClick={handleDownloadFullReport}
            fullWidth
            sx={{ mb: 2 }}
            color="secondary"
            variant="outlined"
          >
            Download
          </Button>
          <Button
            fullWidth
            sx={{ mb: 2 }}
            target="_blank"
            component={Link}
            color="secondary"
            variant="outlined"
            href={`/invoice/print/`}
            onClick={async () => {
              id && localStorage.setItem('invoiceId', id?.toString());
            }}
          >
            Print
          </Button>
          {/* <Button
            fullWidth
            sx={{ mb: 2 }}
            component={Link}
            color='secondary'
            variant='outlined'
            href={`/apps/invoice/edit`}
            onClick={async () => {
              id && (await dispatch(setInvoiceId(id)))
            }}
          >
            Edit Invoice
          </Button> */}
        </CardContent>
      </Card>
    </>
  );
};

export default PreviewActions;
