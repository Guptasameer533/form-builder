"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { GripVertical, Plus, Trash2 } from "lucide-react"
import type { FormField, FormStep } from "@/lib/types"
import { useFormBuilder } from "@/lib/store"
import { cn } from "@/lib/utils"

interface DraggedField {
  field: FormField
  index: number
  stepId?: string
}

export function FormCanvas() {
  const {
    currentForm,
    selectedFieldId,
    selectField,
    updateForm,
    addStep,
    updateStep,
    deleteStep,
    reorderFields,
    toggleMultiStep,
  } = useFormBuilder()

  const [draggedField, setDraggedField] = useState<DraggedField | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [dragOverStepId, setDragOverStepId] = useState<string | null>(null)

  if (!currentForm) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Create a new form to get started</p>
      </div>
    )
  }

  const handleDragStart = (field: FormField, index: number, stepId?: string) => {
    setDraggedField({ field, index, stepId })
  }

  const handleDragOver = (e: React.DragEvent, index: number, stepId?: string) => {
    e.preventDefault()
    setDragOverIndex(index)
    setDragOverStepId(stepId || null)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number, dropStepId?: string) => {
    e.preventDefault()

    if (!draggedField) return

    const { index: dragIndex, stepId: dragStepId } = draggedField

    if (dragIndex !== dropIndex || dragStepId !== dropStepId) {
      reorderFields(dragIndex, dropIndex, dropStepId)
    }

    setDraggedField(null)
    setDragOverIndex(null)
    setDragOverStepId(null)
  }

  const renderField = (field: FormField, index: number, stepId?: string) => {
    const isSelected = selectedFieldId === field.id
    const isDragging = draggedField?.field.id === field.id
    const isDropTarget = dragOverIndex === index && dragOverStepId === stepId

    return (
      <div
        key={field.id}
        className={cn(
          "relative group border rounded-lg p-4 cursor-pointer transition-all",
          isSelected && "border-primary bg-primary/5 ring-2 ring-primary/20",
          isDragging && "opacity-50 scale-95",
          isDropTarget && "border-primary border-2 bg-primary/10",
          "hover:border-primary/50 hover:shadow-sm",
        )}
        draggable
        onDragStart={() => handleDragStart(field, index, stepId)}
        onDragOver={(e) => handleDragOver(e, index, stepId)}
        onDrop={(e) => handleDrop(e, index, stepId)}
        onClick={() => selectField(field.id)}
      >
        <div className="flex items-start space-x-3">
          <GripVertical className="w-4 h-4 text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-medium">{field.label}</span>
              {field.required && (
                <Badge variant="secondary" className="text-xs">
                  Required
                </Badge>
              )}
              <Badge variant="outline" className="text-xs capitalize">
                {field.type}
              </Badge>
            </div>

            {field.helpText && <p className="text-sm text-muted-foreground">{field.helpText}</p>}

            {field.options && (
              <div className="text-xs text-muted-foreground">
                Options: {field.options.map((opt) => opt.label).join(", ")}
              </div>
            )}
          </div>
          {isSelected && (
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full border-2 border-background"></div>
          )}
        </div>
      </div>
    )
  }

  const renderStep = (step: FormStep, stepIndex: number) => {
    const stepFields = step.fields
      .map((fieldId) => currentForm.fields.find((field) => field.id === fieldId))
      .filter(Boolean) as FormField[]

    return (
      <Card key={step.id} className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              <Input
                value={step.title}
                onChange={(e) => updateStep(step.id, { title: e.target.value })}
                className="border-none p-0 h-auto text-lg font-semibold bg-transparent"
              />
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Step {stepIndex + 1}</Badge>
              <Button size="sm" variant="outline" onClick={() => deleteStep(step.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {step.description && (
            <Textarea
              value={step.description}
              onChange={(e) => updateStep(step.id, { description: e.target.value })}
              placeholder="Step description..."
              className="mt-2"
              rows={2}
            />
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {stepFields.map((field, index) => renderField(field, index, step.id))}
          {stepFields.length === 0 && (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
              Drag fields here to add them to this step
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex-1 p-6 max-h-screen overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Form Header */}
        <Card>
          <CardHeader>
            <div className="space-y-4">
              <Input
                value={currentForm.title}
                onChange={(e) => updateForm({ title: e.target.value })}
                className="text-2xl font-bold border-none p-0 h-auto bg-transparent"
                placeholder="Form Title"
              />
              <Textarea
                value={currentForm.description || ""}
                onChange={(e) => updateForm({ description: e.target.value })}
                placeholder="Form description (optional)"
                rows={2}
              />
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={toggleMultiStep}>
                  {currentForm.isMultiStep ? "Convert to Single Step" : "Convert to Multi-Step"}
                </Button>
                {currentForm.isMultiStep && (
                  <Button variant="outline" onClick={() => addStep(`Step ${currentForm.steps.length + 1}`)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Step
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Form Content */}
        {currentForm.isMultiStep ? (
          <div className="space-y-4">{currentForm.steps.map((step, index) => renderStep(step, index))}</div>
        ) : (
          <Card>
            <CardContent className="p-6 space-y-4">
              {currentForm.fields.map((field, index) => renderField(field, index))}
              {currentForm.fields.length === 0 && (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                  <p className="text-lg mb-2">No fields added yet</p>
                  <p>Drag components from the left panel to build your form</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
