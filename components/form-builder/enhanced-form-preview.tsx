"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Monitor, Tablet, Smartphone, Sparkles, Eye, RotateCcw } from "lucide-react"
import type { FormField } from "@/lib/types"
import { useFormBuilder } from "@/lib/store"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export function EnhancedFormPreview() {
  const { currentForm, previewMode, setPreviewMode } = useFormBuilder()
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Reset form when currentForm changes
  useEffect(() => {
    if (currentForm) {
      setCurrentStepIndex(0)
      setFormData({})
      setErrors({})
      setIsSubmitted(false)
    }
  }, [currentForm])

  // Scroll to top when step changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  }, [currentStepIndex])

  if (!currentForm) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-primary/60 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <p className="text-muted-foreground text-base sm:text-lg">No form to preview</p>
        </motion.div>
      </div>
    )
  }

  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && (!value || (typeof value === "string" && value.trim() === ""))) {
      return `${field.label} is required`
    }

    if (field.validation && value) {
      const { minLength, maxLength, pattern } = field.validation

      if (minLength && value.length < minLength) {
        return `${field.label} must be at least ${minLength} characters`
      }

      if (maxLength && value.length > maxLength) {
        return `${field.label} must be no more than ${maxLength} characters`
      }

      if (pattern && !new RegExp(pattern).test(value)) {
        if (field.type === "email") {
          return "Please enter a valid email address"
        } else if (field.type === "phone") {
          return "Please enter a valid phone number"
        } else {
          return `${field.label} format is invalid`
        }
      }
    }

    return null
  }

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))

    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: "" }))
    }
  }

  const validateStep = (stepFields: FormField[]): boolean => {
    const stepErrors: Record<string, string> = {}
    let isValid = true

    stepFields.forEach((field) => {
      const error = validateField(field, formData[field.id])
      if (error) {
        stepErrors[field.id] = error
        isValid = false
      }
    })

    setErrors((prev) => ({ ...prev, ...stepErrors }))
    return isValid
  }

  const handleNextStep = () => {
    if (currentForm.isMultiStep) {
      const currentStep = currentForm.steps[currentStepIndex]
      const stepFields = currentStep.fields
        .map((fieldId) => currentForm.fields.find((field) => field.id === fieldId))
        .filter(Boolean) as FormField[]

      if (validateStep(stepFields)) {
        setCurrentStepIndex((prev) => Math.min(prev + 1, currentForm.steps.length - 1))
      }
    }
  }

  const handlePrevStep = () => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const fieldsToValidate = currentForm.isMultiStep ? currentForm.fields : currentForm.fields

    if (validateStep(fieldsToValidate)) {
      console.log("Form submitted:", formData)
      setIsSubmitted(true)

      // Scroll to top to show success message
      if (containerRef.current) {
        containerRef.current.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }
    }
  }

  const handleReset = () => {
    setFormData({})
    setErrors({})
    setCurrentStepIndex(0)
    setIsSubmitted(false)

    // Scroll to top
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  }

  const renderField = (field: FormField) => {
    const error = errors[field.id]
    const value = formData[field.id] || ""

    const fieldElement = (() => {
      switch (field.type) {
        case "text":
        case "email":
        case "phone":
        case "number":
          return (
            <Input
              type={
                field.type === "number"
                  ? "number"
                  : field.type === "email"
                    ? "email"
                    : field.type === "phone"
                      ? "tel"
                      : "text"
              }
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className={cn(
                "transition-all duration-200 text-sm sm:text-base h-10 sm:h-11",
                error ? "border-destructive focus:border-destructive" : "focus:border-primary",
              )}
            />
          )

        case "textarea":
          return (
            <Textarea
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className={cn(
                "transition-all duration-200 text-sm sm:text-base min-h-[80px] sm:min-h-[100px] resize-none",
                error ? "border-destructive focus:border-destructive" : "focus:border-primary",
              )}
              rows={3}
            />
          )

        case "date":
          return (
            <Input
              type="date"
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className={cn(
                "transition-all duration-200 text-sm sm:text-base h-10 sm:h-11",
                error ? "border-destructive focus:border-destructive" : "focus:border-primary",
              )}
            />
          )

        case "dropdown":
          return (
            <Select value={value} onValueChange={(val) => handleFieldChange(field.id, val)}>
              <SelectTrigger
                className={cn(
                  "transition-all duration-200 text-sm sm:text-base h-10 sm:h-11",
                  error ? "border-destructive focus:border-destructive" : "focus:border-primary",
                )}
              >
                <SelectValue placeholder={field.placeholder || "Select an option"} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-sm sm:text-base">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )

        case "radio":
          return (
            <RadioGroup
              value={value}
              onValueChange={(val) => handleFieldChange(field.id, val)}
              className="space-y-3 sm:space-y-2"
            >
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <RadioGroupItem
                    value={option.value}
                    id={`${field.id}-${option.value}`}
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  />
                  <Label
                    htmlFor={`${field.id}-${option.value}`}
                    className="text-sm sm:text-base leading-relaxed cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )

        case "checkbox":
          const checkboxValues = Array.isArray(value) ? value : []
          return (
            <div className="space-y-3 sm:space-y-2">
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <Checkbox
                    id={`${field.id}-${option.value}`}
                    checked={checkboxValues.includes(option.value)}
                    onCheckedChange={(checked) => {
                      const newValues = checked
                        ? [...checkboxValues, option.value]
                        : checkboxValues.filter((v) => v !== option.value)
                      handleFieldChange(field.id, newValues)
                    }}
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  />
                  <Label
                    htmlFor={`${field.id}-${option.value}`}
                    className="text-sm sm:text-base leading-relaxed cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          )

        default:
          return <div className="text-sm text-muted-foreground">Unsupported field type: {field.type}</div>
      }
    })()

    return (
      <motion.div
        key={field.id}
        className="space-y-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Label htmlFor={field.id} className="flex items-center space-x-2 text-sm sm:text-base font-medium">
          <span>{field.label}</span>
          {field.required && <span className="text-destructive text-lg">*</span>}
        </Label>
        {fieldElement}
        {field.helpText && <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{field.helpText}</p>}
        {error && (
          <motion.p
            className="text-xs sm:text-sm text-destructive font-medium"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    )
  }

  const getPreviewWidth = () => {
    switch (previewMode) {
      case "mobile":
        return "max-w-sm"
      case "tablet":
        return "max-w-2xl"
      case "desktop":
        return "max-w-4xl"
      default:
        return "max-w-4xl"
    }
  }

  const currentStep = currentForm.isMultiStep ? currentForm.steps[currentStepIndex] : null
  const fieldsToShow = currentStep
    ? (currentStep.fields
        .map((fieldId) => currentForm.fields.find((field) => field.id === fieldId))
        .filter(Boolean) as FormField[])
    : currentForm.fields

  const progress = currentForm.isMultiStep ? ((currentStepIndex + 1) / currentForm.steps.length) * 100 : 100

  // Success state
  if (isSubmitted) {
    return (
      <div
        ref={containerRef}
        className="flex-1 p-3 sm:p-6 bg-gradient-to-br from-background via-muted/10 to-background overflow-y-auto"
      >
        <motion.div
          className="flex items-center justify-center min-h-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <GlassCard className="bg-background/60 border-border/30 shadow-xl max-w-md w-full">
            <div className="p-6 sm:p-8 text-center">
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Thank You!</h2>
              <p className="text-muted-foreground mb-6">
                Your form has been submitted successfully. We'll get back to you soon.
              </p>
              <AnimatedButton onClick={handleReset} variant="gradient" className="w-full">
                <RotateCcw className="w-4 h-4 mr-2" />
                Fill Out Again
              </AnimatedButton>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 p-3 sm:p-6 bg-gradient-to-br from-background via-muted/10 to-background overflow-y-auto"
    >
      {/* Header */}
      <motion.div
        className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
            <Eye className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold">Form Preview</h2>
        </div>

        {/* Device Preview Toggle - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:flex items-center space-x-2">
          <AnimatedButton
            variant={previewMode === "desktop" ? "default" : "outline"}
            size="sm"
            onClick={() => setPreviewMode("desktop")}
          >
            <Monitor className="w-4 h-4" />
          </AnimatedButton>
          <AnimatedButton
            variant={previewMode === "tablet" ? "default" : "outline"}
            size="sm"
            onClick={() => setPreviewMode("tablet")}
          >
            <Tablet className="w-4 h-4" />
          </AnimatedButton>
          <AnimatedButton
            variant={previewMode === "mobile" ? "default" : "outline"}
            size="sm"
            onClick={() => setPreviewMode("mobile")}
          >
            <Smartphone className="w-4 h-4" />
          </AnimatedButton>
        </div>

        {/* Mobile Device Indicator */}
        <div className="lg:hidden">
          <Badge variant="outline" className="text-xs">
            <Smartphone className="w-3 h-3 mr-1" />
            Mobile View
          </Badge>
        </div>
      </motion.div>

      {/* Preview Container */}
      <motion.div
        className={cn("mx-auto transition-all duration-300", getPreviewWidth())}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard className="bg-background/60 border-border/30 shadow-xl" ref={formRef}>
          {/* Form Header */}
          <div className="p-4 sm:p-6 border-b border-border/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">{currentForm.title}</h1>
                {currentForm.description && (
                  <p className="text-sm sm:text-base text-muted-foreground mt-1">{currentForm.description}</p>
                )}
              </div>
            </div>

            {/* Multi-step Progress */}
            {currentForm.isMultiStep && (
              <motion.div
                className="space-y-3 sm:space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-sm font-medium">
                    Step {currentStepIndex + 1} of {currentForm.steps.length}
                  </span>
                  <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="w-full h-2 sm:h-3" />
                {currentStep && (
                  <div className="space-y-1">
                    <h3 className="font-semibold text-sm sm:text-base">{currentStep.title}</h3>
                    {currentStep.description && (
                      <p className="text-xs sm:text-sm text-muted-foreground">{currentStep.description}</p>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Form Content */}
          <div className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStepIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 sm:space-y-6"
                >
                  {fieldsToShow.length > 0 ? (
                    fieldsToShow.map(renderField)
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No fields in this step</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Form Navigation */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-border/20">
                {currentForm.isMultiStep && currentStepIndex > 0 ? (
                  <AnimatedButton
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                    className="w-full sm:w-auto order-2 sm:order-1"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </AnimatedButton>
                ) : (
                  <div className="hidden sm:block" />
                )}

                <div className="w-full sm:w-auto sm:ml-auto order-1 sm:order-2">
                  {currentForm.isMultiStep && currentStepIndex < currentForm.steps.length - 1 ? (
                    <AnimatedButton
                      type="button"
                      onClick={handleNextStep}
                      variant="gradient"
                      className="w-full sm:w-auto"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </AnimatedButton>
                  ) : (
                    <AnimatedButton type="submit" variant="glow" className="w-full sm:w-auto">
                      Submit Form
                    </AnimatedButton>
                  )}
                </div>
              </div>
            </form>
          </div>
        </GlassCard>
      </motion.div>

      {/* Mobile Preview Info */}
      <motion.div
        className="mt-4 text-center lg:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-xs text-muted-foreground">Preview optimized for mobile viewing</p>
      </motion.div>
    </div>
  )
}
