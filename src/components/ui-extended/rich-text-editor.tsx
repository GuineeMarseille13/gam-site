"use client";

import { useCallback, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Redo2,
  Undo2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/helpers/utils";
import {
  getAssociationPlainTextLength,
  normalizeAssociationContentForEditor,
  sanitizeAssociationHtml,
} from "@/lib/format/association-content-format";

interface RichTextEditorProps {
  id?: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  maxLength?: number;
  minHeightClassName?: string;
  className?: string;
  "aria-label"?: string;
}

interface ToolbarButtonProps {
  label: string;
  pressed?: boolean;
  disabled?: boolean;
  onPressedChange?: () => void;
  onClick?: () => void;
  children: React.ReactNode;
}

function ToolbarButton({
  label,
  pressed,
  disabled,
  onPressedChange,
  onClick,
  children,
}: ToolbarButtonProps) {
  if (onPressedChange) {
    return (
      <Toggle
        type="button"
        size="sm"
        variant="outline"
        pressed={pressed}
        disabled={disabled}
        onPressedChange={onPressedChange}
        aria-label={label}
        className="size-8 shrink-0 border-border/60 bg-background/80 data-[state=on]:border-amber-400/50 data-[state=on]:bg-amber-500/10 data-[state=on]:text-amber-700"
      >
        {children}
      </Toggle>
    );
  }

  return (
    <Button
      type="button"
      size="icon-sm"
      variant="outline"
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      className="size-8 shrink-0 border-border/60 bg-background/80 hover:bg-amber-500/5"
    >
      {children}
    </Button>
  );
}

/**
 * Éditeur riche TipTap — gras, italique, listes. Sortie HTML sanitisée.
 */
export function RichTextEditor({
  id,
  value,
  onChange,
  placeholder = "Rédigez votre contenu…",
  maxLength = 12_000,
  minHeightClassName = "min-h-[18rem]",
  className,
  "aria-label": ariaLabel = "Éditeur de texte enrichi",
}: RichTextEditorProps) {
  const handleUpdate = useCallback(
    (html: string) => {
      onChange(sanitizeAssociationHtml(html));
    },
    [onChange],
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        code: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: normalizeAssociationContentForEditor(value) || "<p></p>",
    editorProps: {
      attributes: {
        ...(id ? { id } : {}),
        "aria-label": ariaLabel,
        class: cn(
          "max-w-none text-base leading-relaxed focus:outline-none",
          minHeightClassName,
          "px-4 py-3 sm:px-5 sm:py-4",
          "[&_p]:my-3 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0",
          "[&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5",
          "[&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5",
          "[&_strong]:font-semibold",
        ),
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      handleUpdate(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    const normalized = normalizeAssociationContentForEditor(value);
    const current = sanitizeAssociationHtml(editor.getHTML());
    const next = sanitizeAssociationHtml(normalized || "<p></p>");

    if (current !== next) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
  }, [editor, value]);

  const plainLength = getAssociationPlainTextLength(value);
  const isNearLimit = plainLength > maxLength * 0.9;

  if (!editor) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-border/60 bg-background/80 shadow-sm",
          minHeightClassName,
          className,
        )}
        aria-busy="true"
      />
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border/60 bg-background/80 shadow-sm",
        "transition-shadow focus-within:border-amber-400/60 focus-within:ring-2 focus-within:ring-amber-500/15",
        className,
      )}
    >
      <div
        role="toolbar"
        aria-label="Mise en forme"
        className="flex flex-wrap items-center gap-1 border-b border-border/50 bg-muted/25 px-2 py-2 sm:px-3"
      >
        <ToolbarButton
          label="Gras"
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Italique"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="size-4" />
        </ToolbarButton>

        <div className="mx-1 hidden h-6 w-px bg-border/60 sm:block" aria-hidden />

        <ToolbarButton
          label="Liste à puces"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Liste numérotée"
          pressed={editor.isActive("orderedList")}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="size-4" />
        </ToolbarButton>

        <div className="mx-1 hidden h-6 w-px bg-border/60 sm:block" aria-hidden />

        <ToolbarButton
          label="Annuler"
          disabled={!editor.can().chain().focus().undo().run()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Rétablir"
          disabled={!editor.can().chain().focus().redo().run()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 className="size-4" />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/40 bg-muted/15 px-3 py-2 sm:px-4">
        <span className="text-[11px] font-medium text-muted-foreground">
          Gras, italique et listes
        </span>
        <span
          className={cn(
            "inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold tabular-nums",
            isNearLimit
              ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
              : "bg-muted text-muted-foreground",
          )}
          aria-live="polite"
        >
          {plainLength.toLocaleString("fr-FR")} / {maxLength.toLocaleString("fr-FR")}
        </span>
      </div>
    </div>
  );
}
