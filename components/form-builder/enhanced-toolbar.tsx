"use client"

import { Button } from "@/components/ui/button"
import { AnimatedButton } from "@/components/ui/animated-button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { GlassCard } from "@/components/ui/glass-card"
import { Save, Share2, Undo, Redo, Moon, Sun, FileText, Sparkles, MoreHorizontal } from "lucide-react"
import { useFormBuilder } from "@/lib/store"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AutoSaveIndicator } from "./auto-save-indicator"
import { motion } from "framer-motion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function EnhancedToolbar() {
  const { currentForm, theme, setTheme, undo, redo, canUndo, canRedo, saveForm, saveTemplate } = useFormBuilder()

  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false)
  const [templateName, setTemplateName] = useState("")
  const [templateDescription, setTemplateDescription] = useState("")
  const [shareUrl, setShareUrl] = useState("")

  const handleLogoClick = () => {
    // Reset to home page by clearing current form
    window.location.reload()
  }

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
    <GlassCard className="border-b rounded-none bg-background/80 backdrop-blur-xl border-border/50">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        <motion.div
          className="flex items-center space-x-3 sm:space-x-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleLogoClick}
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              FormCraft
            </h1>
          </div>

          {currentForm && (
            <motion.div
              className="hidden sm:flex items-center space-x-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge variant="outline" className="text-xs bg-primary/10 border-primary/20">
                {currentForm.fields.length} fields
              </Badge>
              <AutoSaveIndicator />
            </motion.div>
          )}
        </motion.div>

        <motion.div
          className="flex items-center space-x-1 sm:space-x-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {currentForm && (
            <>
              {/* Desktop Actions */}
              <div className="hidden lg:flex items-center space-x-2">
                <div className="flex items-center space-x-1 bg-muted/50 rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={undo}
                    disabled={!canUndo()}
                    className="hover:bg-background/80"
                  >
                    <Undo className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={redo}
                    disabled={!canRedo()}
                    className="hover:bg-background/80"
                  >
                    <Redo className="w-4 h-4" />
                  </Button>
                </div>

                <div className="w-px h-6 bg-border/50" />

                <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
                  <DialogTrigger asChild>
                    <AnimatedButton variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      Save Template
                    </AnimatedButton>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <FileText className="w-5 h-5" />
                        <span>Save as Template</span>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="template-name">Template Name</Label>
                        <Input
                          id="template-name"
                          value={templateName}
                          onChange={(e) => setTemplateName(e.target.value)}
                          placeholder="Contact Form"
                          className="focus:ring-2 focus:ring-primary/20"
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
                          className="focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setTemplateDialogOpen(false)}>
                          Cancel
                        </Button>
                        <AnimatedButton variant="gradient" onClick={handleSaveTemplate} disabled={!templateName.trim()}>
                          Save Template
                        </AnimatedButton>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <AnimatedButton variant="outline" size="sm" onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </AnimatedButton>

                <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                  <DialogTrigger asChild>
                    <AnimatedButton variant="glow" size="sm" onClick={handleShare}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </AnimatedButton>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <Share2 className="w-5 h-5" />
                        <span>Share Form</span>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Shareable Link</Label>
                        <div className="flex space-x-2">
                          <Input value={shareUrl} readOnly className="bg-muted/50" />
                          <AnimatedButton variant="gradient" onClick={() => copyToClipboard(shareUrl)}>
                            Copy
                          </AnimatedButton>
                        </div>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Anyone with this link can fill out your form. The form will be saved and accessible via this
                          URL.
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="w-px h-6 bg-border/50" />
              </div>

              {/* Mobile Actions */}
              <div className="lg:hidden flex items-center space-x-1">
                <AnimatedButton variant="outline" size="sm" onClick={handleSave}>
                  <Save className="w-4 h-4" />
                </AnimatedButton>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={handleShare}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Form
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTemplateDialogOpen(true)}>
                      <FileText className="w-4 h-4 mr-2" />
                      Save Template
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={undo} disabled={!canUndo()}>
                      <Undo className="w-4 h-4 mr-2" />
                      Undo
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={redo} disabled={!canRedo()}>
                      <Redo className="w-4 h-4 mr-2" />
                      Redo
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile Dialogs */}
                <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
                  <DialogContent className="sm:max-w-md mx-4">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <FileText className="w-5 h-5" />
                        <span>Save as Template</span>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="template-name">Template Name</Label>
                        <Input
                          id="template-name"
                          value={templateName}
                          onChange={(e) => setTemplateName(e.target.value)}
                          placeholder="Contact Form"
                          className="focus:ring-2 focus:ring-primary/20"
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
                          className="focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setTemplateDialogOpen(false)}>
                          Cancel
                        </Button>
                        <AnimatedButton variant="gradient" onClick={handleSaveTemplate} disabled={!templateName.trim()}>
                          Save Template
                        </AnimatedButton>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                  <DialogContent className="sm:max-w-md mx-4">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <Share2 className="w-5 h-5" />
                        <span>Share Form</span>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Shareable Link</Label>
                        <div className="flex space-x-2">
                          <Input value={shareUrl} readOnly className="bg-muted/50" />
                          <AnimatedButton variant="gradient" onClick={() => copyToClipboard(shareUrl)}>
                            Copy
                          </AnimatedButton>
                        </div>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Anyone with this link can fill out your form. The form will be saved and accessible via this
                          URL.
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="w-px h-6 bg-border/50" />
              </div>
            </>
          )}

          <AnimatedButton
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="relative"
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4 transition-transform duration-300" />
            ) : (
              <Sun className="w-4 h-4 transition-transform duration-300 rotate-180" />
            )}
          </AnimatedButton>
        </motion.div>
      </div>
    </GlassCard>
  )
}
