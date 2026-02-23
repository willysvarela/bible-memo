export type BibleVersion = "NVI" | "NTLH";

export const BIBLE_VERSIONS: BibleVersion[] = ["NVI", "NTLH"];

export interface Verse {
  id: string;
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd: number; // same as verseStart when single verse
  version: BibleVersion;
  text: string;
  createdAt: number;
}

export type AppView = "list" | "cards";
