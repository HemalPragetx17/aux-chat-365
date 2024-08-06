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
import toast from 'react-hot-toast';
import swal from 'sweetalert';

import axios from '../../../../utils/axios';
import { ROW_PROPS, STATUS_COLOR } from '../../../../utils/constant';
import CustomDataGrid from '../../../custom/CustomDataGrid';
import CustomTextField from '../../../custom/CustomTextField';
import KeywordForm from '../../../forms/features/KeywordForm';

const KeywordList = () => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState<any>('');
  const [status, setStatus] = useState<any>('ALL');
  const [filterData, setFilterData] = useState<any>([]);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [currentData, setCurrentData] = useState<any>(null);
  let timer: any;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    setSearch('');
    setStatus('ALL');
    setPaginationModel({ page: 0, pageSize: 10 });
    setLoading(true);
    try {
      const response = await axios.get(`/keyword?status=ACTIVE,INACTIVE`);
      const resp = response.status === 200 ? response.data.data : [];
      setData(resp);
      setFilterData(resp);
      setLoading(false);
    } catch (e) {
      setData([]);
      setFilterData([]);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (data?.length) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        searchData();
      }, 1000);
    }
  }, [search, status]);

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
  }, [search, status]);

  const columns: GridColDef[] = [
    {
      flex: 0.2,
      minWidth: 150,
      headerName: 'Keyword',
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
      minWidth: 220,
      headerName: 'Description',
      field: 'description',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row?.description}
          </Typography>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 150,
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

  const handleAdd = (row: any) => {
    setCurrentData(null);
    setOpenForm(true);
  };

  const handleEdit = async (row: any) => {
    setLoading(true);
    const resposne = await axios.get(`/keyword/${row?.id}`);
    if (resposne.status === 200) {
      setCurrentData(resposne?.data.data);
      setOpenForm(true);
    }
    setLoading(false);
  };

  const handleDelete = async (row: any) => {
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
      try {
        setLoading(true);
        const response = await axios.delete(`/keyword/${row?.id}`);
        if (response.status === 200) {
          fetchData();
        }
      } catch (error) {
        setLoading(false);
        toast.error((error as any)?.message || 'API Error! Please try again.');
      }
    }
  };

  const onRefresh = () => {
    setOpenForm(false);
    fetchData();
  };

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
              <MenuItem value={'ALL'}>ALL</MenuItem>
              <MenuItem value={'ACTIVE'}>Active</MenuItem>
              <MenuItem value={'INACTIVE'}>In-Active</MenuItem>
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
          <Button variant="contained" sx={{ mr: 2,background:'linear-gradient(180deg, rgba(101,17,160,1) 36%, rgba(124,14,177,1) 69%, rgba(131,52,184,1) 84%)' }} onClick={handleAdd}>
            Add New Keyword
          </Button>
          <IconButton aria-label="refresh" size="small" onClick={fetchData}>
            <IconRefresh />
          </IconButton>
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
      <KeywordForm
        open={openForm}
        toggle={() => setOpenForm(false)}
        currentData={currentData}
        success={onRefresh}
        addFlag={!Boolean(currentData?.id)}
      />
    </>
  );
};

export default KeywordList;
