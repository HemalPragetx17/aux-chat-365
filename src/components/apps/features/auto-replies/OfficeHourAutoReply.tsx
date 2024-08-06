import {
  Alert,
  Button,
  Chip,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { IconDotsVertical, IconEdit, IconPlus } from '@tabler/icons-react';
import { MouseEvent, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import swal from 'sweetalert';

import axios from '../../../../utils/axios';
import { ROW_PROPS } from '../../../../utils/constant';
import CustomDataGrid from '../../../custom/CustomDataGrid';
import OfficeAutoReplyForm from '../../../forms/features/OfficeAutoReplyForm';
import OfficeHoursForm from '../../../forms/features/OfficeHoursForm';

const OfficeHourAutoReply = () => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [officeForm, setOfficeForm] = useState<boolean>(false);
  const [autoReplyForm, setAutoReplyForm] = useState<boolean>(false);
  const [currentData, setCurrentData] = useState<any>(null);
  const [departmentList, setDepartmentList] = useState<any>([]);

  useEffect(() => {
    fetchData();
    fetchDepartment();
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const response = await axios.get(`features/officehours`);
    setData(response?.data?.data);
    setOfficeForm(false);
    setLoading(false);
  }, []);

  const fetchDepartment = useCallback(async () => {
    const response = await axios.get(`features/officehours/active-department`);
    let department = response.status === 200 ? response?.data?.data : [];
    department = department.map((dept: any) => {
      return {
        label: dept.name,
        value: dept.id,
      };
    });
    setDepartmentList([...department]);
  }, []);

  const columns: GridColDef[] = [
    {
      flex: 0.25,
      minWidth: 160,
      headerName: 'Title',
      field: 'replyAfterOffice',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row?.Department?.name}
          </Typography>
        );
      },
    },
    {
      flex: 0.45,
      minWidth: 220,
      headerName: 'Message',
      field: 'message',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography sx={{ ...ROW_PROPS }}>
            During Office Hours : {row?.officeHoursReply || '-'}
            <br />
            After Office Hours : {row?.afterOfficeHoursReply || '-'}
          </Typography>
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
        const text = row?.status == 'ACTIVE' ? 'Active' : 'InActive';
        const color = row?.status == 'ACTIVE' ? 'success' : 'error';
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
            dense
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
            dense
            onClick={() => {
              setAnchorEl(null);
              handleAddAutoReply(row);
            }}
            sx={{ '& svg': { mr: 2 } }}
          >
            <IconPlus fontSize={20} />
            Add Auto Reply
          </MenuItem>
          {/* <MenuItem
            dense
            onClick={() => {
              setAnchorEl(null);
              handleDelete(row);
            }}
            sx={{ '& svg': { mr: 2 } }}
          >
            <IconTrash fontSize={20} />
            Delete
          </MenuItem> */}
        </Menu>
      </>
    );
  };

  const handleEdit = (row: any) => {
    const { Department } = row;
    const currentDepartment = { label: Department.name, value: Department.id };
    setDepartmentList([...departmentList, currentDepartment]);
    setCurrentData(row);
    setOfficeForm(true);
  };

  const handleAdd = () => {
    setCurrentData(null);
    setOfficeForm(true);
  };

  const handleAddAutoReply = (row: any) => {
    setCurrentData(row);
    setAutoReplyForm(true);
  };

  const onRefresh = () => {
    setAutoReplyForm(false);
    fetchData();
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
        const response = await axios.delete(`/features/${row?.id}`);
        if (response.status === 200) {
          fetchData();
        }
      } catch (error) {
        setLoading(false);
        toast.error((error as any)?.message || 'API Error! Please try again.');
      }
    }
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
          <Tooltip
            title={departmentList.length === 0 && 'No Department Available'}
          >
            <span>
              <Button
                color="primary"
                variant="contained"
                onClick={handleAdd}
                disabled={departmentList.length === 0}
              >
                ADD OFFICE HOURS
              </Button>
            </span>
          </Tooltip>
        </Grid>
        <Grid item xs={12}>
          <Alert severity="info" icon={false}>
            Use this feature to send an auto reply based on when your business
            is open or closed. Individuals will only receive these messages once
            every 4 hours to prevent interrupting the flow of conversation.
          </Alert>
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
      <OfficeHoursForm
        addFlag={!Boolean(currentData)}
        open={officeForm}
        departmentList={departmentList}
        toggle={() => setOfficeForm(false)}
        success={fetchData}
        currentData={currentData}
      />
      <OfficeAutoReplyForm
        open={autoReplyForm}
        toggle={() => setAutoReplyForm(false)}
        currentData={currentData}
        success={onRefresh}
        addFlag={data?.length === 0}
      />
    </>
  );
};

export default OfficeHourAutoReply;
