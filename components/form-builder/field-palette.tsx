"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, CheckSquare, ChevronDown, Hash, Mail, Phone, Type, AlignLeft, Circle } from "lucide-react"
import type { FieldType } from "@/lib/types"
import { useFormBuilder } from "@/lib/store"

const fieldTypes: Array<{
  type: FieldType
  label: string
  icon: React.ReactNode
  description: string
}> = [
  { type: "text", label: "Text Input", icon: <Type className="w-4 h-4" />, description: "Single line text input" },
  {
    type: "textarea",
    label: "Textarea",
    icon: <AlignLeft className="w-4 h-4" />,
    description: "Multi-line text input",
  },
  { type: "email", label: "Email", icon: <Mail className="w-4 h-4" />, description: "Email address input" },
  { type: "phone", label: "Phone", icon: <Phone className="w-4 h-4" />, description: "Phone number input" },
  { type: "number", label: "Number", icon: <Hash className="w-4 h-4" />, description: "Numeric input" },
  { type: "date", label: "Date", icon: <Calendar className="w-4 h-4" />, description: "Date picker" },
  {
    type: "dropdown",
    label: "Dropdown",
    icon: <ChevronDown className="w-4 h-4" />,
    description: "Select from options",
  },
  {
    type: "radio",
    label: "Radio Group",
    icon: <Circle className="w-4 h-4" />,
    description: "Single choice from options",
  },
  {
    type: "checkbox",
    label: "Checkbox",
    icon: <CheckSquare className="w-4 h-4" />,
    description: "Multiple selections",
  },
]

export function FieldPalette() {
  const { addField } = useFormBuilder()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredFields = fieldTypes.filter(
    (field) =>
      field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddField = (type: FieldType) => {
    const fieldConfig = fieldTypes.find((f) => f.type === type)
    if (!fieldConfig) return

    addField({
      type,
      label: fieldConfig.label,
      placeholder: `Enter ${fieldConfig.label.toLowerCase()}...`,
      required: false,
    })
  }

  const handleDragStart = (e: React.DragEvent, type: FieldType) => {
    e.dataTransfer.setData("fieldType", type)
    e.dataTransfer.effectAllowed = "copy"
  }

  return (
    <Card className="w-80 h-full">
      <CardHeader>
        <CardTitle className="text-lg">Field Components</CardTitle>
        <Input
          placeholder="Search fields..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-2"
        />
      </CardHeader>
      <CardContent className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
        {filteredFields.map((field) => (
          <Button
            key={field.type}
            variant="outline"
            className="w-full justify-start h-auto p-3 text-left hover:bg-primary/5 transition-colors"
            onClick={() => handleAddField(field.type)}
            draggable
            onDragStart={(e) => handleDragStart(e, field.type)}
          >
            <div className="flex items-start space-x-3">
              <div className="mt-0.5 text-primary">{field.icon}</div>
              <div>
                <div className="font-medium">{field.label}</div>
                <div className="text-sm text-muted-foreground">{field.description}</div>
              </div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
