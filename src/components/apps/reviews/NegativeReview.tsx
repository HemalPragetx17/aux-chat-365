import {
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import {
  IconDotsVertical,
  IconEye,
  IconMessage,
  IconRefresh,
  IconShare,
  IconX,
} from '@tabler/icons-react';
import { MouseEvent, useCallback, useEffect, useState } from 'react';

import { ROW_PROPS } from '../../../utils/constant';
import { toLocalDate } from '../../../utils/date';
import CustomDataGrid from '../../custom/CustomDataGrid';
import CustomTextField from '../../custom/CustomTextField';
import NegativeReviewForm from '../../forms/reviews/NegativeReviewForm';

const NegativeReview = () => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState<any>('');
  const [filterData, setFilterData] = useState<any>([]);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [currentData, setCurrentData] = useState<any>(null);
  const [replyFlag, setReplyFlag] = useState<boolean>(false);
  let timer: any;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    setSearch('');
    setPaginationModel({ page: 0, pageSize: 10 });
    setData([
      {
        id: 79,
        user_id: 21,
        customer_number: '2127862918',
        coversation_id: 77101,
        rating: '0.5',
        feedback: "I don't like it",
        reply: null,
        sender_number: '7024781111',
        created_at: '2022-12-09T18:09:20.000000Z',
        read_status: 1,
        reply_date: null,
        updated_at: '2023-10-11T10:21:59.000000Z',
        review_setting_id: 21,
      },
      {
        id: 78,
        user_id: 21,
        customer_number: '2127862918',
        coversation_id: 77101,
        rating: '0.5',
        feedback: 'this a demo',
        reply: null,
        sender_number: '7024781111',
        created_at: '2022-12-09T18:06:54.000000Z',
        read_status: 1,
        reply_date: null,
        updated_at: '2023-10-11T10:21:59.000000Z',
        review_setting_id: 21,
      },
    ]);
  }, []);

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
          obj.feedback.toLowerCase().indexOf(search.trim().toLowerCase()) > -1,
      );
    }
    setFilterData(filtered);
    setLoading(false);
  }, [search]);

  const columns: GridColDef[] = [
    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'From',
      field: 'customer_number',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row?.customer_number}
          </Typography>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 120,
      headerName: 'Rating',
      field: 'rating',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row?.rating}
          </Typography>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 140,
      headerName: 'Review',
      field: 'feedback',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row?.feedback}
          </Typography>
        );
      },
    },
    {
      flex: 0.15,
      minWidth: 140,
      headerName: 'Reply Status',
      field: 'status',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Chip
            label={Boolean(row?.reply_date) ? 'Replied' : 'Pending'}
            color={Boolean(row?.reply_date) ? 'success' : 'warning'}
            size="small"
          />
        );
      },
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'Date',
      field: 'created_at',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {toLocalDate(row.out_created_at).format(`MM-DD-YYYY`)}
            <br />
            {toLocalDate(row.out_created_at).format(`hh:mm:ssA`)}
          </Typography>
        );
      },
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'Reply Date',
      field: 'reply_date',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {Boolean(row?.reply_date)
              ? toLocalDate(row.reply_date).format(`MM-DD-YYYY hh:mm:ssA`)
              : ''}
          </Typography>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 10,
      headerName: 'Action',
      field: '',
      renderCell: ({ row }: any) => {
        return <RowOptions row={row} />;
      },
    },
  ];

  const RowOptions = (props: any) => {
    const { row } = props;
    const { reply_date } = row;
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
              handleOpenForm(row, false);
            }}
            sx={{ '& svg': { mr: 2 } }}
          >
            <IconEye fontSize={20} />
            Click to view
          </MenuItem>

          {Boolean(reply_date) ? (
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                sendMessage(row);
              }}
              sx={{ '& svg': { mr: 2 } }}
            >
              <IconMessage fontSize={20} />
              Send Message
            </MenuItem>
          ) : (
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                handleOpenForm(row, true);
              }}
              sx={{ '& svg': { mr: 2 } }}
            >
              <IconShare fontSize={20} />
              Reply
            </MenuItem>
          )}
        </Menu>
      </>
    );
  };

  const handleOpenForm = (row: any, flag: boolean) => {
    setCurrentData(row);
    setReplyFlag(flag);
    setOpenForm(true);
  };

  const sendMessage = (row: any) => {
    // Redirect To Message Page
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
        rows={filterData}
        columns={columns}
        loading={loading}
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
      <NegativeReviewForm
        open={openForm}
        toggle={() => setOpenForm(false)}
        currentData={currentData}
        success={onRefresh}
        replyFlag={replyFlag}
      />
    </>
  );
};

export default NegativeReview;
