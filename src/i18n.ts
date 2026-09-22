export const LOCALE_STORAGE_KEY = 'findcall-locale';

export type Locale = 'de' | 'en';

export type TranslationKey =
  'invalidResponse' | 'searchFailed' | 'serviceUnavailable';

type Translations = {
  clearSearch: string;
  documentTitle: string;
  english: string;
  german: string;
  heading: string;
  helperText: string;
  homeLabel: string;
  initial: string;
  languageLabel: string;
  loading: string;
  noResults: string;
  results: string;
  resultsCount: (count: number) => string;
  searchLabel: string;
  slogan: string;
  waiting: string;
  errors: Record<TranslationKey, string>;
};

export const translations: Record<Locale, Translations> = {
  de: {
    clearSearch: 'Suche leeren',
    documentTitle: 'FindCall – Telefonnummer finden',
    english: 'Englisch',
    german: 'Deutsch',
    heading: 'Telefonnummer finden',
    helperText:
      'Die Suche startet automatisch und berücksichtigt keine Groß- und Kleinschreibung.',
    homeLabel: 'FindCall – zur Startseite',
    initial: 'Gib einen Namen ein, um das Telefonbuch zu durchsuchen.',
    languageLabel: 'Sprache',
    loading: 'Telefonbuch wird durchsucht.',
    noResults: 'Keine passenden Kontakte gefunden.',
    results: 'Suchergebnisse',
    resultsCount: (count) => `${count} Treffer gefunden.`,
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
    documentTitle: 'FindCall – Find a phone number',
    english: 'English',
    german: 'German',
    heading: 'Find a phone number',
    helperText: 'Search starts automatically and is not case-sensitive.',
    homeLabel: 'FindCall – back to home',
    initial: 'Enter a name to search the phonebook.',
    languageLabel: 'Language',
    loading: 'Searching the phonebook.',
    noResults: 'No matching contacts found.',
    results: 'Search results',
    resultsCount: (count) => `${count} results found.`,
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
