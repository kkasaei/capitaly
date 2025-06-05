# Environment Configuration Guide

This monorepo uses a single `.env` file at the root level to manage environment variables for all applications and packages.

## How it works

1. A single `.env` file is placed at the root of the monorepo.
2. Turborepo is configured to forward environment variables to each task that needs them.
3. Environment variables are available to all apps and packages in the monorepo.

## Using Environment Variables

### Adding New Environment Variables

1. Add your environment variable to the root `.env` file.
2. Add the variable name to the appropriate task in `turbo.json` under the `env` array.

Example:
```json
"build": {
  "env": ["NODE_ENV", "DATABASE_URL", "MY_NEW_VARIABLE"]
}
```

### Environment Variables Naming Convention

- For Next.js applications, prefix variables with `NEXT_PUBLIC_` to make them available in the browser.
- For sensitive information, use regular naming without prefixes.

### Overriding Variables for Specific Environments

You can create environment-specific files like:
- `.env.development` (for development environment)
- `.env.production` (for production environment)

Turborepo will automatically pick these up based on the `NODE_ENV` setting.

## Development Workflow

1. Copy the `.env.example` file to a new file called `.env`
2. Fill in the values according to your local development setup
3. Run `pnpm dev` or other commands to start your development server

## Production Deployment

For production deployment, ensure you set all necessary environment variables in your hosting provider's environment configuration.
