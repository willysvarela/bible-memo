"use client";

import { useState, useEffect } from "react";
import { getApiToken, setApiToken } from "@/lib/bibleApi";
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

interface ApiTokenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApiTokenDialog({ open, onOpenChange }: ApiTokenDialogProps) {
  const [token, setToken] = useState("");

  useEffect(() => {
    if (open) setToken(getApiToken());
  }, [open]);

  function handleSave() {
    setApiToken(token.trim());
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Token da API Bíblia</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Para buscar textos automaticamente, crie uma conta gratuita em{" "}
            <strong>abibliadigital.com.br</strong> e cole o token abaixo.
          </p>
          <div className="space-y-1.5">
            <Label>Token</Label>
            <Input
              type="password"
              placeholder="Cole o token aqui…"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>
          {token && (
            <p className="text-xs text-green-600 font-medium">Token configurado.</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
