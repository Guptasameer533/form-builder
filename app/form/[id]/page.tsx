"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react"
import type { Form, FormField } from "@/lib/types"
import { useFormBuilder } from "@/lib/store"

export default function FormFiller() {
  const params = useParams()
  const formId = params.id as string
  const { loadFormById, saveResponse } = useFormBuilder()

  const [form, setForm] = useState<Form | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (formId) {
      const loadedForm = loadFormById(formId)
      setForm(loadedForm)
      setIsLoading(false)
    }
  }, [formId, loadFormById])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading form...</p>
        </div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold mb-2">Form Not Found</h2>
            <p className="text-muted-foreground">The form you're looking for doesn't exist or has been removed.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Thank You!</h2>
            <p className="text-muted-foreground">
              Your form has been submitted successfully. We'll get back to you soon.
            </p>
          </CardContent>
        </Card>
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
    if (form.isMultiStep) {
      const currentStep = form.steps[currentStepIndex]
      const stepFields = currentStep.fields
        .map((fieldId) => form.fields.find((field) => field.id === fieldId))
        .filter(Boolean) as FormField[]

      if (validateStep(stepFields)) {
        setCurrentStepIndex((prev) => Math.min(prev + 1, form.steps.length - 1))
      }
    }
  }

  const handlePrevStep = () => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const fieldsToValidate = form.isMultiStep ? form.fields : form.fields

    if (validateStep(fieldsToValidate)) {
      saveResponse(form.id, formData)
      setIsSubmitted(true)
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
              className={error ? "border-destructive" : ""}
            />
          )

        case "textarea":
          return (
            <Textarea
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className={error ? "border-destructive" : ""}
              rows={3}
            />
          )

        case "date":
          return (
            <Input
              type="date"
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className={error ? "border-destructive" : ""}
            />
          )

        case "dropdown":
          return (
            <Select value={value} onValueChange={(val) => handleFieldChange(field.id, val)}>
              <SelectTrigger className={error ? "border-destructive" : ""}>
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

  const currentStep = form.isMultiStep ? form.steps[currentStepIndex] : null
  const fieldsToShow = currentStep
    ? (currentStep.fields
        .map((fieldId) => form.fields.find((field) => field.id === fieldId))
        .filter(Boolean) as FormField[])
    : form.fields

  const progress = form.isMultiStep ? ((currentStepIndex + 1) / form.steps.length) * 100 : 100

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{form.title}</CardTitle>
            {form.description && <p className="text-muted-foreground">{form.description}</p>}

            {form.isMultiStep && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>
                    Step {currentStepIndex + 1} of {form.steps.length}
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
            <form onSubmit={handleSubmit} className="space-y-6">
              {fieldsToShow.map(renderField)}

              <div className="flex items-center justify-between pt-4">
                {form.isMultiStep && currentStepIndex > 0 && (
                  <Button type="button" variant="outline" onClick={handlePrevStep}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                )}

                <div className="ml-auto">
                  {form.isMultiStep && currentStepIndex < form.steps.length - 1 ? (
                    <Button type="button" onClick={handleNextStep}>
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button type="submit">Submit Form</Button>
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
