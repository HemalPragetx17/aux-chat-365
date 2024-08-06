import { Icon } from '@iconify/react';
import { LoadingButton } from '@mui/lab';
import { Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import * as yup from 'yup';

import { useAuth } from '../../../../hooks/useAuth';
import axios from '../../../../utils/axios';
import { PRIMARY_COLOR } from '../../../../utils/constant';
import CustomCloseButton from '../../../custom/CustomCloseButton';
import CustomFileUploadSingle from '../../../custom/CustomFileUploadSingle';

interface ContactImportDialogProp {
  open: boolean;
  toggle: () => void;
  success: () => void;
}

const customFields = {
  labelOne: 'Custom Field Label 1',
  valueOne: '',
  labelTwo: 'Custom Field Label 2',
  valueTwo: '',
  labelThree: 'Custom Field Label 3',
  valueThree: '',
};

const contactSchema = yup.object().shape({
  email: yup.string().email('Enter Valid Email Address'),
  phone: yup.string().required('Phone Number is required field'),
});

const ContactImportDialog = (props: ContactImportDialogProp) => {
  const { open, toggle, success } = props;
  const [files, setFiles] = useState<any[] | []>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    if (open) {
      setFiles([]);
      setLoading(false);
    }
  }, [open]);

  const handleFileUpload = (acceptedFile: File[] | []) => {
    acceptedFile.length ? parseExcel(acceptedFile[0]) : setFiles([]);
  };

  const parseExcel = async (file: any) => {
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');
    reader.onload = (e) => {
      const bstr = e?.target?.result;
      const workbook = XLSX.read(bstr, { type: rABS ? 'binary' : 'array' });
      const sheet_name_list = workbook.SheetNames;
      const fileData: any = XLSX.utils.sheet_to_json(
        workbook.Sheets[sheet_name_list[0]],
      );
      setFiles(fileData);
    };
    if (rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
  };

  const handleSubmit = async (type: 'overwrite' | 'new') => {
    try {
      setLoading(true);
      const contacts = [];
      for (let file of files) {
        const {
          firstName,
          lastName,
          email,
          phone,
          company,
          jobTitle,
          street,
          city,
          state,
          zip,
          serviceName,
          contactType,
        } = file;
        const contact = {
          firstName: firstName?.toString() || '',
          lastName: lastName?.toString() || '',
          email: email?.toString() || '',
          phone: phone?.toString(),
          company: company?.toString() || '',
          jobTitle: jobTitle?.toString() || '',
          address: {
            street: street?.toString() || '',
            city: city?.toString() || '',
            state: state?.toString() || '',
            zip: zip?.toString() || '',
          },
          status: 'ACTIVE',
          customFields,
          image: null,
          createdById: user?.uid,
          serviceName: serviceName?.toString() || null,
          contactType: contactType?.toString() || null,
        };
        if (await contactSchema.isValid(contact)) {
          contacts.push(contact);
        }
      }

      const uniqueMap = new Map();
      let phoneList: any = new Map();
      contacts.forEach((item) => {
        uniqueMap.set(item['phone'], item);
        phoneList.set(item['phone'], item.phone);
      });

      const contactList = Array.from(uniqueMap.values());
      phoneList = Array.from(phoneList.values());
      const payload = { phone: phoneList };

      if (type === 'new') {
        const validate_response = await axios.post(
          '/contact/validate',
          payload,
        );
        const duplicate_array = validate_response?.data?.data;
        if (duplicate_array.length > 0) {
          toast.error(
            `Phone number (${duplicate_array.join(
              ',',
            )}) already exist in database!`,
          );
          setLoading(false);
          return false;
        }
      }

      await axios.post('/contact/import', {
        contact: contactList,
        type,
      });
      setLoading(false);
      toast.success('Contacts Imported Successfully!');
      success();
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={toggle}
      fullWidth
      maxWidth="xs"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <CustomCloseButton onClick={toggle}>
        <Icon icon={'tabler:x'} width={18} height={18} />
      </CustomCloseButton>
      <DialogContent>
        <Typography variant="caption">
          Click&nbsp;
          <a href="/static/contact_list.csv" style={{ color: PRIMARY_COLOR }}>
            here
          </a>{' '}
          to download sample CSV.
        </Typography>
        <br />
        <CustomFileUploadSingle
          handleFileUpload={handleFileUpload}
          text="Upload Contact List"
        />
        <LoadingButton
          fullWidth
          loading={loading}
          variant="contained"
          disabled={files.length === 0}
          sx={{ marginY: 2 }}
          onClick={() => handleSubmit('overwrite')}
        >
          Overwrite Existing Contacts
        </LoadingButton>
        <LoadingButton
          fullWidth
          loading={loading}
          variant="outlined"
          disabled={files.length === 0}
          sx={{ mb: 2 }}
          onClick={() => handleSubmit('new')}
        >
          Import New Contacts
        </LoadingButton>
      </DialogContent>
    </Dialog>
  );
};

export default ContactImportDialog;
