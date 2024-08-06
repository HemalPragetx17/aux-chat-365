import {
  Box,
  Drawer,
  MenuItem,
  MenuList,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import Scrollbar from '../../../../components/custom-scroll/Scrollbar';
import menuIcon from '../../../../images/side_icon/humber.png';
import { AppState, useDispatch, useSelector } from '../../../../store/Store';
import {
  toggleMobileSidebar,
  toggleSidebar,
} from '../../../../store/customizer/CustomizerSlice';
import Logo from '../../shared/logo/Logo';

import SidebarItems from './SidebarItems';
import { Profile } from './SidebarProfile/Profile';

const Sidebar = () => {
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up('lg'));
  const customizer = useSelector((state: AppState) => state.customizer);
  const chatArea = useRef(null);
  const dispatch = useDispatch();
  const route = useRouter();
  const [selectMenue, setSelectMenu] = useState(false);
  const [selectMenueItems, setSelectMenuItems] = useState<any>(null);
  const [topPosition, setTopPosition] = useState(0);
  const theme = useTheme();
  const toggleWidth =
    customizer.isCollapse && !customizer.isSidebarHover
      ? customizer.MiniSidebarWidth
      : customizer.SidebarWidth;

  let timer: any;

  console.log(theme);
  

  useEffect(() => {
    if (!lgUp) {
      setSelectMenu(false);
      dispatch(toggleSidebar(false));
    }
  }, [lgUp]);

  const timeOut = () => {
    timer = setTimeout(() => {
      setSelectMenu(false);
    }, 2000);
  };

  const handleMouseMove = (event: any) => {
    let number = event.clientY || 0;
    number = Math.floor(number / 10) * 10;
    number = number > 500 ? number - 100 : number - 50;
    setTopPosition(number);
  };

  useEffect(() => {
    const div = chatArea.current as any;
    if (div) {
      div.addEventListener('mouseenter', handleMouseMove);
    }
  }, [chatArea?.current]);

  if (lgUp) {
    return (
      <Box
        sx={{
          width: toggleWidth,
          flexShrink: 0,
          ...(customizer.isCollapse && {
            width: customizer.MiniSidebarWidth,
          }),
        }}
        className={'custom-sidebar'}
        onMouseLeave={timeOut}
      >
        <Drawer
          anchor="left"
          open
          variant="permanent"
          PaperProps={{
            sx: {
              transition: theme.transitions.create('width', {
                duration: theme.transitions.duration.complex,
              }),
              width: toggleWidth,
              boxSizing: 'border-box',
              border: 'none !important',
              background: `${
                customizer?.activeMode === 'light' ? '#e5e5e5' : '#323441'
              }`,
            },
          }}
        >
          <Box
            sx={{
              height: 'calc(100% - 70px)',
              maxWidth: !customizer.isCollapse
                ? '200px !important'
                : '75px !important',
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <Box sx={{ margin: 0, padding: 0, width: '100%' }}>
              <Image
                alt=""
                src={menuIcon}
                width={15}
                height={70}
                style={{
                  position: 'absolute',
                  left: !customizer.isCollapse ? 200 : 75,
                  cursor: 'pointer',
                }}
                onClick={() =>
                  lgUp
                    ? dispatch(toggleSidebar({}))
                    : dispatch(toggleMobileSidebar())
                }
              />
              <Box
                sx={{
                  // background: '#431c7a',
                  background: theme.palette.primary.dark,
                  borderBottomLeftRadius: '0px',
                  borderBottomRightRadius: '0px',
                  marginRight: '15px',
                  borderTopLeftRadius: '0',
                  width: 'inherit',
                  borderBottom: customizer.isCollapse
                    ? `2px solid ${theme.palette.primary.light}`
                    : 'none',
                }}
              >
                <Logo isSidebarOpen={customizer.isCollapse} />
              </Box>
              <Scrollbar
                scrollableNodeProps={{ ref: chatArea }}
                sx={{
                  height: customizer.isCollapse
                    ? 'calc(100% - 67px)'
                    : 'calc(100% - 68px)',
                  // background:
                  //   'linear-gradient(to bottom, #431c7a, #481c80, #4e1b86, #531a8b, #591991, #5e1895, #62179a, #67169e, #6c15a3, #7114a8, #7613ac, #7b11b1)',
                  background:
                    `linear-gradient(to bottom, ${theme.palette.primary.dark},${theme.palette.primary.main})`,
                  borderBottomRightRadius: '40px',
                  marginRight: '15px',
                  width: 'inherit',
                }}
              >
                <SidebarItems
                  setSelectMenuItems={setSelectMenuItems}
                  setSelectMenu={setSelectMenu}
                />
              </Scrollbar>
            </Box>
          </Box>
          <Profile />
          {customizer.isCollapse && selectMenue && (
            <Box
              sx={{
                position: 'inherit',
                left: '74px',
                top: `${topPosition}px`,
                width: 'fit-content',
              }}
              onMouseEnter={() => {
                clearTimeout(timer);
                setSelectMenu(true);
              }}
              onMouseLeave={() => setSelectMenu(false)}
            >
              <Paper
                sx={{
                  width: 'fit-content',
                  maxWidth: '100%',
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: '0 25px 9px 0',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    // backgroundColor: theme.palette.primary.dark,
                    background: theme.palette.action.selected,
                    borderRadius: '0 25px 0 0',
                    height: '50px',
                  }}
                >
                  <Image
                    alt=""
                    src={selectMenueItems?.icon}
                    width={30}
                    height={30}
                    style={{ marginLeft: '15px' }}
                  />
                  <Typography
                    variant="h4"
                    style={{ color: 'white', padding: '12px' }}
                  >
                    {selectMenueItems?.title}
                  </Typography>
                </Box>
                <MenuList>
                  {selectMenueItems?.children?.map(
                    (item: { title: string; id: string; href: string }) => (
                      <MenuItem
                        key={item.id}
                        onClick={() => {
                          route.push(item.href);
                          setSelectMenu(false);
                        }}
                        sx={{
                          ':hover': {
                            // background: '#6d2f9b',
                            background: theme.palette.action.active,
                          },
                        }}
                      >
                        <Typography style={{ color: 'white' }}>
                          {item?.title}
                        </Typography>
                      </MenuItem>
                    ),
                  )}
                </MenuList>
              </Paper>
            </Box>
          )}
        </Drawer>
      </Box>
    );
  }

  return (
    <Drawer
      anchor="left"
      open={customizer.isMobileSidebar}
      onClose={() => dispatch(toggleMobileSidebar())}
      variant="temporary"
      PaperProps={{
        sx: {
          border: '0 !important',
          width: customizer.SidebarWidth,
          boxShadow: (theme) => theme.shadows[8],
          background:
            'linear-gradient(180deg, hsla(267, 74%, 32%, 1) 0%, hsla(274, 80%, 35%, 1) 50%, hsla(281, 85%, 38%, 1) 100%)',
        },
      }}
    >
      <Box>
        <Logo isSidebarOpen={customizer.isCollapse} />
      </Box>
      <SidebarItems
        setSelectMenuItems={setSelectMenuItems}
        setSelectMenu={setSelectMenu}
      />
    </Drawer>
  );
};

export default Sidebar;
