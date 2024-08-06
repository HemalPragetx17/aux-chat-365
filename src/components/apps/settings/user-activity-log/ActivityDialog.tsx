import { Icon } from '@iconify/react';
import { Dialog, DialogContent, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import Link from 'next/link';
import { useState } from 'react';

import { PRIMARY_COLOR, ROW_PROPS } from '../../../../utils/constant';
import { toLocalDate } from '../../../../utils/date';
import CustomCloseButton from '../../../custom/CustomCloseButton';
import CustomDataGrid from '../../../custom/CustomDataGrid';

interface ActivityDialogProp {
  data: any[];
  open: boolean;
  toggle: () => void;
}

const ActivityDialog = (props: ActivityDialogProp) => {
  const { data, open, toggle } = props;
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const columns: GridColDef[] = [
    {
      flex: 0.33,
      minWidth: 120,
      headerName: 'IP Address',
      field: 'ip',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {row.ip}
          </Typography>
        );
      },
    },
    {
      flex: 0.33,
      minWidth: 120,
      headerName: 'Information',
      field: '',
      filterable: false,
      sortable: false,
      renderCell: ({ row }: any) => {
        return (
          <Link href={'#'} style={{ color: PRIMARY_COLOR }}>
            CLICK HERE
          </Link>
        );
      },
    },
    {
      flex: 0.33,
      minWidth: 120,
      headerName: 'Time',
      field: 'created_at',
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ ...ROW_PROPS }}>
            {toLocalDate(row.created_at).format(`MM-DD-YYYY, hh:mm:ss A`)}
          </Typography>
        );
      },
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={toggle}
      fullWidth
      maxWidth="lg"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <CustomCloseButton onClick={toggle}>
        <Icon icon={'tabler:x'} width={24} height={24} />
      </CustomCloseButton>
      <DialogContent>
        <CustomDataGrid
          sx={{ mt: 5 }}
          autoHeight
          rowHeight={42}
          rows={data}
          columns={columns}
          disableRowSelectionOnClick
          pageSizeOptions={[5, 7, 10]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ActivityDialog;
