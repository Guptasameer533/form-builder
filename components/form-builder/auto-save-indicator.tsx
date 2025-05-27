"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertCircle } from "lucide-react"
import { useFormBuilder } from "@/lib/store"

export function AutoSaveIndicator() {
  const { currentForm, saveForm } = useFormBuilder()
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">("saved")
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  useEffect(() => {
    if (!currentForm) return

    const autoSaveInterval = setInterval(() => {
      setSaveStatus("saving")
      try {
        saveForm()
        setSaveStatus("saved")
        setLastSaved(new Date())
      } catch (error) {
        setSaveStatus("error")
      }
    }, 30000) // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval)
  }, [currentForm, saveForm])

  if (!currentForm) return null

  const getStatusIcon = () => {
    switch (saveStatus) {
      case "saved":
        return <CheckCircle className="w-3 h-3" />
      case "saving":
        return <Clock className="w-3 h-3 animate-spin" />
      case "error":
        return <AlertCircle className="w-3 h-3" />
    }
  }

  const getStatusText = () => {
    switch (saveStatus) {
      case "saved":
        return lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : "Saved"
      case "saving":
        return "Saving..."
      case "error":
        return "Save failed"
    }
  }

  const getStatusVariant = () => {
    switch (saveStatus) {
      case "saved":
        return "secondary"
      case "saving":
        return "outline"
      case "error":
        return "destructive"
    }
  }

  return (
    <Badge variant={getStatusVariant()} className="text-xs">
      {getStatusIcon()}
      <span className="ml-1">{getStatusText()}</span>
    </Badge>
  )
}
