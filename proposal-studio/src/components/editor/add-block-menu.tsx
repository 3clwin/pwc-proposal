'use client'

import * as React from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useProject } from '@/context/project-context'
import { makeId } from '@/lib/blocks'
import {
  ADDABLE_BLOCK_TYPES,
  createBlock,
  type ExecSummaryBlock,
} from '@/templates/catalyze-journey/sections/executive-summary.schema'
import { AssetUploadDialog } from './asset-upload-dialog'

interface AddBlockMenuProps {
  sectionId: string
  atIndex: number
  trigger: React.ReactNode
  align?: 'start' | 'center' | 'end'
}

/**
 * Popover that lists every insertable block type. When the user picks
 * one, we dispatch an `INSERT_BLOCK` action; for image blocks we open
 * the asset upload dialog first so the new block can land with its
 * `src` already set.
 */
export function AddBlockMenu({
  sectionId,
  atIndex,
  trigger,
  align = 'start',
}: AddBlockMenuProps) {
  const { dispatch } = useProject()
  const [open, setOpen] = React.useState(false)
  const [assetOpen, setAssetOpen] = React.useState(false)

  const insert = (block: ExecSummaryBlock) => {
    dispatch({
      type: 'INSERT_BLOCK',
      payload: { sectionId, index: atIndex, block },
    })
    setOpen(false)
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent
          align={align}
          sideOffset={6}
          className="w-[280px] gap-1 rounded-xl p-1.5"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Add block
          </p>
          <div className="flex flex-col">
            {ADDABLE_BLOCK_TYPES.map((t) => (
              <button
                key={t.type}
                type="button"
                onClick={() => {
                  if (t.type === 'image') {
                    setOpen(false)
                    setAssetOpen(true)
                    return
                  }
                  insert(createBlock(t.type, makeId('blk')))
                }}
                className="flex flex-col gap-0.5 rounded-md px-2 py-1.5 text-left hover:bg-muted"
              >
                <span className="text-sm font-medium text-foreground">{t.label}</span>
                <span className="text-[11px] text-muted-foreground">{t.description}</span>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <AssetUploadDialog
        open={assetOpen}
        onOpenChange={setAssetOpen}
        onUploaded={(src, alt) => {
          insert({
            id: makeId('blk'),
            type: 'image',
            src,
            alt,
            aspect: '16/9',
          })
        }}
      />
    </>
  )
}
