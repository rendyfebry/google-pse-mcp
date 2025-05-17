# Google Programmable Search Engine (PSE) MCP Server

A Model Context Protocol (MCP) server for the Google Programmable Search Engine (PSE) API. This server exposes tools for searching the web with Google Custom Search engine, making them accessible to MCP-compatible clients such as VSCode, Copilot, and Claude Desktop.

## Quick Start

You do NOT need to clone this repository manually. Simply add the configuration below to your VS Code `settings.json` file and VS Code will automatically install and run the server using `npx` when needed—no manual setup required!

Open Command Palette → Preferences: Open Settings (JSON), then add:

`settings.json`
```jsonc
{
  // Other settings...
  "mcp": {
    "servers": {
      "google-pse-mcp": {
        "command": "npx",
        "args": [
          "-y",
          "google-pse-mcp",
          "https://www.googleapis.com/customsearch",
          "<api_key>",
          "<cx>",
        ]
      }
    }
  }
}
```

- Replace `<api_key>` and `<cx>` with your credentials.

## Available Tools

- `search`: Search the web with Google Programmable Search Engine.

## Useful Links

- [Model Context Protocol Servers](https://github.com/modelcontextprotocol/servers)
- [Google Programmable Search Engine Intro](https://developers.google.com/custom-search/v1/overview)
