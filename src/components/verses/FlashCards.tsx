"use client";

import { useState, useCallback } from "react";
import type { Verse } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Shuffle, ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";

interface FlashCardsProps {
  verses: Verse[];
}

function verseRef(v: Verse): string {
  const range =
    v.verseEnd !== v.verseStart
      ? `${v.verseStart}–${v.verseEnd}`
      : `${v.verseStart}`;
  return `${v.book} ${v.chapter}:${range}`;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function FlashCards({ verses }: FlashCardsProps) {
  const [order, setOrder] = useState<Verse[]>(verses);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);

  const current = order[index];

  const handleShuffle = useCallback(() => {
    setOrder(shuffle(verses));
    setIndex(0);
    setRevealed(false);
    setIsShuffled(true);
  }, [verses]);

  const handleReset = useCallback(() => {
    setOrder(verses);
    setIndex(0);
    setRevealed(false);
    setIsShuffled(false);
  }, [verses]);

  const handlePrev = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
    setRevealed(false);
  }, []);

  const handleNext = useCallback(() => {
    setIndex((i) => Math.min(order.length - 1, i + 1));
    setRevealed(false);
  }, [order.length]);

  if (verses.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border py-16 text-center text-muted-foreground">
        <p className="text-base">Nenhum versículo para praticar.</p>
        <p className="mt-1 text-sm">Adicione versículos na lista primeiro.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {index + 1} / {order.length}
          {isShuffled && (
            <span className="ml-2 text-xs text-amber-600">(embaralhado)</span>
          )}
        </span>
        <div className="flex gap-2">
          {isShuffled ? (
            <Button size="sm" variant="outline" onClick={handleReset} className="gap-2">
              <Shuffle className="h-3.5 w-3.5" />
              Ordem original
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={handleShuffle} className="gap-2">
              <Shuffle className="h-3.5 w-3.5" />
              Embaralhar
            </Button>
          )}
        </div>
      </div>

      {/* Card */}
      <div
        className="rounded-xl border border-border bg-card shadow-sm cursor-pointer select-none min-h-[260px] flex flex-col items-center justify-center p-8 text-center gap-4 transition-colors hover:bg-muted/20"
        onClick={() => setRevealed((r) => !r)}
      >
        {/* Reference always visible */}
        <p className="text-2xl font-bold tracking-tight">{verseRef(current)}</p>
        <span className="text-xs font-medium text-muted-foreground rounded-full border border-border px-2 py-0.5">
          {current.version ?? "NVI"}
        </span>

        {/* Divider */}
        <div className="w-12 h-px bg-border" />

        {/* Text / hidden state */}
        {revealed ? (
          <p className="text-base leading-relaxed text-foreground max-w-prose">
            {current.text}
          </p>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <EyeOff className="h-6 w-6" />
            <span className="text-sm">Toque para revelar o texto</span>
          </div>
        )}
      </div>

      {/* Reveal button */}
      <Button
        className="w-full gap-2"
        variant={revealed ? "outline" : "default"}
        onClick={() => setRevealed((r) => !r)}
      >
        {revealed ? (
          <>
            <EyeOff className="h-4 w-4" />
            Ocultar texto
          </>
        ) : (
          <>
            <Eye className="h-4 w-4" />
            Revelar texto
          </>
        )}
      </Button>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1 gap-2"
          onClick={handlePrev}
          disabled={index === 0}
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>
        <Button
          variant="outline"
          className="flex-1 gap-2"
          onClick={handleNext}
          disabled={index === order.length - 1}
        >
          Próximo
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
