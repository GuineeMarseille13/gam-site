"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

interface EventMediaPreviewContextValue {
  isLightboxOpen: boolean;
  setLightboxOpen: (open: boolean) => void;
}

const EventMediaPreviewContext =
  createContext<EventMediaPreviewContextValue | null>(null);

export function EventMediaPreviewProvider({ children }: { children: ReactNode }) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const setLightboxOpen = useCallback((open: boolean) => {
    setIsLightboxOpen(open);
  }, []);

  return (
    <EventMediaPreviewContext.Provider
      value={{ isLightboxOpen, setLightboxOpen }}
    >
      {children}
    </EventMediaPreviewContext.Provider>
  );
}

export function useEventMediaPreview() {
  const ctx = useContext(EventMediaPreviewContext);
  return ctx;
}
