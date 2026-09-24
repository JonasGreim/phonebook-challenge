import { Box } from '@mui/material';
import findCallMark from './assets/findcall-mark.svg';

type FindCallLogoProps = {
  compact?: boolean;
  homeLabel: string;
  subtitle: string;
};

export default function FindCallLogo({
  compact = false,
  homeLabel,
  subtitle,
}: FindCallLogoProps) {
  return (
    <Box
      aria-label={homeLabel}
      component="a"
      href="/"
      sx={{
        alignItems: 'center',
        color: 'inherit',
        display: 'inline-flex',
        gap: { xs: 1.25, sm: 1.5, lg: 1.75 },
        textDecoration: 'none',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexShrink: 0,
          height: { xs: 48, sm: 52, lg: 60 },
          width: { xs: 48, sm: 52, lg: 60 },
        }}
      >
        <Box alt="" aria-hidden="true" component="img" src={findCallMark} />
      </Box>

      {!compact && (
        <Box
          aria-hidden="true"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              fontSize: { xs: '1.375rem', lg: '1.5rem' },
              fontWeight: 750,
              letterSpacing: '-0.04em',
              lineHeight: 1,
            }}
          >
            <Box component="span" sx={{ color: '#0B2D5B' }}>
              Find
            </Box>
            <Box component="span" sx={{ color: '#2563EB' }}>
              Call
            </Box>
          </Box>

          <Box
            sx={{
              color: '#667085',
              fontSize: { xs: '0.75rem', lg: '0.8125rem' },
              fontWeight: 400,
              lineHeight: 1.2,
              mt: 0.625,
              display: { xs: 'none', sm: 'block' },
              whiteSpace: 'nowrap',
            }}
          >
            {subtitle}
          </Box>
        </Box>
      )}
    </Box>
  );
}
