const baselightTheme = {
  direction: 'ltr',
  palette: {
    primary: {
      main: '#a652db',
      light: '#7D0EB3',
      dark: '#a953df',
    },
    secondary: {
      main: '#FF33FF',
      light: '#FFE8F2',
      dark: '#FF00FF',
    },
    success: {
      main: '#077A1E',
      light: '#CCFFD3',
      dark: '#02b3a9',
      contrastText: '#ffffff',
    },
    info: {
      main: '#539BFF',
      light: '#EBF3FE',
      dark: '#1682d4',
      contrastText: '#ffffff',
    },
    error: {
      light: '#ffc6c6',
      main: '#EA5455',
      dark: '#CE4A4B',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#FFAE1F',
      light: '#FEF5E5',
      dark: '#ae8e59',
      contrastText: '#ffffff',
    },
    purple: {
      light: '#EFDEEF',
      main: '#E600E6',
      A50: '#EBF3FE',
      A100: '#6610f2',
      A200: '#557fb9',
    },
    green: {
      light: '#EBFFF1',
      main: '#099333',
    },
    grey: {
      100: '#F2F6FA',
      200: '#EAEFF4',
      300: '#DFE5EF',
      400: '#7C8FAC',
      500: '#5A6A85',
      600: '#2A3547',
      900: '#ced5ff',
    },
    text: {
      primary: '#2A3547',
      secondary: '#2A3547',
    },
    action: {
      disabledBackground: 'rgba(73,82,88,0.12)',
      hoverOpacity: 0.02,
      hover: '#f6f9fc',
    },
    divider: '#e5eaef',
    white: {
      main: '#a953df',
      light: '#ffe8f2',
    },
  },
};

const baseDarkTheme = {
  direction: 'ltr',
  palette: {
    primary: {
      main: '#a953df',
      light: '#ECF2FF',
      dark: '#6a10a3',
    },
    secondary: {
      main: '#777e89',
      light: '#1C455D',
      dark: '#173f98',
    },
    success: {
      main: '#13DEB9',
      light: '#1B3C48',
      dark: '#02b3a9',
      contrastText: '#ffffff',
    },
    info: {
      main: '#539BFF',
      light: '#223662',
      dark: '#1682d4',
      contrastText: '#ffffff',
    },
    error: {
      main: '#FA896B',
      light: '#4B313D',
      dark: '#f3704d',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#FFAE1F',
      light: '#4D3A2A',
      dark: '#ae8e59',
      contrastText: '#ffffff',
    },
    purple: {
      A50: '#EBF3FE',
      A100: '#6610f2',
      A200: '#557fb9',
    },
    grey: {
      100: '#333F55',
      200: '#465670',
      300: '#7C8FAC',
      400: '#DFE5EF',
      500: '#EAEFF4',
      600: '#F2F6FA',
      900: '#3f3f3f',
    },
    text: {
      primary: '#EAEFF4',
      secondary: '#d0d0d0',
    },
    action: {
      disabledBackground: 'rgba(73,82,88,0.12)',
      hoverOpacity: 0.02,
      hover: '#333F55',
    },
    divider: '#333F55',
    background: {
      default: '#393B48',
      dark: '#393B48',
      paper: '#393B48',
    },
  },
};

export { baseDarkTheme, baselightTheme };
