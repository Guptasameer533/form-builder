"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Monitor, Tablet, Smartphone, RotateCcw } from "lucide-react"
import type { FormField } from "@/lib/types"
import { useFormBuilder } from "@/lib/store"
import { cn } from "@/lib/utils"

export function FormPreview() {
  const { currentForm, previewMode, setPreviewMode } = useFormBuilder()
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
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
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">No form to preview</p>
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
              className={cn(error ? "border-destructive" : "", "w-full")}
            />
          )

        case "textarea":
          return (
            <Textarea
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className={cn(error ? "border-destructive" : "", "w-full resize-none")}
              rows={3}
            />
          )

        case "date":
          return (
            <Input
              type="date"
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className={cn(error ? "border-destructive" : "", "w-full")}
            />
          )

        case "dropdown":
          return (
            <Select value={value} onValueChange={(val) => handleFieldChange(field.id, val)}>
              <SelectTrigger className={cn(error ? "border-destructive" : "", "w-full")}>
                <SelectValue placeholder={field.placeholder || "Select an option"} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )

        case "radio":
          return (
            <RadioGroup value={value} onValueChange={(val) => handleFieldChange(field.id, val)} className="space-y-2">
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${field.id}-${option.value}`} />
                  <Label htmlFor={`${field.id}-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          )

        case "checkbox":
          const checkboxValues = Array.isArray(value) ? value : []
          return (
            <div className="space-y-2">
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.id}-${option.value}`}
                    checked={checkboxValues.includes(option.value)}
                    onCheckedChange={(checked) => {
                      const newValues = checked
                        ? [...checkboxValues, option.value]
                        : checkboxValues.filter((v) => v !== option.value)
                      handleFieldChange(field.id, newValues)
                    }}
                  />
                  <Label htmlFor={`${field.id}-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </div>
          )

        default:
          return <div>Unsupported field type: {field.type}</div>
      }
    })()

    return (
      <div key={field.id} className="space-y-2">
        <Label htmlFor={field.id} className="flex items-center space-x-1">
          <span>{field.label}</span>
          {field.required && <span className="text-destructive">*</span>}
        </Label>
        {fieldElement}
        {field.helpText && <p className="text-sm text-muted-foreground">{field.helpText}</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    )
  }

  const getPreviewWidth = () => {
    switch (previewMode) {
      case "mobile":
        return "w-full"
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
      <div ref={containerRef} className="flex-1 p-4 sm:p-6 bg-muted/30 overflow-y-auto">
        <div className="flex items-center justify-center min-h-full">
          <Card className="max-w-md w-full">
            <CardContent className="text-center py-8">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Thank You!</h2>
              <p className="text-muted-foreground mb-4">
                Your form has been submitted successfully. We'll get back to you soon.
              </p>
              <Button onClick={handleReset} className="w-full">
                <RotateCcw className="w-4 h-4 mr-2" />
                Fill Out Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="flex-1 p-4 sm:p-6 bg-muted/30 overflow-y-auto">
      <div className="mb-4 sm:mb-6 flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-semibold">Form Preview</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant={previewMode === "desktop" ? "default" : "outline"}
            size="icon"
            onClick={() => setPreviewMode("desktop")}
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button
            variant={previewMode === "tablet" ? "default" : "outline"}
            size="icon"
            onClick={() => setPreviewMode("tablet")}
          >
            <Tablet className="w-4 h-4" />
          </Button>
          <Button
            variant={previewMode === "mobile" ? "default" : "outline"}
            size="icon"
            onClick={() => setPreviewMode("mobile")}
          >
            <Smartphone className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className={cn("mx-auto transition-all duration-300", getPreviewWidth())}>
        <Card>
          <CardHeader>
            <CardTitle>{currentForm.title}</CardTitle>
            {currentForm.description && <p className="text-muted-foreground">{currentForm.description}</p>}

            {currentForm.isMultiStep && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>
                    Step {currentStepIndex + 1} of {currentForm.steps.length}
                  </span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="w-full" />
                {currentStep && (
                  <div>
                    <h3 className="font-medium">{currentStep.title}</h3>
                    {currentStep.description && (
                      <p className="text-sm text-muted-foreground">{currentStep.description}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {fieldsToShow.length > 0 ? (
                fieldsToShow.map(renderField)
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No fields in this step</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-between pt-4">
                {currentForm.isMultiStep && currentStepIndex > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                    className="w-full sm:w-auto mb-2 sm:mb-0"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                )}

                <div className="ml-auto">
                  {currentForm.isMultiStep && currentStepIndex < currentForm.steps.length - 1 ? (
                    <Button type="button" onClick={handleNextStep} className="w-full sm:w-auto">
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button type="submit" className="w-full sm:w-auto">
                      Submit Form
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
