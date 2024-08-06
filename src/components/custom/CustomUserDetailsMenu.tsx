import styled from '@emotion/styled';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Avatar, IconButton, Typography } from '@mui/material';
import Menu from '@mui/material/Menu';
import { Box, BoxProps } from '@mui/system';
import Image from 'next/image';
import { MouseEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { IconDotsVertical } from '@tabler/icons-react';

import CrossIcon from '../../images/chatIcons/CrossIcon.png';
import CrossIcon1 from '../../images/chatIcons/CrossIcon1.png';
import { AppState, useDispatch } from '../../store/Store';
import { addNote } from '../../store/apps/chat/ChatSlice';
import { getChatHeadMain } from '../../utils/conversation';
import { formatAddress } from '../../utils/format';

import CustomFormTextArea from './form/CustomFormTextArea';

const CustomUserDetailsMenu = (props: any) => {
  const { imageIcon, menuProps, name, selectedChat } = props;
  const customizer = useSelector((state: AppState) => state.customizer);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    note: yup.string().required('Note is Required'),
  });

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { note: '' },
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const response = await dispatch(addNote(selectedChat?.id, data));
      if (response) {
        setAnchorEl(null);
        setValue('note', '');
        toast.success('Note Added successfully.');
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error((error as any)?.message || 'API Error! Please try again.');
    }
  };

  const Header = styled(Box)<BoxProps>(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }));

  let popupContent;

  if (name === 'Add Note') {
    popupContent = selectedChat && (
      <Box sx={{ padding: '5px 16px 5px 16px' }}>
        <Header>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Avatar
              alt={selectedChat?.to}
              sx={{ width: 60, height: 60, mr: 1, borderRadius: '10%' }}
              src={
                selectedChat?.Contact?.image?.src || '/images/profile/thumb.png'
              }
            />
            <Box>
              <Typography
                variant="h6"
                sx={{ fontSize: '11px', fontWeight: 400 }}
              >
                {getChatHeadMain(selectedChat)}
              </Typography>
              <Typography variant="caption">{selectedChat.from}</Typography>
            </Box>
          </Box>
          <Box
            sx={{
              ml: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <Image
              style={{ cursor: 'pointer' }}
              src={customizer?.activeMode === 'dark' ? CrossIcon : CrossIcon1}
              alt="CrossIcon"
              onClick={() => setAnchorEl(null)}
            />
          </Box>
        </Header>
        <Box
          sx={{ display: 'flex', alignItems: 'start', margin: '5px 0 5px 0' }}
        >
          <Typography
            variant="h6"
            sx={{ fontSize: '11px', fontWeight: 600, minWidth: '70px' }}
          >
            Job Title:
          </Typography>
          <Typography variant="h6" sx={{ fontSize: '11px', fontWeight: 700 }}>
            {selectedChat.Contact?.jobTitle || ''}
          </Typography>
        </Box>
        <Box
          sx={{ display: 'flex', alignItems: 'start', margin: '5px 0 5px 0' }}
        >
          <Typography
            variant="h6"
            sx={{ fontSize: '11px', fontWeight: 600, minWidth: '70px' }}
          >
            Company:
          </Typography>
          <Typography variant="h6" sx={{ fontSize: '11px', fontWeight: 700 }}>
            {selectedChat.Contact?.company || ''}
          </Typography>
        </Box>
        <Box
          sx={{ display: 'flex', alignItems: 'start', margin: '5px 0 5px 0' }}
        >
          <Typography
            variant="h6"
            sx={{ fontSize: '11px', fontWeight: 600, minWidth: '70px' }}
          >
            Status:
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontSize: '11px',
              fontWeight: 700,
              color:
                selectedChat.Contact?.status === 'ACTIVE'
                  ? '#41a2ff'
                  : '#d65050',
            }}
          >
            {selectedChat.Contact?.status || ''}
          </Typography>
        </Box>
        <Box
          sx={{ display: 'flex', alignItems: 'start', margin: '5px 0 5px 0' }}
        >
          <Typography
            variant="h6"
            sx={{ fontSize: '11px', fontWeight: 600, minWidth: '70px' }}
          >
            Address:
          </Typography>
          <Typography variant="h6" sx={{ fontSize: '11px', fontWeight: 700 }}>
            {formatAddress(
              selectedChat.Contact?.address?.street,
              selectedChat.Contact?.address?.city,
              selectedChat.Contact?.address?.state,
              selectedChat.Contact?.address?.zip,
            )}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'start' }}>
          <Box sx={{ minWidth: '20px', ml: 5 }}>
            <p style={{ color: '#78ACDD', margin: '0px' }}>•</p>
            <p
              style={{
                width: '2px',
                height: '38px',
                background: '#666874',
                margin: '0px 3px',
              }}
            ></p>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontSize: '11px', fontWeight: 800 }}>
              Admin Merchant
            </Typography>
            <Typography variant="h6" sx={{ fontSize: '11px', fontWeight: 600 }}>
              Sun, Jan 14 at 9:30 AM
            </Typography>
            <Typography variant="h6" sx={{ fontSize: '11px', fontWeight: 600 }}>
              Notes goes here
            </Typography>
          </Box>
        </Box>
        <Box sx={{ padding: '5px', mt: 1 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CustomFormTextArea
              name={'note'}
              label={'Enter Note'}
              errors={errors}
              control={control}
              rows={2}
            />
            <LoadingButton
              fullWidth
              type="submit"
              loading={loading}
              variant="contained"
            >
              Add Note
            </LoadingButton>
          </form>
        </Box>
      </Box>
    );
  } else if (name === 'Edit User') {
    popupContent = (
      <Typography variant="h6" sx={{ fontSize: '11px', fontWeight: 400, p: 2 }}>
        In Progress
      </Typography>
    );
  } else if (name === 'Call User') {
    popupContent = (
      <Typography variant="h6" sx={{ fontSize: '11px', fontWeight: 400, p: 2 }}>
        rinigning
      </Typography>
    );
  } else if (name === 'Status User') {
    popupContent = (
      <Typography variant="h6" sx={{ fontSize: '11px', fontWeight: 400, p: 2 }}>
        In Progress
      </Typography>
    );
  }

  return (
    <>
      <IconButton aria-haspopup="true" onClick={handleClick}>
        {imageIcon ? imageIcon : <IconDotsVertical stroke={1.5} />}
      </IconButton>

      <Menu
        keepMounted
        anchorEl={anchorEl}
        onClose={handleClose}
        open={Boolean(anchorEl)}
        {...menuProps}
        {...{
          anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
          transformOrigin: { vertical: 'top', horizontal: 'center' },
        }}
      >
        {popupContent}
      </Menu>
    </>
  );
};

export default CustomUserDetailsMenu;
