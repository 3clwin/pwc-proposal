'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'
import { IntakeFields, type ClientMode } from '@/components/intake-fields'
import { FileUpload } from '@/components/file-upload'
import { TemplatePicker } from '@/components/template-picker'
import { useProject } from '@/context/project-context'
import { useSavedClients } from '@/hooks/use-saved-clients'
import { Progress } from '@/components/ui/progress'
import type { UploadedFile } from '@/types'

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

interface ClientFields {
  clientName: string
  projectTitle: string
  industry: string
  sector: string
  clientUrl: string
  clientContact: string
  dueDate: Date | undefined
  description: string
}

const EMPTY_FIELDS: ClientFields = {
  clientName: '',
  projectTitle: '',
  industry: '',
  sector: '',
  clientUrl: '',
  clientContact: '',
  dueDate: undefined,
  description: '',
}

const STEP_VARIANTS = {
  enter: { x: 24, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -24, opacity: 0 },
}

const HEADLINES = [
  'Tell us about your client',
  'Upload your documents',
  'Choose a starting point',
]

const SUBHEADLINES = [
  'We use this to tailor the proposal voice, branding, and positioning to the buyer.',
  'Drop in the RFP, past proposals, or any reference material. We\'ll extract the requirements so your draft is grounded in the client\'s actual language.',
  'Each template is a complete design system tuned for a different kind of decision-maker. Pick the direction that fits this client.',
]

// Short labels rendered inside the stepper strip below the top nav.
// Kept terse (one word each) so the strip stays compact on narrow widths.
const STEPS = ['Client', 'Documents', 'Template'] as const

