import styled from '@emotion/styled';
import {
  Badge,
  Box,
  BoxProps,
  Drawer,
  IconButton,
  InputAdornment,
  Theme,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import {
  IconArrowsMaximize,
  IconEdit,
  IconFilter,
  IconX,
} from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { AppState, useDispatch } from '../../../store/Store';
import { getNewChats } from '../../../store/apps/chat/ChatSlice';
import CustomTextField from '../../custom/CustomTextField';

import ChatDialog from './ChatDidDialog';
import ChatFilterDialog from './ChatFilterDialog';
import ChatListing from './ChatListing';

interface chatType {
  isMobileSidebarOpen: boolean;
  onSidebarClose: (event: React.MouseEvent<HTMLElement>) => void;
}

const ChatSidebar = ({ isMobileSidebarOpen, onSidebarClose }: chatType) => {
  const dispatch = useDispatch();
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  const customizer = useSelector((state: AppState) => state.customizer);
  const [chatCollaps, setCollapsChat] = useState<any>(true);
  const [didDialog, setDidDialog] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<any>(null);
  const [dest, setDest] = useState<any>(undefined);
  const [filterDialog, setFilterDialog] = useState<boolean>(false);
  const store = useSelector((state: AppState) => state.chatReducer);

  const Header = styled(Box)<BoxProps>(() => ({
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    justifyContent: 'space-between',
    paddingRight: 0,
  }));

  useEffect(() => {
    if (searchText !== null) {
      let timeoutId: NodeJS.Timeout;
      const debounce = (func: () => void, delay: number) => {
        return () => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(func, delay);
        };
      };

      const handleSearch = debounce(() => {
        const payload = {
          searchText,
          dateFlag: store.dateFlag,
          filterData: store.dateFlag,
        };
        dispatch(getNewChats(payload));
      }, 1000);
      handleSearch();

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [searchText]);

  useEffect(() => {
    const collapse_flag = localStorage.getItem('collapse_flag');
    if (collapse_flag === null) {
      localStorage.setItem('collapse_flag', 'true');
    }
    if (collapse_flag === 'false') {
      setCollapsChat(false);
    }
  }, []);

  const handleApplyFilter = (filterData: any) => {
    const payload = {
      searchText: Boolean(searchText) ? searchText : '',
      ...filterData,
    };
    dispatch(getNewChats(payload));
  };

  const handleMessage = () => {
    if (Boolean(searchText) && !isNaN(searchText)) {
      setDest({ phone: searchText.trim(), firstName: '' });
    } else {
      setDest('');
    }
    setDidDialog(true);
  };

  const handleCollapseChat = () => {
    let collapse_flag: any = localStorage.getItem('collapse_flag') === 'true';
    collapse_flag = !collapse_flag;
    localStorage.setItem('collapse_flag', collapse_flag.toString());
    setCollapsChat(collapse_flag);
  };

  return (
    <Drawer
      open={isMobileSidebarOpen}
      onClose={onSidebarClose}
      variant={lgUp ? 'permanent' : 'temporary'}
      sx={{
        width: customizer?.isCollapse ? '23%' : '27%',
        flexShrink: 0,
        zIndex: lgUp ? 0 : 1,
        [`& .MuiDrawer-paper`]: { position: 'relative' },
        '& .MuiPaper-root': {
          background:
            customizer?.activeMode === 'dark'
              ? '#323441 !important'
              : '#eeeeee !important',
        },
      }}
    >
      <Header>
        <Typography
          variant="h2"
          color={customizer?.activeMode === 'dark' ? '#fff' : '#979797'}
        >
          Messages
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}
        >
          <Tooltip title={'Toggle Expand'}>
            <IconButton onClick={handleCollapseChat}>
              <IconArrowsMaximize strokeWidth={1} />
            </IconButton>
          </Tooltip>
          <Box display={'flex'}>
            <Tooltip title={'New Message'}>
              <IconButton onClick={handleMessage}>
                <IconEdit strokeWidth={1} />
              </IconButton>
            </Tooltip>
            <Tooltip title={'Search and Sort'}>
              <IconButton
                onClick={() => {
                  setFilterDialog(true);
                }}
              >
                <Badge
                  badgeContent={
                    !store.dateFlag || Boolean(store.filterData) ? ' ' : 0
                  }
                  variant="dot"
                  color="primary"
                >
                  <IconFilter stroke={1} />
                </Badge>
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Header>

      <Box
        sx={{
          height: 60,
          display: 'flex',
          alignItems: 'center',
          px: 1,
          justifyContent: 'space-between',
          borderRadius: 0,
        }}
      >
        <CustomTextField
          fullWidth
          value={searchText || ''}
          label="Search"
          onChange={(event: any) => setSearchText(event?.target?.value)}
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="refresh"
                  size="small"
                  onClick={() => setSearchText('')}
                >
                  <IconX />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <ChatListing chatCollaps={chatCollaps} />
      <ChatDialog
        open={didDialog}
        toggle={() => {
          setDidDialog(false);
          setDest('');
        }}
        dest={dest}
      />
      <ChatFilterDialog
        filterDialog={filterDialog}
        setFilterDialog={setFilterDialog}
        handleFilterApply={(data: any) => {
          handleApplyFilter(data);
        }}
      />
    </Drawer>
  );
};

export default ChatSidebar;
