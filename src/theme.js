import { createTheme } from '@mui/material';

const colors = {
  navy: '#0B2D5B',
  blue: '#2563EB',
  green: '#10B981',
  background: '#F3F6FA',
  surface: '#FFFFFF',
  secondaryText: '#667085',
  border: '#DCE4EE',
};

export const theme = createTheme({
  palette: {
    primary: { main: colors.blue, dark: '#1D4ED8', contrastText: colors.surface },
    success: { main: '#087F5B', light: '#D1FAE5' },
    background: { default: colors.background, paper: colors.surface },
    text: { primary: colors.navy, secondary: colors.secondaryText },
    divider: colors.border,
  },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: { color: colors.navy, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, lineHeight: 1.18 },
    h2: { color: colors.navy, fontSize: '1rem', fontWeight: 600, lineHeight: 1.5 },
    button: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { minWidth: 320 },
        '*:focus-visible': { outline: `3px solid ${colors.blue}`, outlineOffset: 3 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { border: `1px solid ${colors.border}`, boxShadow: '0 10px 24px rgba(11, 45, 91, 0.07)' },
      },
    },
    MuiTextField: { defaultProps: { variant: 'outlined' } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { backgroundColor: colors.surface },
        notchedOutline: { borderColor: colors.border },
      },
    },
    MuiInputLabel: { styleOverrides: { root: { fontWeight: 600 } } },
  },
});
