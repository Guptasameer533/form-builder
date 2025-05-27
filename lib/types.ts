export type FieldType = "text" | "textarea" | "dropdown" | "checkbox" | "date" | "email" | "phone" | "number" | "radio"

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: string
  message?: string
}

export interface FieldOption {
  label: string
  value: string
}

export interface FormField {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  helpText?: string
  required?: boolean
  validation?: ValidationRule
  options?: FieldOption[]
  stepId?: string
}

export interface FormStep {
  id: string
  title: string
  description?: string
  fields: string[]
}

export interface Form {
  id: string
  title: string
  description?: string
  fields: FormField[]
  steps: FormStep[]
  isMultiStep: boolean
  createdAt: Date
  updatedAt: Date
}

export interface FormResponse {
  id: string
  formId: string
  data: Record<string, any>
  submittedAt: Date
}

export interface FormTemplate {
  id: string
  name: string
  description: string
  form: Omit<Form, "id" | "createdAt" | "updatedAt">
}

export type PreviewMode = "desktop" | "tablet" | "mobile"
export type Theme = "light" | "dark"

export interface FormBuilderState {
  currentForm: Form | null
  selectedFieldId: string | null
  previewMode: PreviewMode
  theme: Theme
  isDragging: boolean
  history: Form[]
  historyIndex: number
  autoSaveEnabled: boolean
}
