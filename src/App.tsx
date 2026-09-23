import { useEffect, useRef, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
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
  FormControl,
  IconButton,
  InputLabel,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Snackbar,
  TextField,
  ThemeProvider,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  SearchError,
  searchContacts,
  type SearchErrorCode,
  type SearchPage,
} from './api.js';
import FindCallLogo from './FindCallLogo.js';
import { getHighlightParts } from './highlight.js';
import {
  getInitialLocale,
  LOCALE_STORAGE_KEY,
  translations,
  type Locale,
} from './i18n.js';
import { theme } from './theme.js';

type SearchStatus =
  'initial' | 'waiting' | 'loading' | 'success' | 'empty' | 'error';
type ClipboardFeedbackStatus = 'success' | 'unavailable' | 'failed';

interface ClipboardFeedback {
  contactId: string;
  id: number;
  status: ClipboardFeedbackStatus;
}

const INITIAL_STATUS: SearchStatus = 'initial';
type PageSize = 10 | 25 | 50;
const PAGE_SIZES: readonly PageSize[] = [10, 25, 50];

function getSearchErrorCode(error: unknown): SearchErrorCode {
  return error instanceof SearchError ? error.code : 'searchFailed';
}

export default function App() {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);
  const [input, setInput] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(10);
  const [searchPage, setSearchPage] = useState<SearchPage | null>(null);
  const [resultQuery, setResultQuery] = useState('');
  const [status, setStatus] = useState<SearchStatus>(INITIAL_STATUS);
  const [errorCode, setErrorCode] = useState<SearchErrorCode | null>(null);
  const [clipboardFeedback, setClipboardFeedback] =
    useState<ClipboardFeedback | null>(null);
  const requestId = useRef(0);
  const clipboardRequestId = useRef(0);
  const text = translations[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = text.documentTitle;
  }, [locale, text.documentTitle]);

  function handleInputChange(nextInput: string) {
    setInput(nextInput);
    setPage(1);
    setSearchPage(null);
    setResultQuery('');
    setErrorCode(null);
    setStatus(nextInput.trim() ? 'waiting' : INITIAL_STATUS);
  }

  function handlePageChange(nextPage: number) {
    if (nextPage === page) return;

    setPage(nextPage);
    setErrorCode(null);
    setStatus('waiting');
  }

  function handlePageSizeChange(nextPageSize: PageSize) {
    setPageSize(nextPageSize);
    setPage(1);
    setErrorCode(null);
    if (input.trim()) setStatus('waiting');
  }

  function handleLocaleChange(nextLocale: Locale) {
    setLocale(nextLocale);
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
    } catch {
      // The chosen language remains active for this session when storage is unavailable.
    }
  }

  async function handleCopyPhoneNumber(contactId: string, phone: string) {
    const currentRequest = ++clipboardRequestId.current;
    setClipboardFeedback(null);

    if (!navigator.clipboard?.writeText) {
      setClipboardFeedback({
        contactId,
        id: currentRequest,
        status: 'unavailable',
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(phone);
      if (clipboardRequestId.current === currentRequest) {
        setClipboardFeedback({
          contactId,
          id: currentRequest,
          status: 'success',
        });
      }
    } catch {
      if (clipboardRequestId.current === currentRequest) {
        setClipboardFeedback({
          contactId,
          id: currentRequest,
          status: 'failed',
        });
      }
    }
  }

  function dismissClipboardFeedback(id: number) {
    setClipboardFeedback((currentFeedback) =>
      currentFeedback?.id === id ? null : currentFeedback,
    );
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
        const nextSearchPage = await searchContacts(
          query,
          page,
          pageSize,
          controller.signal,
        );
        if (requestId.current === currentRequest) {
          setSearchPage(nextSearchPage);
          setResultQuery(query);
          setStatus(nextSearchPage.totalCount ? 'success' : 'empty');
        }
      } catch (requestError: unknown) {
        if (
          !(
            requestError instanceof Error && requestError.name === 'AbortError'
          ) &&
          requestId.current === currentRequest
        ) {
          setSearchPage(null);
          setResultQuery('');
          setErrorCode(getSearchErrorCode(requestError));
          setStatus('error');
        }
      }
    }, 280);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [input, page, pageSize]);

  const resultRange = searchPage
    ? text.resultsRange(
        (searchPage.page - 1) * searchPage.pageSize + 1,
        (searchPage.page - 1) * searchPage.pageSize +
          searchPage.contacts.length,
        searchPage.totalCount,
      )
    : '';

  const statusMessage =
    status === 'waiting'
      ? text.waiting
      : status === 'loading'
        ? text.loading
        : status === 'success'
          ? text.resultsCount(searchPage?.totalCount ?? 0)
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

            {status !== 'initial' ? (
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
            ) : null}

            {searchPage &&
            (status === 'success' ||
              status === 'waiting' ||
              status === 'loading') ? (
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
                    {status === 'success' ? resultRange : text.waiting}
                  </Typography>
                </Box>
                {status === 'success' ? (
                  <List disablePadding>
                    {searchPage.contacts.map((contact) => (
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
                          primary={getHighlightParts(
                            contact.name,
                            resultQuery,
                          ).map((part, index) =>
                            part.highlighted ? (
                              <Box
                                component="mark"
                                key={`${contact.id}-${index}`}
                                sx={{
                                  bgcolor: 'primary.light',
                                  borderRadius: 0,
                                  color: 'inherit',
                                  display: 'inline',
                                  fontFamily: 'inherit',
                                  fontSize: 'inherit',
                                  fontWeight: 'inherit',
                                  letterSpacing: 'inherit',
                                  lineHeight: 'inherit',
                                  m: 0,
                                  p: 0,
                                }}
                              >
                                {part.text}
                              </Box>
                            ) : (
                              part.text
                            ),
                          )}
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
                        {clipboardFeedback?.status === 'success' &&
                        clipboardFeedback.contactId === contact.id ? (
                          <Tooltip title={text.copied}>
                            <IconButton
                              aria-label={text.copied}
                              color="primary"
                              onClick={() =>
                                void handleCopyPhoneNumber(
                                  contact.id,
                                  contact.phone,
                                )
                              }
                            >
                              <CheckIcon />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title={text.copyPhoneNumber(contact.name)}>
                            <IconButton
                              aria-label={text.copyPhoneNumber(contact.name)}
                              color="primary"
                              onClick={() =>
                                void handleCopyPhoneNumber(
                                  contact.id,
                                  contact.phone,
                                )
                              }
                            >
                              <ContentCopyOutlinedIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </ListItem>
                    ))}
                  </List>
                ) : null}
                <Box
                  sx={{
                    alignItems: { sm: 'center' },
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    justifyContent: 'space-between',
                    px: { xs: 2, sm: 3 },
                    py: 2,
                  }}
                >
                  <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel id="page-size-label">
                      {text.rowsPerPage}
                    </InputLabel>
                    <Select
                      id="page-size"
                      label={text.rowsPerPage}
                      labelId="page-size-label"
                      onChange={(event) => {
                        const nextPageSize = Number(event.target.value);
                        if (
                          nextPageSize === 10 ||
                          nextPageSize === 25 ||
                          nextPageSize === 50
                        ) {
                          handlePageSizeChange(nextPageSize);
                        }
                      }}
                      value={pageSize}
                    >
                      {PAGE_SIZES.map((size) => (
                        <MenuItem key={size} value={size}>
                          {size}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Pagination
                    count={searchPage.totalPages}
                    getItemAriaLabel={(type, pageNumber) =>
                      type === 'previous'
                        ? text.previousPage
                        : type === 'next'
                          ? text.nextPage
                          : text.page(pageNumber ?? 1)
                    }
                    onChange={(_event, nextPage) => handlePageChange(nextPage)}
                    page={page}
                    shape="rounded"
                    siblingCount={0}
                  />
                </Box>
              </Paper>
            ) : null}
          </Box>
        </Container>
      </Box>
      <Snackbar
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        autoHideDuration={clipboardFeedback?.status === 'success' ? 2500 : 5000}
        key={clipboardFeedback?.id}
        onClose={(_event, reason) => {
          if (reason !== 'clickaway' && clipboardFeedback) {
            dismissClipboardFeedback(clipboardFeedback.id);
          }
        }}
        open={Boolean(clipboardFeedback)}
        sx={{
          '& .MuiAlert-root': {
            maxWidth: { sm: 480, xs: 'calc(100vw - 32px)' },
          },
          bottom: { sm: 24, xs: 16 },
        }}
      >
        {clipboardFeedback ? (
          <Alert
            onClose={() => dismissClipboardFeedback(clipboardFeedback.id)}
            role={clipboardFeedback.status === 'success' ? 'status' : 'alert'}
            severity={
              clipboardFeedback.status === 'success' ? 'success' : 'error'
            }
            sx={
              clipboardFeedback.status === 'success'
                ? {
                    '& .MuiAlert-icon, & .MuiIconButton-root': {
                      color: 'inherit',
                    },
                    bgcolor: 'success.main',
                    color: 'common.white',
                  }
                : {
                    '& .MuiAlert-icon, & .MuiIconButton-root': {
                      color: 'primary.main',
                    },
                    bgcolor: 'background.paper',
                    border: 1,
                    borderColor: 'primary.main',
                    color: 'text.primary',
                  }
            }
            variant="filled"
          >
            {clipboardFeedback.status === 'success'
              ? text.phoneCopied
              : clipboardFeedback.status === 'unavailable'
                ? text.clipboardUnavailable
                : text.copyFailed}
          </Alert>
        ) : undefined}
      </Snackbar>
    </ThemeProvider>
  );
}
