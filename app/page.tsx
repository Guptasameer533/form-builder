"use client"

import { useEffect } from "react"
import { EnhancedToolbar } from "@/components/form-builder/enhanced-toolbar"
import { EnhancedFieldPalette } from "@/components/form-builder/enhanced-field-palette"
import { EnhancedFormCanvas } from "@/components/form-builder/enhanced-form-canvas"
import { EnhancedFieldEditor } from "@/components/form-builder/enhanced-field-editor"
import { FormPreview } from "@/components/form-builder/form-preview"
import { AnimatedButton } from "@/components/ui/animated-button"
import { GlassCard } from "@/components/ui/glass-card"
import { Plus, FileText, Eye, Sparkles, Zap, Layers } from "lucide-react"
import { useFormBuilder } from "@/lib/store"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TemplateGallery } from "@/components/form-builder/template-gallery"
import { KeyboardShortcuts } from "@/components/form-builder/keyboard-shortcuts"
import { motion } from "framer-motion"

export default function FormBuilder() {
  const { currentForm, createForm, loadTemplate, theme, setTheme } = useFormBuilder()
  const [view, setView] = useState<"builder" | "preview">("builder")
  const [newFormDialogOpen, setNewFormDialogOpen] = useState(false)
  const [formTitle, setFormTitle] = useState("")

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("form-builder-theme") as "light" | "dark" | null
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [setTheme])

  const handleCreateForm = () => {
    if (formTitle.trim()) {
      createForm(formTitle.trim())
      setNewFormDialogOpen(false)
      setFormTitle("")
    }
  }

  const handleLoadTemplate = (template: any) => {
    loadTemplate(template)
  }

  if (!currentForm) {
    return (
      <div className={theme === "dark" ? "dark" : ""}>
        <KeyboardShortcuts />
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background text-foreground">
          <EnhancedToolbar />
          <div className="flex items-center justify-center min-h-[calc(100vh-73px)] p-6">
            <div className="max-w-6xl mx-auto space-y-12">
              <motion.div
                className="text-center space-y-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-3xl flex items-center justify-center shadow-2xl">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
                  FormCraft
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Build forms that actually work. No coding required, no headaches included. Just drag, drop, and you're
                  done.
                </p>
              </motion.div>

              <motion.div
                className="grid md:grid-cols-2 gap-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <GlassCard className="bg-background/40 border-border/30 hover:bg-background/60 transition-all duration-300 group">
                  <div className="p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Plus className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-semibold">Start Fresh</h2>
                    </div>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Got a specific idea? Start with a blank canvas and build exactly what you need. It's easier than
                      you think.
                    </p>
                    <Dialog open={newFormDialogOpen} onOpenChange={setNewFormDialogOpen}>
                      <DialogTrigger asChild>
                        <AnimatedButton variant="gradient" size="lg" className="w-full">
                          <Plus className="w-5 h-5 mr-2" />
                          Create New Form
                        </AnimatedButton>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="flex items-center space-x-2">
                            <Sparkles className="w-5 h-5" />
                            <span>What should we call your form?</span>
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="form-title">Form Name</Label>
                            <Input
                              id="form-title"
                              value={formTitle}
                              onChange={(e) => setFormTitle(e.target.value)}
                              placeholder="Contact Form"
                              onKeyDown={(e) => e.key === "Enter" && handleCreateForm()}
                              className="focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <AnimatedButton variant="outline" onClick={() => setNewFormDialogOpen(false)}>
                              Cancel
                            </AnimatedButton>
                            <AnimatedButton variant="gradient" onClick={handleCreateForm} disabled={!formTitle.trim()}>
                              Let's Build It
                            </AnimatedButton>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </GlassCard>

                <GlassCard className="bg-background/40 border-border/30 hover:bg-background/60 transition-all duration-300 group">
                  <div className="p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-semibold">Use a Template</h2>
                    </div>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Why reinvent the wheel? Pick from our ready-made templates and customize them to match your style.
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <AnimatedButton variant="glow" size="lg" className="w-full">
                          <FileText className="w-5 h-5 mr-2" />
                          Browse Templates
                        </AnimatedButton>
                      </DialogTrigger>
                      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center space-x-2">
                            <Layers className="w-5 h-5" />
                            <span>Choose Your Starting Point</span>
                          </DialogTitle>
                        </DialogHeader>
                        <TemplateGallery onSelectTemplate={loadTemplate} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div
                className="text-center space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex justify-center space-x-8 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4" />
                    <span>Drag & Drop</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Layers className="w-4 h-4" />
                    <span>Multi-Step Forms</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>Live Preview</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <KeyboardShortcuts />
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background text-foreground">
        <EnhancedToolbar />

        <div className="flex h-[calc(100vh-73px)]">
          {view === "builder" ? (
            <>
              <EnhancedFieldPalette />
              <EnhancedFormCanvas />
              <EnhancedFieldEditor />
            </>
          ) : (
            <FormPreview />
          )}
        </div>

        {/* Enhanced View Toggle */}
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard className="bg-background/80 border-border/30 p-1">
            <div className="flex items-center space-x-1">
              <AnimatedButton
                variant={view === "builder" ? "default" : "ghost"}
                size="sm"
                onClick={() => setView("builder")}
                className="relative"
              >
                <FileText className="w-4 h-4 mr-2" />
                Builder
                {view === "builder" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/20 rounded-md"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </AnimatedButton>
              <AnimatedButton
                variant={view === "preview" ? "default" : "ghost"}
                size="sm"
                onClick={() => setView("preview")}
                className="relative"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
                {view === "preview" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/20 rounded-md"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </AnimatedButton>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}
