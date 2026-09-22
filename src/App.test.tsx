import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App.js';
import { searchContacts, type Contact } from './api.js';

vi.mock('./api.js', () => ({ searchContacts: vi.fn() }));

const mockedSearchContacts = vi.mocked(searchContacts);

describe('App', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('wartet vor der Suche und zeigt Treffer nach der Serverantwort', async () => {
    mockedSearchContacts.mockResolvedValueOnce([
      { id: 'contact-0', name: 'Anna Muster', phone: '0123' },
    ]);
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
      expect.any(AbortSignal),
    );
    expect(screen.getByText('Anna Muster')).toBeInTheDocument();
    expect(screen.getByText('0123')).toBeInTheDocument();
  });

  it('ignores a late response and clears results immediately', async () => {
    let resolveFirst: (contacts: Contact[]) => void = () => {
      throw new Error('First request was not initialized.');
    };
    let resolveSecond: (contacts: Contact[]) => void = () => {
      throw new Error('Second request was not initialized.');
    };
    mockedSearchContacts
      .mockImplementationOnce(
        () =>
          new Promise<Contact[]>((resolve) => {
            resolveFirst = resolve;
          }),
      )
      .mockImplementationOnce(
        () =>
          new Promise<Contact[]>((resolve) => {
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
      resolveSecond([
        { id: 'contact-1', name: 'Aktueller Kontakt', phone: '0456' },
      ]);
    });
    expect(screen.getByText('Aktueller Kontakt')).toBeInTheDocument();

    await act(async () => {
      resolveFirst([{ id: 'contact-0', name: 'Alter Kontakt', phone: '0123' }]);
    });
    expect(screen.queryByText('Alter Kontakt')).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: '   ' } });
    expect(screen.queryByText('Aktueller Kontakt')).not.toBeInTheDocument();
    expect(
      screen.getByText(
        'Gib einen Namen ein, um das Telefonbuch zu durchsuchen.',
      ),
    ).toBeInTheDocument();
  });
});
