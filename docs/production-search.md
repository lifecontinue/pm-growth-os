# Production Web Search Setup

PM Growth OS uses a server-side Knowledge Search API so end users never provide search credentials.

## Required Environment

Configure at least one provider in Vercel project environment variables:

- `TAVILY_API_KEY`
- `BRAVE_SEARCH_API_KEY`
- `SERPAPI_API_KEY`

Optional:

- `SEARCH_PROVIDER=tavily`
- `SEARCH_PROVIDER=brave`
- `SEARCH_PROVIDER=serpapi`

If `SEARCH_PROVIDER` is omitted, the API selects the first configured provider in this order:
Tavily, Brave Search, SerpAPI.

## Runtime API

- `GET /api/knowledge-search` returns provider configuration status.
- `POST /api/knowledge-search` accepts `capabilityId`, `focusArea`, `limit`, and `queries`.
- The response returns structured `LearningResource[]` data for Coach Agent.

The app does not return mock or static search results. If no provider key is configured, the API returns a `503` error with a setup message.
