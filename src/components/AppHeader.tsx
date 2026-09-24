import { Box, Button, ButtonGroup, Container } from '@mui/material';
import FindCallLogo from '../FindCallLogo.js';
import { translations, type Locale } from '../i18n.js';

interface AppHeaderProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export default function AppHeader({ locale, onLocaleChange }: AppHeaderProps) {
  const text = translations[locale];

  return (
    <Box
      component="header"
      sx={{
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          alignItems: 'center',
          display: 'flex',
          gap: { xs: 2, sm: 3, lg: 3.5 },
          justifyContent: 'space-between',
          minHeight: { xs: 76, sm: 84, lg: 92 },
        }}
      >
        <FindCallLogo homeLabel={text.homeLabel} subtitle={text.logoSubtitle} />
        <ButtonGroup
          aria-label={text.languageLabel}
          size="small"
          variant="outlined"
        >
          <Button
            aria-label={text.german}
            aria-pressed={locale === 'de'}
            onClick={() => onLocaleChange('de')}
            variant={locale === 'de' ? 'contained' : 'outlined'}
          >
            DE
          </Button>
          <Button
            aria-label={text.english}
            aria-pressed={locale === 'en'}
            onClick={() => onLocaleChange('en')}
            variant={locale === 'en' ? 'contained' : 'outlined'}
          >
            EN
          </Button>
        </ButtonGroup>
      </Container>
    </Box>
  );
}
