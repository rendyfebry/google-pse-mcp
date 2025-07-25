[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/rendyfebry-google-pse-mcp-badge.png)](https://mseep.ai/app/rendyfebry-google-pse-mcp)

<a href="https://glama.ai/mcp/servers/@rendyfebry/google-pse-mcp">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@rendyfebry/google-pse-mcp/badge" alt="Google PSE Server MCP server" />
</a>

# Google Programmable Search Engine (PSE) MCP Server

A Model Context Protocol (MCP) server for the Google Programmable Search Engine (PSE) API. This server exposes tools for searching the web with Google Custom Search engine, making them accessible to MCP-compatible clients such as VSCode, Copilot, and Claude Desktop.

## Installation Steps

You do NOT need to clone this repository manually or run any installation commands yourself. Simply add the configuration below to your respective MCP client—your client will automatically install and launch the server as needed.

### VS Code Copilot Configuration 

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
          "<cx>"
        ]
      }
    }
  }
}
```

### Cline MCP Configuration Example

If you are using [Cline](https://github.com/saoudrizwan/cline), add the following to your `cline_mcp_settings.json` (usually found in your VSCode global storage or Cline config directory):

- macOS: `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
- Windows: `%APPDATA%\Code\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json`

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


### Important Notes

Don't forget to replace `<api_key>` and `<cx>` with your credentials in the configuration above.


## Available Tools

This MCP server provides the following tool:

1. `search`: Search the web with Google Programmable Search Engine

   - Parameters:
     - `q` (string, required): Search query
     - `page` (integer, optional): Page number
     - `size` (integer, optional): Number of search results to return per page (1-10)
     - `sort` (string, optional): Sort expression (only 'date' is supported)
     - `safe` (boolean, optional): Enable safe search filtering
     - `lr` (string, optional): Restrict search to a particular language (e.g., lang_en)
     - `siteRestricted` (boolean, optional): Use the Site Restricted API endpoint

## Example Usage

```python
# Search for "artificial intelligence"
result = await use_mcp_tool(
    server_name="google-pse-mcp",
    tool_name="search",
    arguments={
        "q": "artificial intelligence",
        "size": 5,
        "safe": True
    }
)
```

## Useful Links

- [Model Context Protocol Servers](https://github.com/modelcontextprotocol/servers)
- [Google Programmable Search Engine Intro](https://developers.google.com/custom-search/v1/overview)