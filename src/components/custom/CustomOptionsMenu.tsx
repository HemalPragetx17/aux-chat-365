import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IconDotsVertical } from '@tabler/icons-react';
import Link from 'next/link';
import { MouseEvent, ReactNode, useState } from 'react';

const MenuItemWrapper = ({
  children,
  option,
}: {
  children: ReactNode;
  option: any;
}) => {
  if (option.href) {
    return (
      <Box
        component={Link}
        href={option.href}
        {...option.linkProps}
        sx={{
          px: 4,
          py: 1.5,
          width: '100%',
          display: 'flex',
          color: 'inherit',
          alignItems: 'center',
          textDecoration: 'none',
        }}
      >
        {children}
      </Box>
    );
  } else {
    return <>{children}</>;
  }
};

const CustomOptionsMenu = (props: any) => {
  const { icon, options, menuProps, leftAlignMenu, iconButtonProps } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
        onClick={handleClick}
        {...iconButtonProps}
      >
        {icon ? icon : <IconDotsVertical stroke={1.5} />}
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        onClose={handleClose}
        open={Boolean(anchorEl)}
        {...(!leftAlignMenu && {
          anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
          transformOrigin: { vertical: 'top', horizontal: 'right' },
        })}
        {...menuProps}
      >
        {options.map((option: any, index: number) => {
          if (typeof option === 'string') {
            return (
              <MenuItem key={index} onClick={handleClose}>
                {option}
              </MenuItem>
            );
          } else if ('divider' in option) {
            return (
              option.divider && <Divider key={index} {...option.dividerProps} />
            );
          } else {
            return (
              <MenuItem
                key={index}
                {...option.menuItemProps}
                {...(option.href && { sx: { p: 0 } })}
                sx={{ pY: 1 }}
                onClick={(e) => {
                  handleClose();
                  option.menuItemProps && option.menuItemProps.onClick
                    ? option.menuItemProps.onClick(e)
                    : null;
                }}
              >
                <MenuItemWrapper option={option}>
                  {option.icon ? option.icon : null}
                  {option.text}
                </MenuItemWrapper>
              </MenuItem>
            );
          }
        })}
      </Menu>
    </>
  );
};

export default CustomOptionsMenu;
