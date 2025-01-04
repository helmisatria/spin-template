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

- `coba`: Your application name (lowercase with dashes)
- `helmisatria`: Your username (lowercase with dashes/underscores)
- `Helmi Satria`: Your display name
- `satriahelmi@gmail.com`: Email for SSL certificate
- `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOG1BXrIkq+VGU/PLbmAu+W/R+Bf+X6WaE2fAQAy8s6l satriahelmi@gmail.com`: Public SSH key
- `server.natauang.com`: Host server address
- `natauang.com`: Production domain

## License

MIT
