import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IconUserPlus } from '@tabler/icons-react';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { AppState } from '../../../store/Store';

const CustomTaggingComponent = (props: any) => {
  const { handleSelect, text } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { operator } = useSelector((state: AppState) => state.userReducer);
  const tagButton = useRef(null);

  useEffect(() => {
    const lastLetter = text?.slice(-1);
    if (lastLetter === '@') {
      setAnchorEl(tagButton?.current);
    } else {
      setAnchorEl(null);
    }
  }, [text]);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-haspopup="true"
        ref={tagButton}
        onClick={handleClick}
        size="small"
      >
        <IconUserPlus size={16} style={{ cursor: 'pointer' }} />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        onClose={handleClose}
        open={Boolean(anchorEl)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: 2 }}
      >
        {operator.map((option: any, index: number) => (
          <MenuItem
            key={index}
            sx={{ py: 1 }}
            onClick={(e) => {
              handleSelect({ text: option.name, id: option.id });
              handleClose();
            }}
          >
            {option.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default CustomTaggingComponent;
