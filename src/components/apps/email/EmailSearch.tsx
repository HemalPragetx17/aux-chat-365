import { Box, Fab, MenuItem, Select } from '@mui/material';
import { IconMenu2 } from '@tabler/icons-react';
import React from 'react';

interface Props {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  selectedEmail: string;
  setSelectedEmail: any;
  data: any;
}

const EmailSearch = ({
  onClick,
  selectedEmail,
  setSelectedEmail,
  data,
}: Props) => {
  return (
    <Box display="flex" sx={{ padding: 1 }} width={'100%'}>
      <Fab
        onClick={onClick}
        color="primary"
        size="small"
        sx={{
          mr: 1,
          flexShrink: '0',
          display: { xs: 'block', lineHeight: '10px', lg: 'none' },
        }}
      >
        <IconMenu2 width="16" />
      </Fab>
      <Select
        value={selectedEmail}
        onChange={(event: any) => setSelectedEmail(event?.target?.value)}
        sx={{ width: '100%' }}
        size="small"
      >
        {data.map((option: any, index: number) => {
          return (
            <MenuItem key={index} value={option?.accessTokenNylas} dense>
              {option?.email}
            </MenuItem>
          );
        })}
      </Select>
    </Box>
  );
};

export default EmailSearch;
