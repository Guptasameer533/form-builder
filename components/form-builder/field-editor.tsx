"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, GripVertical } from "lucide-react"
import type { FormField, FieldOption } from "@/lib/types"
import { useFormBuilder } from "@/lib/store"

export function FieldEditor() {
  const { currentForm, selectedFieldId, updateField, deleteField, selectField } = useFormBuilder()
  const [localField, setLocalField] = useState<FormField | null>(null)

  const selectedField = currentForm?.fields.find((field) => field.id === selectedFieldId)

  useEffect(() => {
    setLocalField(selectedField || null)
  }, [selectedField])

  if (!selectedField || !localField) {
    return (
      <Card className="w-80 h-full">
        <CardHeader>
          <CardTitle className="text-lg">Field Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">Select a field to edit its properties</p>
        </CardContent>
      </Card>
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

  return (
    <Card className="w-80 h-full">
      <CardHeader>
        <CardTitle className="text-lg">Field Properties</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        <div className="space-y-2">
          <Label htmlFor="field-label">Label</Label>
          <Input
            id="field-label"
            value={localField.label}
            onChange={(e) => handleFieldUpdate({ label: e.target.value })}
            placeholder="Field label"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="field-placeholder">Placeholder</Label>
          <Input
            id="field-placeholder"
            value={localField.placeholder || ""}
            onChange={(e) => handleFieldUpdate({ placeholder: e.target.value })}
            placeholder="Placeholder text"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="field-help">Help Text</Label>
          <Textarea
            id="field-help"
            value={localField.helpText || ""}
            onChange={(e) => handleFieldUpdate({ helpText: e.target.value })}
            placeholder="Additional help text"
            rows={2}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="field-required"
            checked={localField.required || false}
            onCheckedChange={(checked) => handleFieldUpdate({ required: checked })}
          />
          <Label htmlFor="field-required">Required field</Label>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-medium">Validation</h4>

          {(localField.type === "text" || localField.type === "textarea") && (
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="min-length">Min Length</Label>
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
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="max-length">Max Length</Label>
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
                />
              </div>
            </div>
          )}

          {localField.type === "text" && (
            <div className="space-y-2">
              <Label htmlFor="pattern">Pattern (Regex)</Label>
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
              />
            </div>
          )}
        </div>

        {needsOptions && (
          <>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Options</h4>
                <Button size="sm" onClick={handleAddOption}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Option
                </Button>
              </div>

              <div className="space-y-2">
                {localField.options?.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    <Input
                      value={option.label}
                      onChange={(e) =>
                        handleUpdateOption(index, {
                          label: e.target.value,
                          value: e.target.value.toLowerCase().replace(/\s+/g, "_"),
                        })
                      }
                      placeholder="Option label"
                      className="flex-1"
                    />
                    <Button size="sm" variant="outline" onClick={() => handleDeleteOption(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator />

        <Button variant="destructive" className="w-full" onClick={handleDeleteField}>
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Field
        </Button>
      </CardContent>
    </Card>
  )
}
