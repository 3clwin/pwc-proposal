export function scanRiskPrompt(siteText: string): string {
  return `You are a compliance reviewer for professional services proposals. Scan the following proposal text for restricted language, overcommitments, and compliance risks.

Proposal text:
---
${siteText.slice(0, 12000)}
---

Restricted patterns to check:
- Overcommitment: "guarantee", "ensure", "certify", "warrant", "promise results"
- Liability: "unlimited liability", "indemnify without limit"
- Pricing: specific dollar amounts without qualification, "fixed fee" without qualifier
- Regulatory: "compliant with all regulations" (overly broad), specific regulatory claims without qualification
- Confidential: references to other client names, internal project codes

Return ONLY valid JSON with no markdown fences:
{
  "flags": [
    {
      "text": "The exact flagged text from the proposal",
      "rule": "Which rule it triggered (e.g., 'Overcommitment language')",
      "severity": "high" | "medium" | "low",
      "suggestedReplacement": "A safer alternative phrasing",
      "sectionId": "The section ID where this was found, or 'unknown'"
    }
  ]
}

Be thorough but avoid false positives. Only flag genuinely risky language.`
}
