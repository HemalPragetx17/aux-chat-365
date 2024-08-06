import { styled } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';

const CustomDataGrid = styled((props: any) => {
  return (
    <>
      <DataGrid {...props} />
    </>
  );
})(({ theme }) => ({
  '& .MuiDataGrid-root': {
    border: 0,
    color: theme.palette.text.primary,
    '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within':
      {
        outline: 'none',
      },
  },
  '& .MuiDataGrid-toolbarContainer': {
    paddingRight: `${theme.spacing(6)} !important`,
    paddingLeft: `${theme.spacing(3.25)} !important`,
  },
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: `${
      theme.palette.mode === 'dark' ? '#333f55' : '#F6F6F7'
    } !important`,
    borderColor: 'rgba(51, 48, 60, 0.12) !important',
  },
  '& .MuiDataGrid-columnHeader': {
    backgroundColor: `${
      theme.palette.mode === 'dark' ? '#333f55' : '#F6F6F7'
    } !important`,
    '&:not(.MuiDataGrid-columnHeaderCheckbox)': {
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
      '&:first-of-type': {
        paddingLeft: theme.spacing(6),
      },
    },
    '& .MuiDataGrid-overlay': {
      backgroundColor: `${theme.palette.mode === 'dark' ? '#393b48 ' : 'rgba(255, 255, 255, 0.7)'} !important`,
    },
    '&:focus, &:focus-within': {
      outline: 'none !important',
    },
  },
  '& .MuiDataGrid-columnHeaderCheckbox': {
    maxWidth: '58px !important',
    minWidth: '58px !important',
  },
  '& .MuiDataGrid-columnHeaderTitleContainer': {
    padding: 0,
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    fontWeight: 600,
    fontSize: '0.75rem',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  '.MuiDataGrid-columnSeparator--resizing': {
    visibility: 'hidden',
  },
  '& .MuiDataGrid-columnSeparator': {
    color: `rgba(51, 48, 60, 0.12)`,
  },
  '& .MuiDataGrid-row': {
    '&:last-child': {
      '& .MuiDataGrid-cell': {
        borderBottom: 0,
      },
    },
  },
  '& .MuiDataGrid-cell': {
    borderColor: `rgba(51, 48, 60, 0.12) !important`,
    '&:not(.MuiDataGrid-cellCheckbox)': {
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
      '&:first-of-type': {
        paddingLeft: theme.spacing(6),
      },
    },
    '&:last-of-type': {
      paddingRight: theme.spacing(6),
    },
    '&:focus, &:focus-within': {
      outline: 'none !important',
    },
  },
  '& .MuiDataGrid-cellCheckbox': {
    maxWidth: '58px !important',
    minWidth: '58px !important',
  },
  '& .MuiDataGrid-editInputCell': {
    padding: 0,
    '& .MuiInputBase-input': {
      padding: 0,
    },
  },
  '& .MuiDataGrid-footerContainer': {
    borderTop: `1px solid rgba(51, 48, 60, 0.12)`,
    '& .MuiTablePagination-toolbar': {
      paddingLeft: `${theme.spacing(4)} !important`,
      paddingRight: `${theme.spacing(4)} !important`,
    },
  },
  '& .MuiDataGrid-selectedRowCount': {
    margin: 0,
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  '& .MuiDataGrid-overlay': {
    backgroundColor: `${
      theme.palette.mode === 'dark' ? '#171c23' : 'rgba(255, 255, 255, 0.7)'
    } !important`,
  },
}));

export default CustomDataGrid;
