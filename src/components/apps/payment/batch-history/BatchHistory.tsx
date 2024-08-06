import {
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  Typography,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { IconEye, IconRefresh, IconX } from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';

import { ROW_PROPS } from '../../../../utils/constant';
import { toLocalDate } from '../../../../utils/date';
import CustomDataGrid from '../../../custom/CustomDataGrid';
import CustomTextField from '../../../custom/CustomTextField';

const BatchHistory = () => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState<any>('');

  useEffect(() => {
    fetchData();
  }, [search]);

  const fetchData = useCallback(async () => {
    setData([
      {
        id: 5,
        name: 'batch test',
        userid: '21',
        created_at: '2022-04-08 14:33:53',
        updated_at: '2022-04-08 14:33:53',
      },
      {
        id: 4,
        name: 'Bulk Test aux',
        userid: '21',
        created_at: '2022-04-06 18:00:47',
        updated_at: '2022-04-06 18:00:47',
      },
    ]);
  }, [search]);

  const columns: GridColDef[] = [
    {
      flex: 0.4,
      minWidth: 120,
      headerName: 'Name',
      field: 'name',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row.name}
          </Typography>
        );
      },
    },
    {
      flex: 0.4,
      minWidth: 120,
      headerName: 'Date',
      field: 'date',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {toLocalDate(row.created_at).format(`MM-DD-YYYY hh:mm:ssA`)}
          </Typography>
        );
      },
    },
    {
      minWidth: 140,
      headerName: 'Action',
      field: '',
      renderCell: ({ row }: any) => {
        return (
          <IconButton
            size="small"
            onClick={() => viewBatchHistory(row)}
            color="primary"
          >
            <IconEye fontSize={20} />
          </IconButton>
        );
      },
    },
  ];

  const viewBatchHistory = (row: any) => {};

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
        <Grid
          item
          sm={9}
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
        rowHeight={38}
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

export default BatchHistory;
