import { NextResponse } from 'next/server'

interface ParsedDocument {
  name: string
  type: string
  text: string
}

async function parsePDF(buffer: ArrayBuffer): Promise<string> {
  const mod = await import('pdf-parse')
  // pdf-parse v2 exports differ from @types/pdf-parse — coerce to callable
  const parse = (typeof mod === 'function' ? mod : (mod as Record<string, unknown>).default) as
    (buf: Buffer) => Promise<{ text: string }>
  const result = await parse(Buffer.from(buffer))
  return result.text
}

async function parseDOCX(buffer: ArrayBuffer): Promise<string> {
  const mammoth = await import('mammoth')
  const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) })
  return result.value
}

async function parseXLSX(buffer: ArrayBuffer): Promise<string> {
  const XLSX = await import('xlsx')
  const workbook = XLSX.read(buffer, { type: 'array' })
  const sheets: string[] = []

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName]
    if (sheet) {
      const csv = XLSX.utils.sheet_to_csv(sheet)
      sheets.push(`--- Sheet: ${sheetName} ---\n${csv}`)
    }
  }

  return sheets.join('\n\n')
}

async function parsePlainText(buffer: ArrayBuffer): Promise<string> {
  return new TextDecoder().decode(buffer)
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files')

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      )
    }

    const parsed: ParsedDocument[] = []

    for (const entry of files) {
      if (!(entry instanceof File)) continue

      const buffer = await entry.arrayBuffer()
      const name = entry.name
      const ext = name.split('.').pop()?.toLowerCase() ?? ''

      let text = ''

      try {
        switch (ext) {
          case 'pdf':
            text = await parsePDF(buffer)
            break
          case 'docx':
            text = await parseDOCX(buffer)
            break
          case 'xlsx':
            text = await parseXLSX(buffer)
            break
          case 'txt':
          case 'csv':
            text = await parsePlainText(buffer)
            break
          case 'pptx':
            // PPTX parsing not implemented in prototype — extract as plain text fallback
            text = `[PPTX file: ${name} — content extraction pending]`
            break
          default:
            text = `[Unsupported file type: ${ext}]`
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Parse error'
        text = `[Error parsing ${name}: ${msg}]`
      }

      parsed.push({ name, type: ext, text })
    }

    return NextResponse.json({ files: parsed })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to parse documents'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
