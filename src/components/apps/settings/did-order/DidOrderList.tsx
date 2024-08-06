import { Chip, Grid, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useCallback, useEffect, useState } from 'react';

import axios from '../../../../utils/axios';
import { ORDER_STATUS_COLOR, ROW_PROPS } from '../../../../utils/constant';
import { toLocalDate } from '../../../../utils/date';
import CustomDataGrid from '../../../custom/CustomDataGrid';

const DidOrderList = () => {
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
    const response = await axios.post(`/did/orders/`);
    const orders = response.status === 200 ? response.data : [];
    setData(orders);
    setLoading(false);
  }, []);

  const columns: GridColDef[] = [
    {
      flex: 0.2,
      minWidth: 180,
      headerName: 'Provider',
      field: 'didProvider',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row?.didProvider}
          </Typography>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 180,
      headerName: 'Status',
      field: 'status',
      renderCell: ({ row }: any) => {
        return (
          <Chip
            label={row.status}
            color={
              ORDER_STATUS_COLOR[
                row.status as keyof typeof ORDER_STATUS_COLOR
              ] as any
            }
            size="small"
          />
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 180,
      headerName: 'Order Date',
      field: 'createdAt',
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
      flex: 0.4,
      minWidth: 180,
      headerName: 'Phone Numbers',
      field: 'telephoneNumber',
      renderCell: ({ row }: any) => {
        return (
          <Typography sx={{ ...ROW_PROPS }}>
            {row?.telephoneNumber.map((phone: any, index: number) => (
              <Typography key={index} sx={{ display: 'block' }}>
                {phone}
              </Typography>
            ))}
          </Typography>
        );
      },
    },
  ];

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <CustomDataGrid
          sx={{ mt: 5 }}
          autoHeight
          // rowHeight={38}
          rows={data}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </Grid>
    </Grid>
  );
};

export default DidOrderList;
