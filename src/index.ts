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
    CX
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

// ListToolsRequestSchema handler: define both search tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "search",
                description: "Search the Web using Google Custom Search API",
                inputSchema: {
                    type: "object",
                    properties: {
                        q: { type: "string", description: "Search query" },
                        page: { type: "integer", description: "Page number" },
                        size: { type: "integer", description: "Results size per page" },
                    },
                    required: ["q"]
                }
            }
        ]
    };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (!request.params.arguments) {
        throw new Error("No arguments provided");
    }

    // --- search tool implementation ---
    if (request.params.name === "search") {
        const args = request.params.arguments as any;
        const {
            q,
            page = 1,
            size = 10,
        } = args;

        if (!q) {
            throw new Error("Missing required argument: q");
        }
        if (!API_KEY) {
            throw new Error("API_KEY is not configured");
        }
        if (!CX) {
            throw new Error("CX is not configured");
        }

        // Build query params
        const params = new URLSearchParams();
        params.append("key", API_KEY);
        params.append("cx", CX);
        params.append("q", q);

        // Pagination
        params.append("num", String(size));

        if (page > 0 && size > 0) {
            const start = ((page - 1) * size) + 1;
            params.append("start", String(start));
        } else {
            params.append("start", "1");
        }

        const url = `${API_HOST}/v1/siterestrict?${params.toString()}`;
        const response = await fetch(url, {
            method: "GET"
        });

        if (!response.ok) {
            throw new Error(`Search API request failed: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        // Return the items array (list of articles)
        const items = result?.items ?? [];
        return {
            content: [{
                type: "text",
                text: JSON.stringify(items, null, 2)
            }]
        };
    }

    throw new Error(`Unknown tool: ${request.params.name}`);
});

async function runServer() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

runServer().catch(console.error);
