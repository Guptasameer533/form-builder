import { create } from "zustand"
import type {
  FormBuilderState,
  Form,
  FormField,
  FormStep,
  FormResponse,
  FormTemplate,
  PreviewMode,
  Theme,
} from "./types"

interface FormBuilderStore extends FormBuilderState {
  // Form management
  createForm: (title: string) => void
  updateForm: (updates: Partial<Form>) => void
  loadForm: (form: Form) => void

  // Field management
  addField: (field: Omit<FormField, "id">) => void
  updateField: (fieldId: string, updates: Partial<FormField>) => void
  deleteField: (fieldId: string) => void
  reorderFields: (fromIndex: number, toIndex: number, stepId?: string) => void
  selectField: (fieldId: string | null) => void

  // Step management
  addStep: (title: string) => void
  updateStep: (stepId: string, updates: Partial<FormStep>) => void
  deleteStep: (stepId: string) => void
  toggleMultiStep: () => void

  // UI state
  setPreviewMode: (mode: PreviewMode) => void
  setTheme: (theme: Theme) => void
  setDragging: (isDragging: boolean) => void

  // History management
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean

  // Persistence
  saveForm: () => string
  loadFormById: (id: string) => Form | null
  saveResponse: (formId: string, data: Record<string, any>) => void
  getResponses: (formId: string) => FormResponse[]

  // Templates
  saveTemplate: (name: string, description: string) => void
  loadTemplate: (template: FormTemplate) => void
  getTemplates: () => FormTemplate[]
}

const generateId = () => Math.random().toString(36).substr(2, 9)

