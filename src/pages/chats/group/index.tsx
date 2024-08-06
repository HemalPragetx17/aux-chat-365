import { Backdrop, Card, CircularProgress, Divider } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';

// import GroupChatContent from '../../../components/apps/conversation-group/GroupChatContent';
import GroupChatContent from '../../../components/apps/conversation-group/GroupChatContent';
import GroupChatMsgSent from '../../../components/apps/conversation-group/GroupChatMsgSent';
import GroupChatSidebar from '../../../components/apps/conversation-group/GroupChatSidebar';
import { AppState, useSelector } from '../../../store/Store';

export default function ChatGroup() {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const loading = useSelector((state) => state.chatGroupReducer.loading);
  const chatContent = useSelector(
    (state) => state.chatGroupReducer.selectedChat,
  );
  const customizer = useSelector((state: AppState) => state.customizer);

  return (
    <Card
      sx={{ display: 'flex', p: 0, height: '100%' }}
      elevation={customizer.isCardShadow ? 9 : 0}
      variant={!customizer.isCardShadow ? 'outlined' : undefined}
    >
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="error" />
      </Backdrop>
      <GroupChatSidebar
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)}
      />

      <Box flexGrow={1} height={'100%'}>
        <GroupChatContent
          toggleChatSidebar={() => setMobileSidebarOpen(true)}
        />
        {chatContent && (
          <>
            <Divider />
            <GroupChatMsgSent />
          </>
        )}
      </Box>
    </Card>
  );
}
