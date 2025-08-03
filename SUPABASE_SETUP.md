# 🚀 Supabase Setup Guide

## Overview
This guide explains how to set up and configure Supabase for the BuildAIFor.Me project.

## Prerequisites
- Supabase account at [supabase.com](https://supabase.com)
- Node.js and npm installed
- Supabase CLI installed

## Installation

### 1. Install Supabase CLI
```bash
npm install supabase --save-dev
```

### 2. Login to Supabase
```bash
npx supabase login
```

### 3. Link to Your Project
Replace `YOUR_PROJECT_REF` with your actual Supabase project reference:
```bash
npx supabase link --project-ref YOUR_PROJECT_REF
```

## Configuration

### 1. Environment Variables
Copy `env.example` to `.env.local` and update with your actual values:

```bash
cp env.example .env.local
```

Update the following variables in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your public anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Your service role key (keep secret!)

### 2. Get Your Project Reference
1. Go to your Supabase dashboard
2. Select your project
3. Go to Settings > API
4. Copy the "Project Reference" (found in the URL: `https://supabase.com/dashboard/project/YOUR_PROJECT_REF`)

### 3. Get Your API Keys
1. In your Supabase dashboard, go to Settings > API
2. Copy the "anon public" key for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Copy the "service_role secret" key for `SUPABASE_SERVICE_ROLE_KEY`

## Available Scripts

### Development
```bash
# Start local Supabase development environment
npm run supabase:start

# Stop local Supabase development environment
npm run supabase:stop

# Reset local database
npm run supabase:reset
```

### Functions
```bash
# Serve Edge Functions locally
npm run supabase:functions

# Deploy Edge Functions to production
npm run supabase:deploy
```

### Database
```bash
# Generate migration from local changes
npm run supabase:db:diff

# Apply migrations to local database
npm run supabase:db:reset

# Push local schema to remote database
npm run supabase:db:push
```

## Project Structure

```
supabase/
├── config.toml          # Supabase configuration
├── functions/           # Edge Functions
│   └── hello/          # Sample function
├── migrations/          # Database migrations
└── seed/               # Seed data
```

## Testing Your Setup

### 1. Test Local Development
```bash
# Start local Supabase
npx supabase start

# Test the hello function
curl -X POST http://localhost:54321/functions/v1/hello \
  -H "Content-Type: application/json" \
  -d '{"name": "World"}'
```

### 2. Test Production Function
```bash
# Deploy and test the hello function
npx supabase functions deploy hello

# Test the deployed function
curl -X POST https://YOUR_PROJECT_REF.supabase.co/functions/v1/hello \
  -H "Content-Type: application/json" \
  -d '{"name": "World"}'
```

## Integration with Frontend

### 1. Install Supabase Client
```bash
npm install @supabase/supabase-js
```

### 2. Create Supabase Client
Create `src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 3. Use in Components
```typescript
import { supabase } from '@/lib/supabase'

// Example: Fetch data
const { data, error } = await supabase
  .from('your_table')
  .select('*')
```

## Common Commands

### Database Management
```bash
# Create a new migration
npx supabase migration new create_users_table

# Apply all migrations
npx supabase db reset

# Generate types from database
npx supabase gen types typescript --local > src/types/database.ts
```

### Functions Management
```bash
# Create a new function
npx supabase functions new my-function

# Deploy all functions
npx supabase functions deploy

# Invoke a function
npx supabase functions invoke my-function
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill processes using Supabase ports
   lsof -ti:54321 | xargs kill -9
   lsof -ti:54322 | xargs kill -9
   ```

2. **Authentication Issues**
   ```bash
   # Re-login to Supabase
   npx supabase logout
   npx supabase login
   ```

3. **Function Deployment Fails**
   ```bash
   # Check function logs
   npx supabase functions logs
   ```

### Getting Help
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [Edge Functions Guide](https://supabase.com/docs/guides/functions)

## Next Steps

1. ✅ Set up environment variables
2. ✅ Link to your Supabase project
3. ✅ Test local development
4. 🔄 Create database schema
5. 🔄 Set up authentication
6. 🔄 Deploy Edge Functions
7. 🔄 Integrate with frontend

Your Supabase setup is now ready! 🎉 