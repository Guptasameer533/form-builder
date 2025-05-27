"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Eye, Download, Star } from "lucide-react"
import type { FormTemplate } from "@/lib/types"
import { useFormBuilder } from "@/lib/store"

const featuredTemplates: FormTemplate[] = [
  {
    id: "job-application",
    name: "Job Application Form",
    description: "Comprehensive job application with personal info, experience, and file uploads",
    form: {
      title: "Job Application",
      description: "Apply for a position at our company",
      fields: [
        {
          id: "full_name",
          type: "text",
          label: "Full Name",
          placeholder: "Enter your full name",
          required: true,
        },
        {
          id: "email",
          type: "email",
          label: "Email Address",
          placeholder: "your.email@example.com",
          required: true,
        },
        {
          id: "phone",
          type: "phone",
          label: "Phone Number",
          placeholder: "+1 (555) 123-4567",
          required: true,
        },
        {
          id: "position",
          type: "dropdown",
          label: "Position Applied For",
          required: true,
          options: [
            { label: "Frontend Developer", value: "frontend" },
            { label: "Backend Developer", value: "backend" },
            { label: "Full Stack Developer", value: "fullstack" },
            { label: "UI/UX Designer", value: "designer" },
            { label: "Product Manager", value: "pm" },
          ],
        },
        {
          id: "experience",
          type: "radio",
          label: "Years of Experience",
          required: true,
          options: [
            { label: "0-1 years", value: "0-1" },
            { label: "2-3 years", value: "2-3" },
            { label: "4-5 years", value: "4-5" },
            { label: "6+ years", value: "6+" },
          ],
        },
        {
          id: "skills",
          type: "checkbox",
          label: "Technical Skills",
          options: [
            { label: "JavaScript", value: "javascript" },
            { label: "React", value: "react" },
            { label: "Node.js", value: "nodejs" },
            { label: "Python", value: "python" },
            { label: "SQL", value: "sql" },
            { label: "AWS", value: "aws" },
          ],
        },
        {
          id: "cover_letter",
          type: "textarea",
          label: "Cover Letter",
          placeholder: "Tell us why you're interested in this position...",
          required: true,
        },
      ],
      steps: [
        {
          id: "personal",
          title: "Personal Information",
          fields: ["full_name", "email", "phone"],
        },
        {
          id: "professional",
          title: "Professional Details",
          fields: ["position", "experience", "skills"],
        },
        {
          id: "application",
          title: "Application",
          fields: ["cover_letter"],
        },
      ],
      isMultiStep: true,
    },
  },
  {
    id: "event-registration",
    name: "Event Registration",
    description: "Event registration form with attendee details and preferences",
    form: {
      title: "Event Registration",
      description: "Register for our upcoming conference",
      fields: [
        {
          id: "attendee_name",
          type: "text",
          label: "Attendee Name",
          placeholder: "Full name",
          required: true,
        },
        {
          id: "company",
          type: "text",
          label: "Company/Organization",
          placeholder: "Your company name",
        },
        {
          id: "email",
          type: "email",
          label: "Email Address",
          placeholder: "your.email@example.com",
          required: true,
        },
        {
          id: "ticket_type",
          type: "radio",
          label: "Ticket Type",
          required: true,
          options: [
            { label: "Early Bird - $299", value: "early_bird" },
            { label: "Regular - $399", value: "regular" },
            { label: "Student - $99", value: "student" },
            { label: "VIP - $599", value: "vip" },
          ],
        },
        {
          id: "sessions",
          type: "checkbox",
          label: "Sessions of Interest",
          options: [
            { label: "Keynote Presentations", value: "keynote" },
            { label: "Technical Workshops", value: "workshops" },
            { label: "Networking Sessions", value: "networking" },
            { label: "Panel Discussions", value: "panels" },
          ],
        },
        {
          id: "dietary",
          type: "dropdown",
          label: "Dietary Restrictions",
          options: [
            { label: "None", value: "none" },
            { label: "Vegetarian", value: "vegetarian" },
            { label: "Vegan", value: "vegan" },
            { label: "Gluten-free", value: "gluten_free" },
            { label: "Other", value: "other" },
          ],
        },
        {
          id: "special_requests",
          type: "textarea",
          label: "Special Requests",
          placeholder: "Any special accommodations needed?",
        },
      ],
      steps: [],
      isMultiStep: false,
    },
  },
  {
    id: "feedback-survey",
    name: "Product Feedback Survey",
    description: "Detailed product feedback form with ratings and suggestions",
    form: {
      title: "Product Feedback Survey",
      description: "Help us improve our product with your valuable feedback",
      fields: [
        {
          id: "product_used",
          type: "dropdown",
          label: "Which product did you use?",
          required: true,
          options: [
            { label: "Mobile App", value: "mobile_app" },
            { label: "Web Platform", value: "web_platform" },
            { label: "Desktop Software", value: "desktop" },
            { label: "API Service", value: "api" },
          ],
        },
        {
          id: "usage_frequency",
          type: "radio",
          label: "How often do you use our product?",
          required: true,
          options: [
            { label: "Daily", value: "daily" },
            { label: "Weekly", value: "weekly" },
            { label: "Monthly", value: "monthly" },
            { label: "Rarely", value: "rarely" },
          ],
        },
        {
          id: "satisfaction",
          type: "radio",
          label: "Overall Satisfaction",
          required: true,
          options: [
            { label: "Very Satisfied", value: "very_satisfied" },
            { label: "Satisfied", value: "satisfied" },
            { label: "Neutral", value: "neutral" },
            { label: "Dissatisfied", value: "dissatisfied" },
            { label: "Very Dissatisfied", value: "very_dissatisfied" },
          ],
        },
        {
          id: "features_liked",
          type: "checkbox",
          label: "Which features do you like most?",
          options: [
            { label: "User Interface", value: "ui" },
            { label: "Performance", value: "performance" },
            { label: "Reliability", value: "reliability" },
            { label: "Customer Support", value: "support" },
            { label: "Documentation", value: "docs" },
          ],
        },
        {
          id: "improvements",
          type: "textarea",
          label: "What improvements would you suggest?",
          placeholder: "Share your ideas for making our product better...",
        },
        {
          id: "recommend",
          type: "radio",
          label: "Would you recommend us to others?",
          required: true,
          options: [
            { label: "Definitely", value: "definitely" },
            { label: "Probably", value: "probably" },
            { label: "Not sure", value: "not_sure" },
            { label: "Probably not", value: "probably_not" },
            { label: "Definitely not", value: "definitely_not" },
          ],
        },
      ],
      steps: [],
      isMultiStep: false,
    },
  },
]

