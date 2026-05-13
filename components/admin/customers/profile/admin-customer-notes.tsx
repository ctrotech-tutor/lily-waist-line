"use client";

import { StickyNote, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CustomerNote } from "./data";

interface AdminCustomerNotesProps {
  notes: CustomerNote[];
}

export function AdminCustomerNotes({ notes }: AdminCustomerNotesProps) {
  return (
    <Card className="rounded-none border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <StickyNote className="h-5 w-5 text-[#d4af37]" />
          <CardTitle className="font-[family-name:var(--font-bodoni-moda)] text-lg font-semibold">
            Admin Notes
          </CardTitle>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 font-[family-name:var(--font-montserrat)] text-xs hover:text-[#d4af37]"
          onClick={() => {
            // UI only - no backend integration
            console.log("Add note clicked");
          }}
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add Note
        </Button>
      </CardHeader>
      <CardContent>
        {notes.length === 0 ? (
          <div className="py-8 text-center">
            <p className="font-[family-name:var(--font-montserrat)] text-sm text-muted-foreground">
              No notes added yet
            </p>
            <p className="mt-1 font-[family-name:var(--font-montserrat)] text-xs text-muted-foreground">
              Click Add Note to record customer insights
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="border border-border/50 bg-muted/30 p-3"
              >
                <p className="font-[family-name:var(--font-montserrat)] text-sm">
                  {note.content}
                </p>
                <p className="mt-1 font-[family-name:var(--font-montserrat)] text-xs text-muted-foreground">
                  Added {note.createdAt}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
