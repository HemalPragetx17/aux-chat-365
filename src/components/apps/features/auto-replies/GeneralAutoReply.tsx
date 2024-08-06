import {
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons-react';
import { MouseEvent, useCallback, useEffect, useState } from 'react';

import { ROW_PROPS } from '../../../../utils/constant';
import CustomDataGrid from '../../../custom/CustomDataGrid';
import GeneralAutoReplyForm from '../../../forms/features/GeneralAutoReplyForm';

const GeneralAutoReply = () => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [currentData, setCurrentData] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    setData([
      {
        id: 28,
        user_id: '21',
        type: 'generalautoreply',
        message_type: 'Title',
        message: 'Message',
        timezone: 'America/Los_Angeles',
        status: '1',
        reply_time_type: 'specific_time',
        reply_days: ['Monday', 'Tuesday'],
        reply_start_time: '08:00',
        reply_end_time: '22:00',
        is_deleted: '0',
        created_at: '2023-10-11T11:41:45.000000Z',
        updated_at: '2023-10-11T11:41:56.000000Z',
      },
    ]);
  }, []);

  const columns: GridColDef[] = [
    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'Title',
      field: 'message_type',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row?.message_type}
          </Typography>
        );
      },
    },
    {
      flex: 0.3,
      minWidth: 140,
      headerName: 'Message',
      field: 'message',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row?.message}
          </Typography>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 140,
      headerName: 'Days',
      field: 'reply_time_type',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row?.reply_time_type === 'all_time'
              ? 'All Days'
              : row?.reply_days?.join(', ')}
          </Typography>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 140,
      headerName: 'Time',
      field: 'timezone',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Box>
            <Typography noWrap sx={{ ...ROW_PROPS }}>
              {row?.timezone}
            </Typography>
            <Typography noWrap sx={{ ...ROW_PROPS, fontSize: 12 }}>
              {row?.reply_time_type === 'all_time'
                ? '00:00 - 23:59'
                : `${row?.reply_start_time} - ${row?.reply_end_time}`}
            </Typography>
          </Box>
        );
      },
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'Status',
      field: 'status',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        const text = row?.status == 1 ? 'Active' : 'InActive';
        const color = row?.status == 1 ? 'success' : 'error';
        return <Chip label={text} color={color} size="small" />;
      },
    },
    {
      flex: 0.15,
      minWidth: 100,
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
            onClick={() => {
              setAnchorEl(null);
              handleEdit(row);
            }}
            sx={{ '& svg': { mr: 2 } }}
          >
            <IconEdit fontSize={20} />
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              handleDelete(row);
            }}
            sx={{ '& svg': { mr: 2 } }}
          >
            <IconTrash fontSize={20} />
            Delete
          </MenuItem>
        </Menu>
      </>
    );
  };

  const handleEdit = (row: any) => {
    setCurrentData(row);
    setOpenForm(true);
  };

  const handleDelete = async (row: any) => {};

  const handleAdd = () => {
    setCurrentData(null);
    setOpenForm(true);
  };

  const onRefresh = () => {
    setOpenForm(false);
    fetchData();
  };

  return (
    <>
      <Grid container direction="row" alignItems="center" spacing={3}>
        <Grid
          item
          xs={12}
          justifyContent={{ xs: 'left', sm: 'right' }}
          display={'flex'}
        >
          <Button color="primary" variant="contained" onClick={handleAdd}>
            ADD AUTO REPLY
          </Button>
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
      <GeneralAutoReplyForm
        open={openForm}
        toggle={() => setOpenForm(false)}
        success={onRefresh}
        currentData={currentData}
        addFlag={Boolean(currentData?.id)}
      />
    </>
  );
};

export default GeneralAutoReply;