export function OnboardingWizard() {
  const router = useRouter()
  const { dispatch } = useProject()
  const { clients: savedClients, saveClient } = useSavedClients()

  const [step, setStep] = useState(0)
  const [fields, setFields] = useState<ClientFields>(EMPTY_FIELDS)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [clientMode, setClientMode] = useState<ClientMode>('new')
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)

  const handleFilesChange = useCallback((newFiles: UploadedFile[]) => {
    setFiles(newFiles)
  }, [])

  function handleModeChange(mode: ClientMode) {
    setClientMode(mode)
    if (mode === 'new') {
      setSelectedClientId(null)
      setFields(EMPTY_FIELDS)
    }
  }

  function handleSelectClient(id: string) {
    const client = savedClients.find((c) => c.id === id)
    if (!client) return
    setSelectedClientId(id)
    setFields((prev) => ({
      ...prev,
      clientName: client.clientName,
      industry: client.industry,
      sector: client.sector ?? '',
      clientUrl: client.clientUrl.replace(/^https?:\/\/(www\.)?/, ''),
      clientContact: client.clientContact ?? '',
    }))
  }

  function validateStep1(): boolean {
    if (clientMode === 'existing' && !selectedClientId) {
      toast.error('Select a client')
      return false
    }
    if (
      !fields.clientName.trim() ||
      !fields.projectTitle.trim() ||
      !fields.industry ||
      !fields.sector ||
      !fields.clientUrl.trim() ||
      !fields.dueDate
    ) {
      toast.error('Fill in all required fields')
      return false
    }
    if (!fields.clientUrl.includes('.')) {
      toast.error('Enter a valid domain')
      return false
    }
    return true
  }

  function handleContinue() {
    if (step === 0 && !validateStep1()) return
    if (step === 2) {
      handleSubmit()
      return
    }
    setStep((s) => s + 1)
  }

  function handleBack() {
    if (step > 0) setStep((s) => s - 1)
  }

  async function handleSubmit() {
    setSubmitting(true)
    try {
      const normalizedUrl = `https://www.${fields.clientUrl.replace(/^(https?:\/\/)?(www\.)?/, '')}`

      let parsedFiles = files
      if (files.length > 0) {
        try {
          const formData = new FormData()
          for (const f of files) {
            formData.append('files', f.file)
          }
          const res = await fetch('/api/parse-documents', {
            method: 'POST',
            body: formData,
          })
          if (res.ok) {
            const data = await res.json() as {
              files: Array<{ name: string; type: string; text: string }>
            }
            parsedFiles = files.map((f) => {
              const parsed = data.files.find((p) => p.name === f.name)
              return parsed ? { ...f, extractedText: parsed.text } : f
            })
            toast.success(`Parsed ${data.files.length} document${data.files.length > 1 ? 's' : ''}`)
          }
        } catch {
          toast.warning('Document parsing failed — you can still proceed without extracted text.')
        }
      }

      const clientSlug = toSlug(fields.clientName)

      dispatch({
        type: 'SET_CLIENT_INFO',
        payload: {
          clientName: fields.clientName,
          clientSlug,
          projectTitle: fields.projectTitle,
          industry: fields.industry,
          sector: fields.sector || undefined,
          clientUrl: normalizedUrl,
          clientContact: fields.clientContact || undefined,
          dueDate: fields.dueDate?.toISOString() ?? undefined,
          description: fields.description || undefined,
          uploadedFiles: parsedFiles,
        },
      })

      saveClient({
        clientName: fields.clientName,
        clientSlug,
        industry: fields.industry,
        sector: fields.sector || undefined,
        clientUrl: normalizedUrl,
        clientContact: fields.clientContact || undefined,
      })

      router.push('/theme')
    } catch {
      toast.error('Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  const step0Valid =
    clientMode === 'existing'
      ? !!(selectedClientId && fields.projectTitle && fields.dueDate)
      : !!(
          fields.clientName &&
          fields.projectTitle &&
          fields.industry &&
          fields.sector &&
          fields.clientUrl &&
          fields.dueDate
        )

  const canContinue =
    step === 0 ? step0Valid
    : step === 1 ? true
    : !!selectedTemplate

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top nav — mirrors `GlobalNav` exactly (border, background,
          padding, logo+label spacing). Intake can't use the shared
          GlobalNav directly because AppShell excludes this route, but
          rendering the same shape here prevents the visual "shift" the
          user sees when moving from /intake to /theme or /editor. */}
      <nav className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-8 w-auto text-foreground" />
            <span className="text-sm font-medium tracking-tight text-foreground">
              Proposal Studio
            </span>
          </Link>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">Exit</Link>
          </Button>
        </div>
      </nav>

      {/* Content — single scrolling column. Layout mirrors
          `src/app/theme/page.tsx`: progress bar + headline + sub at
          the top of a centered max-w column, step body (form / upload
          / picker) flows beneath. The per-step content keeps its
          existing STEP_VARIANTS slide; the headline gets a short
          crossfade keyed to `step` so the title change doesn't pop. */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="mx-auto w-full max-w-[720px] px-6 pt-10 pb-16 sm:px-8 lg:pt-14">
          {/* Thin progress bar above the headline. Fills
              proportionally to the current step (1/3, 2/3, 3/3) so the
              user can gauge how far they've come at a glance. Caption
              gives an explicit "Step X of N" for screen readers and
              keyboard users. */}
          <div className="mb-8 flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              <span>
                Step <span className="tabular-nums text-foreground">{step + 1}</span>
                {' '}of{' '}
                <span className="tabular-nums">{STEPS.length}</span>
              </span>
              <span className="text-foreground">{STEPS[step]}</span>
            </div>
            <Progress
              value={((step + 1) / STEPS.length) * 100}
              aria-label={`Intake progress — step ${step + 1} of ${STEPS.length}`}
              className="h-1"
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`headline-${step}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mb-10"
            >
              <h1 className="mb-3 text-3xl font-medium leading-tight text-foreground">
                {HEADLINES[step]}
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground">
                {SUBHEADLINES[step]}
              </p>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={`step-${step}`}
              variants={STEP_VARIANTS}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {step === 0 && (
                <IntakeFields
                  fields={fields}
                  onChange={setFields}
                  mode={clientMode}
                  onModeChange={handleModeChange}
                  savedClients={savedClients}
                  selectedClientId={selectedClientId}
                  onSelectClient={handleSelectClient}
                />
              )}
              {step === 1 && (
                <div className="flex flex-col gap-4">
                  <FileUpload files={files} onChange={handleFilesChange} />
                  <p className="text-xs text-muted-foreground">
                    Optional. You can add documents later.
                  </p>
                </div>
              )}
              {step === 2 && (
                <TemplatePicker
                  selectedId={selectedTemplate}
                  onSelect={setSelectedTemplate}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom bar — full width, below both columns */}
      <div className="shrink-0 border-t border-border bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="ghost" size="sm" onClick={handleBack}>
                Back
              </Button>
            )}
            {step === 1 && (
              <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
                Skip
              </Button>
            )}
          </div>
          <Button
            onClick={handleContinue}
            disabled={!canContinue || submitting}
          >
            {submitting && <Loader2 className="size-4 animate-spin" data-icon="inline-start" />}
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
