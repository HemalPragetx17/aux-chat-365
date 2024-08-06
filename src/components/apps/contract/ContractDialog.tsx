import { Icon } from '@iconify/react';
import { DialogContent, IconButton } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { IconDownload } from '@tabler/icons-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import moment from 'moment';
import toast from 'react-hot-toast';

import Scrollbar from '../../custom-scroll/Scrollbar';
import CustomCloseButton from '../../custom/CustomCloseButton';

interface DialogProp {
  open: boolean;
  toggle: () => void;
  currentData: any;
}

const ContractDialog = (props: DialogProp) => {
  const { open, toggle, currentData } = props;

  const handlePDFGenerate = async () => {
    toast.loading('Generating PDF...', { duration: 2000 });
    const input: any = document.getElementById('template_container');
    input.style.paddingLeft = '10px';
    input.style.paddingRight = '10px';

    html2canvas(input, {
      allowTaint: true,
      useCORS: true,
    }).then(async (canvas) => {
      const imgData: any = canvas.toDataURL('image/png');
      const pdf: any = new jsPDF('p', 'mm', 'a4');
      var width = pdf.internal.pageSize.getWidth();
      var height = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'JPEG', 0, 0, width, height);

      if (currentData?.lifecycleAttributesForMerchant?.signedAt) {
        pdf.addPage();
        var img = new Image();
        img.src = '/images/backgrounds/dsc.png';
        var imgWidth = pdf.internal.pageSize.getWidth();
        var imgHeight = pdf.internal.pageSize.getHeight();
        pdf.addImage(img, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.setFontSize(32);
        pdf.text('Digital Signature Certificate', 20, 30);
        pdf.setFontSize(10);
        pdf.text(`Reference Number - ${currentData?.id}`, 20, 40);

        let signature_image: any = document.getElementById('signature_image');
        signature_image = await html2canvas(signature_image);
        signature_image = signature_image.toDataURL('image/png');
        pdf.addImage(signature_image, 'JPEG', 20, 75);

        pdf.setFontSize(10);
        const { signedIp, signedAt } =
          currentData?.lifecycleAttributesForCustomer;
        pdf.text(`IP Address : ${signedIp}`, 20, 115);
        pdf.text(
          `Signed On : ${moment(signedAt).format('MM-DD-YYYY, HH:mm:ss')}`,
          20,
          120,
        );
      }

      pdf.save('download.pdf');
    });
  };

  return (
    <Dialog
      open={open}
      onClose={toggle}
      fullWidth
      maxWidth="md"
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <CustomCloseButton onClick={toggle}>
        <Icon icon={'tabler:x'} width={18} height={18} />
      </CustomCloseButton>
      <DialogContent sx={{ position: 'relative' }}>
        <Scrollbar
          sx={{
            width: '100%',
            height: '80vH',
            borderRadius: 1,
            backgroundColor: 'white',
            color: 'black',
          }}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: currentData?.rawContract,
            }}
            style={{
              pointerEvents: 'none',
            }}
            id="template_container"
          />
        </Scrollbar>
        <IconButton
          sx={{ position: 'absolute', top: 20, right: 30, color: 'black' }}
          onClick={() => {
            handlePDFGenerate();
          }}
        >
          <IconDownload fontSize={16} />
        </IconButton>
      </DialogContent>
    </Dialog>
  );
};

export default ContractDialog;
