// mui imports
import {
  Chip,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import { IconCircle, IconCircleFilled } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { AppState, useSelector } from '../../../../../store/Store';

type NavGroup = {
  [x: string]: any;
  id?: string;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: any;
  href?: any;
  children?: NavGroup[];
  chip?: string;
  chipColor?: any;
  variant?: string | any;
  external?: boolean;
  level?: number;
  onClick?: React.MouseEvent<HTMLButtonElement, MouseEvent>;
};

interface ItemType {
  item: NavGroup;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  hideMenu?: any;
  level?: number | any;
  pathDirect: string;
  setSelectMenu: Function;
}

const NavItem = ({
  item,
  level,
  pathDirect,
  hideMenu,
  onClick,
  setSelectMenu,
}: ItemType) => {
  const customizer = useSelector((state: AppState) => state.customizer);
  const theme = useTheme();
  const { t } = useTranslation();
  const { pathname } = useRouter();

  const renderIcon = () => {
    if (Boolean(item?.icon)) {
      return level > 1 ? (
        <div style={{ textAlign: 'center', minWidth: '35px', margin: 'auto' }}>
          <Image
            src={item?.icon}
            width={customizer?.isCollapse ? 25 : 20}
            height={customizer?.isCollapse ? 25 : 20}
            alt=""
          />
          {customizer.isCollapse && (
            <Typography sx={{ lineHeight: '10px', fontSize: '0.6rem' }}>
              {item.title}
            </Typography>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', minWidth: '35px', margin: 'auto' }}>
          <Image
            src={item?.icon}
            width={customizer?.isCollapse ? 25 : 20}
            height={customizer?.isCollapse ? 25 : 20}
            alt=""
          />
          {customizer.isCollapse && (
            <Typography sx={{ lineHeight: '10px', fontSize: '0.6rem' }}>
              {item.title}
            </Typography>
          )}
        </div>
      );
    }
    if (item?.href === pathname) {
      return <IconCircleFilled stroke={1.5} size="0.5rem" />;
    }
    return <IconCircle stroke={1.5} size="0.5rem" />;
  };

  let ListItemStyled = styled(ListItemButton)(() => ({
    whiteSpace: 'nowrap',
    marginBottom: '2px',
    padding: '8px 10px',
    borderRadius: `${customizer.borderRadius}px`,
    backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
    color:
      level > 1 && pathDirect === item?.href ? `white !important` : 'white',
    paddingLeft: hideMenu ? '10px' : level > 2 ? `${level * 15}px` : '10px',
    '&:hover': {
      // backgroundColor: '#a953df',
      backgroundColor: `${theme.palette.action.active}`,
      color: 'white',
    },
    '&.Mui-selected': {
      color: 'white',
      // backgroundColor: '#a953df',
       backgroundColor: `${theme.palette.action.active}`,
      '&:hover': {
        // backgroundColor: '#a953df',
       backgroundColor: `${theme.palette.action.active}`,
        color: 'white',
      },
    },
  }));

  if (customizer?.isCollapse) {
    ListItemStyled = styled(ListItemButton)(() => ({
      whiteSpace: 'nowrap',
      marginBottom: '5px',
      padding: '0.1px',
      lineHight: '15px',
      borderRadius: `${customizer.borderRadius}px`,
      backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
      color:
        level > 1 && pathDirect === item?.href ? `white !important` : 'white',
      paddingLeft:
        hideMenu && item.title !== 'Dashboard'
          ? '12px !important'
          : level > 2
          ? `${level * 15}px`
          : '5px !important',
      '&:hover': {
        backgroundColor: `${theme.palette.action.active}`,
        color: 'white',
      },
      '&.Mui-selected': {
        color: 'white',
        // backgroundColor: '#250d41',
        backgroundColor: `${theme.palette.action.active}`,
        '&:hover': {
          backgroundColor: `${theme.palette.action.active}`,
          color: 'white',
        },
      },
    }));
  } else {
    ListItemStyled = styled(ListItemButton)(() => ({
      whiteSpace: 'nowrap',
      marginBottom: '2px',
      padding: '8px 10px',
      borderRadius: `${customizer.borderRadius}px`,
      backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
      color:
        level > 1 && pathDirect === item?.href ? `white !important` : 'white',
      paddingLeft: hideMenu ? '10px' : level > 2 ? `${level * 15}px` : '10px',
      '&:hover': {
        // backgroundColor: '#a953df',
        backgroundColor: `${theme.palette.action.active}`,
        color: 'white',
      },
      '&.Mui-selected': {
        color: 'white',
        // backgroundColor: '#a953df',
        backgroundColor: `${theme.palette.action.active}`,
        '&:hover': {
          // backgroundColor: '#a953df',
          backgroundColor: `${theme.palette.action.active}`,
          color: 'white',
        },
      },
    }));
  }

  return (
    <List
      component="li"
      disablePadding
      key={item?.id && item.title}
      onMouseEnter={() => setSelectMenu(false)}
    >
      <Link href={item.href} target={item?.external ? '_blank' : ''}>
        <ListItemStyled
          style={{ justifyContent: 'center', padding: '5px' }}
          disabled={item?.disabled}
          selected={pathDirect === item?.href}
          onClick={onClick}
        >
          <ListItemIcon
            sx={{
              minWidth: '36px',
              p: '3px 0',
              color:
                level > 1 && pathDirect === item?.href
                  ? `${theme.palette.action.active}!important`
                  : 'inherit',
            }}
          >
            {renderIcon()}
          </ListItemIcon>
          <ListItemText>
            {hideMenu ? '' : <>{t(`${item?.title}`)}</>}
            <br />
            {item?.subtitle ? (
              <Typography variant="caption">
                {hideMenu ? '' : item?.subtitle}
              </Typography>
            ) : (
              ''
            )}
          </ListItemText>

          {!item?.chip || hideMenu ? null : (
            <Chip
              color={item?.chipColor}
              variant={item?.variant ? item?.variant : 'filled'}
              size="small"
              label={item?.chip}
            />
          )}
        </ListItemStyled>
      </Link>
    </List>
  );
};

export default NavItem;
