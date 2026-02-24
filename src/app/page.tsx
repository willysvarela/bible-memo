"use client";

import { useState } from "react";
import { useVerses } from "@/hooks/useVerses";
import { VerseList } from "@/components/verses/VerseList";
import { FlashCards } from "@/components/verses/FlashCards";
import { ApiTokenDialog } from "@/components/settings/ApiTokenDialog";
import { Button } from "@/components/ui/button";
import { List, LayoutGrid, Settings } from "lucide-react";
import type { AppView } from "@/lib/types";

export default function Home() {
  const { verses, loaded, addVerse, updateVerse, deleteVerse } = useVerses();
  const [view, setView] = useState<AppView>("list");
  const [settingsOpen, setSettingsOpen] = useState(false);

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground text-sm">
        Carregando…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Bible Memo</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Memorize a Palavra
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Settings */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSettingsOpen(true)}
              aria-label="Configurações"
            >
              <Settings className="h-4 w-4" />
            </Button>

            {/* View toggle */}
            <div className="flex rounded-lg border border-border overflow-hidden">
              <Button
                variant={view === "list" ? "default" : "ghost"}
                size="sm"
                className="rounded-none gap-2 px-3"
                onClick={() => setView("list")}
              >
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">Lista</span>
              </Button>
              <Button
                variant={view === "cards" ? "default" : "ghost"}
                size="sm"
                className="rounded-none gap-2 px-3 border-l border-border"
                onClick={() => setView("cards")}
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Cards</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Views */}
        {view === "list" ? (
          <VerseList
            verses={verses}
            onAdd={addVerse}
            onUpdate={updateVerse}
            onDelete={deleteVerse}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        ) : (
          <FlashCards verses={verses} />
        )}
      </div>

      <ApiTokenDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
