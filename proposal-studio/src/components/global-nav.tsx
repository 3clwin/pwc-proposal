'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Rocket, Loader2, ExternalLink, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { RiskModal } from '@/components/editor/risk-modal'
import { DeploySuccessModal } from '@/components/editor/deploy-success-modal'
import { useProject } from '@/context/project-context'
import { useLLM } from '@/context/llm-context'
import type { RiskFlag } from '@/types'

import { Logo } from '@/components/logo'

export function GlobalNav() {
  const pathname = usePathname()
  const { project, dispatch } = useProject()
  const { activeProvider, activeModel, activeApiKey } = useLLM()

  const [scanning, setScanning] = useState(false)
  const [riskFlags, setRiskFlags] = useState<RiskFlag[]>([])
  const [showRiskModal, setShowRiskModal] = useState(false)
  const [deploying, setDeploying] = useState(false)
  const [successModalOpen, setSuccessModalOpen] = useState(false)

  // Hard guard against double-submits. Survives rapid re-renders better
  // than state because refs update synchronously.
  const deployInFlight = useRef(false)

  const isEditor = pathname === '/editor'
  const deployedUrl = project.deploymentUrl
  const hasDeployed = Boolean(deployedUrl)

  async function handleDeployClick() {
    // Already deployed — do not scan, do not redeploy.
    if (hasDeployed) {
      setSuccessModalOpen(true)
      return
    }

    if (!project.siteContent || scanning || deploying || deployInFlight.current) return

    setScanning(true)
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (activeApiKey) {
        headers['x-llm-provider'] = activeProvider
        headers['x-llm-api-key'] = activeApiKey
        headers['x-llm-model'] = activeModel
      }

      const res = await fetch('/api/scan-risk', {
        method: 'POST',
        headers,
        body: JSON.stringify({ siteContent: project.siteContent }),
      })

      const data = (await res.json()) as { flags?: RiskFlag[]; error?: string }

      if (!res.ok) {
        toast.error(data.error ?? 'Risk scan failed')
        return
      }

      const flags = data.flags ?? []
      setRiskFlags(flags)

      if (flags.length === 0) {
        await executeDeploy()
      } else {
        setShowRiskModal(true)
      }
    } catch {
      toast.error('Risk scan failed')
    } finally {
      setScanning(false)
    }
  }

  function handleResolveFlag(flagId: string, status: 'dismissed' | 'resolved') {
    setRiskFlags((prev) => prev.map((f) => (f.id === flagId ? { ...f, status } : f)))
    dispatch({ type: 'RESOLVE_RISK_FLAG', payload: { id: flagId, status } })
  }

  async function executeDeploy() {
    if (!project.siteContent || !project.brandTokens) return
    // Idempotency: if we already have a URL, never hit the API again.
    if (hasDeployed) {
      setShowRiskModal(false)
      setSuccessModalOpen(true)
      return
    }
    // Single-flight: ignore concurrent invocations.
    if (deployInFlight.current) return
    deployInFlight.current = true

    setDeploying(true)
    setShowRiskModal(false)

    try {
      const res = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteContent: project.siteContent,
          brandTokens: project.brandTokens,
          projectName: `ps-${project.clientSlug || project.id}`,
          projectId: project.id,
        }),
      })

      const data = (await res.json()) as { url?: string; error?: string }

      if (!res.ok || !data.url) {
        toast.error(data.error ?? 'Deployment failed')
        return
      }

      dispatch({ type: 'SET_DEPLOYMENT_URL', payload: data.url })
      setSuccessModalOpen(true)
      toast.success('Deployed successfully')
    } catch {
      toast.error('Deployment failed')
    } finally {
      setDeploying(false)
      deployInFlight.current = false
    }
  }

  return (
    <>
      <nav className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4">
        {/* Left: logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-8 w-auto text-foreground" />
            <span className="text-sm font-medium tracking-tight text-foreground">
              Proposal Studio
            </span>
          </Link>
        </div>

        {/* Center: reserved for editor toolbar */}
        <div className="flex-1" />

        {/* Right: deploy button (editor only) + exit */}
        <div className="flex items-center gap-2">
          {isEditor &&
            (hasDeployed ? (
              <>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setSuccessModalOpen(true)}
                  className="gap-1.5"
                >
                  <CheckCircle2 className="size-4 text-emerald-600" data-icon="inline-start" />
                  Deployed
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <a href={deployedUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="size-4" data-icon="inline-start" />
                    View site
                  </a>
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                onClick={handleDeployClick}
                disabled={scanning || deploying || !project.siteContent}
              >
                {scanning || deploying ? (
                  <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
                ) : (
                  <Rocket className="size-4" data-icon="inline-start" />
                )}
                {scanning ? 'Scanning…' : deploying ? 'Deploying…' : 'Deploy to Vercel'}
              </Button>
            ))}
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">Exit</Link>
          </Button>
        </div>
      </nav>

      {/* Risk modal */}
      <RiskModal
        open={showRiskModal}
        onClose={() => setShowRiskModal(false)}
        flags={riskFlags}
        onResolve={handleResolveFlag}
        onDeploy={executeDeploy}
        deploying={deploying}
      />

      {/* Deploy success modal — opens after first deploy and anytime the
          user re-clicks the "Deployed" pill. */}
      {deployedUrl && (
        <DeploySuccessModal
          open={successModalOpen}
          onClose={() => setSuccessModalOpen(false)}
          url={deployedUrl}
        />
      )}
    </>
  )
}
