import { Icon } from '@iconify/react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import { Fragment, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import DropzoneWrapper from '../../wrappers/DropzoneWrapper';

interface FileProp {
  name: string;
  type: string;
  size: number;
  key?: string;
  src?: string;
}

interface ComponentProp {
  handleFileUpload: (file: File[]) => void;
  text: string;
}

const CustomFileUploadSingle = (props: ComponentProp) => {
  const [files, setFiles] = useState<File[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const { handleFileUpload, text } = props;

  useEffect(() => {
    handleFileUpload(files);
  }, [files]);

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'text/xlsx': ['.xlsx', '.xlsm', '.xlsb', '.csv', '.xls'],
    },
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)));
      setErrorMsg('');
    },
    onDropRejected: () => {
      setErrorMsg('File Format Not Supported');
    },
  });

  const renderFilePreview = () => {
    return <Icon icon="tabler:file-description" />;
  };

  const fileList = files?.map((file: FileProp) => (
    <ListItem key={file.name}>
      <div className="file-details">
        <div className="file-preview">{renderFilePreview()}</div>
        <div>
          <Typography className="file-name">{file.name}</Typography>
          <Typography className="file-size" variant="body2">
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => setFiles([])}>
        <Icon icon="tabler:x" fontSize={20} />
      </IconButton>
    </ListItem>
  ));

  return (
    <DropzoneWrapper>
      <Fragment>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <Box
            sx={{
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2.5 }}>
              {text}
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '12px' }}>
              Allowed *.xlsx, *.xlsm, *.xlsb, *.csv, *.xls
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '12px' }}>
              Format should match the example template
            </Typography>
          </Box>
        </div>
        {files.length > 0 && (
          <Fragment>
            <List>{fileList}</List>
          </Fragment>
        )}
      </Fragment>
      <Typography variant="body2" color="error.main">
        {errorMsg}
      </Typography>
    </DropzoneWrapper>
  );
};

export default CustomFileUploadSingle;