interface TemplateGalleryProps {
  onSelectTemplate: (template: FormTemplate) => void
}

export function TemplateGallery({ onSelectTemplate }: TemplateGalleryProps) {
  const { getTemplates } = useFormBuilder()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const userTemplates = getTemplates()
  const allTemplates = [...featuredTemplates, ...userTemplates]

  const filteredTemplates = allTemplates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handlePreview = (template: FormTemplate) => {
    setSelectedTemplate(template)
    setPreviewOpen(true)
  }

  const handleUseTemplate = (template: FormTemplate) => {
    onSelectTemplate(template)
    setPreviewOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                </div>
                {featuredTemplates.some((t) => t.id === template.id) && (
                  <Badge variant="secondary" className="ml-2">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Fields:</span>
                  <Badge variant="outline">{template.form.fields.length}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Type:</span>
                  <Badge variant="outline">{template.form.isMultiStep ? "Multi-step" : "Single-step"}</Badge>
                </div>
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handlePreview(template)}>
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <Button size="sm" className="flex-1" onClick={() => handleUseTemplate(template)}>
                    <Download className="w-4 h-4 mr-1" />
                    Use Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Template Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.name}</DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Form Structure</h3>
                <div className="space-y-2">
                  <p>
                    <strong>Title:</strong> {selectedTemplate.form.title}
                  </p>
                  <p>
                    <strong>Description:</strong> {selectedTemplate.form.description}
                  </p>
                  <p>
                    <strong>Fields:</strong> {selectedTemplate.form.fields.length}
                  </p>
                  <p>
                    <strong>Type:</strong> {selectedTemplate.form.isMultiStep ? "Multi-step" : "Single-step"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Fields</h3>
                <div className="grid gap-2">
                  {selectedTemplate.form.fields.map((field, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="font-medium">{field.label}</span>
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {field.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setPreviewOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => handleUseTemplate(selectedTemplate)}>Use This Template</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
