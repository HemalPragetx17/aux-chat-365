import { Icon } from '@iconify/react';
import { DialogContent } from '@mui/material';
import Dialog from '@mui/material/Dialog';

import CustomCloseButton from '../../custom/CustomCloseButton';

interface DialogProp {
  open: boolean;
  toggle: () => void;
  currentData: string;
}

const InvoiceNotificationDialog = (props: DialogProp) => {
  const { open, toggle, currentData } = props;

  return (
    <Dialog
      open={open}
      onClose={toggle}
      fullWidth
      maxWidth="md"
      sx={{ '& .MuiDialog-paper': { minHeight: 600, overflow: 'visible' } }}
    >
      <CustomCloseButton onClick={toggle}>
        <Icon icon={'tabler:x'} width={18} height={18} />
      </CustomCloseButton>
      <DialogContent sx={{ position: 'relative' }}>
        <iframe
          src={currentData}
          style={{ border: 'none', width: '100%', minHeight: '600px' }}
          title="PDF Viewer"
        />
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceNotificationDialog;
