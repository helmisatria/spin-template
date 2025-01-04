# @helmisatria/spin-template

A Node.js package that generates project files and directories from templates, with built-in infrastructure setup.

## Features

- Generates files and directories based on predefined templates
- Includes infrastructure setup (`.infrastructure/` directory)
- Supports multiple template options
- Variable replacement for configuration
- Interactive CLI interface

## Installation

```bash
# Using npx (recommended)
npx @helmisatria/spin-template
```

## Usage

1. Run the generator:

```bash
npx @helmisatria/spin-template
```

2. Follow the interactive prompts:

   - Select a template from available options
   - Enter your app name (required)
   - Enter your username (required)
   - Enter your display name (required)
   - Optionally provide:
     - Email (for SSL certificate)
     - SSH key
     - Host server
     - Production domain

3. The generator will:
   - Copy the selected template
   - Copy infrastructure files
   - Replace configuration placeholders
   - Set up your project structure

## Template Structure

- `.infrastructure/`: Contains infrastructure setup files (always copied)
- `templates/`: Contains available project templates
  - Each subdirectory is a separate template option
  - Templates can be selected during generation

## Configuration

The following placeholders are available in templates:

- `{{APP_NAME}}`: Your application name (lowercase with dashes)
- `{{USER_NAME}}`: Your username (lowercase with dashes/underscores)
- `{{USER_DISPLAY_NAME}}`: Your display name
- `{{EMAIL}}`: Email for SSL certificate
- `{{SSH_PUBLIC_KEY}}`: Public SSH key
- `{{HOST_SERVER}}`: Host server address
- `{{PRODUCTION_DOMAIN}}`: Production domain

## License

MIT
