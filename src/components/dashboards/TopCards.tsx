import { Icon } from '@iconify/react';
import { alpha, Box, Grid, Typography, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';

const TopCards = (props: any) => {
  const { topCards } = props;
  const theme = useTheme()
  type AppState = {
    customizer: any;
  };
  const customizer = useSelector((state: AppState) => state.customizer);
  return (
    <Grid container spacing={3}>
      {topCards.map((topCard: any, i: number) => {
        const { bgcolor, color, isDidTrue } = topCard;

        return (
          <Grid item xs={12} sm={3} key={i}>
            <Box
              sx={{
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'row',
                padding: 2,
                justifyContent: 'space-between',
                // backgroundColor:
                //   isDidTrue || ''
                //     ? customizer?.activeMode === 'light'
                //       ? '#CEE5F9'
                //       : '#49A8FF'
                //     : customizer?.activeMode === 'light'
                //     ? bgcolor
                //     : '#866858',
                // backgroundColor:theme.palette.action.selected
                backgroundColor: (theme) => alpha(theme.palette.primary.dark, 0.06),
                // boxShadow: (theme) => theme.shadows[5],  
              }}
            >
              <Box
                sx={{
                  '& svg path': { strokeWidth: 1.3 },
                  justifyContent: 'center',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Icon
                  icon={topCard.icon}
                  width={50}
                  height={50}
                  color={isDidTrue || '' ? '#000' : theme.palette.primary.main}
                />
              </Box>
              <Box textAlign={'right'}>
                <Typography
                  color={
                    isDidTrue || ''
                      ? color
                      : customizer?.activeMode === 'light'
                      ? 'black'
                      : 'white'
                  }
                  mt={1}
                  variant="subtitle1"
                  fontSize={14}
                  fontWeight={600}
                >
                  {topCard.title}
                </Typography>
                <Typography
                  color={
                    isDidTrue || ''
                      ? color
                      : customizer?.activeMode === 'light'
                      ? 'black'
                      : 'white'
                  }
                  variant="h3"
                  fontWeight={600}
                >
                  {topCard?.digits || 0}
                </Typography>
              </Box>
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default TopCards;
