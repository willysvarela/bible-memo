import type { BibleVersion } from "@/lib/types";
import { BIBLE_BOOKS } from "@/lib/books";

const API_BASE = "https://www.abibliadigital.com.br/api";
export const TOKEN_KEY = "bible-memo-api-token";

export function getApiToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(TOKEN_KEY) ?? "";
}

export function setApiToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

function bookApiAbbr(bookName: string): string {
  const book = BIBLE_BOOKS.find((b) => b.name === bookName);
  if (!book) throw new Error(`Livro não encontrado: ${bookName}`);
  // Lowercase the abbreviation — "Jó" → "jó" (Job), "Jo" → "jo" (João), etc.
  return book.abbr.toLowerCase();
}

async function fetchSingleVerse(
  version: BibleVersion,
  abbr: string,
  chapter: number,
  verse: number,
  token: string
): Promise<string> {
  const res = await fetch(
    `${API_BASE}/verses/${version.toLowerCase()}/${abbr}/${chapter}/${verse}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.msg ?? `Erro ${res.status}`);
  }
  const data = await res.json();
  return data.text as string;
}

export async function fetchVerseText(
  version: BibleVersion,
  bookName: string,
  chapter: number,
  verseStart: number,
  verseEnd: number,
  token: string
): Promise<string> {
  const abbr = bookApiAbbr(bookName);

  if (verseStart === verseEnd) {
    return fetchSingleVerse(version, abbr, chapter, verseStart, token);
  }

  // Range: fetch each verse and join
  const texts = await Promise.all(
    Array.from({ length: verseEnd - verseStart + 1 }, (_, i) =>
      fetchSingleVerse(version, abbr, chapter, verseStart + i, token)
    )
  );
  return texts.join(" ");
}
