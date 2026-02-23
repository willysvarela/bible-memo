export interface Verse {
  id: string;
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd: number; // same as verseStart when single verse
  text: string;
  createdAt: number;
}

export type AppView = "list" | "cards";
