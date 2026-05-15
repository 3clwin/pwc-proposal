import { UnlockForm } from './unlock-form'

/**
 * Server component — pulls `?return=` from the request and hands it to the
 * client form as a prop. Reading it here (instead of with `useSearchParams`
 * in the client) avoids the App Router's CSR-bailout requirement that
 * `useSearchParams()` be wrapped in a Suspense boundary.
 */
export default async function UnlockPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const raw = params.return
  const returnPath = typeof raw === 'string' && raw.startsWith('/') ? raw : '/'

  return <UnlockForm returnPath={returnPath} />
}
