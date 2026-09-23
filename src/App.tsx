import { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Container,
  CssBaseline,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  ThemeProvider,
  Tooltip,
  Typography,
} from '@mui/material';
import AppHeader from './components/AppHeader.js';
import ProjectFooter from './components/ProjectFooter.js';
import SearchResults from './components/SearchResults.js';
import { useClipboardFeedback } from './hooks/useClipboardFeedback.js';
import { usePhonebookSearch } from './hooks/usePhonebookSearch.js';
import {
  getInitialLocale,
  LOCALE_STORAGE_KEY,
  translations,
  type Locale,
} from './i18n.js';
import { theme } from './theme.js';

export default function App() {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);
  const search = usePhonebookSearch();
  const clipboard = useClipboardFeedback();
  const text = translations[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = text.documentTitle;
  }, [locale, text.documentTitle]);

  function handleLocaleChange(nextLocale: Locale) {
    setLocale(nextLocale);
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
    } catch {
      // The chosen language remains active for this session when storage is unavailable.
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      >
        <Box component="main" sx={{ flexGrow: 1 }}>
          <AppHeader locale={locale} onLocaleChange={handleLocaleChange} />
          <Container maxWidth="sm" sx={{ py: { xs: 4, sm: 7 } }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 2.5, sm: 3 },
              }}
            >
              <Box component="header" sx={{ maxWidth: 480 }}>
                <Typography component="h1" variant="h1" gutterBottom>
                  {text.heading}
                </Typography>
                <Typography color="text.secondary">{text.slogan}</Typography>
              </Box>

              <Paper
                component="section"
                elevation={0}
                sx={{ p: { xs: 2, sm: 3 } }}
              >
                <TextField
                  autoFocus
                  fullWidth
                  id="contact-search"
                  label={text.searchLabel}
                  helperText={text.helperText}
                  onChange={(event) =>
                    search.handleInputChange(event.target.value)
                  }
                  value={search.input}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon aria-hidden="true" color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: search.input ? (
                        <InputAdornment position="end">
                          <Tooltip title={text.clearSearch}>
                            <IconButton
                              aria-label={text.clearSearch}
                              edge="end"
                              onClick={() => search.handleInputChange('')}
                            >
                              <CloseIcon />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ) : null,
                    },
                  }}
                />
              </Paper>

              <SearchResults
                clipboardFeedback={clipboard.clipboardFeedback}
                errorCode={search.errorCode}
                locale={locale}
                onCopyPhoneNumber={clipboard.copyPhoneNumber}
                onDismissClipboardFeedback={clipboard.dismissClipboardFeedback}
                onPageChange={search.handlePageChange}
                onPageSizeChange={search.handlePageSizeChange}
                page={search.page}
                pageSize={search.pageSize}
                resultQuery={search.resultQuery}
                searchPage={search.searchPage}
                status={search.status}
              />
            </Box>
          </Container>
        </Box>
        <ProjectFooter locale={locale} />
      </Box>
    </ThemeProvider>
  );
}
