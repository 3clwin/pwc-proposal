'use client'

import { useState, useRef, useEffect } from 'react'
import { Plus, ArrowUp, Mic, Loader2, Globe } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { LLMSelector } from './llm-selector'
import { ChatMessage } from './chat-message'
import { EditorTooltip } from './editor-tooltip'
import { useProject } from '@/context/project-context'
import { useLLM } from '@/context/llm-context'
import type { SiteContent } from '@/types'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  model?: string
}

export function AIChat() {
  const { project, dispatch } = useProject()
  const { activeProvider, activeModel, activeApiKey } = useLLM()
  const sectionCount = project.siteContent?.sections.length ?? 0
  const estimatedLines = sectionCount * 45

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Ready to refine your proposal. Try "Make the hero bolder" or "Add a case study."',
    },
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (textareaRef.current) {
      if (!input.trim()) {
        textareaRef.current.style.height = '28px'
        return
      }
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 96)}px`
    }
  }, [input])

  async function handleSend() {
    const text = input.trim()
    if (!text || sending) return

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setSending(true)

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-llm-provider': activeProvider,
        'x-llm-model': activeModel,
      }
      if (activeApiKey) {
        headers['x-llm-api-key'] = activeApiKey
      }

      const res = await fetch('/api/edit-section', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          siteContent: project.siteContent,
          userRequest: text,
        }),
      })

      const data = await res.json() as {
        sections?: SiteContent['sections']
        summary?: string
        error?: string
      }

      if (!res.ok) {
        throw new Error(data.error ?? 'Edit failed')
      }

      if (data.sections && project.siteContent) {
        dispatch({
          type: 'SET_SITE_CONTENT',
          payload: { ...project.siteContent, sections: data.sections },
        })
      }

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.summary ?? 'Changes applied.',
        model: activeModel,
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      toast.error(msg)
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: `Error: ${msg}` },
      ])
    } finally {
      setSending(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const hasInput = input.trim().length > 0
  const rfpName = project.projectTitle || 'Untitled Proposal'

  return (
    <div className="flex h-full flex-col">
      {/* Header — RFP name */}
      <div className="flex h-10 shrink-0 items-center gap-1.5 px-4">
        <span className="cursor-default truncate text-xs text-muted-foreground transition-colors hover:text-foreground">
          {rfpName}
        </span>
        <Globe className="size-3 shrink-0 text-muted-foreground/50" />
      </div>

      {/* Messages */}
      <ScrollArea className="min-h-0 flex-1" ref={scrollRef}>
        <div className="flex flex-col gap-1 px-4 py-3">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              role={msg.role}
              content={msg.content}
              model={msg.model}
              additions={msg.role === 'assistant' ? (msg.id === 'welcome' ? estimatedLines : 12) : 0}
              deletions={msg.role === 'assistant' ? (msg.id === 'welcome' ? 0 : 3) : 0}
            />
          ))}
          {sending && (
            <div className="flex items-center gap-2 py-3">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Thinking...</span>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Composer */}
      <div className="shrink-0 px-3 pb-3 pt-2">
        <div className="overflow-hidden rounded-[20px] border border-border bg-card shadow-sm">
          <div className="px-3 pt-3 pb-1">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Send follow-up"
              rows={1}
              className="max-h-24 min-h-7 w-full resize-none bg-transparent text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex h-9 items-center gap-1 px-2 pb-1.5">
            <div className="flex min-w-0 flex-1 items-center gap-0.5">
              <EditorTooltip label="Add attachment or context" side="top">
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Add attachment or context"
                  className="shrink-0 rounded-full text-muted-foreground hover:text-foreground"
                >
                  <Plus className="size-4" />
                </Button>
              </EditorTooltip>
              <LLMSelector />
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <EditorTooltip label="Voice input" side="top">
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Voice input"
                  className="rounded-full text-muted-foreground hover:text-foreground"
                >
                  <Mic className="size-4" />
                </Button>
              </EditorTooltip>
              <EditorTooltip
                label={hasInput ? 'Send message' : 'Type a message to send'}
                side="top"
                disabledTrigger={sending || !hasInput}
              >
                <Button
                  size="icon-xs"
                  onClick={handleSend}
                  disabled={sending || !hasInput}
                  aria-label="Send message"
                  className="rounded-full"
                >
                  <ArrowUp className="size-3.5" />
                </Button>
              </EditorTooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
