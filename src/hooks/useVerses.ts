"use client";

import { useState, useEffect, useCallback } from "react";
import type { Verse } from "@/lib/types";
import { getBookOrder } from "@/lib/books";

const STORAGE_KEY = "bible-memo-verses";

function sortVerses(verses: Verse[]): Verse[] {
  return [...verses].sort((a, b) => {
    const bookDiff = getBookOrder(a.book) - getBookOrder(b.book);
    if (bookDiff !== 0) return bookDiff;
    if (a.chapter !== b.chapter) return a.chapter - b.chapter;
    return a.verseStart - b.verseStart;
  });
}

export function useVerses() {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setVerses(JSON.parse(raw));
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  const persist = useCallback((updated: Verse[]) => {
    const sorted = sortVerses(updated);
    setVerses(sorted);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
  }, []);

  const addVerse = useCallback(
    (verse: Omit<Verse, "id" | "createdAt">) => {
      const newVerse: Verse = {
        ...verse,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      };
      persist([...verses, newVerse]);
    },
    [verses, persist]
  );

  const updateVerse = useCallback(
    (id: string, data: Omit<Verse, "id" | "createdAt">) => {
      persist(verses.map((v) => (v.id === id ? { ...v, ...data } : v)));
    },
    [verses, persist]
  );

  const deleteVerse = useCallback(
    (id: string) => {
      persist(verses.filter((v) => v.id !== id));
    },
    [verses, persist]
  );

  return { verses, loaded, addVerse, updateVerse, deleteVerse };
}
