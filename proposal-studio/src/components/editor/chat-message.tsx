import React from 'react'
import { Undo2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  model?: string
  additions?: number
  deletions?: number
}

export const ChatMessage = React.memo(function ChatMessage({
  role,
  content,
  model,
  additions = 0,
  deletions = 0,
}: ChatMessageProps) {
  const isUser = role === 'user'

  if (isUser) {
    return (
      <div className="rounded-xl bg-muted px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {content}
          </p>
          <Button variant="ghost" size="icon-xs" className="shrink-0 text-muted-foreground hover:text-foreground">
            <Undo2 className="size-3.5" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="py-3">
      <div className="mb-2 flex items-center gap-2 font-mono text-xs">
        <span className="text-red-500">-{deletions}</span>
        <span className="text-green-600">+{additions}</span>
      </div>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
        {content}
      </p>
      {model && (
        <p className="mt-2 text-[11px] text-muted-foreground">{model}</p>
      )}
    </div>
  )
})
