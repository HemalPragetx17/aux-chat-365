import { Box } from '@mui/material';
import Image from 'next/image';

import AUXlogo from '../../../../src/images/side_icon/AUXlogo.png';
import LoginPage from '../../../../src/images/side_icon/Login.png';
import Phone from '../../../../src/images/side_icon/Phone.png';
import AuthForgotPassword from '../authForms/AuthForgotPassword';

const ForgotPassword = () => {
  return (
    <div
      className="background-image"
      style={{
        overflowX: 'hidden',
        backgroundSize: '100% 100%',
        backgroundImage: `url(${LoginPage.src})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        height: '100%',
        backgroundColor: '#1d1f58',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="mobile-container">
        <Image alt="" src={Phone} className="img-mobile" />
        <div className="abs-mobile-form">
          <Image
            src={AUXlogo}
            alt="Google Play"
            style={{ height: '150px', width: '200px' }}
          />
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ margin: '0', fontSize: '15px', color: 'white' }}>
              Forgot your password?
            </h3>
            <p style={{ margin: '0', fontSize: '10px', color: 'white' }}>
              {' '}
              Enter your email address below, and we'll send a code to reset
              your password.
            </p>
          </div>
          <Box>
            <Box sx={{ minWidth: '180px' }}>
              <AuthForgotPassword />
            </Box>
          </Box>
        </div>
      </div>
    </div>
  );
};

ForgotPassword.layout = 'Blank';
export default ForgotPassword;
