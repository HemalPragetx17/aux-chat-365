import { Drawer, Theme, useMediaQuery } from '@mui/material';
import React from 'react';

import GroupChatListing from './GroupChatListing';

interface chatType {
  isMobileSidebarOpen: boolean;
  onSidebarClose: (event: React.MouseEvent<HTMLElement>) => void;
}

const drawerWidth = 320;

const GroupChatSidebar = ({
  isMobileSidebarOpen,
  onSidebarClose,
}: chatType) => {
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

  return (
    <Drawer
      open={isMobileSidebarOpen}
      onClose={onSidebarClose}
      variant={lgUp ? 'permanent' : 'temporary'}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        zIndex: lgUp ? 0 : 1,
        [`& .MuiDrawer-paper`]: { position: 'relative' },
      }}
    >
      <GroupChatListing />
    </Drawer>
  );
};

export default GroupChatSidebar;
