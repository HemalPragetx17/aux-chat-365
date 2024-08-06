import {
  Collapse,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import {
  IconChevronDown,
  IconChevronRight,
  IconCircle,
} from '@tabler/icons-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { AppState, useSelector } from '../../../../../store/Store';
import NavItem from '../NavItem';

type NavGroupProps = {
  [x: string]: any;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: any;
  href?: any;
};

interface NavCollapseProps {
  menu: NavGroupProps;
  level: number;
  pathWithoutLastPart: any;
  pathDirect: any;
  hideMenu: any;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  setSelectMenu: Function;
  setSelectMenuItems: any;
}

// FC Component For Dropdown Menu
const NavCollapse = ({
  menu,
  level,
  pathWithoutLastPart,
  pathDirect,
  hideMenu,
  onClick,
  setSelectMenu,
  setSelectMenuItems,
}: NavCollapseProps) => {
  const customizer = useSelector((state: AppState) => state.customizer);
  const { pathname, push } = useRouter();
  const [open, setOpen] = useState(false);
  const theme = useTheme()

  const renderIcon = () => {
    if (Boolean(menu?.icon)) {
      return level > 1 ? (
        <div style={{ textAlign: 'center', minWidth: '35px', margin: 'auto' }}>
          <Image
            src={menu?.icon}
            width={customizer?.isCollapse ? 25 : 20}
            height={customizer?.isCollapse ? 25 : 20}
            alt=""
          />
          {customizer.isCollapse && (
            <Typography sx={{ lineHeight: '10px', fontSize: '0.6rem' }}>
              {menu.title}
            </Typography>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', minWidth: '35px', margin: 'auto' }}>
          <Image
            src={menu?.icon}
            width={customizer?.isCollapse ? 25 : 20}
            height={customizer?.isCollapse ? 25 : 20}
            alt=""
          />
          {customizer.isCollapse && (
            <Typography sx={{ lineHeight: '10px', fontSize: '0.6rem' }}>
              {menu.title}
            </Typography>
          )}
        </div>
      );
    }
    return <IconCircle stroke={1.5} size="0.5rem" />;
  };

  // menu collapse for sub-levels
  React.useEffect(() => {
    setOpen(false);
    menu?.children?.forEach((item: any) => {
      if (item?.href === pathname) {
        setOpen(true);
      }
    });
  }, [pathname, menu.children]);

  React.useEffect(() => {
    const shrinked = customizer?.isCollapse && !customizer?.isSidebarHover;
    if (shrinked) {
      setOpen(false);
    } else {
      menu?.children?.forEach((item: any) => {
        if (item?.href === pathname) {
          setOpen(true);
        }
      });
    }
  }, [customizer?.isCollapse, customizer?.isSidebarHover]);

  let ListItemStyled = styled(ListItemButton)(() => ({
    marginBottom: '2px',
    padding: '8px 10px',
    paddingLeft: hideMenu ? '10px' : level > 2 ? `${level * 15}px` : '10px',
    // backgroundColor: pathname.includes(menu.href) ? `#000000 !important` : '',
    backgroundColor: pathname.includes(menu.href) ? `${theme.palette.action.active} !important` : '',
    whiteSpace: 'nowrap',
    '&:hover': {
      // backgroundColor: pathname.includes(menu.href)
      //   ? '#461472 !important'
      //   : '#a953df',
      backgroundColor: pathname.includes(menu.href)
        ? `${theme.palette.action.active} !important`
        : `${theme.palette.action.active}`,
      color: pathname.includes(menu.href) ? 'white' : 'white',
    },
    color: pathname.includes(menu.href) ? 'white' : `white`,
    borderRadius: `${customizer.borderRadius}px`,
  }));

  if (customizer?.isCollapse) {
    ListItemStyled = styled(ListItemButton)(() => ({
      marginBottom: '5px',
      padding: '5px', // 4px lineHight: "15px"
      lineHight: '15px',
      paddingLeft:
        menu.title === 'Admin Settings' || menu.title === 'Management'
          ? '0px'
          : hideMenu && menu.title !== 'Campaign'
            ? '11px'
            : level > 2
              ? `${level * 15}px`
              : '8px',
      // backgroundColor: pathname.includes(menu.href) ? `#000000 !important` : '',
      backgroundColor: pathname.includes(menu.href) ? `${theme.palette.action.active} !important` : '',

      whiteSpace: 'nowrap',
      '&:hover': {
        backgroundColor: pathname.includes(menu.href)
          ? `${theme.palette.action.active} !important`
          : `${theme.palette.action.active} !important`,
        color: pathname.includes(menu.href) ? 'white' : 'white',
      },
      color: pathname.includes(menu.href) ? 'white' : `white`,
      borderRadius: `${customizer.borderRadius}px`,
    }));
  } else {
    ListItemStyled = styled(ListItemButton)(() => ({
      marginBottom: '1px',
      padding: '6px 10px',
      paddingLeft: hideMenu ? '5px' : level > 2 ? `${level * 15}px` : '5px',
      // backgroundColor: pathname.includes(menu.href) ? `#000000 !important` : '',
      backgroundColor: pathname.includes(menu.href) ? `${theme.palette.action.active} !important` : '',

      whiteSpace: 'nowrap',
      '&:hover': {
        backgroundColor: pathname.includes(menu.href)
          ? `${theme.palette.action.active} !important`
          : `${theme.palette.action.active}`,
        color: pathname.includes(menu.href) ? 'white' : 'white',
      },
      color: pathname.includes(menu.href) ? 'white' : `white`,
      borderRadius: `${customizer.borderRadius}px`,
    }));
  }

  // If Menu has Children
  const submenus = menu.children?.map((item: any) => {
    if (item.children) {
      return (
        <NavCollapse
          key={item?.id}
          setSelectMenuItems={setSelectMenuItems}
          menu={item}
          level={level + 1}
          setSelectMenu={setSelectMenu}
          pathWithoutLastPart={pathWithoutLastPart}
          pathDirect={pathDirect}
          hideMenu={hideMenu}
          onClick={onClick}
        />
      );
    } else {
      return (
        <NavItem
          key={item.id}
          item={item}
          level={level + 1}
          pathDirect={pathDirect}
          hideMenu={hideMenu}
          onClick={onClick}
          setSelectMenu={setSelectMenu}
        />
      );
    }
  });

  return (
    <>
      <ListItemStyled
        key={menu?.id}
        onClick={() => {
          setOpen(!open);
          if (customizer?.isCollapse) {
            push(menu?.children[0]?.href);
          }
        }}
        onMouseEnter={() => {
          if (customizer?.isCollapse) {
            setSelectMenu(true);
            setSelectMenuItems(menu);
          }
        }}
        selected={pathWithoutLastPart === menu.href}
      >
        <ListItemIcon
          sx={{
            minWidth: '36px',
            p: '3px 0',
            color: 'inherit',
          }}
        >
          {renderIcon()}
        </ListItemIcon>
        <ListItemText color="inherit">
          {hideMenu ? '' : <>{menu.title}</>}
        </ListItemText>
        {!open ? (
          <IconChevronRight
            size="1rem"
            style={{
              right: '0',
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />
        ) : (
          <IconChevronDown
            size="1rem"
            style={{
              right: '0',
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />
        )}
      </ListItemStyled>
      {!customizer?.isCollapse && (
        <Collapse in={open} timeout="auto" sx={{ marginLeft: '20px' }}>
          {submenus}
        </Collapse>
      )}
    </>
  );
};

export default NavCollapse;
