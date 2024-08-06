import { Button } from '@mui/material';
import { Box } from '@mui/system';
import { useRef, useState } from 'react';
import SignaturePad from 'react-signature-canvas';

const SignaturePadComponent = (props: any) => {
  const sigRef = useRef();
  const [signature, setSignature] = useState<any>('');
  const { onSign, onClose, setSign } = props;

  const handleSignatureEnd = () => {
    onSign((sigRef.current as any).toDataURL());
    setSignature((sigRef.current as any).toDataURL());
  };

  return (
    <Box>
      <div
        style={{
          width: '100%',
          height: 150,
          backgroundImage: `url(/images/backgrounds/page.jpg)`,
          backgroundSize: `100% 100%`,
        }}
      >
        <SignaturePad
          ref={sigRef as any}
          canvasProps={{ style: { width: '100%', height: 150 } }}
          onEnd={handleSignatureEnd}
        />
      </div>
      <Box display={'flex'} mt={1} justifyContent={'center'}>
        <Button
          variant="contained"
          onClick={() => setSign(signature)}
          disabled={!Boolean(signature)}
        >
          Save Signature
        </Button>
        <Button variant="text" onClick={onClose}>
          Close
        </Button>
      </Box>
    </Box>
  );
};

export default SignaturePadComponent;
