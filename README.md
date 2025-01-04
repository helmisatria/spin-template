# @helmisatria/spin-template

A Node.js package that generates project files and directories from templates.

## Quick Start

```bash
npx @helmisatria/spin-template
```

## Features

- Generates project structure from predefined templates
- Built-in infrastructure setup (`.infrastructure/`)
- Interactive CLI interface
- Variable replacement for configuration

## How It Works

1. Run the generator and follow the prompts
2. Enter required information:
   - App name
   - Template selection
3. Optionally configure:
   - Email (for SSL)
   - SSH key
   - Host server
   - Production domain

## Project Structure

- `.infrastructure/` - Core infrastructure files (auto-included)
- `templates/` - Available project templates (user-selectable)

## License

MIT
