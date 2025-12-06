# MedHelp-AI

AI-powered clinical decision support with animated landing, multi-step intake wizard, OpenAI-backed analysis, validation against a mock drug-interaction DB, and a treatment dashboard.

## Quick start

```bash
npm install --legacy-peer-deps
OPENAI_API_KEY=your_key_here npm run dev
# open http://localhost:3000
```

### Environment
- `OPENAI_API_KEY` is required for `/api/medhelp/analyze` (OpenAI gpt-4.1 with JSON output).
- Without the key the API returns an error; UI remains usable for intake/demo.

## Key flows
- Landing page: 3D hero (R3F), light trails, particles, feature cards.
- Intake wizard: 5 steps (personal, history, meds, lifestyle, complaint) with Zod + RHF, BMI auto-calc, draft persistence, interaction hints, and quick-load samples.
- AI analysis: `useAIAnalysis` → `/api/medhelp/analyze` → structured JSON; validation against `drugInteractionDatabase`.
- Dashboard: risk gauge, critical alerts, treatment plan, flagged issues, rationale, alternatives; skeletons during loading.
- Audit: `logClinicalAction` stores client-side audit entries on completed analyses.

## Sample patients (quick-load buttons in wizard)
- John Doe: warfarin + NSAID risk (bleeding).
- Sarah Smith: beta-blocker contraindication with asthma.
- Michael Chen: low weight → dosage caution.

## Files of interest
- UI: `src/modules/medhelp/components/landing`, `src/modules/medhelp/components/intake`, `src/modules/medhelp/components/dashboard`
- Services: `app/api/medhelp/analyze/route.ts`, `src/modules/medhelp/services/aiClient.ts`, `src/modules/medhelp/services/drugDatabase.service.ts`, `src/modules/medhelp/services/audit.service.ts`
- Types & schemas: `src/modules/medhelp/types`, `src/modules/medhelp/constants/intakeSchema.ts`, `src/modules/medhelp/constants/prompt.ts`
- Samples/DB: `src/modules/medhelp/data/examplePatients.ts`, `src/modules/medhelp/data/drugInteractions.ts`

## Known limitations
- Audit log is client-side only (localStorage).
- Drug interaction DB is a limited mock set; extend for broader coverage.
- API errors surface in the UI banner; no retry/backoff yet.
