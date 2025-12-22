# Pokke Bookmark Extension

A Chrome extension to save the current page to [Pokke](https://pokke.femto-cloud.com/) with a single click.

## Features

- Save the current page's URL and title to Pokke simply by clicking the toolbar icon.
- Notifications via badge on the icon:
  - <span style="color: #3b82f6">**…**</span> : Saving in progress
  - <span style="color: #10b981">**OK**</span> : Saved successfully
  - <span style="color: #ef4444">**ERR**</span> : Error occurred
  - <span style="color: #eab308">**KEY**</span> : API Key not set
  - <span style="color: #eab308">**WS**</span> : Workspace ID not set

## Setup

### 1. Installation

Currently, this extension supports manual installation only.

1. Clone the repository and install dependencies:
   ```bash
   pnpm install
   ```
2. Build the project:
   ```bash
   pnpm build
   ```
3. Open `chrome://extensions/` in your Chrome browser.
4. Enable "Developer mode" in the top right corner.
5. Click "Load unpacked" and select the `dist` directory of this project.

### 2. Configuration

Before using the extension, you need to configure your Pokke credentials.

1. Right-click the Pokke extension icon in the Chrome toolbar and select "Options".
2. In the settings page, enter the following information and click "Save":
   - **API Key**: Your API key issued by Pokke.
   - **Workspace ID**: The ID of the workspace where bookmarks will be saved.

You can find this information in your [Pokke](https://pokke.femto-cloud.com/) settings.

## Development

This project is built with Vite + TypeScript.

### Available Commands

- **Build**
  ```bash
  pnpm build
  ```
  Outputs the extension files to the `dist` directory.

- **Package**
  ```bash
  pnpm build:zip
  ```
  Builds the project and creates `chrome-extension.zip` for store submission.

- **Type Check**
  ```bash
  pnpm typecheck
  ```

- **Lint / Format**
  ```bash
  pnpm lint
  ```
  Checks and fixes code using [Biome](https://biomejs.dev/).

- **Test**
  ```bash
  pnpm test
  ```
  Runs tests using [Vitest](https://vitest.dev/).

## File Structure

- `src/background.ts`: Background script (API integration, badge control, etc.)
- `src/optionsPage.html`: Options page (Settings)
- `src/actionHandler.ts`: Logic for handling action clicks
- `manifest.json`: Extension manifest file
