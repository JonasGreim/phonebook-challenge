import { Box } from '@mui/material';

type MarkProps = { title?: string };
type FindCallLogoProps = { compact?: boolean; homeLabel: string };

function Mark({ title }: MarkProps) {
  return (
    <svg
      aria-hidden={title ? undefined : 'true'}
      aria-label={title}
      fill="none"
      height="100%"
      style={{ display: 'block' }}
      viewBox="0 0 64 64"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="28" cy="28" r="20" stroke="#0B2D5B" strokeWidth="6" />
      <path
        d="M42 42L57 57"
        stroke="#0B2D5B"
        strokeLinecap="round"
        strokeWidth="7"
      />
      <path
        d="M20 17C18 17 16.5 18.5 16.5 20.5C16.5 32 25.5 41 37 41C39 41 40.5 39.5 40.5 37.5L40.5 33C40.5 31.8 39.7 30.8 38.5 30.5L33.5 29C32.5 28.7 31.5 29 30.8 29.8L28.5 32.3C25 30.3 22.3 27.5 20.3 24L22.8 21.7C23.5 21 23.8 20 23.5 19L22 18C21.5 17.4 20.8 17 20 17Z"
        fill="#2563EB"
      />
      <path
        d="M34 17C39 18 42 21 43 26"
        stroke="#10B981"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <path
        d="M36 12C43 13.5 47.5 18 49 25"
        stroke="#10B981"
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
  );
}

export default function FindCallLogo({
  compact = false,
  homeLabel,
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
        <Mark />
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
            Search a name. Find a number.
          </Box>
        </Box>
      )}
    </Box>
  );
}
