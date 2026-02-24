"use client";

import { useState, useEffect } from "react";
import type { Verse, BibleVersion } from "@/lib/types";
import { BIBLE_VERSIONS } from "@/lib/types";
import { BIBLE_BOOKS } from "@/lib/books";
import { fetchVerseText, getApiToken } from "@/lib/bibleApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader2 } from "lucide-react";

interface VerseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Omit<Verse, "id" | "createdAt">) => void;
  initialData?: Verse | null;
  onOpenSettings: () => void;
}

const EMPTY: Omit<Verse, "id" | "createdAt"> = {
  book: "",
  chapter: 1,
  verseStart: 1,
  verseEnd: 1,
  version: "NVI",
  text: "",
};

export function VerseForm({
  open,
  onOpenChange,
  onSave,
  initialData,
  onOpenSettings,
}: VerseFormProps) {
  const [form, setForm] = useState(EMPTY);
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setFetchError(null);
      setForm(
        initialData
          ? {
              book: initialData.book,
              chapter: initialData.chapter,
              verseStart: initialData.verseStart,
              verseEnd: initialData.verseEnd,
              version: initialData.version,
              text: initialData.text,
            }
          : EMPTY
      );
    }
  }, [open, initialData]);

  const canFetch =
    !!form.book && form.chapter >= 1 && form.verseStart >= 1;

  async function handleFetch() {
    const token = getApiToken();
    if (!token) {
      onOpenChange(false);
      onOpenSettings();
      return;
    }
    setFetching(true);
    setFetchError(null);
    try {
      const text = await fetchVerseText(
        form.version,
        form.book,
        form.chapter,
        form.verseStart,
        form.verseEnd,
        token
      );
      setForm((f) => ({ ...f, text }));
    } catch (e) {
      setFetchError(e instanceof Error ? e.message : "Erro ao buscar texto");
    } finally {
      setFetching(false);
    }
  }

  const isValid =
    form.book &&
    form.chapter >= 1 &&
    form.verseStart >= 1 &&
    form.verseEnd >= form.verseStart &&
    form.text.trim().length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    onSave({ ...form, text: form.text.trim() });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar versículo" : "Adicionar versículo"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Book */}
          <div className="space-y-1.5">
            <Label>Livro</Label>
            <Select
              value={form.book}
              onValueChange={(v) => setForm((f) => ({ ...f, book: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o livro…" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {BIBLE_BOOKS.map((b) => (
                  <SelectItem key={b.name} value={b.name}>
                    {b.abbr} — {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Version */}
          <div className="space-y-1.5">
            <Label>Versão</Label>
            <div className="flex gap-2">
              {BIBLE_VERSIONS.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() =>
                    setForm((f) => ({ ...f, version: v as BibleVersion }))
                  }
                  className={`flex-1 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                    form.version === v
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input bg-background hover:bg-muted"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Chapter + verse range */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Capítulo</Label>
              <Input
                type="number"
                min={1}
                value={form.chapter}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    chapter: parseInt(e.target.value) || 1,
                  }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Vers. início</Label>
              <Input
                type="number"
                min={1}
                value={form.verseStart}
                onChange={(e) => {
                  const v = parseInt(e.target.value) || 1;
                  setForm((f) => ({
                    ...f,
                    verseStart: v,
                    verseEnd: Math.max(f.verseEnd, v),
                  }));
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Vers. fim</Label>
              <Input
                type="number"
                min={form.verseStart}
                value={form.verseEnd}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    verseEnd: Math.max(
                      f.verseStart,
                      parseInt(e.target.value) || f.verseStart
                    ),
                  }))
                }
              />
            </div>
          </div>

          {/* Fetch button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full gap-2"
            disabled={!canFetch || fetching}
            onClick={handleFetch}
          >
            {fetching ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Search className="h-3.5 w-3.5" />
            )}
            {fetching ? "Buscando…" : "Buscar texto na API"}
          </Button>
          {fetchError && (
            <p className="text-xs text-destructive">{fetchError}</p>
          )}

          {/* Text */}
          <div className="space-y-1.5">
            <Label>Texto</Label>
            <textarea
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              placeholder="Digite ou busque o texto do versículo…"
              value={form.text}
              onChange={(e) =>
                setForm((f) => ({ ...f, text: e.target.value }))
              }
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!isValid}>
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
