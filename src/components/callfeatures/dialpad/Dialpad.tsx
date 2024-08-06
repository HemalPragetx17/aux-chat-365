import { ReactNode } from 'react';

import { Box, Button, InputBase, Stack, Typography } from '@mui/material';

import { updateCallSliceState } from '../../../store/apps/calls/callsSlice';
import { useDispatch, useSelector } from '../../../store/Store';

const DialPadButtonList = [
  [
    { value: '1', label: '' },
    { value: '2', label: 'ABC' },
    { value: '3', label: 'DEF' },
  ],
  [
    { value: '4', label: 'GHI' },
    { value: '5', label: 'JKL' },
    { value: '6', label: 'MNO' },
  ],
  [
    { value: '7', label: 'PQRS' },
    { value: '8', label: 'TUV' },
    { value: '9', label: 'WXYZ' },
  ],
  [
    { value: '*', label: '' },
    { value: '0', label: '+' },
    { value: '#', label: '' },
  ],
];

const buttonBorderRadius = (rowindex: number, buttonIndex: number) => {
  let borderRadius = '10% 10% 10% 10%';
  switch (rowindex) {
    case 0:
      switch (buttonIndex) {
        case 0:
          borderRadius = '40% 10% 10% 10%';
          break;
        case 2:
          borderRadius = '10% 40% 10% 10%';
          break;
        default:
          borderRadius = '10% 10% 10% 10%';
      }
      break;
    case 2:
      switch (buttonIndex) {
        case 0:
          borderRadius = '10% 10% 10% 40%';
          break;
        case 2:
          borderRadius = '10% 10% 40% 10%';
          break;
        default:
          borderRadius = '10% 10% 10% 10%';
      }
      break;
    case 3:
      switch (buttonIndex) {
        case 0:
          borderRadius = '40% 10% 40% 40%';
          break;
        case 2:
          borderRadius = '10% 40% 40% 40%';
          break;
        default:
          borderRadius = '10% 10% 40% 40%';
      }
  }
  return borderRadius;
};

type DialPadPropsType = {
  number: string;
  changeHandler: (e: any) => void;
  typeNumber: (num: string) => void;
  clearNumber: () => void;
  children?: ReactNode;
  isDtmf?: boolean;
};
const DialPad = (props: DialPadPropsType) => {
  const {
    number,
    changeHandler,
    typeNumber,
    clearNumber,
    children,
    isDtmf = false,
  } = props;
  const { callOptionModal } = useSelector((state) => state.callsReducer);

  const dispatch = useDispatch();
  const closeDialPadHandle = () => {
    dispatch(updateCallSliceState({ key: 'toggleDialPad', value: false }));
  };

  return (
    <Box>
      {/* <IconButton sx={{ position: 'absolute', top: '10px', right: '10px', padding: '0px', width: '15px', height: '15px', marginBottom: '5px', color: '#d9d9d98c' }}
        onClick={closeDialPadHandle}
      >
        <Icon icon={"fa:close"} />
      </IconButton> */}
      <Stack
        direction={'column'}
        sx={{ width: '100%', height: '100%', marginTop: '5px' }}
        alignItems={'center'}
        justifyContent={'center'}
      >
        {!isDtmf && (
          <Stack
            direction={'column'}
            sx={{ marginTop: '15px', marginBottom: '15px', width: '100%' }}
            alignItems={'center'}
            justifyContent={'center'}
          >
            <InputBase
              sx={{ flex: 1, width: '100%' }}
              placeholder="Enter Number"
              inputProps={{
                'aria-label': 'Enter Number',
                sx: { textAlign: 'center', color: '#fff', fontSize: '23px' },
              }}
              value={number}
              onChange={changeHandler}
            />
            <Typography
              sx={{
                fontSize: '12px',
                textDecoration: 'underline',
                color: '#49A8FF',
                bodrer: '1px solid #49A8FF',
                fontWeight: '500',
              }}
            >
              Add Contact
            </Typography>
          </Stack>
        )}

        <Stack spacing={2}>
          {DialPadButtonList.map((button: any, index: number) => {
            return (
              <Stack
                direction={'row'}
                justifyContent={'center'}
                alignItems={'center'}
                key={index}
                spacing={2}
                sx={{ cursor: 'pointer' }}
              >
                {button.map((item: any, buttonIndex: number) => {
                  return (
                    <Button
                      key={item.value}
                      sx={{
                        width: '67px',
                        height: '67px',
                        background: '#d9d9d921',
                        color: '#fff',
                        borderRadius: buttonBorderRadius(index, buttonIndex),
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                      }}
                      onClick={() => typeNumber(item.value)}
                    >
                      <Typography sx={{ fontSize: '30px' }}>
                        {item.value}
                      </Typography>
                      <Typography sx={{ marginTop: '5px', fontSize: '10px' }}>
                        {item.label}
                      </Typography>
                    </Button>
                  );
                })}
              </Stack>
            );
          })}

          {children && children}
        </Stack>
      </Stack>
    </Box>
  );
};

export default DialPad;
