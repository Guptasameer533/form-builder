"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, GripVertical, Settings, Sparkles, AlertTriangle } from "lucide-react"
import type { FormField, FieldOption } from "@/lib/types"
import { useFormBuilder } from "@/lib/store"
import { motion, AnimatePresence } from "framer-motion"

export function EnhancedFieldEditor() {
  const { currentForm, selectedFieldId, updateField, deleteField, selectField } = useFormBuilder()
  const [localField, setLocalField] = useState<FormField | null>(null)

  const selectedField = currentForm?.fields.find((field) => field.id === selectedFieldId)

  useEffect(() => {
    setLocalField(selectedField || null)
  }, [selectedField])

  if (!selectedField || !localField) {
    return (
      <GlassCard className="w-full lg:w-80 h-full bg-background/60 border-border/30">
        <div className="p-4 sm:p-6 border-b border-border/30">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-primary to-primary/60 rounded flex items-center justify-center">
              <Settings className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
            </div>
            <h2 className="text-base sm:text-lg font-semibold">Field Properties</h2>
          </div>
        </div>
        <div className="flex items-center justify-center h-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-6 sm:p-8"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-muted/40 to-muted/20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground/60" />
            </div>
            <p className="text-muted-foreground text-center text-sm sm:text-base">
              Select a field to edit its properties
            </p>
          </motion.div>
        </div>
      </GlassCard>
    )
  }

  const handleFieldUpdate = (updates: Partial<FormField>) => {
    const updatedField = { ...localField, ...updates }
    setLocalField(updatedField)
    updateField(selectedField.id, updates)
  }

  const handleAddOption = () => {
    const newOptions = [
      ...(localField.options || []),
      {
        label: `Option ${(localField.options?.length || 0) + 1}`,
        value: `option_${(localField.options?.length || 0) + 1}`,
      },
    ]
    handleFieldUpdate({ options: newOptions })
  }

  const handleUpdateOption = (index: number, updates: Partial<FieldOption>) => {
    const newOptions = [...(localField.options || [])]
    newOptions[index] = { ...newOptions[index], ...updates }
    handleFieldUpdate({ options: newOptions })
  }

  const handleDeleteOption = (index: number) => {
    const newOptions = localField.options?.filter((_, i) => i !== index) || []
    handleFieldUpdate({ options: newOptions })
  }

  const handleDeleteField = () => {
    deleteField(selectedField.id)
    selectField(null)
  }

  const needsOptions = ["dropdown", "radio", "checkbox"].includes(localField.type)

  const getFieldTypeColor = (type: string) => {
    const colors = {
      text: "from-blue-500 to-blue-600",
      textarea: "from-indigo-500 to-indigo-600",
      email: "from-green-500 to-green-600",
      phone: "from-emerald-500 to-emerald-600",
      number: "from-purple-500 to-purple-600",
      date: "from-orange-500 to-orange-600",
      dropdown: "from-pink-500 to-pink-600",
      radio: "from-rose-500 to-rose-600",
      checkbox: "from-cyan-500 to-cyan-600",
    }
    return colors[type as keyof typeof colors] || "from-gray-500 to-gray-600"
  }

  return (
    <GlassCard className="w-full lg:w-80 h-full bg-background/60 border-border/30">
      <div className="p-4 sm:p-6 border-b border-border/30">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-primary to-primary/60 rounded flex items-center justify-center">
            <Settings className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
          </div>
          <h2 className="text-base sm:text-lg font-semibold">Field Properties</h2>
        </div>

        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${getFieldTypeColor(localField.type)} text-white`}>
            <div className="w-3 h-3" />
          </div>
          <div>
            <p className="font-medium text-sm">{localField.label}</p>
            <Badge variant="outline" className="text-xs capitalize">
              {localField.type}
            </Badge>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Basic Properties */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="field-label" className="text-sm font-medium">
                Label
              </Label>
              <Input
                id="field-label"
                value={localField.label}
                onChange={(e) => handleFieldUpdate({ label: e.target.value })}
                placeholder="Field label"
                className="bg-background/50 border-border/30 focus:bg-background/80 text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="field-placeholder" className="text-sm font-medium">
                Placeholder
              </Label>
              <Input
                id="field-placeholder"
                value={localField.placeholder || ""}
                onChange={(e) => handleFieldUpdate({ placeholder: e.target.value })}
                placeholder="Placeholder text"
                className="bg-background/50 border-border/30 focus:bg-background/80 text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="field-help" className="text-sm font-medium">
                Help Text
              </Label>
              <Textarea
                id="field-help"
                value={localField.helpText || ""}
                onChange={(e) => handleFieldUpdate({ helpText: e.target.value })}
                placeholder="Additional help text"
                rows={2}
                className="bg-background/50 border-border/30 focus:bg-background/80 text-sm"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                <Label htmlFor="field-required" className="text-sm font-medium">
                  Required field
                </Label>
              </div>
              <Switch
                id="field-required"
                checked={localField.required || false}
                onCheckedChange={(checked) => handleFieldUpdate({ required: checked })}
              />
            </div>
          </div>

          <Separator className="bg-border/30" />

          {/* Validation Rules */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Validation</span>
            </h4>

            {(localField.type === "text" || localField.type === "textarea") && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="min-length" className="text-xs">
                    Min Length
                  </Label>
                  <Input
                    id="min-length"
                    type="number"
                    value={localField.validation?.minLength || ""}
                    onChange={(e) =>
                      handleFieldUpdate({
                        validation: {
                          ...localField.validation,
                          minLength: e.target.value ? Number.parseInt(e.target.value) : undefined,
                        },
                      })
                    }
                    placeholder="0"
                    className="bg-background/50 border-border/30 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="max-length" className="text-xs">
                    Max Length
                  </Label>
                  <Input
                    id="max-length"
                    type="number"
                    value={localField.validation?.maxLength || ""}
                    onChange={(e) =>
                      handleFieldUpdate({
                        validation: {
                          ...localField.validation,
                          maxLength: e.target.value ? Number.parseInt(e.target.value) : undefined,
                        },
                      })
                    }
                    placeholder="100"
                    className="bg-background/50 border-border/30 text-xs"
                  />
                </div>
              </div>
            )}

            {localField.type === "text" && (
              <div className="space-y-2">
                <Label htmlFor="pattern" className="text-sm">
                  Pattern (Regex)
                </Label>
                <Input
                  id="pattern"
                  value={localField.validation?.pattern || ""}
                  onChange={(e) =>
                    handleFieldUpdate({
                      validation: {
                        ...localField.validation,
                        pattern: e.target.value,
                      },
                    })
                  }
                  placeholder="^[a-zA-Z0-9]+$"
                  className="bg-background/50 border-border/30 text-sm"
                />
              </div>
            )}
          </div>

          {needsOptions && (
            <>
              <Separator className="bg-border/30" />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium flex items-center space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Options</span>
                  </h4>
                  <AnimatedButton size="sm" variant="gradient" onClick={handleAddOption}>
                    <Plus className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Add</span>
                  </AnimatedButton>
                </div>

                <div className="space-y-3">
                  <AnimatePresence>
                    {localField.options?.map((option, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center space-x-2 p-2 bg-background/30 rounded-lg border border-border/20"
                      >
                        <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab hidden sm:block" />
                        <Input
                          value={option.label}
                          onChange={(e) =>
                            handleUpdateOption(index, {
                              label: e.target.value,
                              value: e.target.value.toLowerCase().replace(/\s+/g, "_"),
                            })
                          }
                          placeholder="Option label"
                          className="flex-1 bg-background/50 border-border/30 text-sm"
                        />
                        <AnimatedButton
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteOption(index)}
                          className="hover:bg-destructive/10 hover:border-destructive/30 flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </AnimatedButton>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </>
          )}

          <Separator className="bg-border/30" />

          <AnimatedButton variant="destructive" className="w-full" onClick={handleDeleteField}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Field
          </AnimatedButton>
        </motion.div>
      </div>
    </GlassCard>
  )
}
