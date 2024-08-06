import { Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';

import { ROW_PROPS } from '../../../utils/constant';
import { toLocalDate } from '../../../utils/date';
import CustomDataGrid from '../../custom/CustomDataGrid';

const LoginLogList = () => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    // call API here
    setData([
      {
        id: 745,
        user_id: '21',
        ip: '172.31.6.136',
        info: null,
        status: 0,
        created_at: '2023-09-20T16:04:07.000000Z',
        updated_at: '2023-09-20T16:04:07.000000Z',
      },
      {
        id: 744,
        user_id: '21',
        ip: '172.31.55.209',
        info: null,
        status: 0,
        created_at: '2023-09-20T14:23:15.000000Z',
        updated_at: '2023-09-20T14:23:15.000000Z',
      },
    ]);
  }, []);

  const columns: GridColDef[] = [
    {
      flex: 0.33,
      minWidth: 150,
      headerName: 'IP Address',
      field: 'ip',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={ROW_PROPS}>
            {row.ip}
          </Typography>
        );
      },
    },
    {
      flex: 0.33,
      minWidth: 150,
      headerName: 'Information',
      field: '',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={ROW_PROPS}>
            N/A
          </Typography>
        );
      },
    },
    {
      flex: 0.33,
      minWidth: 150,
      headerName: 'Time',
      field: 'created_at',
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={ROW_PROPS}>
            {toLocalDate(row.created_at).format(`MM-DD-YYYY, hh:mm:ss A`)}
          </Typography>
        );
      },
    },
  ];

  return (
    <CustomDataGrid
      sx={{ mt: 5 }}
      autoHeight
      rowHeight={42}
      rows={data}
      columns={columns}
      loading={loading}
      disableRowSelectionOnClick
      pageSizeOptions={[10, 25, 50]}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
    />
  );
};

export default LoginLogList;
