"use client"

import { Label } from "@/components/ui/label"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Download, Calendar, User } from "lucide-react"
import type { Form, FormResponse } from "@/lib/types"
import { useFormBuilder } from "@/lib/store"
import Link from "next/link"
import { FormAnalytics } from "@/components/form-builder/form-analytics"

export default function FormResponses() {
  const params = useParams()
  const formId = params.id as string
  const { loadFormById, getResponses } = useFormBuilder()

  const [form, setForm] = useState<Form | null>(null)
  const [responses, setResponses] = useState<FormResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"responses" | "analytics">("responses")

  useEffect(() => {
    if (formId) {
      const loadedForm = loadFormById(formId)
      const formResponses = getResponses(formId)
      setForm(loadedForm)
      setResponses(formResponses)
      setIsLoading(false)
    }
  }, [formId, loadFormById, getResponses])

  const exportToCSV = () => {
    if (!form || responses.length === 0) return

    const headers = form.fields.map((field) => field.label)
    const csvContent = [
      ["Submission Date", ...headers].join(","),
      ...responses.map((response) =>
        [
          new Date(response.submittedAt).toLocaleString(),
          ...form.fields.map((field) => {
            const value = response.data[field.id]
            if (Array.isArray(value)) {
              return `"${value.join(", ")}"`
            }
            return `"${value || ""}"`
          }),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${form.title.replace(/\s+/g, "_")}_responses.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading responses...</p>
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
            <Link href="/">
              <Button className="mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Forms
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Form Builder
            </Button>
          </Link>
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <Button
                variant={activeTab === "responses" ? "default" : "outline"}
                onClick={() => setActiveTab("responses")}
              >
                Responses ({responses.length})
              </Button>
              <Button
                variant={activeTab === "analytics" ? "default" : "outline"}
                onClick={() => setActiveTab("analytics")}
              >
                Analytics
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{form.title}</h1>
              <p className="text-muted-foreground mt-1">Form Responses</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-sm">
                {responses.length} {responses.length === 1 ? "Response" : "Responses"}
              </Badge>
              {responses.length > 0 && (
                <Button onClick={exportToCSV}>
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              )}
            </div>
          </div>
        </div>

        {activeTab === "responses" ? (
          responses.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No Responses Yet</h2>
                <p className="text-muted-foreground mb-4">Share your form to start collecting responses.</p>
                <Link href={`/form/${form.id}`}>
                  <Button>View Form</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {responses.map((response, index) => (
                <Card key={response.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Response #{responses.length - index}</CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(response.submittedAt).toLocaleString()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {form.fields.map((field) => {
                        const value = response.data[field.id]

                        if (!value && value !== 0) return null

                        return (
                          <div key={field.id}>
                            <Label className="font-medium text-sm text-muted-foreground">{field.label}</Label>
                            <div className="mt-1">
                              {Array.isArray(value) ? (
                                <div className="flex flex-wrap gap-1">
                                  {value.map((item, idx) => (
                                    <Badge key={idx} variant="secondary">
                                      {item}
                                    </Badge>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm">{value}</p>
                              )}
                            </div>
                            {index < form.fields.length - 1 && <Separator className="mt-3" />}
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        ) : (
          <FormAnalytics form={form} responses={responses} />
        )}
      </div>
    </div>
  )
}
