import { NextResponse } from 'next/server'
import { deployToVercel, type DeployResult } from '@/lib/vercel-deploy'
import type { SiteContent, BrandTokens } from '@/types'

interface DeployRequest {
  siteContent: SiteContent
  brandTokens: BrandTokens
  projectName: string
  /** Stable client-side project identifier used for idempotency. */
  projectId?: string
}

// Per-project single-flight lock + short-lived result cache.
// Prevents accidental double-deploys from rapid clicks, double submits,
// or React StrictMode double-invokes. Cleared on server restart, which
// is fine — the persisted `project.deploymentUrl` on the client is the
// long-lived source of truth.
const inFlight = new Map<string, Promise<DeployResult>>()
const recentResults = new Map<string, { result: DeployResult; expiresAt: number }>()
const RESULT_TTL_MS = 60_000

function lockKey(body: DeployRequest) {
  return body.projectId || body.projectName
}

export async function POST(request: Request) {
  try {
    const vercelToken = process.env.VERCEL_TOKEN
    const teamId = process.env.VERCEL_TEAM_ID

    if (!vercelToken) {
      return NextResponse.json(
        { error: 'VERCEL_TOKEN not configured. Set it in your environment variables.' },
        { status: 500 }
      )
    }

    const body = (await request.json()) as DeployRequest

    if (!body.siteContent || !body.brandTokens || !body.projectName) {
      return NextResponse.json(
        { error: 'Missing siteContent, brandTokens, or projectName' },
        { status: 400 }
      )
    }

    const key = lockKey(body)

    // 1. Return a cached result if this project just deployed successfully.
    const cached = recentResults.get(key)
    if (cached && cached.expiresAt > Date.now()) {
      return NextResponse.json(cached.result)
    }

    // 2. If a deploy is already in flight for this project, await it
    //    instead of starting a second one.
    const existing = inFlight.get(key)
    if (existing) {
      const result = await existing
      return NextResponse.json(result)
    }

    // 3. Start a new deploy and register the promise in the lock map.
    const promise = deployToVercel(
      body.siteContent,
      body.brandTokens,
      body.projectName,
      vercelToken,
      teamId
    )
    inFlight.set(key, promise)

    try {
      const result = await promise
      recentResults.set(key, { result, expiresAt: Date.now() + RESULT_TTL_MS })
      return NextResponse.json(result)
    } finally {
      inFlight.delete(key)
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Deployment failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
