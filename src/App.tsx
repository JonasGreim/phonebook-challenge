import { useEffect, useRef, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import SearchIcon from '@mui/icons-material/Search';
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Container,
  CssBaseline,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  ThemeProvider,
  Tooltip,
  Typography,
} from '@mui/material';
import { searchContacts, type Contact } from './api.js';
import { SearchError, type SearchErrorCode } from './api.js';
import FindCallLogo from './FindCallLogo.js';
import {
  getInitialLocale,
  LOCALE_STORAGE_KEY,
  translations,
  type Locale,
} from './i18n.js';
import { theme } from './theme.js';

type SearchStatus =
  'initial' | 'waiting' | 'loading' | 'success' | 'empty' | 'error';

const INITIAL_STATUS: SearchStatus = 'initial';

function getSearchErrorCode(error: unknown): SearchErrorCode {
  return error instanceof SearchError ? error.code : 'searchFailed';
}

export default function App() {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);
  const [input, setInput] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [status, setStatus] = useState<SearchStatus>(INITIAL_STATUS);
  const [errorCode, setErrorCode] = useState<SearchErrorCode | null>(null);
  const requestId = useRef(0);
  const text = translations[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = text.documentTitle;
  }, [locale, text.documentTitle]);

  function handleInputChange(nextInput: string) {
    setInput(nextInput);
    setContacts([]);
    setErrorCode(null);
    setStatus(nextInput.trim() ? 'waiting' : INITIAL_STATUS);
  }

  function handleLocaleChange(nextLocale: Locale) {
    setLocale(nextLocale);
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
    } catch {
      // The chosen language remains active for this session when storage is unavailable.
    }
  }

  useEffect(() => {
    const query = input.trim();
    const currentRequest = ++requestId.current;

    if (!query) {
      return undefined;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setStatus('loading');
      try {
        const nextContacts = await searchContacts(query, controller.signal);
        if (requestId.current === currentRequest) {
          setContacts(nextContacts);
          setStatus(nextContacts.length ? 'success' : 'empty');
        }
      } catch (requestError: unknown) {
        if (
          !(
            requestError instanceof Error && requestError.name === 'AbortError'
          ) &&
          requestId.current === currentRequest
        ) {
          setContacts([]);
          setErrorCode(getSearchErrorCode(requestError));
          setStatus('error');
        }
      }
    }, 280);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [input]);

  const statusMessage =
    status === 'initial'
      ? text.initial
      : status === 'waiting'
        ? text.waiting
        : status === 'loading'
          ? text.loading
          : status === 'success'
            ? text.resultsCount(contacts.length)
            : status === 'empty'
              ? text.noResults
              : '';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box component="main" sx={{ minHeight: '100vh' }}>
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
              justifyContent: 'space-between',
              minHeight: 72,
            }}
          >
            <FindCallLogo homeLabel={text.homeLabel} />
            <ButtonGroup
              aria-label={text.languageLabel}
              size="small"
              variant="outlined"
            >
              <Button
                aria-label={text.german}
                aria-pressed={locale === 'de'}
                onClick={() => handleLocaleChange('de')}
                variant={locale === 'de' ? 'contained' : 'outlined'}
              >
                DE
              </Button>
              <Button
                aria-label={text.english}
                aria-pressed={locale === 'en'}
                onClick={() => handleLocaleChange('en')}
                variant={locale === 'en' ? 'contained' : 'outlined'}
              >
                EN
              </Button>
            </ButtonGroup>
          </Container>
        </Box>
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
                onChange={(event) => handleInputChange(event.target.value)}
                value={input}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon aria-hidden="true" color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: input ? (
                      <InputAdornment position="end">
                        <Tooltip title={text.clearSearch}>
                          <IconButton
                            aria-label={text.clearSearch}
                            edge="end"
                            onClick={() => handleInputChange('')}
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

            <Box
              aria-atomic="true"
              aria-busy={status === 'loading'}
              aria-live="polite"
            >
              {status === 'error' ? (
                <Alert severity="error">
                  {text.errors[errorCode ?? 'searchFailed']}
                </Alert>
              ) : null}
              {status !== 'error' ? (
                <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                  {status === 'loading' ? (
                    <CircularProgress size={18} aria-label={text.loading} />
                  ) : null}
                  <Typography color="text.secondary">
                    {statusMessage}
                  </Typography>
                </Box>
              ) : null}
            </Box>

            {status === 'success' ? (
              <Paper
                component="section"
                aria-label={text.results}
                elevation={0}
              >
                <Box
                  sx={{
                    alignItems: 'center',
                    borderBottom: 1,
                    borderColor: 'divider',
                    display: 'flex',
                    justifyContent: 'space-between',
                    px: { xs: 2, sm: 3 },
                    py: 1.5,
                  }}
                >
                  <Typography component="h2" variant="h2">
                    {text.results}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {contacts.length}
                  </Typography>
                </Box>
                <List disablePadding>
                  {contacts.map((contact) => (
                    <ListItem
                      key={contact.id}
                      divider
                      sx={{
                        alignItems: 'center',
                        gap: 1.5,
                        px: { xs: 2, sm: 3 },
                        py: 1.5,
                      }}
                    >
                      <Box
                        aria-hidden="true"
                        sx={{
                          alignItems: 'center',
                          bgcolor: 'success.light',
                          borderRadius: '50%',
                          color: 'success.main',
                          display: 'flex',
                          flexShrink: 0,
                          height: 36,
                          justifyContent: 'center',
                          width: 36,
                        }}
                      >
                        <PhoneOutlinedIcon fontSize="small" />
                      </Box>
                      <ListItemText
                        primary={contact.name}
                        secondary={contact.phone}
                        slotProps={{
                          primary: {
                            sx: { color: 'text.primary', fontWeight: 600 },
                          },
                          secondary: {
                            sx: { color: 'text.secondary', mt: 0.25 },
                          },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            ) : null}
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
