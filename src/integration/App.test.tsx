import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App.js';
import {
  SearchError,
  searchContacts,
  type Contact,
  type SearchPage,
} from '../api.js';

vi.mock('../api.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../api.js')>();
  return { ...actual, searchContacts: vi.fn() };
});

const mockedSearchContacts = vi.mocked(searchContacts);
const originalClipboard = Object.getOwnPropertyDescriptor(
  navigator,
  'clipboard',
);

function createSearchPage(
  contacts: Contact[],
  page = 1,
  pageSize = 10,
  totalCount = contacts.length,
  totalPages = Math.ceil(totalCount / pageSize),
) {
  return { contacts, page, pageSize, totalCount, totalPages };
}

function setClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText },
  });
}

function getRenderedContactName(name: string) {
  return screen.getByText((_content, element) => element?.textContent === name);
}

describe('App', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.resetAllMocks();
    if (originalClipboard) {
      Object.defineProperty(navigator, 'clipboard', originalClipboard);
    } else {
      Reflect.deleteProperty(navigator, 'clipboard');
    }
  });

  it('keeps the result area empty before a search', () => {
    render(<App />);

    expect(
      screen.queryByText(
        'Gib einen Namen ein, um das Telefonbuch zu durchsuchen.',
      ),
    ).not.toBeInTheDocument();
  });

  it('wartet vor der Suche und zeigt Treffer nach der Serverantwort', async () => {
    mockedSearchContacts.mockResolvedValueOnce(
      createSearchPage([
        { id: 'contact-0', name: 'Anna Muster', phone: '0123' },
      ]),
    );
    render(<App />);

    fireEvent.change(screen.getByLabelText('Name suchen'), {
      target: { value: 'anna' },
    });
    expect(mockedSearchContacts).not.toHaveBeenCalled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(280);
    });

    expect(mockedSearchContacts).toHaveBeenCalledWith(
      'anna',
      1,
      10,
      expect.any(AbortSignal),
    );
    expect(getRenderedContactName('Anna Muster')).toBeInTheDocument();
    expect(screen.getByText('0123')).toBeInTheDocument();
  });

  it('ignores a late response and clears results immediately', async () => {
    let resolveFirst: (searchPage: SearchPage) => void = () => {
      throw new Error('First request was not initialized.');
    };
    let resolveSecond: (searchPage: SearchPage) => void = () => {
      throw new Error('Second request was not initialized.');
    };
    mockedSearchContacts
      .mockImplementationOnce(
        () =>
          new Promise<SearchPage>((resolve) => {
            resolveFirst = resolve;
          }),
      )
      .mockImplementationOnce(
        () =>
          new Promise<SearchPage>((resolve) => {
            resolveSecond = resolve;
          }),
      );
    render(<App />);
    const input = screen.getByLabelText('Name suchen');

    fireEvent.change(input, { target: { value: 'erste' } });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(280);
    });
    fireEvent.change(input, { target: { value: 'zweite' } });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(280);
    });

    await act(async () => {
      resolveSecond(
        createSearchPage([
          { id: 'contact-1', name: 'Aktueller Kontakt', phone: '0456' },
        ]),
      );
    });
    expect(screen.getByText('Aktueller Kontakt')).toBeInTheDocument();

    await act(async () => {
      resolveFirst(
        createSearchPage([
          { id: 'contact-0', name: 'Alter Kontakt', phone: '0123' },
        ]),
      );
    });
    expect(screen.queryByText('Alter Kontakt')).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: '   ' } });
    expect(screen.queryByText('Aktueller Kontakt')).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        'Gib einen Namen ein, um das Telefonbuch zu durchsuchen.',
      ),
    ).not.toBeInTheDocument();
  });

  it('keeps highlights tied to the newest accepted search response', async () => {
    let resolveFirst: (searchPage: SearchPage) => void = () => {
      throw new Error('First request was not initialized.');
    };
    let resolveSecond: (searchPage: SearchPage) => void = () => {
      throw new Error('Second request was not initialized.');
    };
    mockedSearchContacts
      .mockImplementationOnce(
        () =>
          new Promise<SearchPage>((resolve) => {
            resolveFirst = resolve;
          }),
      )
      .mockImplementationOnce(
        () =>
          new Promise<SearchPage>((resolve) => {
            resolveSecond = resolve;
          }),
      );
    render(<App />);
    const input = screen.getByLabelText('Name suchen');

    fireEvent.change(input, { target: { value: 'first' } });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(280);
    });
    fireEvent.change(input, { target: { value: 'second' } });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(280);
    });

    await act(async () => {
      resolveSecond(
        createSearchPage([
          { id: 'contact-2', name: 'Second Second', phone: '0202' },
        ]),
      );
    });
    const highlightedMatches = screen.getAllByText('Second');
    expect(highlightedMatches).toHaveLength(2);
    highlightedMatches.forEach((element) => {
      expect(element.tagName).toBe('MARK');
    });

    await act(async () => {
      resolveFirst(
        createSearchPage([
          { id: 'contact-1', name: 'First First', phone: '0101' },
        ]),
      );
    });
    expect(screen.queryByText('First First')).not.toBeInTheDocument();
  });

  it('switches language without clearing the active query or results', async () => {
    mockedSearchContacts.mockResolvedValueOnce(
      createSearchPage([
        { id: 'contact-0', name: 'Anna Muster', phone: '0123' },
      ]),
    );
    render(<App />);
    const input = screen.getByLabelText('Name suchen');

    fireEvent.change(input, { target: { value: 'anna' } });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(280);
    });
    expect(getRenderedContactName('Anna Muster')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Englisch' }));

    expect(document.documentElement.lang).toBe('en');
    expect(document.title).toBe('FindCall – Find a phone number');
    expect(window.localStorage.getItem('findcall-locale')).toBe('en');
    expect(screen.getByLabelText('Search by name')).toHaveValue('anna');
    expect(screen.getByText('Search results')).toBeInTheDocument();
    expect(getRenderedContactName('Anna Muster')).toBeInTheDocument();
  });

  it('uses the persisted language for a new app instance', () => {
    window.localStorage.setItem('findcall-locale', 'en');
    render(<App />);

    expect(screen.getByLabelText('Search by name')).toBeInTheDocument();
    expect(document.documentElement.lang).toBe('en');
  });

  it('resets the page for a new query and ignores an older page response', async () => {
    let resolveSecond: (searchPage: SearchPage) => void = () => {
      throw new Error('Second request was not initialized.');
    };
    mockedSearchContacts
      .mockResolvedValueOnce(
        createSearchPage(
          [{ id: 'contact-1', name: 'First Page', phone: '0101' }],
          1,
          10,
          26,
          3,
        ),
      )
      .mockImplementationOnce(
        () =>
          new Promise<SearchPage>((resolve) => {
            resolveSecond = resolve;
          }),
      )
      .mockResolvedValueOnce(
        createSearchPage(
          [{ id: 'contact-1', name: 'New Query Page', phone: '0101' }],
          1,
          10,
          26,
          3,
        ),
      );
    render(<App />);

    fireEvent.change(screen.getByLabelText('Name suchen'), {
      target: { value: 'page' },
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(280);
    });
    fireEvent.click(screen.getByRole('button', { name: 'Seite 2' }));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(280);
    });
    expect(mockedSearchContacts).toHaveBeenLastCalledWith(
      'page',
      2,
      10,
      expect.any(AbortSignal),
    );

    fireEvent.change(screen.getByLabelText('Name suchen'), {
      target: { value: 'new page' },
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(280);
    });
    expect(mockedSearchContacts).toHaveBeenLastCalledWith(
      'new page',
      1,
      10,
      expect.any(AbortSignal),
    );
    expect(getRenderedContactName('New Query Page')).toBeInTheDocument();
    expect(screen.getByText('1–1 von 26 Treffern')).toBeInTheDocument();

    await act(async () => {
      resolveSecond(
        createSearchPage(
          [{ id: 'contact-11', name: 'Older Page', phone: '0111' }],
          2,
          10,
          26,
          3,
        ),
      );
    });
    expect(screen.queryByText('Older Page')).not.toBeInTheDocument();
  });

  it('resets the page for a new page size and preserves it on a language switch', async () => {
    mockedSearchContacts
      .mockResolvedValueOnce(
        createSearchPage(
          [{ id: 'contact-1', name: 'First Page', phone: '0101' }],
          1,
          10,
          26,
          3,
        ),
      )
      .mockResolvedValueOnce(
        createSearchPage(
          [{ id: 'contact-1', name: 'Resized First Page', phone: '0101' }],
          1,
          25,
          26,
          2,
        ),
      )
      .mockResolvedValueOnce(
        createSearchPage(
          [{ id: 'contact-26', name: 'Second Page', phone: '0126' }],
          2,
          25,
          26,
          2,
        ),
      );
    render(<App />);

    fireEvent.change(screen.getByLabelText('Name suchen'), {
      target: { value: 'page' },
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(280);
    });
    fireEvent.mouseDown(screen.getByRole('combobox'));
    fireEvent.click(screen.getByRole('option', { name: '25' }));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(280);
    });
    fireEvent.click(screen.getByRole('button', { name: 'Seite 2' }));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(280);
    });
    fireEvent.click(screen.getByRole('button', { name: 'Englisch' }));

    expect(getRenderedContactName('Second Page')).toBeInTheDocument();
    expect(screen.getByText('26–26 of 26 results')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveTextContent('25');
    expect(mockedSearchContacts).toHaveBeenCalledTimes(3);
  });

  it('copies the unmodified number for the selected contact with a duplicate name', async () => {
    const writeText = vi
      .fn<(text: string) => Promise<void>>()
      .mockResolvedValue();
    setClipboard(writeText);
    mockedSearchContacts.mockResolvedValueOnce(
      createSearchPage([
        { id: 'contact-1', name: 'Anna Muster', phone: '0101' },
        { id: 'contact-2', name: 'Anna Muster', phone: '0202-03' },
      ]),
    );
    render(<App />);

    fireEvent.change(screen.getByLabelText('Name suchen'), {
      target: { value: 'anna' },
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(280);
    });
    await act(async () => {
      fireEvent.click(
        screen.getAllByRole('button', {
          name: 'Telefonnummer von Anna Muster kopieren',
        })[1],
      );
    });

    expect(writeText).toHaveBeenCalledWith('0202-03');
    expect(screen.getByRole('status')).toHaveTextContent(
      'Telefonnummer kopiert.',
    );
    expect(screen.getByRole('button', { name: 'Kopiert' })).toBeInTheDocument();
  });

  it('shows copy success only after clipboard writing succeeds', async () => {
    let resolveWrite: () => void = () => {
      throw new Error('Clipboard write was not initialized.');
    };
    const writeText = vi.fn<(text: string) => Promise<void>>(
      () =>
        new Promise<void>((resolve) => {
          resolveWrite = resolve;
        }),
    );
    setClipboard(writeText);
    mockedSearchContacts.mockResolvedValueOnce(
      createSearchPage([
        { id: 'contact-1', name: 'Anna Muster', phone: '0101' },
      ]),
    );
    render(<App />);

    fireEvent.change(screen.getByLabelText('Name suchen'), {
      target: { value: 'anna' },
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(280);
    });
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Telefonnummer von Anna Muster kopieren',
      }),
    );

    expect(
      screen.queryByText('Telefonnummer kopiert.'),
    ).not.toBeInTheDocument();
    await act(async () => {
      resolveWrite();
    });
    expect(screen.getByRole('status')).toHaveTextContent(
      'Telefonnummer kopiert.',
    );
  });

  it('reports rejected clipboard access without hiding the phone number', async () => {
    const writeText = vi
      .fn<(text: string) => Promise<void>>()
      .mockRejectedValue(new Error('Permission denied'));
    setClipboard(writeText);
    mockedSearchContacts.mockResolvedValueOnce(
      createSearchPage([
        { id: 'contact-1', name: 'Anna Muster', phone: '0101' },
      ]),
    );
    render(<App />);

    fireEvent.change(screen.getByLabelText('Name suchen'), {
      target: { value: 'anna' },
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(280);
    });
    await act(async () => {
      fireEvent.click(
        screen.getByRole('button', {
          name: 'Telefonnummer von Anna Muster kopieren',
        }),
      );
    });

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Die Telefonnummer konnte nicht kopiert werden. Du kannst sie weiterhin auswählen.',
    );
    expect(screen.getByText('0101')).toBeInTheDocument();
  });

  it('reports when the Clipboard API is unavailable', async () => {
    Reflect.deleteProperty(navigator, 'clipboard');
    mockedSearchContacts.mockResolvedValueOnce(
      createSearchPage([
        { id: 'contact-1', name: 'Anna Muster', phone: '0101' },
      ]),
    );
    render(<App />);

    fireEvent.change(screen.getByLabelText('Name suchen'), {
      target: { value: 'anna' },
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(280);
    });
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Telefonnummer von Anna Muster kopieren',
      }),
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Kopieren ist in diesem Browser nicht verfügbar. Du kannst die Nummer weiterhin auswählen.',
    );
  });

  it('keeps the newest clipboard result when an older write resolves late', async () => {
    let resolveFirstWrite: () => void = () => {
      throw new Error('First clipboard write was not initialized.');
    };
    let resolveSecondWrite: () => void = () => {
      throw new Error('Second clipboard write was not initialized.');
    };
    const writeText = vi
      .fn<(text: string) => Promise<void>>()
      .mockImplementationOnce(
        () =>
          new Promise<void>((resolve) => {
            resolveFirstWrite = resolve;
          }),
      )
      .mockImplementationOnce(
        () =>
          new Promise<void>((resolve) => {
            resolveSecondWrite = resolve;
          }),
      );
    setClipboard(writeText);
    mockedSearchContacts.mockResolvedValueOnce(
      createSearchPage([
        { id: 'contact-1', name: 'Anna Muster', phone: '0101' },
        { id: 'contact-2', name: 'Berta Muster', phone: '0202' },
      ]),
    );
    render(<App />);

    fireEvent.change(screen.getByLabelText('Name suchen'), {
      target: { value: 'muster' },
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(280);
    });
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Telefonnummer von Anna Muster kopieren',
      }),
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Telefonnummer von Berta Muster kopieren',
      }),
    );

    await act(async () => {
      resolveSecondWrite();
    });
    expect(screen.getByRole('button', { name: 'Kopiert' })).toBeInTheDocument();
    await act(async () => {
      resolveFirstWrite();
    });
    expect(
      screen.getByRole('button', {
        name: 'Telefonnummer von Anna Muster kopieren',
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Kopiert' })).toBeInTheDocument();
    expect(writeText).toHaveBeenNthCalledWith(2, '0202');
  });

  it('translates error feedback after a language change', async () => {
    mockedSearchContacts.mockRejectedValueOnce(
      new SearchError('serviceUnavailable'),
    );
    render(<App />);

    fireEvent.change(screen.getByLabelText('Name suchen'), {
      target: { value: 'anna' },
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(280);
    });
    expect(
      screen.getByText('Die Suche ist momentan nicht erreichbar.'),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Englisch' }));
    expect(
      screen.getByText('The search is currently unavailable.'),
    ).toBeInTheDocument();
  });
});
