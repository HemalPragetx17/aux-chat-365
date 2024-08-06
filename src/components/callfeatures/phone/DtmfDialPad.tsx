import { useEffect, useState } from 'react';
import Draggable from 'react-draggable';

import { Icon } from '@iconify/react';
import { IconButton, Stack } from '@mui/material';

import useCallFeature from '../../../hooks/useCallFeature';
import { updateCallOptionModalState } from '../../../store/apps/calls/callsSlice';
import { useDispatch, useSelector } from '../../../store/Store';
import DialPad from '../dialpad/Dialpad';

const DtmfDialPad = () => {
  const [number, setNumber] = useState('');
  const { callOptionModal } = useSelector((state) => state.callsReducer);
  const { dtmf } = useCallFeature();
  const dispatch = useDispatch();
  const clearNumber = () => {
    setNumber((prv: any) => prv.substring(0, prv.length - 1));
  };
  const changeHandler = (e: any) => {
    setNumber(e.target.value);
  };
  const typeNumber = (num: any) => {
    setNumber(num);
  };

  const closeDialPadHandle = () => {
    dispatch(updateCallOptionModalState({ key: 'dtmf', value: false }));
  };

  useEffect(() => {
    if (number && callOptionModal.dtmf) {
      dtmf(number);
    }
  }, [number]);

  return (
    <Draggable>
      <Stack
        sx={{
          width: '320px',
          height: '400px',
          border: '4px solid #49A8FF',
          zIndex: 99999,
          position: 'absolute',
          top: '30px',
          right: '61px',
          borderRadius: '20px 20px 20px 129px',
          background: '#323441',
        }}
      >
        <IconButton
          sx={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            padding: '0px',
            width: '15px',
            height: '15px',
            marginBottom: '5px',
            color: '#d9d9d98c',
          }}
          onClick={closeDialPadHandle}
        >
          <Icon icon={'fa:close'} />
        </IconButton>
        <Stack sx={{ marginTop: '30px' }}>
          <DialPad
            number={number}
            clearNumber={clearNumber}
            typeNumber={typeNumber}
            changeHandler={changeHandler}
            isDtmf={true}
          />
        </Stack>
      </Stack>
    </Draggable>
  );
};

export default DtmfDialPad;
