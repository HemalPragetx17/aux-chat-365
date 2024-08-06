import { Icon } from '@iconify/react';
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  Stack,
  Typography,
} from '@mui/material';

import {
  updateCallOptionModalState,
  updateCallSliceState,
} from '../../../store/apps/calls/callsSlice';
import { useDispatch, useSelector } from '../../../store/Store';

const CallOptionActionModal = () => {
  const dispatch = useDispatch();
  const { callOptionModal } = useSelector((state) => state.callsReducer);

  const toggleCallOptionModal = () => {
    dispatch(updateCallOptionModalState({ key: 'toggle', value: false }));
    dispatch(updateCallOptionModalState({ key: 'callTransfer', value: false }));
  };

  const blindTransferHandle = () => {
    dispatch(updateCallOptionModalState({ key: 'callTransfer', value: true }));
    dispatch(updateCallOptionModalState({ key: 'toggle', value: false }));
    dispatch(
      updateCallOptionModalState({ key: 'isAttendedTransfer', value: false }),
    );

    dispatch(
      updateCallOptionModalState({ key: 'isBlindTransfer', value: true }),
    );
  };

  const attendantTransferHandle = () => {
    dispatch(updateCallOptionModalState({ key: 'callTransfer', value: true }));
    dispatch(updateCallOptionModalState({ key: 'toggle', value: false }));
    dispatch(
      updateCallOptionModalState({ key: 'isBlindTransfer', value: false }),
    );
    dispatch(
      updateCallOptionModalState({ key: 'isAttendedTransfer', value: true }),
    );
  };

  const addCallHandler = () => {
    dispatch(updateCallOptionModalState({ key: 'toggle', value: false }));
    dispatch(updateCallSliceState({ key: 'toggleDialPad', value: true }));
  };
  return (
    <Stack
      sx={{
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.6)',
        position: 'absolute',
      }}
    >
      <Stack
        sx={{
          position: 'relative',
          bottom: '0',
          width: '100%',
          height: 'max-content',
          marginTop: '30px',
          minHeight: '229px',
        }}
        direction={'row'}
        spacing={1}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Box
          sx={{
            width: '180px',
            maxWidth: '180px',
            height: 'auto',
            background: '#323441',
            border: '2px solid #62626D',
            transition: '1s width',
            '&::after': {
              position: 'absolute',
              height: '15px',
              borderRadius: '0px',
              content: "''",
              background: '#62626D',
              right: '-11px',
              bottom: '18px !important',
              width: '15px',
              zIndex: '-1',
              transform: 'rotate(45deg)',
            },
          }}
        >
          {!callOptionModal.callTransfer && (
            <>
              <nav aria-label="main mailbox folders">
                <List>
                  <ListItem
                    disablePadding
                    sx={{
                      background: 'transparent',
                      display: 'flex',
                      cursor: 'pointer',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      margin: '3px 0',
                    }}
                    onClick={addCallHandler}
                  >
                    <Stack
                      sx={{ color: '#9193A4', width: '100%', padding: '2px' }}
                      direction={'row'}
                      spacing={1}
                      alignItems={'center'}
                    >
                      <Icon
                        icon={'fa-solid:user-plus'}
                        width={20}
                        height={20}
                      />
                      <Typography>Add people</Typography>
                    </Stack>
                  </ListItem>
                  <ListItem
                    disablePadding
                    sx={{
                      background: 'transparent',
                      display: 'flex',
                      cursor: 'pointer',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      margin: '3px 0',
                    }}
                  >
                    <Stack
                      sx={{ color: '#9193A4', width: '100%', padding: '2px' }}
                      direction={'row'}
                      spacing={1}
                      alignItems={'center'}
                    >
                      <Icon
                        icon={'fluent:call-transfer-24-filled'}
                        width={20}
                        height={20}
                      />
                      <Typography>Transfer call</Typography>
                    </Stack>
                  </ListItem>
                </List>
              </nav>
              <Divider sx={{ background: '#62626D', width: '100%' }} />
              <nav aria-label="secondary mailbox folders">
                <List>
                  <ListItem
                    disablePadding
                    sx={{
                      background: 'transparent',
                      display: 'flex',
                      cursor: 'pointer',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      margin: '3px 0',
                    }}
                  >
                    <Stack
                      sx={{ color: '#fff', width: '100%', padding: '2px' }}
                      direction={'row'}
                      spacing={1}
                      alignItems={'center'}
                    >
                      <Icon
                        icon={'fluent:call-end-24-filled'}
                        width={20}
                        height={20}
                        color={'#ef3b14'}
                      />
                      <Typography sx={{ fontSize: '14px' }}>
                        End call
                      </Typography>
                    </Stack>
                  </ListItem>
                </List>
              </nav>
            </>
          )}
          {/* <Divider sx={{ background: '#62626D', width: '100%' }} />
                    <nav aria-label="secondary mailbox folders">
                        <List>
                            <ListItem disablePadding sx={{ background: 'transparent', display: 'flex', cursor: 'pointer', justifyContent: 'space-between', alignItems: 'center', margin: '3px 0' }}>
                                <Stack sx={{ color: '#fff', width: '100%', padding: '2px' }} direction={"row"} spacing={1} alignItems={"center"} >
                                    <Icon icon={"fa:microphone-slash"} width={20} height={20} />
                                    <Typography>Mute mic</Typography>
                                </Stack>
                            </ListItem>
                            <ListItem disablePadding sx={{ background: 'transparent', display: 'flex', cursor: 'pointer', justifyContent: 'space-between', alignItems: 'center', margin: '3px 0' }}>
                                <Stack sx={{ color: '#fff', width: '100%', padding: '2px' }} direction={"row"} spacing={1} alignItems={"center"} >
                                    <Icon icon={"material-symbols:dialpad"} width={20} height={20} />
                                    <Typography>Show keypad</Typography>
                                </Stack>
                            </ListItem>
                            <ListItem disablePadding sx={{ background: 'transparent', display: 'flex', cursor: 'pointer', justifyContent: 'space-between', alignItems: 'center', margin: '3px 0' }}>
                                <Stack sx={{ color: '#fff', width: '100%', padding: '2px' }} direction={"row"} spacing={1} alignItems={"center"} >
                                    <Icon icon={"fa:microphone-slash"} width={20} height={20} />
                                    <Typography>Mute mic</Typography>
                                </Stack>
                            </ListItem>


                        </List>
                    </nav> */}

          {callOptionModal.callTransfer && (
            <nav aria-label="secondary mailbox folders">
              <List sx={{ padding: '5px' }}>
                <ListItem
                  disablePadding
                  sx={{
                    background: 'transparent',
                    display: 'flex',
                    cursor: 'pointer',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    margin: '3px 0',
                  }}
                  onClick={blindTransferHandle}
                >
                  <Stack
                    sx={{ color: '#fff', width: '100%', padding: '2px' }}
                    direction={'row'}
                    spacing={1}
                    alignItems={'center'}
                  >
                    <Icon icon={'wpf:call-transfer'} width={20} height={20} />
                    <Typography sx={{ fontSize: '14px' }}>
                      Blind Transfer
                    </Typography>
                  </Stack>
                </ListItem>
                <ListItem
                  disablePadding
                  sx={{
                    background: 'transparent',
                    display: 'flex',
                    cursor: 'pointer',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    margin: '3px 0',
                  }}
                  onClick={attendantTransferHandle}
                >
                  <Stack
                    sx={{ color: '#fff', width: '100%', padding: '2px' }}
                    direction={'row'}
                    spacing={1}
                    alignItems={'center'}
                  >
                    <Icon
                      icon={'fluent-mdl2:transfer-call'}
                      width={20}
                      height={20}
                    />
                    <Typography sx={{ fontSize: '14px' }}>
                      Attended Transfer
                    </Typography>
                  </Stack>
                </ListItem>
              </List>
            </nav>
          )}
        </Box>

        <IconButton
          sx={{
            width: '40px',
            height: '40px',
            background: '#62626D',
            color: '#fff',
            borderRadius: '50%',
          }}
          onClick={toggleCallOptionModal}
        >
          <Icon icon={'formkit:close'} />
        </IconButton>
      </Stack>
    </Stack>
  );
};

export default CallOptionActionModal;
