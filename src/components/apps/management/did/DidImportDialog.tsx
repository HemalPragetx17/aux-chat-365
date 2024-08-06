import { Icon } from '@iconify/react';
import { LoadingButton } from '@mui/lab';
import { Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import * as yup from 'yup';

import axios from '../../../../utils/axios';
import { PRIMARY_COLOR } from '../../../../utils/constant';
import CustomCloseButton from '../../../custom/CustomCloseButton';
import CustomFileUploadSingle from '../../../custom/CustomFileUploadSingle';

interface DidImportDialogProp {
  open: boolean;
  toggle: () => void;
  success: () => void;
  uid: string;
}

const schema = yup.object().shape({
  title: yup.string().required().max(30),
  phoneNumber: yup.string().required().max(10),
  didProvider: yup.string().required().oneOf(['BANDWIDTH', 'TELNYX']).strict(),
});

const DidImportDialog = (props: DidImportDialogProp) => {
  const { open, toggle, success, uid } = props;
  const [files, setFiles] = useState<any[] | []>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [disabled, setDisalbed] = useState<boolean>(true);

  useEffect(() => {
    if (open) {
      setFiles([]);
      setLoading(false);
      setDisalbed(true);
    }
  }, [open]);

  useEffect(() => {
    const validateFile = async () => {
      const didList = [];
      for (let file of files) {
        const _did = {
          title: file?.title?.toString() || '',
          phoneNumber: file?.phoneNumber?.toString() || '',
          departmentId: '',
          didProvider: file?.didProvider || '',
          didLocationId: [],
          countryCode: '+1',
          isDefault: false,
          status: 'ACTIVE',
          uid,
        };
        if (await schema.isValid(_did)) {
          didList.push(_did);
        }
      }
      setDisalbed(didList.length === 0);
      if (didList.length === 0) {
        toast.error('Upload List is invalid');
      }
    };
    if (files.length) {
      validateFile();
    }
  }, [files]);

  const handleFileUpload = (acceptedFile: File[] | []) => {
    acceptedFile.length ? parseExcel(acceptedFile[0]) : setFiles([]);
  };

  const parseExcel = async (file: any) => {
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onabort = () => toast.error('file reading was aborted');
    reader.onerror = () => toast.error('file reading has failed');
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

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const didList = [];
      for (let file of files) {
        const _did = {
          title: file?.title?.toString() || '',
          phoneNumber: file?.phoneNumber?.toString() || '',
          departmentId: null,
          didProvider: file?.didProvider,
          didLocationId: [],
          countryCode: '+1',
          isDefault: false,
          status: 'ACTIVE',
          uid,
        };
        if (await schema.isValid(_did)) {
          didList.push(_did);
        }
      }

      if (didList.length === 0) {
        toast.error('Upload List is invalid');
        return false;
      }

      const uniqueMap = new Map();
      didList.forEach((did) => {
        uniqueMap.set(did['phoneNumber'], did);
      });

      const list = Array.from(uniqueMap.values());
      const phoneList = list.map((did) => did.phoneNumber);
      const payload = { phone: phoneList };

      const validate_response = await axios.post('/did/validate', payload);
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

      await axios.post('/did/import', { didList: list });
      setLoading(false);
      toast.success('DIDs Imported Successfully!');
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
          <a href="/static/did_list.csv" style={{ color: PRIMARY_COLOR }}>
            here
          </a>{' '}
          to download sample CSV.
        </Typography>
        <br />
        <CustomFileUploadSingle
          handleFileUpload={handleFileUpload}
          text="Upload DID List"
        />
        <LoadingButton
          fullWidth
          loading={loading}
          variant="contained"
          disabled={disabled}
          sx={{ mt: 2 }}
          onClick={handleSubmit}
        >
          Import New DID
        </LoadingButton>
      </DialogContent>
    </Dialog>
  );
};

export default DidImportDialog;
