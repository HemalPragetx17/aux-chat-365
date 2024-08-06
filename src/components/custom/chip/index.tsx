import MuiChip from '@mui/material/Chip';
import clsx from 'clsx';

import UseBgColor, { UseBgColorType } from '../../../hooks/useBgColor';

import { CustomChipProps } from './types';

const CustomChip = (props: CustomChipProps) => {
  // ** Props
  const { sx, skin, color, rounded } = props;

  // ** Hook
  const bgColors = UseBgColor();

  const colors: UseBgColorType = {
    primary: { ...bgColors.primaryLight },
    secondary: { ...bgColors.secondaryLight },
    success: { ...bgColors.successLight },
    error: { ...bgColors.errorLight },
    warning: { ...bgColors.warningLight },
    info: { ...bgColors.infoLight },
  };

  const propsToPass = { ...props };

  propsToPass.rounded = undefined;

  return (
    <MuiChip
      {...propsToPass}
      variant="filled"
      className={clsx({
        'MuiChip-rounded': rounded,
        'MuiChip-light': skin === 'light',
      })}
      sx={skin === 'light' && color ? Object.assign(colors[color], sx) : sx}
    />
  );
};

export default CustomChip;
