"use client";

import { useState } from "react";
import type { Verse } from "@/lib/types";
import { BIBLE_BOOKS } from "@/lib/books";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VerseForm } from "./VerseForm";
import { Pencil, Trash2, Plus } from "lucide-react";

interface VerseListProps {
  verses: Verse[];
  onAdd: (data: Omit<Verse, "id" | "createdAt">) => void;
  onUpdate: (id: string, data: Omit<Verse, "id" | "createdAt">) => void;
  onDelete: (id: string) => void;
  onOpenSettings: () => void;
}

function verseRef(v: Verse): string {
  const range =
    v.verseEnd !== v.verseStart ? `${v.verseStart}–${v.verseEnd}` : `${v.verseStart}`;
  return `${v.chapter}:${range}`;
}

function testament(book: string): "AT" | "NT" | null {
  return BIBLE_BOOKS.find((b) => b.name === book)?.testament ?? null;
}

export function VerseList({ verses, onAdd, onUpdate, onDelete, onOpenSettings }: VerseListProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Verse | null>(null);

  function handleEdit(v: Verse) {
    setEditing(v);
    setFormOpen(true);
  }

  function handleAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function handleSave(data: Omit<Verse, "id" | "createdAt">) {
    if (editing) {
      onUpdate(editing.id, data);
    } else {
      onAdd(data);
    }
    setEditing(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {verses.length === 0
            ? "Nenhum versículo ainda"
            : `${verses.length} versículo${verses.length !== 1 ? "s" : ""}`}
        </p>
        <Button size="sm" onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Adicionar
        </Button>
      </div>

      {verses.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-16 text-center text-muted-foreground">
          <p className="text-base">Nenhum versículo salvo.</p>
          <p className="mt-1 text-sm">Clique em &quot;Adicionar&quot; para começar.</p>
        </div>
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {verses.map((v) => {
            const t = testament(v.book);
            return (
              <li
                key={v.id}
                className="flex items-start gap-3 px-4 py-3 hover:bg-muted/30 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">
                      {v.book} {verseRef(v)}
                    </span>
                    <Badge variant="secondary" className="text-xs px-1.5 py-0">
                      {v.version ?? "NVI"}
                    </Badge>
                    {t && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0">
                        {t}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {v.text}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0 mt-0.5">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => handleEdit(v)}
                    aria-label="Editar"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => onDelete(v.id)}
                    aria-label="Excluir"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <VerseForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSave={handleSave}
        initialData={editing}
        onOpenSettings={onOpenSettings}
      />
    </div>
  );
}
