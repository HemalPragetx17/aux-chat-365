import { Box, List, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '../../../../hooks/useAuth';
import { AppState, useDispatch, useSelector } from '../../../../store/Store';
import { toggleMobileSidebar } from '../../../../store/customizer/CustomizerSlice';
import axios from '../../../../utils/axios';

import NavCollapse from './NavCollapse';
import NavItem from './NavItem';

interface SidebarItemsProps {
  setSelectMenu: Function;
  setSelectMenuItems: any;
}

const SidebarItems = ({
  setSelectMenu,
  setSelectMenuItems,
}: SidebarItemsProps) => {
  const { pathname } = useRouter();
  const pathDirect = pathname;
  const pathWithoutLastPart = pathname.slice(0, pathname.lastIndexOf('/'));
  const customizer = useSelector((state: AppState) => state.customizer);
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up('lg'));
  const hideMenu: any = lgUp
    ? customizer.isCollapse && !customizer.isSidebarHover
    : '';
  const [navItems, setNavItems] = useState<any>([]);
  const dispatch = useDispatch();
  const { user } = useAuth();

  useEffect(() => {
    fetchUserMenu();
  }, [user]);

  const fetchUserMenu = useCallback(async () => {
    if (Boolean(user)) {
      const response = await axios.get(`/users/menu/${user?.uid}`);
      const menu = response.status === 200 ? response.data : [];
      const parent = menu
        .filter((data: any) => data.parentId === null)
        .map((data: any) => {
          const { id } = data;
          const children = menu.filter((child: any) => child.parentId === id);
          return {
            ...data,
            children,
          };
        });
      setNavItems(parent);
    }
  }, [user]);

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0, mt: '5px' }} className="sidebarNav">
        {navItems.map((item: any, index: number) => {
          if (item.children?.length > 0) {
            return (
              <NavCollapse
                setSelectMenuItems={setSelectMenuItems}
                menu={{ ...item }}
                pathDirect={pathDirect}
                hideMenu={hideMenu}
                pathWithoutLastPart={pathWithoutLastPart}
                level={1}
                key={index}
                setSelectMenu={setSelectMenu}
                onClick={() => dispatch(toggleMobileSidebar())}
              />
            );
          } else {
            return (
              <NavItem
                item={{ ...item }}
                key={index}
                pathDirect={pathDirect}
                hideMenu={hideMenu}
                setSelectMenu={setSelectMenu}
                onClick={() => dispatch(toggleMobileSidebar())}
              />
            );
          }
        })}
      </List>
    </Box>
  );
};
export default SidebarItems;
