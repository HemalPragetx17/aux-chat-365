import { Icon } from '@iconify/react';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Button,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { Box } from '@mui/system';
import { GridColDef } from '@mui/x-data-grid';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

import { AppState } from '../../../store/Store';
import axios from '../../../utils/axios';
import { ROW_PROPS } from '../../../utils/constant';
import Scrollbar from '../../custom-scroll/Scrollbar';
import CustomCheckbox from '../../custom/CustomCheckbox';
import CustomCloseButton from '../../custom/CustomCloseButton';
import CustomDataGrid from '../../custom/CustomDataGrid';

interface DialogProp {
  open: boolean;
  toggle: () => void;
  selectedChat: any;
}

const ContractTemplateDialog = (props: DialogProp) => {
  const { open, toggle, selectedChat } = props;
  const [data, setData] = useState<any>([]);
  const [subHeader, setSubHeader] = useState<string>('');
  const [currentData, setCurrentData] = useState<any>(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [amount, setAmount] = useState<number | string>('');
  const [ConvenienceFeeActive, setConvenienceFeeActive] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const customizer = useSelector((state: AppState) => state.customizer);
  const [previewMode, setPreviewMode] = useState<boolean>(true);
  const [validationData, setValidationData] = useState<any>([]);

  useEffect(() => {
    if (open) {
      fetchData();
    }
    handleReset();
  }, [open]);

  const fetchData = useCallback(async () => {
    setPaginationModel({ page: 0, pageSize: 10 });
    try {
      const response = await axios.get(`/contract-template?status=ACTIVE`);
      const resp = response.status === 200 ? response.data.data : [];
      setData(resp);
    } catch (e) {
      setData([]);
    }
  }, []);

  const handleDownload = useCallback(async (s3Url: string) => {
    try {
      const response = await fetch(s3Url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'file_name.pdf'); // Set the desired file name
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  }, []);

  const handleReset = () => {
    setCurrentData(null);
    setLoading(false);
    setSubHeader('');
    setAmount('');
    setPreviewMode(false);
    setConvenienceFeeActive(false);
    setValidationData([]);
  };

  const columns: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 100,
      field: 'id',
      filterable: false,
      renderCell: (index) =>
        index.api.getRowIndexRelativeToVisibleRows(index.row.id) + 1,
    },
    {
      flex: 0.5,
      minWidth: 200,
      field: 'title',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row?.title}
          </Typography>
        );
      },
    },
    {
      flex: 0.4,
      minWidth: 180,
      field: 'description',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            <Button
              variant="text"
              onClick={() => handleDownload(row?.contractFile)}
            >
              Download
            </Button>{' '}
            |
            <Button
              variant="text"
              onClick={() => {
                setCurrentData(row);
                setValidationData(row?.requiredField || []);
                setSubHeader(`> ${row?.title}`);
              }}
            >
              Use this template
            </Button>
          </Typography>
        );
      },
    },
  ];

  const handleSubmit = async () => {
    if (validationData?.length > 0) {
      for (let field of validationData) {
        if (!Boolean(field?.value)) {
          toast.error(`Please fill out the value for ${field.label}`);
          return false;
        }
      }
    }

    setLoading(true);
    const payload = {
      fromNumber: selectedChat?.from,
      conversationId: selectedChat?.id,
      contractTemplateId: currentData?.id,
      contactId: selectedChat?.Contact?.id,
      requiredFields: validationData || [],
      status: 'SENT',
      payment: {
        amount,
        ConvenienceFeeActive,
      },
    };
    try {
      await axios.post(`/contracts`, payload);
      toggle();
    } catch (err) {
      setLoading(false);
      toast.error((err as any)?.message || 'API Error! Please tty again');
    }
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
      <DialogTitle>
        Templates
        <Typography variant="caption" ml={1}>
          {subHeader}
        </Typography>
      </DialogTitle>
      <DialogContent>
        {Boolean(subHeader) ? (
          <>
            <FormControlLabel
              label="Preview Your Contract"
              control={
                <CustomCheckbox
                  checked={previewMode}
                  onChange={() => setPreviewMode(!previewMode)}
                />
              }
            />
            {previewMode && (
              <>
                <Alert severity="warning" icon={false} sx={{ mb: 1, mt: 1 }}>
                  Please Note: You are viewing this template in preview mode.
                  You cannot make any changes to this.
                </Alert>
                <Scrollbar
                  sx={{
                    width: '100%',
                    height: '35vH',
                    borderRadius: 1,
                    marginBottom: 10,
                    opacity: '0.5',
                    backgroundColor:
                      customizer?.activeMode === 'light'
                        ? '#efefef'
                        : '#393b48',
                  }}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: currentData?.contractHtml,
                    }}
                    style={{
                      pointerEvents: 'none',
                    }}
                  />
                </Scrollbar>
              </>
            )}
            {currentData?.requiredField?.length > 0 && (
              <Grid
                container
                spacing={2}
                sx={{
                  marginTop: 1,
                  marginBottom: 2,
                  padding: 1,
                }}
              >
                <Grid item xs={12}>
                  <Alert severity="info" icon={false} sx={{ mb: 1, mt: 1 }}>
                    These are the required fields to generate the contract.
                    Please fill them up!
                  </Alert>
                </Grid>
                {currentData.requiredField.map((field: any, index: number) => (
                  <Grid item xs={6} key={index}>
                    <TextField
                      fullWidth
                      value={field?.value}
                      label={field?.label}
                      size="small"
                      autoComplete="off"
                      onChange={(e: any) => {
                        const fields = [...validationData];
                        fields[index].value = e.target?.value;
                        setValidationData(fields);
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            )}

            <Alert severity="success" icon={false} sx={{ m: 1 }}>
              Send Payment Link with this Contract.
            </Alert>
            <Box
              sx={{
                padding: 1,
                marginTop: 1,
                display: 'flex',
              }}
            >
              <TextField
                fullWidth
                type={'number'}
                placeholder="0.00"
                value={amount}
                label={'Amount'}
                size="small"
                onChange={(e: any) => setAmount(e.target.value)}
                onWheel={(e: any) => e.target.blur()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
              <FormControlLabel
                label="Do not send Tech Fee"
                sx={{ width: '100%', ml: 5 }}
                control={
                  <CustomCheckbox
                    checked={ConvenienceFeeActive}
                    onChange={() =>
                      setConvenienceFeeActive(!ConvenienceFeeActive)
                    }
                  />
                }
              />
            </Box>
            <Box mt={1}>
              <Box mt={1}>
                <LoadingButton
                  variant="contained"
                  color="primary"
                  sx={{ mr: 2 }}
                  disabled={loading}
                  loading={loading}
                  onClick={handleSubmit}
                >
                  Attach
                </LoadingButton>
                <Button variant="text" color="primary" onClick={handleReset}>
                  Cancel
                </Button>
              </Box>
            </Box>
          </>
        ) : (
          <CustomDataGrid
            sx={{ mt: 5 }}
            slots={{
              columnHeaders: () => null,
            }}
            autoHeight
            rowHeight={38}
            rows={data}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContractTemplateDialog;
