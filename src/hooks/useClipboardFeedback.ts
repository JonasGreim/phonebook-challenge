import { useRef, useState } from 'react';

export type ClipboardFeedbackStatus = 'success' | 'unavailable' | 'failed';

export interface ClipboardFeedback {
  contactId: string;
  id: number;
  status: ClipboardFeedbackStatus;
}

export function useClipboardFeedback() {
  const [clipboardFeedback, setClipboardFeedback] =
    useState<ClipboardFeedback | null>(null);
  const clipboardRequestId = useRef(0);

  async function copyPhoneNumber(contactId: string, phone: string) {
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

  return { clipboardFeedback, copyPhoneNumber, dismissClipboardFeedback };
}
