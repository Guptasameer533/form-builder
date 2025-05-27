"use client"

import type React from "react"
import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { GripVertical, Plus, Trash2, Sparkles, Layers, Zap } from "lucide-react"
import type { FormField, FormStep } from "@/lib/types"
import { useFormBuilder } from "@/lib/store"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface DraggedField {
  field: FormField
  index: number
  stepId?: string
}

export function EnhancedFormCanvas() {
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
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-primary/60 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <p className="text-muted-foreground text-base sm:text-lg">Create a new form to get started</p>
        </motion.div>
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

  const renderField = (field: FormField, index: number, stepId?: string) => {
    const isSelected = selectedFieldId === field.id
    const isDragging = draggedField?.field.id === field.id
    const isDropTarget = dragOverIndex === index && dragOverStepId === stepId

    return (
      <motion.div
        key={field.id}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "relative group cursor-pointer transition-all duration-200",
          isDragging && "opacity-50 scale-95",
          isDropTarget && "scale-105",
        )}
        draggable
        onDragStart={() => handleDragStart(field, index, stepId)}
        onDragOver={(e) => handleDragOver(e, index, stepId)}
        onDrop={(e) => handleDrop(e, index, stepId)}
        onClick={() => selectField(field.id)}
      >
        <GlassCard
          className={cn(
            "p-3 sm:p-4 bg-background/40 border-border/30 hover:bg-background/60 hover:border-border/60",
            isSelected && "ring-2 ring-primary/50 bg-primary/5 border-primary/30",
            isDropTarget && "ring-2 ring-primary border-primary bg-primary/10",
          )}
        >
          <div className="flex items-start space-x-3">
            <GripVertical className="w-4 h-4 text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing hidden sm:block" />

            <div
              className={`p-2 rounded-lg bg-gradient-to-br ${getFieldTypeColor(field.type)} text-white flex-shrink-0`}
            >
              <div className="w-3 h-3" />
            </div>

            <div className="flex-1 space-y-2 min-w-0">
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="font-medium truncate text-sm sm:text-base">{field.label}</span>
                {field.required && (
                  <Badge variant="secondary" className="text-xs bg-red-100 text-red-700 border-red-200">
                    Required
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs capitalize bg-background/50">
                  {field.type}
                </Badge>
              </div>

              {field.helpText && (
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{field.helpText}</p>
              )}

              {field.options && (
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Options:</span>{" "}
                  {field.options
                    .slice(0, 2)
                    .map((opt) => opt.label)
                    .join(", ")}
                  {field.options.length > 2 && ` +${field.options.length - 2} more`}
                </div>
              )}
            </div>

            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full border-2 border-background shadow-lg"
              />
            )}
          </div>
        </GlassCard>
      </motion.div>
    )
  }

  const renderStep = (step: FormStep, stepIndex: number) => {
    const stepFields = step.fields
      .map((fieldId) => currentForm.fields.find((field) => field.id === fieldId))
      .filter(Boolean) as FormField[]

    return (
      <motion.div
        key={step.id}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 sm:mb-6"
      >
        <GlassCard className="bg-background/30 border-border/30">
          <div className="p-4 sm:p-6 border-b border-border/30">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                  <Layers className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <Input
                  value={step.title}
                  onChange={(e) => updateStep(step.id, { title: e.target.value })}
                  className="border-none p-0 h-auto text-base sm:text-lg font-semibold bg-transparent focus:bg-background/50 rounded-md px-2"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-primary/10 border-primary/20 text-xs">
                  Step {stepIndex + 1}
                </Badge>
                <AnimatedButton size="sm" variant="outline" onClick={() => deleteStep(step.id)}>
                  <Trash2 className="w-4 h-4" />
                </AnimatedButton>
              </div>
            </div>
            {step.description && (
              <Textarea
                value={step.description}
                onChange={(e) => updateStep(step.id, { description: e.target.value })}
                placeholder="Step description..."
                className="mt-3 bg-background/50 border-border/30 text-sm"
                rows={2}
              />
            )}
          </div>
          <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            <AnimatePresence>{stepFields.map((field, index) => renderField(field, index, step.id))}</AnimatePresence>
            {stepFields.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 sm:py-12 text-muted-foreground border-2 border-dashed border-border/30 rounded-lg bg-muted/20"
              >
                <Layers className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 opacity-50" />
                <p className="text-base sm:text-lg mb-1">No fields in this step</p>
                <p className="text-xs sm:text-sm">Drag fields here to add them to this step</p>
              </motion.div>
            )}
          </div>
        </GlassCard>
      </motion.div>
    )
  }

  return (
    <div className="flex-1 p-3 sm:p-6 max-h-screen overflow-y-auto bg-gradient-to-br from-background via-muted/10 to-background">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Form Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard className="bg-background/40 border-border/30">
            <div className="p-4 sm:p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <Input
                  value={currentForm.title}
                  onChange={(e) => updateForm({ title: e.target.value })}
                  className="text-xl sm:text-2xl font-bold border-none p-0 h-auto bg-transparent focus:bg-background/50 rounded-md px-2"
                  placeholder="Form Title"
                />
              </div>
              <Textarea
                value={currentForm.description || ""}
                onChange={(e) => updateForm({ description: e.target.value })}
                placeholder="Form description (optional)"
                rows={2}
                className="bg-background/50 border-border/30 text-sm sm:text-base"
              />
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <AnimatedButton variant="outline" onClick={toggleMultiStep} className="w-full sm:w-auto">
                  <Layers className="w-4 h-4 mr-2" />
                  {currentForm.isMultiStep ? "Convert to Single Step" : "Convert to Multi-Step"}
                </AnimatedButton>
                {currentForm.isMultiStep && (
                  <AnimatedButton
                    variant="gradient"
                    onClick={() => addStep(`Step ${currentForm.steps.length + 1}`)}
                    className="w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Step
                  </AnimatedButton>
                )}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Form Content */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {currentForm.isMultiStep ? (
            <div className="space-y-4 sm:space-y-6">
              <AnimatePresence>{currentForm.steps.map((step, index) => renderStep(step, index))}</AnimatePresence>
            </div>
          ) : (
            <GlassCard className="bg-background/30 border-border/30">
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <AnimatePresence>{currentForm.fields.map((field, index) => renderField(field, index))}</AnimatePresence>
                {currentForm.fields.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 sm:py-16 text-muted-foreground border-2 border-dashed border-border/30 rounded-xl bg-gradient-to-br from-muted/20 to-muted/10"
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-primary/60" />
                    </div>
                    <p className="text-lg sm:text-xl mb-2 font-medium">No fields added yet</p>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      Drag components from the left panel to build your form
                    </p>
                  </motion.div>
                )}
              </div>
            </GlassCard>
          )}
        </motion.div>
      </div>
    </div>
  )
}
