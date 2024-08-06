// import React, { FunctionComponent } from 'react';
// import { TablerIcon } from '@tabler/icons-react';
// import { OverridableComponent } from '@mui/material/OverridableComponent';
// import { SvgIconTypeMap } from '@mui/material';

// export type GeneralIcon =
//   | (OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
//       muiName: string;
//     })
//   | React.ComponentClass<any>
//   | FunctionComponent<any>
//   | TablerIcon;

import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import React, { FunctionComponent } from 'react';

export type GeneralIcon =
  | (OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
      muiName: string;
    })
  | React.ComponentClass<any>
  | FunctionComponent<any>;
