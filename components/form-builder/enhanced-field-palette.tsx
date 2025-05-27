"use client"

import type React from "react"
import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  CheckSquare,
  ChevronDown,
  Hash,
  Mail,
  Phone,
  Type,
  AlignLeft,
  Circle,
  Search,
  Sparkles,
} from "lucide-react"
import type { FieldType } from "@/lib/types"
import { useFormBuilder } from "@/lib/store"
import { motion, AnimatePresence } from "framer-motion"

const fieldTypes: Array<{
  type: FieldType
  label: string
  icon: React.ReactNode
  description: string
  color: string
  category: string
}> = [
  {
    type: "text",
    label: "Text Input",
    icon: <Type className="w-4 h-4" />,
    description: "Single line text input",
    color: "from-blue-500 to-blue-600",
    category: "Basic",
  },
  {
    type: "textarea",
    label: "Textarea",
    icon: <AlignLeft className="w-4 h-4" />,
    description: "Multi-line text input",
    color: "from-indigo-500 to-indigo-600",
    category: "Basic",
  },
  {
    type: "email",
    label: "Email",
    icon: <Mail className="w-4 h-4" />,
    description: "Email address input",
    color: "from-green-500 to-green-600",
    category: "Contact",
  },
  {
    type: "phone",
    label: "Phone",
    icon: <Phone className="w-4 h-4" />,
    description: "Phone number input",
    color: "from-emerald-500 to-emerald-600",
    category: "Contact",
  },
  {
    type: "number",
    label: "Number",
    icon: <Hash className="w-4 h-4" />,
    description: "Numeric input",
    color: "from-purple-500 to-purple-600",
    category: "Data",
  },
  {
    type: "date",
    label: "Date",
    icon: <Calendar className="w-4 h-4" />,
    description: "Date picker",
    color: "from-orange-500 to-orange-600",
    category: "Data",
  },
  {
    type: "dropdown",
    label: "Dropdown",
    icon: <ChevronDown className="w-4 h-4" />,
    description: "Select from options",
    color: "from-pink-500 to-pink-600",
    category: "Choice",
  },
  {
    type: "radio",
    label: "Radio Group",
    icon: <Circle className="w-4 h-4" />,
    description: "Single choice from options",
    color: "from-rose-500 to-rose-600",
    category: "Choice",
  },
  {
    type: "checkbox",
    label: "Checkbox",
    icon: <CheckSquare className="w-4 h-4" />,
    description: "Multiple selections",
    color: "from-cyan-500 to-cyan-600",
    category: "Choice",
  },
]

const categories = ["All", "Basic", "Contact", "Data", "Choice"]

export function EnhancedFieldPalette() {
  const { addField } = useFormBuilder()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredFields = fieldTypes.filter((field) => {
    const matchesSearch =
      field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || field.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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

  return (
    <GlassCard className="w-full lg:w-80 h-full bg-background/60 border-border/30">
      <div className="p-4 sm:p-6 border-b border-border/30">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-primary to-primary/60 rounded flex items-center justify-center">
            <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
          </div>
          <h2 className="text-base sm:text-lg font-semibold">Field Components</h2>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search fields..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background/50 border-border/30 focus:bg-background/80 transition-colors text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-1 sm:gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer text-xs hover:bg-primary/20 transition-colors px-2 py-1"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto">
        <AnimatePresence>
          {filteredFields.map((field, index) => (
            <motion.div
              key={field.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <AnimatedButton
                variant="outline"
                className="w-full justify-start h-auto p-3 sm:p-4 text-left bg-background/30 border-border/30 hover:bg-background/60 hover:border-border/60 group min-h-[60px] sm:min-h-[auto]"
                onClick={() => handleAddField(field.type)}
              >
                <div className="flex items-start space-x-3 w-full">
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-br ${field.color} text-white group-hover:scale-110 transition-transform flex-shrink-0`}
                  >
                    {field.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm mb-1">{field.label}</div>
                    <div className="text-xs text-muted-foreground leading-relaxed hidden sm:block">
                      {field.description}
                    </div>
                  </div>
                </div>
              </AnimatedButton>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </GlassCard>
  )
}
