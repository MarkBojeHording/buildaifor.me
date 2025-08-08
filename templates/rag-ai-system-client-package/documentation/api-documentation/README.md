# API Reference

## GET /api/health
Returns { status, timestamp }

## POST /api/analyze-documentation
Body: { query: string, documents: [...] }
Returns: array of results with title, description, codeBlock, source, confidence

