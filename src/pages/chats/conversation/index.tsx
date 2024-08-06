import { Backdrop, Card, CircularProgress } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';

import ChatContent from '../../../components/apps/conversation/ChatContent';
import ChatSidebar from '../../../components/apps/conversation/ChatSidebar';
import { useSelector } from '../../../store/Store';

export default function Chats() {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const loading = useSelector((state) => state.chatReducer.loading);

  return (
    <Card
      className="test"
      sx={{ display: 'flex', p: 0, height: '100%', padding: 0 }}
      elevation={0}
    >
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="error" />
      </Backdrop>
      <ChatSidebar
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)}
      />
      <Box flexGrow={1} height={'100%'}>
        <ChatContent toggleChatSidebar={() => setMobileSidebarOpen(true)} />
      </Box>
    </Card>
  );
}
