"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Save, Share2, Undo, Redo, Moon, Sun, FileText } from "lucide-react"
import { useFormBuilder } from "@/lib/store"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AutoSaveIndicator } from "./auto-save-indicator"

export function Toolbar() {
  const { currentForm, theme, setTheme, undo, redo, canUndo, canRedo, saveForm, saveTemplate } = useFormBuilder()

  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false)
  const [templateName, setTemplateName] = useState("")
  const [templateDescription, setTemplateDescription] = useState("")
  const [shareUrl, setShareUrl] = useState("")

  const handleSave = () => {
    if (currentForm) {
      const formId = saveForm()
      console.log("Form saved with ID:", formId)
    }
  }

  const handleShare = () => {
    if (currentForm) {
      const formId = saveForm()
      const url = `${window.location.origin}/form/${formId}`
      setShareUrl(url)
      setShareDialogOpen(true)
    }
  }

  const handleSaveTemplate = () => {
    if (currentForm && templateName.trim()) {
      saveTemplate(templateName.trim(), templateDescription.trim())
      setTemplateDialogOpen(false)
      setTemplateName("")
      setTemplateDescription("")
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert("Link copied to clipboard!")
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">Form Builder</h1>
          {currentForm && (
            <>
              <Badge variant="outline" className="text-xs">
                {currentForm.fields.length} fields
              </Badge>
              <AutoSaveIndicator />
            </>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={undo} disabled={!canUndo()}>
            <Undo className="w-4 h-4" />
          </Button>

          <Button variant="outline" size="sm" onClick={redo} disabled={!canRedo()}>
            <Redo className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-border" />

          <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={!currentForm}>
                <FileText className="w-4 h-4 mr-2" />
                Save Template
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save as Template</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Contact Form"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-description">Description</Label>
                  <Textarea
                    id="template-description"
                    value={templateDescription}
                    onChange={(e) => setTemplateDescription(e.target.value)}
                    placeholder="A simple contact form template"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setTemplateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveTemplate} disabled={!templateName.trim()}>
                    Save Template
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="sm" onClick={handleSave} disabled={!currentForm}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>

          <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" onClick={handleShare} disabled={!currentForm}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Form</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Shareable Link</Label>
                  <div className="flex space-x-2">
                    <Input value={shareUrl} readOnly />
                    <Button onClick={() => copyToClipboard(shareUrl)}>Copy</Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Anyone with this link can fill out your form. The form will be saved and accessible via this URL.
                </p>
              </div>
            </DialogContent>
          </Dialog>

          <div className="w-px h-6 bg-border" />

          <Button variant="outline" size="sm" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
