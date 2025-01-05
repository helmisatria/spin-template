#!/usr/bin/env -S npx tsx

import { intro, outro, text, confirm, select, spinner, isCancel } from "@clack/prompts";
import { readdir, cp } from "fs/promises";
import { join } from "path";
import { replaceInFile } from "replace-in-file";
import { execSync } from "child_process";
import { renameSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

interface UserInputs {
  appName: string;
  username: string;
  displayName: string;
  email?: string;
  sshKey?: string;
  hostServer?: string;
  productionDomain?: string;
}

function checkGitStatus() {
  try {
    const status = execSync("git status --porcelain", { stdio: "ignore" }).toString();
    if (status) {
      return false; // Has uncommitted changes
    }
    return true; // Clean working directory
  } catch (error) {
    // Git is not initialized or not available
    return true; // Allow proceeding when Git isn't initialized
  }
}

function getPackageDir() {
  const currentFilePath = fileURLToPath(import.meta.url);
  const currentDir = dirname(currentFilePath);
  return dirname(currentDir); // Go up one level from src/ to package root
}

async function getTemplates(): Promise<string[]> {
  const packageDir = getPackageDir();
  const templatesDir = join(packageDir, "templates");
  const entries = await readdir(templatesDir, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory() && entry.name !== ".infrastructure").map((entry) => entry.name);
}

async function collectUserInputs(): Promise<UserInputs> {
  const appName = await text({
    message: "What is your app name?",
    validate: (value) => {
      if (!value) return "App name is required";
      if (!/^[a-z0-9-]+$/.test(value)) return "App name must be lowercase with dashes only";
      return;
    },
  });

  if (isCancel(appName)) {
    outro("Operation cancelled. Goodbye!");
    process.exit(0);
  }

  const username = await text({
    message: "What is your username?",
    validate: (value) => {
      if (!value) return "Username is required";
      if (!/^[a-z0-9_-]+$/.test(value)) return "Username must be lowercase with dashes or underscores only";
      return;
    },
  });

  if (isCancel(username)) {
    outro("Operation cancelled. Goodbye!");
    process.exit(0);
  }

  const displayName = await text({
    message: "What is your display name?",
    validate: (value) => {
      if (!value) return "Display name is required";
      return;
    },
  });

  if (isCancel(displayName)) {
    outro("Operation cancelled. Goodbye!");
    process.exit(0);
  }

  const email = await text({
    message: "Email for SSL certificate (optional):",
  });

  if (isCancel(email)) {
    outro("Operation cancelled. Goodbye!");
    process.exit(0);
  }

  const sshKey = await text({
    message: "Public SSH key (optional):",
  });

  if (isCancel(sshKey)) {
    outro("Operation cancelled. Goodbye!");
    process.exit(0);
  }

  const hostServer = await text({
    message: "Host server address (optional):",
  });

  if (isCancel(hostServer)) {
    outro("Operation cancelled. Goodbye!");
    process.exit(0);
  }

  const productionDomain = await text({
    message: "Production domain (optional):",
  });

  if (isCancel(productionDomain)) {
    outro("Operation cancelled. Goodbye!");
    process.exit(0);
  }

  return {
    appName,
    username,
    displayName,
    ...(email && { email }),
    ...(sshKey && { sshKey }),
    ...(hostServer && { hostServer }),
    ...(productionDomain && { productionDomain }),
  };
}

async function main() {
  try {
    intro("Welcome to @helmisatria/spin-template");

    // Check for uncommitted changes
    if (!checkGitStatus()) {
      const shouldProceed = await confirm({
        message: "⚠️ You have uncommitted changes. Do you want to proceed anyway?",
      });

      if (!shouldProceed || isCancel(shouldProceed)) {
        outro("Please commit your changes first. Goodbye!");
        process.exit(0);
      }
    }

    const templates = await getTemplates();
    const selectedTemplate = await select({
      message: "Select a template to use:",
      options: templates.map((t) => ({ value: t, label: t })),
    });

    if (isCancel(selectedTemplate)) {
      outro("Operation cancelled. Goodbye!");
      process.exit(0);
    }

    const userInputs = await collectUserInputs();

    // Confirm file changes
    const confirmChanges = await confirm({
      message: `This will add/modify files in your current directory. Are you sure you want to proceed?
- Copy .infrastructure/ directory
- Copy ${selectedTemplate} template
- Replace placeholders in files`,
    });

    if (!confirmChanges || isCancel(confirmChanges)) {
      outro("Operation cancelled. Goodbye!");
      process.exit(0);
    }

    const s = spinner();
    s.start("Generating project files...");

    const packageDir = getPackageDir();

    // Copy infrastructure files
    await cp(join(packageDir, "templates", ".infrastructure"), join(process.cwd(), ".infrastructure"), {
      recursive: true,
    });

    // Copy selected template
    await cp(join(packageDir, "templates", selectedTemplate), process.cwd(), { recursive: true });

    // Update the gitignore rename operation
    renameSync(
      join(packageDir, "templates", ".infrastructure", "conf", "ci", "gitignore"),
      join(process.cwd(), ".infrastructure", "conf", "ci", ".gitignore")
    );

    // Replace placeholders in files
    await replaceInFile({
      files: ["./**/*"],
      ignore: ["node_modules/**/*"],
      from: [
        /\{\{APP_NAME\}\}/g,
        /\{\{USER_NAME\}\}/g,
        /\{\{USER_DISPLAY_NAME\}\}/g,
        /\{\{EMAIL\}\}/g,
        /\{\{SSH_PUBLIC_KEY\}\}/g,
        /\{\{HOST_SERVER\}\}/g,
        /\{\{PRODUCTION_DOMAIN\}\}/g,
      ],
      to: [
        userInputs.appName,
        userInputs.username,
        userInputs.displayName,
        userInputs.email || "",
        userInputs.sshKey || "",
        userInputs.hostServer || "",
        userInputs.productionDomain || "",
      ],
    });

    s.stop("✨ Project files generated successfully!");

    outro(`
🎉 All done! Your project is ready to use.
📁 Template: ${selectedTemplate}
🚀 App name: ${userInputs.appName}
👤 Username: ${userInputs.username}
📛 Display name: ${userInputs.displayName}
    `);
  } catch (error) {
    outro("❌ An error occurred:");
    console.error(error);
    process.exit(1);
  }
}

main();
