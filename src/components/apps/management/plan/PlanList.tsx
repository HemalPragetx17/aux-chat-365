import React from 'react';
import {
  Button,
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import {
  IconDotsVertical,
  IconEdit,
  IconRefresh,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import { MouseEvent, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import swal from 'sweetalert';

import axios from '../../../../utils/axios';
import { ROW_PROPS, STATUS_COLOR } from '../../../../utils/constant';
import CustomDataGrid from '../../../custom/CustomDataGrid';
import CustomTextField from '../../../custom/CustomTextField';

const PlanList = () => {
  const [data, setData] = useState<any>([]);
  const [filterData, setFilterData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<any>('ALL');
  const router = useRouter();
  let timer: any;

  useEffect(() => {
    setData([]);
    setFilterData([]);
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    handleResetPage();
    setLoading(true);
    const response = await axios.get(`/plan`);
    const plans = response.status === 200 ? response.data.data : [];
    setData(plans);
    setFilterData(plans);
    setLoading(false);
  }, []);

  const handleResetPage = () => {
    setSearch('');
    setStatus('ALL');
    setPaginationModel({ page: 0, pageSize: 10 });
  };

  useEffect(() => {
    if (data?.length) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        searchData();
      }, 1000);
    }
  }, [search]);

  const searchData = useCallback(async () => {
    setLoading(true);
    let filtered: any = [...data];
    if (Boolean(search.trim())) {
      filtered = filtered.filter(
        (obj: any) =>
          obj.title.toLowerCase().indexOf(search.trim().toLowerCase()) > -1,
      );
    }
    if (status !== 'ALL') {
      filtered = filtered.filter((obj: any) => obj.status === status);
    }
    setFilterData(filtered);
    setLoading(false);
  }, [search]);

  const columns: GridColDef[] = [
    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'Title',
      field: 'title',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Tooltip title={row?.title} placement="top">
            <Typography noWrap sx={{ ...ROW_PROPS }}>
              {row?.title}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 180,
      headerName: 'Description',
      field: 'description',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Tooltip title={row?.description} placement="top">
            <Typography noWrap sx={{ ...ROW_PROPS }}>
              {row?.description}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'Monthly',
      field: 'price.monthly',
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            ${row?.price?.monthly}
          </Typography>
        );
      },
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'Yearly',
      field: 'price.yearly',
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            ${row?.price?.yearly}
          </Typography>
        );
      },
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'Status',
      field: 'status',
      renderCell: ({ row }: any) => {
        return (
          <Chip
            label={row.status}
            color={STATUS_COLOR[row.status as keyof typeof STATUS_COLOR] as any}
            size="small"
          />
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 100,
      headerName: 'Action',
      field: '',
      renderCell: ({ row }: any) => {
        return <RowOptions id={row?.id} />;
      },
    },
  ];

  const RowOptions = (props: any) => {
    const { id } = props;
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
              handleEdit(id);
            }}
            sx={{ '& svg': { mr: 2 } }}
          >
            <IconEdit fontSize={20} />
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              handleDelete(id);
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

  const handleAdd = useCallback(async () => {
    router.replace('/management/plan/add');
  }, []);

  const handleEdit = useCallback(async (id: string) => {
    router.replace(`/management/plan/edit?id=${id}`);
  }, []);

  const handleDelete = async (id: string) => {
    const willDelete = await swal({
      title: 'Are you sure?',
      closeOnClickOutside: false,
      closeOnEsc: false,
      icon: 'warning',
      buttons: {
        cancel: {
          text: 'Cancel',
          value: null,
          visible: true,
          className: '',
          closeModal: true,
        },
        confirm: {
          text: 'OK',
          value: true,
          visible: true,
          className: 'MuiButton-root',
          closeModal: true,
        },
      },
      dangerMode: true,
    });
    if (willDelete) {
      setLoading(true);
      await axios.delete(`/plan/${id}`);
      fetchData();
    }
  };

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
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
                <MenuItem value={'ALL'}>ALL</MenuItem>
                <MenuItem value={'INACTIVE'}>In-Active</MenuItem>
                <MenuItem value={'ACTIVE'}>Active</MenuItem>
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
            <Button variant="contained" sx={{ mr: 2 }} onClick={handleAdd}>
              Add New Plan
            </Button>
            <Tooltip title={'Refresh'} arrow>
              <IconButton aria-label="refresh" size="small" onClick={fetchData}>
                <IconRefresh />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
        <CustomDataGrid
          sx={{ mt: 5 }}
          autoHeight
          rowHeight={38}
          rows={filterData}
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

export default PlanList;
