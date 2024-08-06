import {
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import {
  IconDotsVertical,
  IconDownload,
  IconEdit,
  IconEye,
  IconRefresh,
  IconShare,
  IconX,
} from '@tabler/icons-react';
import { MouseEvent, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { debounce } from 'lodash';

import { useAuth } from '../../../../hooks/useAuth';
import axios from '../../../../utils/axios';
import { PAYMENT_STATUS, ROW_PROPS } from '../../../../utils/constant';
import { toLocalDate } from '../../../../utils/date';
import CustomDataGrid from '../../../custom/CustomDataGrid';
import CustomTextField from '../../../custom/CustomTextField';
import CreateInvoice from '../../create-invoice/CreateInvoice';

const InvoiceList = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>([]);
  const [total, setTotal] = useState<any>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<any>('');
  const [status, setStatus] = useState<any>('ALL');
  const [selecteData, setSelecteData] = useState<any>(null);
  const [createInvoiceOpen, setCreateInvoiceOpen] = useState(false);
  const [profileData, setProfileData] = useState<any>({});
  const [payload, setPayload] = useState<any>({ page: 0, pageSize: 10 });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`/users/${user?.uid}`);
      const profile = response.status === 200 ? response.data.data : {};
      setProfileData(profile);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [payload]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.post(`/invoice/find-invoice`, payload);
      if (response.status === 200) {
        const { data, total } = response?.data;
        setData(data);
        setTotal(total);
      }
      setLoading(false);
    } catch (e) {
      setData([]);
      setTotal(0);
      setLoading(false);
    }
  }, [payload]);

  useEffect(() => {
    const _payload = { ...payload };
    delete _payload['status'];
    if (status !== 'ALL') {
      _payload.status = status;
    }
    setPayload(_payload);
  }, [status]);

  useEffect(() => {
    if (Boolean(search)) {
      const delayedDispatch = debounce(() => {
        setPayload({ ...payload, searchText: search });
      }, 1000);
      delayedDispatch();
      return () => {
        delayedDispatch.cancel();
      };
    } else {
      setPayload({ ...payload, searchText: '' });
    }
  }, [search]);

  const handleDownloadInvoice = async (row: any) => {
    const response = await fetch(row?.file);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    let invoice_name = `${row?.customerName}-${row?.invoiceNumber}.pdf`;
    link.setAttribute('download', invoice_name);
    document.body.appendChild(link);
    link.click();
  };

  const handleCancelInvoice = async (row: any) => {
    try {
      setLoading(true);
      const response = await axios.delete(`/invoice/${row?.id}`);
      if (response.status === 200 || response.status === 201) {
        toast.success('Invoice Cancelled Successfully');
        fetchData();
      }
    } catch (error) {
      setLoading(false);
      toast.error((error as any)?.message || 'API Error! Please try again.');
    }
  };

  const handleResendInvoice = async (row: any) => {
    try {
      setLoading(true);
      const payload = {
        ...row,
        to: row?.customerPhoneNumber,
        from: row?.companyPhoneNumber,
        sender: user?.name as string,
        isPaid: 'false',
      };
      const response = await axios.post(`/invoice/send-invoice-app`, payload);
      if (response.status === 200 || response.status === 201) {
        toast.success('Invoice Sent Successfully');
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error((error as any)?.message || 'API Error! Please try again.');
    }
  };

  const columns: GridColDef[] = [
    {
      minWidth: 180,
      flex: 0.18,
      headerName: 'Customer Name',
      field: 'customerName',
      filterable: false,
      sortable: false,
      renderCell: ({ row }) => {
        return (
          <Typography sx={{ ...ROW_PROPS }}>{row.customerName}</Typography>
        );
      },
    },
    {
      minWidth: 160,
      flex: 0.18,
      headerName: 'From',
      field: 'companyPhoneNumber',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography sx={{ ...ROW_PROPS }}>
            {row.companyPhoneNumber}
          </Typography>
        );
      },
    },
    {
      minWidth: 160,
      flex: 0.18,
      headerName: 'To',
      field: 'customerPhoneNumber',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography sx={{ ...ROW_PROPS }}>
            {row.customerPhoneNumber}
          </Typography>
        );
      },
    },
    {
      minWidth: 120,
      flex: 0.15,
      headerName: 'Total',
      field: 'total',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography sx={{ ...ROW_PROPS }}>
            ${parseFloat(row.total || 0)}
          </Typography>
        );
      },
    },
    {
      minWidth: 140,
      flex: 0.15,
      headerName: 'Status',
      field: 'status',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        const index: keyof typeof PAYMENT_STATUS = row.status;
        const { name, color } = PAYMENT_STATUS[index];
        return <Chip label={name} color={color as any} size="small" />;
      },
    },
    {
      minWidth: 140,
      flex: 0.15,
      headerName: 'Send Date',
      field: 'createdAt',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography sx={{ ...ROW_PROPS }}>
            {toLocalDate(row.createdAt).format(`MM-DD-YYYY`)}
            <br />
            {toLocalDate(row.createdAt).format(`hh:mm:ss A`)}
          </Typography>
        );
      },
    },
    {
      minWidth: 140,
      flex: 0.15,
      headerName: 'Is Draft',
      field: 'isDraft',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Chip
            label={row.isDraft ? 'YES' : 'NO'}
            color={row.isDraft ? 'success' : 'error'}
            size="small"
          />
        );
      },
    },
    {
      minWidth: 100,
      flex: 0.1,
      headerName: 'Action',
      field: '',
      renderCell: ({ row }: any) => {
        return <RowOptions row={row} />;
      },
    },
  ];

  const RowOptions = (props: any) => {
    const { row } = props;
    const { status, isDraft } = row;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const rowOptionsOpen = Boolean(anchorEl);

    return (
      <>
        <IconButton
          size="small"
          onClick={(event: MouseEvent<HTMLElement>) =>
            setAnchorEl(event.currentTarget)
          }
        >
          <IconDotsVertical />
        </IconButton>
        <Menu
          keepMounted
          anchorEl={anchorEl}
          open={rowOptionsOpen}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{ style: { minWidth: '8rem' } }}
        >
          {isDraft && (
            <MenuItem
              key={'edit'}
              dense
              onClick={() => {
                setCreateInvoiceOpen(true);
                setSelecteData(row);
              }}
              sx={{ '& svg': { mr: 2 } }}
            >
              <IconEdit fontSize={20} />
              Edit
            </MenuItem>
          )}
          <MenuItem
            key={'view'}
            dense
            onClick={() => {
              window.open(row.file, '_blank');
            }}
            sx={{ '& svg': { mr: 2 } }}
          >
            <IconEye fontSize={20} />
            View
          </MenuItem>
          {status === 'PENDING' && [
            <MenuItem
              key={'cancel'}
              dense
              onClick={() => {
                setAnchorEl(null);
                handleCancelInvoice(row);
              }}
              sx={{ '& svg': { mr: 2 } }}
            >
              <IconX fontSize={20} />
              Cancel Request Payment
            </MenuItem>,
            <MenuItem
              key={'resend'}
              dense
              onClick={() => {
                setAnchorEl(null);
                handleResendInvoice(row);
              }}
              sx={{ '& svg': { mr: 2 } }}
            >
              <IconShare fontSize={20} />
              Resend Invoice
            </MenuItem>,
          ]}
          <MenuItem
            key={'download'}
            dense
            onClick={() => {
              handleDownloadInvoice(row);
            }}
            sx={{ '& svg': { mr: 2 } }}
          >
            <IconDownload fontSize={20} />
            Download
          </MenuItem>
        </Menu>
      </>
    );
  };

  return (
    <>
      <Grid container direction="row" alignItems="center" spacing={3}>
        <Grid item md={3} sm={6} xs={12}>
          <FormControl fullWidth>
            <CustomTextField
              value={search}
              label="Search"
              onChange={(event: any) => setSearch(event?.target?.value)}
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="refresh"
                      size="small"
                      onClick={() => setSearch('')}
                    >
                      <IconX />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
        </Grid>
        <Grid item md={3} sm={6} xs={12}>
          <FormControl size="small" fullWidth>
            <InputLabel id="type-select">Status</InputLabel>
            <Select
              id="select-type"
              label="Status"
              labelId="type-select"
              value={status}
              onChange={(event: any) => setStatus(event?.target?.value)}
              inputProps={{ placeholder: 'Status' }}
            >
              <MenuItem value={'ALL'}>ALL</MenuItem>
              <MenuItem value={'PENDING'}>Pending</MenuItem>
              <MenuItem value={'RECEIVED'}>Received</MenuItem>
              <MenuItem value={'CANCELLED'}>Cancelled</MenuItem>
              <MenuItem value={'FAILED'}>Failed</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid
          item
          sm={6}
          xs={12}
          justifyContent={{ xs: 'left', sm: 'right' }}
          display={'flex'}
        >
          <IconButton
            aria-label="refresh"
            size="small"
            onClick={() => {
              setStatus('ALL');
              setSearch('');
              setPayload({ page: 0, pageSize: 10 });
            }}
          >
            <IconRefresh />
          </IconButton>
        </Grid>
      </Grid>
      <CustomDataGrid
        sx={{ mt: 5 }}
        autoHeight
        rowHeight={50}
        rows={data}
        rowCount={total}
        paginationMode="server"
        columns={columns}
        loading={loading}
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]}
        paginationModel={{ page: payload.page, pageSize: payload.pageSize }}
        onPaginationModelChange={(event: any) => {
          setPayload({ ...payload, ...event });
        }}
      />
      {createInvoiceOpen && (
        <CreateInvoice
          toggle={() => setCreateInvoiceOpen(!createInvoiceOpen)}
          open={createInvoiceOpen}
          profileData={profileData}
          SelecteData={selecteData}
          setSelecteData={setSelecteData}
        />
      )}
    </>
  );
};

export default InvoiceList;
