import { Chip, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { IconDotsVertical } from '@tabler/icons-react';
import { MouseEvent, useCallback, useEffect, useState } from 'react';

import { useAuth } from '../../../../hooks/useAuth';
import axios from '../../../../utils/axios';
import { PAYMENT_STATUS, ROW_PROPS } from '../../../../utils/constant';
import { toLocalDate } from '../../../../utils/date';
import { formatPayment } from '../../../../utils/format';
import CustomDataGrid from '../../../custom/CustomDataGrid';

const BillingInvoiceList = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    setPaginationModel({ page: 0, pageSize: 10 });
    setLoading(true);
    try {
      const response = await axios.post(`/plan/invoiceList`);
      const resp = response.status === 200 ? response.data : [];
      setData(resp);
      setLoading(false);
    } catch (e) {
      setData([]);
      setLoading(false);
    }
  }, []);

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

  const columns: GridColDef[] = [
    {
      minWidth: 180,
      flex: 0.18,
      headerName: 'Invoice Number',
      field: 'invoiceNumber',
      filterable: false,
      sortable: false,
      renderCell: ({ row }) => {
        return (
          <Typography sx={{ ...ROW_PROPS }}>{row.invoiceNumber}</Typography>
        );
      },
    },
    {
      minWidth: 300,
      flex: 0.3,
      headerName: 'Invoice For',
      field: 'message',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return <Typography sx={{ ...ROW_PROPS }}>{row.message}</Typography>;
      },
    },
    {
      minWidth: 120,
      flex: 0.15,
      headerName: 'Amount',
      field: 'total',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography sx={{ ...ROW_PROPS }}>
            ${formatPayment(row.total || 0)}
          </Typography>
        );
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
            {toLocalDate(row.createdAt).format(`MMM DD, YYYY`)}
          </Typography>
        );
      },
    },
    {
      minWidth: 140,
      flex: 0.15,
      headerName: 'Due Date',
      field: 'dueDate',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography sx={{ ...ROW_PROPS }}>
            {toLocalDate(row.dueDate).format(`MMM DD, YYYY`)}
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
          <MenuItem
            key={0}
            dense
            onClick={() => {
              setAnchorEl(null);
              window.open(row.file, '_blank');
            }}
            sx={{ '& svg': { mr: 2 } }}
          >
            View
          </MenuItem>
          <MenuItem
            key={3}
            dense
            onClick={() => {
              setAnchorEl(null);
              handleDownloadInvoice(row);
            }}
            sx={{ '& svg': { mr: 2 } }}
          >
            Download
          </MenuItem>
        </Menu>
      </>
    );
  };

  return (
    <>
      <Typography variant="h4" sx={{ mt: 5, mb: 2 }}>
        Invoice History - {user?.name}
      </Typography>
      <CustomDataGrid
        autoHeight
        rowHeight={50}
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

export default BillingInvoiceList;
