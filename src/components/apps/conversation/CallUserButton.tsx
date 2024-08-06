import { Avatar, Badge, IconButton, Tooltip, styled } from '@mui/material';
import { IconPhone } from '@tabler/icons-react';

import { useAuth } from '../../../hooks/useAuth';
import useCallFeature from '../../../hooks/useCallFeature';
import { AppState, useDispatch, useSelector } from '../../../store/Store';
import { updateCallSliceState } from '../../../store/apps/calls/callsSlice';
import { SessionState } from '../../../types/apps/calls';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const CallUserButton = (props: any) => {
  const { name, selectedChat } = props;
  const { dialNumber, connected } = useSelector((state) => state.callsReducer);
  const { call, sessionCount } = useCallFeature();
  const dispatch = useDispatch();
  const customizer = useSelector((state: AppState) => state.customizer);

  const { settings } = useAuth();

  const dialHandler = () => {
    if (selectedChat?.Contact?.phone) {
      dispatch(updateCallSliceState({ key: 'isConnectingCall', value: true }));
      dispatch(
        updateCallSliceState({
          key: 'sessionState',
          value: SessionState.ringing,
        }),
      );
      dispatch(
        updateCallSliceState({
          key: 'dialNumber',
          value: selectedChat?.Contact?.phone,
        }),
      );
      dispatch(
        updateCallSliceState({
          key: 'selectedUser',
          value: selectedChat?.Contact || null,
        }),
      );
      dispatch(
        updateCallSliceState({
          key: 'from_number',
          value: settings?.defaultDid.phoneNumber || '',
        }),
      );
      dispatch(
        updateCallSliceState({
          key: 'selectedChat',
          value: {
            Contact: selectedChat?.Contact,
            id: selectedChat?.id,
            Did: selectedChat?.Did,
            to: selectedChat?.to,
          },
        }),
      );

      console.debug(
        'Dial Number',
        selectedChat?.Contact?.phone.replaceAll(
          '+1',
          '',
          selectedChat?.Contact?.phone,
        ),
      );
      call(
        selectedChat?.Contact?.phone.replaceAll(
          '+1',
          '',
          selectedChat?.Contact?.phone,
        ),
      );
    }
  };

  return (
    <Tooltip title={name}>
      <>
        <IconButton
          sx={{ width: '30px', height: '30px' }}
          onClick={dialHandler}
          disabled={sessionCount() > 0 || !connected ? true : false}
        >
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            variant={
              sessionCount() > 0 && dialNumber === selectedChat?.Contact?.phone
                ? 'dot'
                : undefined
            }
          >
            <Avatar
              sx={{
                width: '30px',
                height: '30px',
                padding: '0px',
                borderRadius: '0px',
                background: 'transparent',
              }}
            >
              <IconPhone
                color={customizer?.activeMode === 'light' ? 'black' : 'white'}
                stroke={1}
              />
            </Avatar>
          </StyledBadge>
        </IconButton>
      </>
    </Tooltip>
  );
};

export default CallUserButton;
