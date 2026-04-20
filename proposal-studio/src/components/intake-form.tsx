'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FileUpload } from '@/components/file-upload'
import { useProject } from '@/context/project-context'
import { INDUSTRIES, type UploadedFile } from '@/types'
import { cn } from '@/lib/utils'

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

interface FormErrors {
  clientName?: string
  projectTitle?: string
  industry?: string
  clientUrl?: string
  files?: string
}

export function IntakeForm() {
  const router = useRouter()
  const { dispatch } = useProject()

  const [clientName, setClientName] = useState('')
  const [projectTitle, setProjectTitle] = useState('')
  const [industry, setIndustry] = useState('')
  const [clientUrl, setClientUrl] = useState('')
  const [clientContact, setClientContact] = useState('')
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)

  const handleFilesChange = useCallback((newFiles: UploadedFile[]) => {
    setFiles(newFiles)
    setErrors((prev) => ({ ...prev, files: undefined }))
  }, [])

  function validate(): FormErrors {
    const errs: FormErrors = {}
    if (!clientName.trim()) errs.clientName = 'Required'
    if (!projectTitle.trim()) errs.projectTitle = 'Required'
    if (!industry) errs.industry = 'Required'
    if (!clientUrl.trim()) {
      errs.clientUrl = 'Required'
    } else {
      try {
        new URL(clientUrl.startsWith('http') ? clientUrl : `https://${clientUrl}`)
      } catch {
        errs.clientUrl = 'Enter a valid URL'
      }
    }
    if (files.length === 0) errs.files = 'Upload at least one document'
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSubmitting(true)

    try {
      const clientSlug = toSlug(clientName)
      const normalizedUrl = clientUrl.startsWith('http')
        ? clientUrl
        : `https://${clientUrl}`

      dispatch({
        type: 'SET_CLIENT_INFO',
        payload: {
          clientName,
          clientSlug,
          projectTitle,
          industry,
          clientUrl: normalizedUrl,
          clientContact: clientContact || undefined,
          dueDate: dueDate ? format(dueDate, 'yyyy-MM-dd') : undefined,
          description: description || undefined,
          uploadedFiles: files,
        },
      })

      router.push('/theme')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="clientName">
          <span>Client name<span className="text-destructive"> *</span></span>
        </Label>
        <Input
          id="clientName"
          placeholder="Stripe, Shopify, etc."
          value={clientName}
          onChange={(e) => {
            setClientName(e.target.value)
            setErrors((prev) => ({ ...prev, clientName: undefined }))
          }}
          aria-invalid={!!errors.clientName}
        />
        {errors.clientName && (
          <p className="text-xs text-destructive">{errors.clientName}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="projectTitle">
          <span>Project title<span className="text-destructive"> *</span></span>
        </Label>
        <Input
          id="projectTitle"
          placeholder="Cloud Migration Advisory"
          value={projectTitle}
          onChange={(e) => {
            setProjectTitle(e.target.value)
            setErrors((prev) => ({ ...prev, projectTitle: undefined }))
          }}
          aria-invalid={!!errors.projectTitle}
        />
        {errors.projectTitle && (
          <p className="text-xs text-destructive">{errors.projectTitle}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="industry">
          <span>Industry<span className="text-destructive"> *</span></span>
        </Label>
        <Select
          value={industry}
          onValueChange={(v) => {
            setIndustry(v)
            setErrors((prev) => ({ ...prev, industry: undefined }))
          }}
        >
          <SelectTrigger id="industry" aria-invalid={!!errors.industry}>
            <SelectValue placeholder="Select industry" />
          </SelectTrigger>
          <SelectContent>
            {INDUSTRIES.map((ind) => (
              <SelectItem key={ind} value={ind}>
                {ind}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.industry && (
          <p className="text-xs text-destructive">{errors.industry}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="clientUrl">
          <span>Client website<span className="text-destructive"> *</span></span>
        </Label>
        <Input
          id="clientUrl"
          type="url"
          placeholder="https://stripe.com"
          value={clientUrl}
          onChange={(e) => {
            setClientUrl(e.target.value)
            setErrors((prev) => ({ ...prev, clientUrl: undefined }))
          }}
          aria-invalid={!!errors.clientUrl}
        />
        {errors.clientUrl && (
          <p className="text-xs text-destructive">{errors.clientUrl}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="clientContact" className="text-muted-foreground">
          Client contact
        </Label>
        <Input
          id="clientContact"
          placeholder="Jane Smith"
          value={clientContact}
          onChange={(e) => setClientContact(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-muted-foreground">
          Due date
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'h-9 w-full justify-start text-left font-normal',
                !dueDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="size-4" data-icon="inline-start" />
              {dueDate ? format(dueDate, 'PPP') : 'Pick a date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={setDueDate}
              initialFocus
              // Disable any day strictly before today. Normalizing to
              // midnight prevents off-by-one issues across timezones.
              disabled={(date) => {
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                return date < today
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description" className="text-muted-foreground">
          Brief description
        </Label>
        <Textarea
          id="description"
          placeholder="Two or three sentences about the engagement"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>
          <span>Documents<span className="text-destructive"> *</span></span>
        </Label>
        <FileUpload files={files} onChange={handleFilesChange} />
        {errors.files && (
          <p className="text-xs text-destructive">{errors.files}</p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        className="mt-2"
        disabled={submitting}
      >
        {submitting && (
          <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
        )}
        Continue
      </Button>
    </form>
  )
}
