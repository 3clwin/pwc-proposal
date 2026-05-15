'use client'

import { Copy, ExternalLink, Check } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { EditorTooltip } from './editor-tooltip'

interface DeploySuccessModalProps {
  open: boolean
  onClose: () => void
  url: string
}

export function DeploySuccessModal({ open, onClose, url }: DeploySuccessModalProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-green-100">
              <Check className="size-5 text-green-600" />
            </div>
            Deployed Successfully!
          </DialogTitle>
          <DialogDescription>
            Your proposal site is live and ready to share.
          </DialogDescription>
        </DialogHeader>

        <div
          className="flex items-center gap-2 rounded-lg border px-3 py-2"
          style={{ borderColor: '#E5E5E3', backgroundColor: '#F9FAFB' }}
        >
          <span className="flex-1 truncate font-mono text-sm" style={{ color: '#2563EB' }}>
            {url}
          </span>
          <EditorTooltip label={copied ? 'Copied' : 'Copy link'}>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={handleCopy}
              aria-label={copied ? 'Copied' : 'Copy link'}
            >
              {copied ? (
                <Check className="size-3.5 text-green-600" />
              ) : (
                <Copy className="size-3.5" style={{ color: '#6B6B6B' }} />
              )}
            </Button>
          </EditorTooltip>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={handleCopy}>
            <Copy className="size-4" data-icon="inline-start" />
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
          <Button className="flex-1" asChild>
            <a href={url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-4" data-icon="inline-start" />
              Open in New Tab
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
