import type { SiteContent, BrandTokens } from '@/types'

function generateHTML(site: SiteContent, tokens: BrandTokens): string {
  const sectionsHTML = site.sections
    .sort((a, b) => a.order - b.order)
    .map((section) => {
      const items = section.content.items
        ?.map(
          (item) => `
        <div style="margin-bottom: 16px;">
          ${item.title ? `<h3 style="font-weight: 600; margin-bottom: 4px;">${item.title}</h3>` : ''}
          ${item.description ? `<p style="opacity: 0.7; font-size: 14px; line-height: 1.6;">${item.description}</p>` : ''}
        </div>`
        )
        .join('') ?? ''

      return `
    <section style="background-color: ${section.style.backgroundColor ?? '#FFFFFF'}; color: ${section.style.textColor ?? '#1A1A1A'}; padding: ${section.style.padding ?? '64px 24px'};">
      <div style="max-width: 768px; margin: 0 auto;${section.type === 'hero' ? ' text-align: center; min-height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center;' : ''}">
        ${section.content.headline ? `<h2 style="font-size: ${section.type === 'hero' ? '2.5rem' : '1.5rem'}; font-weight: 700; margin-bottom: 8px;">${section.content.headline}</h2>` : ''}
        ${section.content.subheadline ? `<p style="font-size: 1.1rem; opacity: 0.7; margin-bottom: 16px;">${section.content.subheadline}</p>` : ''}
        ${section.content.body ? `<p style="font-size: 1rem; line-height: 1.7; opacity: 0.85;">${section.content.body}</p>` : ''}
        ${items ? `<div style="margin-top: 24px;">${items}</div>` : ''}
        ${section.content.cta ? `<a style="display: inline-block; margin-top: 24px; padding: 12px 24px; background-color: ${section.style.textColor}; color: ${section.style.backgroundColor}; border-radius: 6px; text-decoration: none; font-weight: 600;">${section.content.cta.text}</a>` : ''}
      </div>
    </section>`
    })
    .join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${site.metadata.title}</title>
  <meta name="description" content="${site.metadata.description}">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: ${tokens.typography.body.family}, -apple-system, BlinkMacSystemFont, sans-serif; }
    a { color: inherit; }
  </style>
</head>
<body>
${sectionsHTML}
</body>
</html>`
}

export interface DeployResult {
  url: string
  deploymentId: string
}

export async function deployToVercel(
  site: SiteContent,
  tokens: BrandTokens,
  projectName: string,
  vercelToken: string,
  teamId?: string
): Promise<DeployResult> {
  const html = generateHTML(site, tokens)

  const deployBody: Record<string, unknown> = {
    name: projectName,
    files: [
      { file: 'index.html', data: html },
    ],
    projectSettings: {
      framework: null,
    },
  }

  if (teamId) {
    deployBody.teamId = teamId
  }

  const response = await fetch('https://api.vercel.com/v13/deployments', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${vercelToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(deployBody),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Vercel deployment failed: ${error}`)
  }

  const data = (await response.json()) as { id: string; url: string }

  return {
    url: `https://${data.url}`,
    deploymentId: data.id,
  }
}
