"use client"

import { useEffect } from "react"
import { useFormBuilder } from "@/lib/store"

export function KeyboardShortcuts() {
  const { undo, redo, canUndo, canRedo, saveForm, currentForm } = useFormBuilder()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault()
        if (canUndo()) {
          undo()
        }
      }

      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y for redo
      if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "Z") || ((e.ctrlKey || e.metaKey) && e.key === "y")) {
        e.preventDefault()
        if (canRedo()) {
          redo()
        }
      }

      // Ctrl/Cmd + S for save
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault()
        if (currentForm) {
          saveForm()
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [undo, redo, canUndo, canRedo, saveForm, currentForm])

  return null
}
