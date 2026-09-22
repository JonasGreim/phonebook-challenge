import { useEffect, useRef, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import SearchIcon from '@mui/icons-material/Search';
import {
  Alert,
  Box,
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
import FindCallLogo from './FindCallLogo.js';
import { theme } from './theme.js';

type SearchStatus =
  'initial' | 'waiting' | 'loading' | 'success' | 'empty' | 'error';

const INITIAL_STATUS: SearchStatus = 'initial';

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'Die Suche ist fehlgeschlagen.';
}

export default function App() {
  const [input, setInput] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [status, setStatus] = useState<SearchStatus>(INITIAL_STATUS);
  const [error, setError] = useState('');
  const requestId = useRef(0);

  function handleInputChange(nextInput: string) {
    setInput(nextInput);
    setContacts([]);
    setError('');
    setStatus(nextInput.trim() ? 'waiting' : INITIAL_STATUS);
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
          setError(getErrorMessage(requestError));
          setStatus('error');
        }
      }
    }, 280);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [input]);

  const statusMessage = {
    initial: 'Gib einen Namen ein, um das Telefonbuch zu durchsuchen.',
    waiting: 'Suche wird vorbereitet.',
    loading: 'Telefonbuch wird durchsucht.',
    success: `${contacts.length} Treffer gefunden.`,
    empty: 'Keine passenden Kontakte gefunden.',
    error: '',
  }[status];

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
            <FindCallLogo />
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
                Telefonnummer finden
              </Typography>
              <Typography color="text.secondary">
                Namen suchen. Telefonnummer finden.
              </Typography>
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
                label="Name suchen"
                helperText="Die Suche startet automatisch und berücksichtigt keine Groß- und Kleinschreibung."
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
                        <Tooltip title="Suche leeren">
                          <IconButton
                            aria-label="Suche leeren"
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
                <Alert severity="error">{error}</Alert>
              ) : null}
              {status !== 'error' ? (
                <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                  {status === 'loading' ? (
                    <CircularProgress size={18} aria-label="Lädt" />
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
                aria-label="Suchergebnisse"
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
                    Suchergebnisse
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
