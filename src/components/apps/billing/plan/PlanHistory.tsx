import { Chip, IconButton, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { IconFile } from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';

import axios from '../../../../utils/axios';
import { ROW_PROPS } from '../../../../utils/constant';
import { toLocalDate } from '../../../../utils/date';
import { formatPayment } from '../../../../utils/format';
import CustomDataGrid from '../../../custom/CustomDataGrid';

const PlanHistory = () => {
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
      const response = await axios.post(`/users/plan-history`);
      const resp = response.status === 201 ? response.data.PlanHistory : [];
      setData(resp);
      setLoading(false);
    } catch (e) {
      setData([]);
      setLoading(false);
    }
  }, []);

  const columns: GridColDef[] = [
    {
      minWidth: 180,
      flex: 0.18,
      headerName: 'Plan Name',
      field: 'title',
      filterable: false,
      sortable: false,
      renderCell: ({ row }) => {
        return <Typography sx={{ ...ROW_PROPS }}>{row.plan?.title}</Typography>;
      },
    },
    {
      minWidth: 120,
      flex: 0.15,
      headerName: 'Plan Type',
      field: 'planType',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return <Typography sx={{ ...ROW_PROPS }}>{row.planType}</Typography>;
      },
    },
    {
      minWidth: 120,
      flex: 0.15,
      headerName: 'Amount',
      field: 'price',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography sx={{ ...ROW_PROPS }}>
            $ {formatPayment(row?.invoice?.total)}
          </Typography>
        );
      },
    },
    {
      minWidth: 140,
      flex: 0.15,
      headerName: 'Start Date',
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
      headerName: 'Expiry Date',
      field: 'dueDate',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography sx={{ ...ROW_PROPS }}>
            {row?.expiredAt ? (
              <>
                {toLocalDate(row.expiredAt).format(`MM-DD-YYYY`)}
                <br />
                {toLocalDate(row.expiredAt).format(`hh:mm:ss A`)}
              </>
            ) : (
              <>-</>
            )}
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
        return (
          <Chip
            label={row.status}
            color={
              row.status === 'ACTIVE'
                ? 'success'
                : row.status === 'PENDING'
                ? 'warning'
                : 'error'
            }
            size="small"
          />
        );
      },
    },
    {
      minWidth: 100,
      flex: 0.1,
      headerName: 'Invoice',
      field: '',
      renderCell: ({ row }: any) => {
        return (
          <IconButton
            onClick={() => {
              window.open(row?.invoice?.file, '_blank');
            }}
          >
            <IconFile fontSize={12} />
          </IconButton>
        );
      },
    },
  ];

  return (
    <>
      <CustomDataGrid
        sx={{ mt: 5 }}
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

export default PlanHistory;