const defaultForm: Form = {
  id: "",
  title: "Untitled Form",
  description: "",
  fields: [],
  steps: [],
  isMultiStep: false,
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const useFormBuilder = create<FormBuilderStore>((set, get) => ({
  currentForm: null,
  selectedFieldId: null,
  previewMode: "desktop",
  theme: "light",
  isDragging: false,
  history: [],
  historyIndex: -1,
  autoSaveEnabled: true,

  createForm: (title: string) => {
    const form: Form = {
      ...defaultForm,
      id: generateId(),
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    set((state) => ({
      currentForm: form,
      history: [form],
      historyIndex: 0,
    }))
  },

  updateForm: (updates: Partial<Form>) => {
    set((state) => {
      if (!state.currentForm) return state

      const updatedForm = {
        ...state.currentForm,
        ...updates,
        updatedAt: new Date(),
      }

      const newHistory = state.history.slice(0, state.historyIndex + 1)
      newHistory.push(updatedForm)

      return {
        currentForm: updatedForm,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      }
    })
  },

  loadForm: (form: Form) => {
    set({
      currentForm: form,
      history: [form],
      historyIndex: 0,
      selectedFieldId: null,
    })
  },

  addField: (field: Omit<FormField, "id">) => {
    const { currentForm, updateForm } = get()
    if (!currentForm) return

    const newField: FormField = {
      ...field,
      id: generateId(),
    }

    updateForm({
      fields: [...currentForm.fields, newField],
    })
  },

  updateField: (fieldId: string, updates: Partial<FormField>) => {
    const { currentForm, updateForm } = get()
    if (!currentForm) return

    const updatedFields = currentForm.fields.map((field) => (field.id === fieldId ? { ...field, ...updates } : field))

    updateForm({ fields: updatedFields })
  },

  deleteField: (fieldId: string) => {
    const { currentForm, updateForm } = get()
    if (!currentForm) return

    const updatedFields = currentForm.fields.filter((field) => field.id !== fieldId)
    const updatedSteps = currentForm.steps.map((step) => ({
      ...step,
      fields: step.fields.filter((id) => id !== fieldId),
    }))

    updateForm({
      fields: updatedFields,
      steps: updatedSteps,
    })

    set({ selectedFieldId: null })
  },

  reorderFields: (fromIndex: number, toIndex: number, stepId?: string) => {
    const { currentForm, updateForm } = get()
    if (!currentForm) return

    if (stepId) {
      // Reorder within a step
      const updatedSteps = currentForm.steps.map((step) => {
        if (step.id === stepId) {
          const newFields = [...step.fields]
          const [movedField] = newFields.splice(fromIndex, 1)
          newFields.splice(toIndex, 0, movedField)
          return { ...step, fields: newFields }
        }
        return step
      })
      updateForm({ steps: updatedSteps })
    } else {
      // Reorder in main fields array
      const newFields = [...currentForm.fields]
      const [movedField] = newFields.splice(fromIndex, 1)
      newFields.splice(toIndex, 0, movedField)
      updateForm({ fields: newFields })
    }
  },

  selectField: (fieldId: string | null) => {
    set({ selectedFieldId: fieldId })
  },

  addStep: (title: string) => {
    const { currentForm, updateForm } = get()
    if (!currentForm) return

    const newStep: FormStep = {
      id: generateId(),
      title,
      fields: [],
    }

    updateForm({
      steps: [...currentForm.steps, newStep],
      isMultiStep: true,
    })
  },

  updateStep: (stepId: string, updates: Partial<FormStep>) => {
    const { currentForm, updateForm } = get()
    if (!currentForm) return

    const updatedSteps = currentForm.steps.map((step) => (step.id === stepId ? { ...step, ...updates } : step))

    updateForm({ steps: updatedSteps })
  },

  deleteStep: (stepId: string) => {
    const { currentForm, updateForm } = get()
    if (!currentForm) return

    const stepToDelete = currentForm.steps.find((step) => step.id === stepId)
    if (!stepToDelete) return

    // Move fields back to main form
    const updatedFields = [
      ...currentForm.fields,
      ...(stepToDelete.fields
        .map((fieldId) => currentForm.fields.find((field) => field.id === fieldId))
        .filter(Boolean) as FormField[]),
    ]

    const updatedSteps = currentForm.steps.filter((step) => step.id !== stepId)

    updateForm({
      fields: updatedFields,
      steps: updatedSteps,
      isMultiStep: updatedSteps.length > 0,
    })
  },

  toggleMultiStep: () => {
    const { currentForm, updateForm } = get()
    if (!currentForm) return

    if (currentForm.isMultiStep) {
      // Convert to single step - move all fields to main form
      const allFields = currentForm.steps.reduce((acc, step) => {
        const stepFields = step.fields
          .map((fieldId) => currentForm.fields.find((field) => field.id === fieldId))
          .filter(Boolean) as FormField[]
        return [...acc, ...stepFields]
      }, [] as FormField[])

      updateForm({
        fields: allFields,
        steps: [],
        isMultiStep: false,
      })
    } else {
      // Convert to multi-step
      if (currentForm.fields.length > 0) {
        const firstStep: FormStep = {
          id: generateId(),
          title: "Step 1",
          fields: currentForm.fields.map((field) => field.id),
        }

        updateForm({
          steps: [firstStep],
          isMultiStep: true,
        })
      }
    }
  },

  setPreviewMode: (mode: PreviewMode) => {
    set({ previewMode: mode })
  },

  setTheme: (theme: Theme) => {
    set({ theme })
    localStorage.setItem("form-builder-theme", theme)
  },

  setDragging: (isDragging: boolean) => {
    set({ isDragging })
  },

  undo: () => {
    set((state) => {
      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1
        return {
          currentForm: state.history[newIndex],
          historyIndex: newIndex,
        }
      }
      return state
    })
  },

  redo: () => {
    set((state) => {
      if (state.historyIndex < state.history.length - 1) {
        const newIndex = state.historyIndex + 1
        return {
          currentForm: state.history[newIndex],
          historyIndex: newIndex,
        }
      }
      return state
    })
  },

  canUndo: () => {
    const { historyIndex } = get()
    return historyIndex > 0
  },

  canRedo: () => {
    const { historyIndex, history } = get()
    return historyIndex < history.length - 1
  },

  saveForm: () => {
    const { currentForm } = get()
    if (!currentForm) return ""

    const forms = JSON.parse(localStorage.getItem("form-builder-forms") || "[]")
    const existingIndex = forms.findIndex((form: Form) => form.id === currentForm.id)

    if (existingIndex >= 0) {
      forms[existingIndex] = currentForm
    } else {
      forms.push(currentForm)
    }

    localStorage.setItem("form-builder-forms", JSON.stringify(forms))
    return currentForm.id
  },

  loadFormById: (id: string) => {
    const forms = JSON.parse(localStorage.getItem("form-builder-forms") || "[]")
    return forms.find((form: Form) => form.id === id) || null
  },

  saveResponse: (formId: string, data: Record<string, any>) => {
    const responses = JSON.parse(localStorage.getItem("form-builder-responses") || "[]")
    const newResponse: FormResponse = {
      id: generateId(),
      formId,
      data,
      submittedAt: new Date(),
    }

    responses.push(newResponse)
    localStorage.setItem("form-builder-responses", JSON.stringify(responses))
  },

  getResponses: (formId: string) => {
    const responses = JSON.parse(localStorage.getItem("form-builder-responses") || "[]")
    return responses.filter((response: FormResponse) => response.formId === formId)
  },

  saveTemplate: (name: string, description: string) => {
    const { currentForm } = get()
    if (!currentForm) return

    const templates = JSON.parse(localStorage.getItem("form-builder-templates") || "[]")
    const newTemplate: FormTemplate = {
      id: generateId(),
      name,
      description,
      form: {
        title: currentForm.title,
        description: currentForm.description,
        fields: currentForm.fields,
        steps: currentForm.steps,
        isMultiStep: currentForm.isMultiStep,
      },
    }

    templates.push(newTemplate)
    localStorage.setItem("form-builder-templates", JSON.stringify(templates))
  },

  loadTemplate: (template: FormTemplate) => {
    const form: Form = {
      ...template.form,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    set({
      currentForm: form,
      history: [form],
      historyIndex: 0,
      selectedFieldId: null,
    })
  },

  getTemplates: () => {
    return JSON.parse(localStorage.getItem("form-builder-templates") || "[]")
  },
}))
