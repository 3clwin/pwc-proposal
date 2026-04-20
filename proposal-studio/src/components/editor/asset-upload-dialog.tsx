'use client'

import * as React from 'react'
import { ImagePlus, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface AssetUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Called with a data-URL and the final alt text when upload is confirmed. */
  onUploaded: (src: string, alt: string) => void
  /** Pre-fill alt text when replacing an existing image. */
  initialAlt?: string
}

/**
 * File-picker dialog for adding or replacing images. Stores the
 * selected file as a data URL in project state (good enough for v1 —
 * production will swap to Vercel Blob or S3). Enforces a 4MB soft
 * cap to keep the serialized `siteContent` localStorage payload
 * manageable.
 */
export function AssetUploadDialog({
  open,
  onOpenChange,
  onUploaded,
  initialAlt = '',
}: AssetUploadDialogProps) {
  const [file, setFile] = React.useState<File | null>(null)
  const [preview, setPreview] = React.useState<string | null>(null)
  const [alt, setAlt] = React.useState(initialAlt)
  const [dragging, setDragging] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (open) {
      setFile(null)
      setPreview(null)
      setAlt(initialAlt)
      setError(null)
    }
  }, [open, initialAlt])

  const acceptFile = (f: File) => {
    setError(null)
    if (!f.type.startsWith('image/')) {
      setError('File must be an image.')
      return
    }
    if (f.size > 4 * 1024 * 1024) {
      setError('Max file size is 4MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const src = String(reader.result)
      setFile(f)
      setPreview(src)
    }
    reader.onerror = () => setError('Failed to read file.')
    reader.readAsDataURL(f)
  }

  const onPick = () => inputRef.current?.click()

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files?.[0]
    if (f) acceptFile(f)
  }

  const confirm = () => {
    if (!preview) return
    onUploaded(preview, alt || file?.name || 'Image')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload image</DialogTitle>
          <DialogDescription>
            PNG, JPG, GIF, or WebP. Max 4MB.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={onPick}
            role="button"
            tabIndex={0}
            className={cn(
              'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 px-4 py-8 transition hover:border-foreground/30',
              dragging && 'border-[#C52B09] bg-[#C52B09]/5',
            )}
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt=""
                className="max-h-48 w-full rounded object-contain"
              />
            ) : (
              <>
                <ImagePlus className="size-6 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">
                  Drop image here or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  {file ? file.name : 'No file selected'}
                </p>
              </>
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) acceptFile(f)
            }}
          />

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="alt-text">Alt text</Label>
            <Input
              id="alt-text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Describe the image for screen readers"
            />
          </div>

          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={confirm} disabled={!preview}>
            <Upload className="size-4" />
            Use image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
