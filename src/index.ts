#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

/**
 * Read API config from process.argv:
 * argv[2]: api_host (default: https://www.googleapis.com/customsearch)
 * argv[3]: api_key
 * argv[4]: cx
 */
const [
    ,
    ,
    API_HOST = "https://www.googleapis.com/customsearch",
    API_KEY,
    INDEX_ID
] = process.argv;

const server = new Server(
    {
        name: "google-pse",
        version: "0.1.0"
    },
    {
        capabilities: {
            tools: {},
            resources: {},
        }
    }
);

// ListToolsRequestSchema handler: define both searchArticles and createSummaryFromText tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
        ]
    };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (!request.params.arguments) {
        throw new Error("No arguments provided");
    }

    throw new Error(`Unknown tool: ${request.params.name}`);
});

async function runServer() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

runServer().catch(console.error);
