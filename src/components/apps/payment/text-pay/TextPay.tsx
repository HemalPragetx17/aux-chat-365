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
  IconBell,
  IconDotsVertical,
  IconEye,
  IconRefresh,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import { MouseEvent, useCallback, useEffect, useState } from 'react';

import { PAYMENT_STATUS, ROW_PROPS } from '../../../../utils/constant';
import { toLocalDate } from '../../../../utils/date';
import CustomDataGrid from '../../../custom/CustomDataGrid';
import CustomPickerRange from '../../../custom/CustomPickerRange';
import CustomTextField from '../../../custom/CustomTextField';

const TextPay = () => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState<any>('');
  const [status, setStatus] = useState<any>('ALL');
  const [date, setDate] = useState<any>([]);

  useEffect(() => {
    fetchData();
  }, [date, status, search]);

  const fetchData = useCallback(async () => {
    setData([
      {
        id: 58721,
        admin_id: 21,
        payment_id: '25832a3f-6e43-4b2e-a1d6-4509ac6f48d8',
        payment_direction: 'OUT',
        ref: '44512',
        amount: '100.00',
        totel: '100.00',
        to: '6',
        content_name: 'Jordan',
        from: '7024781111',
        out_created_at: '2023-06-26T19:15:01.000000Z',
        payment_status: 0,
        status: 0,
        paymenttype: '1',
        createdby: 'netone',
        customername: null,
        reminder: '',
        in_created_at: '',
      },
      {
        id: 57773,
        admin_id: 21,
        payment_id: '3599aed9-028e-4b7f-9928-606e6c5b7136',
        payment_direction: 'OUT',
        ref: '458669',
        amount: '100.00',
        totel: '100.00',
        to: '7',
        content_name: 'Jim Verizon',
        from: '7024781111',
        out_created_at: '2023-06-21T15:40:13.000000Z',
        payment_status: 0,
        status: 0,
        paymenttype: '1',
        createdby: 'netone',
        customername: null,
        reminder: '2023-09-29T15:07:27.000000Z',
        in_created_at: '',
      },
      {
        id: 57617,
        admin_id: 21,
        payment_id: 'c12cdde6-f520-4b0a-9e9c-bbb5b0bc894f',
        payment_direction: 'OUT',
        ref: '2234',
        amount: '100.00',
        totel: '100.00',
        to: '4',
        content_name: 'Cole D',
        from: '7024781111',
        out_created_at: '2023-06-20T23:38:39.000000Z',
        payment_status: 0,
        status: 0,
        paymenttype: '1',
        createdby: 'netone',
        customername: null,
        reminder: '',
        in_created_at: '',
      },
      {
        id: 56655,
        admin_id: 21,
        payment_id: 'd8e14a9f-2a2a-4698-992b-32cab24ac478',
        payment_direction: 'OUT',
        ref: '61323',
        amount: '226.93',
        totel: '234.87',
        to: '3',
        content_name: 'Scott ',
        from: '7024781111',
        out_created_at: '2023-06-13T21:34:45.000000Z',
        payment_status: 1,
        status: 1,
        paymenttype: '1',
        createdby: 'netone',
        customername: 'Gregory king ',
        reminder: '2023-06-14T15:50:56.000000Z',
        in_created_at: '2023-06-14T15:57:13.000000Z',
      },
      {
        id: 55997,
        admin_id: 21,
        payment_id: 'acbcbb45-0b1a-439a-b837-dda1d7935635',
        payment_direction: 'OUT',
        ref: '4875757',
        amount: '20.00',
        totel: '20.00',
        to: '7',
        content_name: 'Jim Verizon',
        from: '7024781111',
        out_created_at: '2023-06-06T18:12:09.000000Z',
        payment_status: 0,
        status: 0,
        paymenttype: '1',
        createdby: 'netone',
        customername: null,
        reminder: '',
        in_created_at: '',
      },
    ]);
  }, [date, status, search]);

  const columns: GridColDef[] = [
    {
      minWidth: 140,
      headerName: 'Created By',
      field: 'createdby',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography sx={{ ...ROW_PROPS }}>
            {Boolean(row.createdby) ? row.createdby : '-'}
          </Typography>
        );
      },
    },
    {
      minWidth: 140,
      headerName: 'From',
      field: 'to',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography sx={{ ...ROW_PROPS }}>
            {Boolean(row.to) ? (row.to.id ? row.to.id : row.to) : '-'}
            {row.content_name ? '(' + row.content_name + ')' : ''}
          </Typography>
        );
      },
    },
    {
      minWidth: 120,
      headerName: 'Type',
      field: 'type',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row.paymenttype == '0'
              ? '-'
              : row.paymenttype == '1'
              ? 'Sale'
              : 'Auth Only'}
          </Typography>
        );
      },
    },
    {
      minWidth: 240,
      headerName: 'PO/Invoice/ Trans No.',
      field: 'po',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography sx={{ ...ROW_PROPS }}>
            {Boolean(row.ref) ? row.ref : '-'}
          </Typography>
        );
      },
    },
    {
      minWidth: 200,
      headerName: 'Customer Name',
      field: 'customername',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography sx={{ ...ROW_PROPS }}>{row.customername}</Typography>
        );
      },
    },
    {
      minWidth: 120,
      headerName: 'Amount',
      field: 'amount',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography sx={{ ...ROW_PROPS }}>
            {row.amount == '' || row.amount == null ? '-' : '$' + row.amount}
          </Typography>
        );
      },
    },
    {
      minWidth: 120,
      headerName: 'Total',
      field: 'totel',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography sx={{ ...ROW_PROPS }}>
            {row.totel == '' || row.totel == null ? '---' : '$' + row.totel}
          </Typography>
        );
      },
    },
    {
      minWidth: 160,
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
      headerName: 'Send Date',
      field: 'out_created_at',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography sx={{ ...ROW_PROPS }}>
            {toLocalDate(row.out_created_at).format(`MM-DD-YYYY`)}
            <br />
            {toLocalDate(row.out_created_at).format(`hh:mm:ss A`)}
          </Typography>
        );
      },
    },
    {
      minWidth: 200,
      headerName: 'Reminder Date',
      field: 'reminder',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography sx={{ ...ROW_PROPS }}>
            {Boolean(row.reminder) && (
              <>
                {toLocalDate(row.reminder).format(`MM-DD-YYYY`)}
                <br />
                {toLocalDate(row.reminder).format(`hh:mm:ss A`)}
              </>
            )}
          </Typography>
        );
      },
    },
    {
      minWidth: 200,
      headerName: 'Payment Date',
      field: 'in_created_at',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography sx={{ ...ROW_PROPS }}>
            {Boolean(row.in_created_at) && (
              <>
                {toLocalDate(row.in_created_at).format(`MM-DD-YYYY`)}
                <br />
                {toLocalDate(row.in_created_at).format(`hh:mm:ss A`)}
              </>
            )}
          </Typography>
        );
      },
    },
    {
      minWidth: 140,
      headerName: 'Action',
      field: '',
      renderCell: ({ row }: any) => {
        return <RowOptions row={row} />;
      },
    },
  ];

  const RowOptions = (props: any) => {
    const { row } = props;
    const { status, payment_status } = row;
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
          {status === 0 &&
            payment_status === 0 && [
              <MenuItem
                key={0}
                onClick={() => {
                  setAnchorEl(null);
                  sendReminder(row);
                }}
                sx={{ '& svg': { mr: 2 } }}
              >
                <IconBell fontSize={20} />
                Send Reminder
              </MenuItem>,
              <MenuItem
                key={1}
                onClick={() => {
                  setAnchorEl(null);
                  cancelPayment(row);
                }}
                sx={{ '& svg': { mr: 2 } }}
              >
                <IconTrash fontSize={20} />
                Cancel Request Payment
              </MenuItem>,
            ]}
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              viewPaymentDetails(row);
            }}
            sx={{ '& svg': { mr: 2 } }}
          >
            <IconEye fontSize={20} />
            View Payment Details
          </MenuItem>
        </Menu>
      </>
    );
  };

  const viewPaymentDetails = (row: any) => {};

  const sendReminder = (row: any) => {};

  const cancelPayment = (row: any) => {};

  const sendPaymentMail = (row: any) => {};

  return (
    <>
      <Grid container direction="row" alignItems="center" spacing={3}>
        <Grid item sm={3} xs={12}>
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
        <Grid item sm={3} xs={12}>
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
              <MenuItem value={4}>ALL</MenuItem>
              <MenuItem value={0}>Pending</MenuItem>
              <MenuItem value={1}>Received</MenuItem>
              <MenuItem value={2}>Cancelled</MenuItem>
              <MenuItem value={3}>Failed</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item sm={3} xs={12}>
          <FormControl size="small" fullWidth>
            <CustomPickerRange onChange={setDate} />
          </FormControl>
        </Grid>
        <Grid
          item
          sm={3}
          xs={12}
          justifyContent={{ xs: 'left', sm: 'right' }}
          display={'flex'}
        >
          <IconButton aria-label="refresh" size="small">
            <IconRefresh />
          </IconButton>
        </Grid>
      </Grid>
      <CustomDataGrid
        sx={{ mt: 5 }}
        autoHeight
        rows={data}
        columns={columns}
        loading={loading}
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </>
  );
};

export default TextPay;
