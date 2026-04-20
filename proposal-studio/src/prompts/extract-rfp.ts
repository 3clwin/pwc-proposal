export function extractRfpPrompt(documentText: string): string {
  return `You are a proposal strategist analyzing an RFP document. Extract structured information from the following document text.

Document text:
---
${documentText.slice(0, 12000)}
---

Return ONLY valid JSON with no markdown fences. Use this exact structure:
{
  "title": "RFP title",
  "organization": "Issuing organization",
  "dueDate": "Due date if found, or null",
  "evaluationCriteria": [
    { "criterion": "Name", "weight": "Weight if specified", "description": "Brief description" }
  ],
  "requirements": [
    { "id": "R1", "category": "Category", "description": "Requirement description", "mandatory": true }
  ],
  "scopeSections": [
    { "title": "Section name", "description": "Brief scope description" }
  ],
  "keyDates": [
    { "event": "Event name", "date": "Date" }
  ],
  "winThemes": [
    "Theme 1: Brief strategic theme that could differentiate our proposal",
    "Theme 2: Another differentiator"
  ]
}`
}
