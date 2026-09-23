export const LOCALE_STORAGE_KEY = 'findcall-locale';

export type Locale = 'de' | 'en';

export type TranslationKey =
  'invalidResponse' | 'searchFailed' | 'serviceUnavailable';

type Translations = {
  clearSearch: string;
  clipboardUnavailable: string;
  copied: string;
  copyFailed: string;
  copyPhoneNumber: (name: string) => string;
  documentTitle: string;
  emptyResultsCount: string;
  english: string;
  german: string;
  heading: string;
  githubProfileLinkLabel: string;
  helperText: string;
  homeLabel: string;
  languageLabel: string;
  linkedInProfileLinkLabel: string;
  loading: string;
  logoSubtitle: string;
  noResults: string;
  noResultsHint: string;
  nextPage: string;
  page: (page: number) => string;
  phoneCopied: string;
  previousPage: string;
  results: string;
  resultsCount: (count: number) => string;
  resultsRange: (from: number, to: number, total: number) => string;
  rowsPerPage: string;
  searchLabel: string;
  slogan: string;
  waiting: string;
  errors: Record<TranslationKey, string>;
};

export const translations: Record<Locale, Translations> = {
  de: {
    clearSearch: 'Suche leeren',
    clipboardUnavailable:
      'Kopieren ist in diesem Browser nicht verfügbar. Du kannst die Nummer weiterhin auswählen.',
    copied: 'Kopiert',
    copyFailed:
      'Die Telefonnummer konnte nicht kopiert werden. Du kannst sie weiterhin auswählen.',
    copyPhoneNumber: (name) => `Telefonnummer von ${name} kopieren`,
    documentTitle: 'FindCall – Telefonnummer finden',
    emptyResultsCount: '0 Treffer',
    english: 'Englisch',
    german: 'Deutsch',
    heading: 'Telefonnummer finden',
    githubProfileLinkLabel: 'GitHub-Profil von Jonas Greim',
    helperText:
      'Die Suche startet automatisch und berücksichtigt keine Groß- und Kleinschreibung.',
    homeLabel: 'FindCall – zur Startseite',
    languageLabel: 'Sprache',
    linkedInProfileLinkLabel: 'LinkedIn-Profil von Jonas Greim',
    loading: 'Telefonbuch wird durchsucht.',
    logoSubtitle: 'Suche einen Namen. Finde eine Nummer.',
    noResults: 'Keine passenden Kontakte gefunden',
    noResultsHint:
      'Versuche einen anderen Namen oder einen kürzeren Suchbegriff.',
    nextPage: 'Nächste Seite',
    page: (page) => `Seite ${page}`,
    phoneCopied: 'Telefonnummer kopiert.',
    previousPage: 'Vorherige Seite',
    results: 'Suchergebnisse',
    resultsCount: (count) => `${count} Treffer gefunden.`,
    resultsRange: (from, to, total) => `${from}–${to} von ${total} Treffern`,
    rowsPerPage: 'Treffer pro Seite',
    searchLabel: 'Name suchen',
    slogan: 'Namen suchen. Telefonnummer finden.',
    waiting: 'Suche wird vorbereitet.',
    errors: {
      invalidResponse: 'Die Suche hat eine ungültige Serverantwort erhalten.',
      searchFailed: 'Die Suche ist fehlgeschlagen.',
      serviceUnavailable: 'Die Suche ist momentan nicht erreichbar.',
    },
  },
  en: {
    clearSearch: 'Clear search',
    clipboardUnavailable:
      'Copying is not available in this browser. You can still select the number.',
    copied: 'Copied',
    copyFailed:
      'The phone number could not be copied. You can still select it.',
    copyPhoneNumber: (name) => `Copy phone number for ${name}`,
    documentTitle: 'FindCall – Find a phone number',
    emptyResultsCount: '0 results',
    english: 'English',
    german: 'German',
    heading: 'Find a phone number',
    githubProfileLinkLabel: 'Jonas Greim’s GitHub profile',
    helperText: 'Search starts automatically and is not case-sensitive.',
    homeLabel: 'FindCall – back to home',
    languageLabel: 'Language',
    linkedInProfileLinkLabel: 'Jonas Greim’s LinkedIn profile',
    loading: 'Searching the phonebook.',
    logoSubtitle: 'Search a name. Find a number.',
    noResults: 'No matching contacts found',
    noResultsHint: 'Try another name or a shorter search term.',
    nextPage: 'Next page',
    page: (page) => `Page ${page}`,
    phoneCopied: 'Phone number copied.',
    previousPage: 'Previous page',
    results: 'Search results',
    resultsCount: (count) => `${count} results found.`,
    resultsRange: (from, to, total) => `${from}–${to} of ${total} results`,
    rowsPerPage: 'Results per page',
    searchLabel: 'Search by name',
    slogan: 'Search a name. Find a number.',
    waiting: 'Preparing search.',
    errors: {
      invalidResponse: 'The search returned an invalid server response.',
      searchFailed: 'The search failed.',
      serviceUnavailable: 'The search is currently unavailable.',
    },
  },
};

export function getInitialLocale(): Locale {
  try {
    const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    return storedLocale === 'en' || storedLocale === 'de' ? storedLocale : 'de';
  } catch {
    return 'de';
  }
}
