## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Testing

This project uses [TestSprite](https://www.testsprite.com) for automated API and UI testing via its MCP integration.

### Test Suites

| Suite                  | Type     | Tests | What it covers                                                                              |
| ---------------------- | -------- | ----- | ------------------------------------------------------------------------------------------- |
| Screenshot API (SS)    | Backend  | 10    | All 9 layouts, 45 variants via `POST /api/screenshot` with mock data                        |
| Preview Page (PV)      | Frontend | 7     | `/preview` widget gallery rendering                                                         |
| Helper Functions (HLP) | Backend  | 20    | `normalizeRange`, `resolveGoogleBoundary`, `resolveTodoistSchedule`, `isTodoistTaskInRange` |
| OAuth Login UI (OA)    | Frontend | 8     | `/get-started` OAuth buttons, email form, sign-up toggle, redirect initiation               |

### Running Tests

1. Start the server (`npm run dev` or `npm run build && npm start` for production mode)
2. Test plans live in `testsprite_tests/testsprite_backend_test_plan.json` and `testsprite_tests/testsprite_frontend_test_plan.json`
3. Run tests through the TestSprite MCP tool — results are written to `testsprite_tests/testsprite-mcp-test-report.md`

### Test Helpers Endpoint

A dev-only `POST /api/test-helpers` endpoint exposes pure utility functions for backend unit testing. It accepts `{fn, args}` and returns `{result}`. Blocked in production via `NODE_ENV` check.

### Notes

- Frontend preview tests work best in **production mode** — the dev server struggles with concurrent Puppeteer screenshot requests.
- OAuth flows can only be tested up to redirect initiation since they require real Google/Todoist credentials.
