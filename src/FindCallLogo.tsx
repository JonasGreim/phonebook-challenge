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
        gap: 1.25,
        textDecoration: 'none',
      }}
    >
      <Box sx={{ display: 'flex', flexShrink: 0, height: 44, width: 44 }}>
        <Box alt="" aria-hidden="true" component="img" src={findCallMark} />
      </Box>

      {!compact && (
        <Box
          aria-hidden="true"
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              fontSize: '1.25rem',
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
              fontSize: '0.68rem',
              fontWeight: 400,
              lineHeight: 1.2,
              mt: 0.5,
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
