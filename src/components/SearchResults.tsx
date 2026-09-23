import CheckIcon from '@mui/icons-material/Check';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import {
  Alert,
  Box,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Snackbar,
  Tooltip,
  Typography,
} from '@mui/material';
import type { SearchErrorCode, SearchPage } from '../api.js';
import { getHighlightParts } from '../highlight.js';
import type { ClipboardFeedback } from '../hooks/useClipboardFeedback.js';
import type { PageSize, SearchStatus } from '../hooks/usePhonebookSearch.js';
import { translations, type Locale } from '../i18n.js';

const PAGE_SIZES: readonly PageSize[] = [10, 25, 50];

interface SearchResultsProps {
  clipboardFeedback: ClipboardFeedback | null;
  errorCode: SearchErrorCode | null;
  locale: Locale;
  onCopyPhoneNumber: (contactId: string, phone: string) => Promise<void>;
  onDismissClipboardFeedback: (id: number) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: PageSize) => void;
  page: number;
  pageSize: PageSize;
  resultQuery: string;
  searchPage: SearchPage | null;
  status: SearchStatus;
}

export default function SearchResults({
  clipboardFeedback,
  errorCode,
  locale,
  onCopyPhoneNumber,
  onDismissClipboardFeedback,
  onPageChange,
  onPageSizeChange,
  page,
  pageSize,
  resultQuery,
  searchPage,
  status,
}: SearchResultsProps) {
  const text = translations[locale];
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
    <>
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
              <Typography color="text.secondary">{statusMessage}</Typography>
            </Box>
          ) : null}
        </Box>
      ) : null}

      {searchPage &&
      (status === 'success' || status === 'waiting' || status === 'loading') ? (
        <Paper component="section" aria-label={text.results} elevation={0}>
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
                    primary={getHighlightParts(contact.name, resultQuery).map(
                      (part, index) =>
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
                          void onCopyPhoneNumber(contact.id, contact.phone)
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
                          void onCopyPhoneNumber(contact.id, contact.phone)
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
              <InputLabel id="page-size-label">{text.rowsPerPage}</InputLabel>
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
                    onPageSizeChange(nextPageSize);
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
              onChange={(_event, nextPage) => onPageChange(nextPage)}
              page={page}
              shape="rounded"
              siblingCount={0}
            />
          </Box>
        </Paper>
      ) : null}

      <Snackbar
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        autoHideDuration={clipboardFeedback?.status === 'success' ? 2500 : 5000}
        key={clipboardFeedback?.id}
        onClose={(_event, reason) => {
          if (reason !== 'clickaway' && clipboardFeedback) {
            onDismissClipboardFeedback(clipboardFeedback.id);
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
            onClose={() => onDismissClipboardFeedback(clipboardFeedback.id)}
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
    </>
  );
}
