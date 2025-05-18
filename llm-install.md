# AI Agents -- Read this!

This guide provides instructions for AI agents to set up the Uber Eats Google Programmable Search Engine (PSE) MCP Server on behalf of the user.

## Prerequisites
- Node and npx installed
- Google Programmable Search Engine API Key (`api_key`)
- Google Custom Search Engine ID (`cx`)

## Installation Steps

1. **No manual installation or cloning is required.**
2. **Add the following configuration to your MCP client:**

### For VSCode Copilot

Add to your `settings.json`:
```jsonc
{
  "mcp": {
    "servers": {
      "google-pse-mcp": {
        "command": "npx",
        "args": [
          "-y",
          "google-pse-mcp",
          "https://www.googleapis.com/customsearch",
          "<api_key>",
          "<cx>"
        ]
      }
    }
  }
}
```

### For Cline VSCode Extension

Add to your `cline_mcp_settings.json`:
```json
{
  "mcpServers": {
    "google-pse-mcp": {
      "disabled": false,
      "timeout": 60,
      "command": "npx",
      "args": [
        "-y",
        "google-pse-mcp",
        "https://www.googleapis.com/customsearch",
        "<api_key>",
        "<cx>"
      ],
      "transportType": "stdio"
    }
  }
}
```

**Important Notes:**

- Replace `<api_key>` and `<cx>` with the actual path to your installation, either user edit them manually or use the MCP client to set them.
- You do NOT need to run `npx -y google-pse-mcp ...` manually. The MCP client will handle installation and launching automatically.
- Verify that the server is installed correctly by search for "Artificial Intelligence" or any other query.
- All above steps are required before completing the task.

## Verification

Perform a test search using your MCP client to confirm the server is working.
