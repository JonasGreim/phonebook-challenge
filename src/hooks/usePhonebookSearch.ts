import { useEffect, useRef, useState } from 'react';
import {
  SearchError,
  searchContacts,
  type SearchErrorCode,
  type SearchPage,
} from '../api.js';

export type SearchStatus =
  'initial' | 'waiting' | 'loading' | 'success' | 'empty' | 'error';
export type PageSize = 10 | 25 | 50;

const INITIAL_STATUS: SearchStatus = 'initial';

function getSearchErrorCode(error: unknown): SearchErrorCode {
  return error instanceof SearchError ? error.code : 'searchFailed';
}

export function usePhonebookSearch() {
  const [input, setInput] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(10);
  const [searchPage, setSearchPage] = useState<SearchPage | null>(null);
  const [resultQuery, setResultQuery] = useState('');
  const [status, setStatus] = useState<SearchStatus>(INITIAL_STATUS);
  const [errorCode, setErrorCode] = useState<SearchErrorCode | null>(null);
  const requestId = useRef(0);

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

  useEffect(() => {
    const query = input.trim();
    const currentRequest = ++requestId.current;

    if (!query) return undefined;

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

  return {
    errorCode,
    handleInputChange,
    handlePageChange,
    handlePageSizeChange,
    input,
    page,
    pageSize,
    resultQuery,
    searchPage,
    status,
  };
}
