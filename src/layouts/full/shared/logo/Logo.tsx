import { styled } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

import { AppState, useSelector } from '../../../../store/Store';

const Logo = ({ isSidebarOpen = false }) => {
  const customizer = useSelector((state: AppState) => state.customizer);
  const LinkStyled = styled(Link)(() => ({
    overflow: 'hidden',
    display: 'flex',
    ' & span': {
      marginLeft: 10,
      color: '#a652db',
      fontWeight: 700,
      fontSize: 24,
      lineHeight: 1.5,
    },
  }));

  return (
    <LinkStyled href="/">
      {isSidebarOpen ? (<Image
        src={"/images/logos/aux365-logo-icon.png"}
        alt="logo"
        height={70}
        width={250}
        style={{ width: "65px", marginLeft: "5px", height: "65px" }}
        priority
      />) : (<Image
        src={'/images/logos/full_logo.png'}
        alt="logo"
        height={60}
        width={200}
        priority
      />)}
      {/* <span>Aux365</span> */}
    </LinkStyled>
  );
};

export default Logo;
