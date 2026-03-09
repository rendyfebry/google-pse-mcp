#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import fetch from "node-fetch";

// Polyfill global fetch for Node < 18
const globalAny = globalThis as any;
if (typeof globalAny.fetch !== "function") {
    globalAny.fetch = fetch as any;
}

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
    CX,
    SITE_RESTRICTED_ARG
] = process.argv;

/**
 * Parse optional siteRestricted CLI flag; default to false when omitted.
 * To enable Site Restricted endpoint, explicitly pass "true" as the last CLI arg.
 */
const SITE_RESTRICTED_DEFAULT = SITE_RESTRICTED_ARG !== undefined
    ? SITE_RESTRICTED_ARG.toLowerCase() === "true"
    : false;

const server = new Server(
    {
        name: "google-pse",
        version: "0.2.1"
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
                        size: { type: "integer", description: "Number of search results to return per page. Valid values are integers between 1 and 10, inclusive." },
                        sort: {
                            type: "string",
                            description: "Sort expression (e.g., 'date'). Only 'date' is supported by the API."
                        },
                        safe: {
                            type: "boolean",
                            description: "Enable safe search filtering. Default: false."
                        },
                        lr: { type: "string", description: "Restricts the search to documents written in a particular language (e.g., lang_en, lang_ja)" },
                        siteRestricted: {
                            type: "boolean",
                            description: "If true, use the Site Restricted API endpoint (/v1/siterestrict). If false, use the standard API endpoint (/v1). Default: false (can be overridden via CLI flag or per-call argument)."
                        },
                    },
                    required: ["q"]
                }
            }
        ]
    };
});

server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
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
            lr,
            safe = false,
            sort
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
        params.append("fields", "items(title,htmlTitle,link,snippet,htmlSnippet),searchInformation(totalResults)");

        // Language restriction
        if (lr !== undefined) {
            params.append("lr", String(lr));
        }

        // SafeSearch mapping (boolean only)
        if (safe !== undefined) {
            if (typeof safe !== "boolean") {
                throw new Error("SafeSearch (safe) must be a boolean");
            }
            params.append("safe", safe ? "active" : "off");
        }

        // Sort validation
        if (sort !== undefined) {
            if (sort === "date") {
                params.append("sort", "date");
            } else {
                throw new Error("Only 'date' is supported for sort");
            }
        }

                // Pagination
        let effectiveSize = size;
        if (typeof effectiveSize !== "number" || isNaN(effectiveSize)) {
            effectiveSize = 10;
        }
        if (effectiveSize < 1) effectiveSize = 1;
        if (effectiveSize > 10) effectiveSize = 10;

        params.append("num", String(effectiveSize));

        if (page > 0 && effectiveSize > 0) {
            const start = ((page - 1) * effectiveSize) + 1;
            params.append("start", String(start));
        } else {
            params.append("start", "1");
        }

        const siteRestricted = args.siteRestricted !== undefined ? args.siteRestricted : SITE_RESTRICTED_DEFAULT;
        const endpoint = siteRestricted ? "/v1/siterestrict" : "/v1";
        const url = `${API_HOST}${endpoint}?${params.toString()}`;
        const response = await fetch(url, {
            method: "GET"
        });

        if (!response.ok) {
            let bodyText = "";
            try {
                bodyText = await response.text();
            } catch (e) {
                // ignore
            }
            let hint = "";
            if (response.status === 401 || response.status === 403) {
                hint = "Authentication/authorization error. Verify API_KEY and CX, enable the Custom Search JSON API in Google Cloud, and ensure the key has access.";
            }
            throw new Error(`Search API request failed: ${response.status} ${response.statusText}${hint ? ` - ${hint}` : ""}${bodyText ? ` | body: ${bodyText}` : ""}`);
        }

        const result = await response.json() as { items?: any[]; searchInformation?: { totalResults?: string } };

        // Return items and meta information
        const items = result?.items ?? [];
        const meta = result?.searchInformation ?? {};
        return {
            content: [{
                type: "text",
                text: JSON.stringify({ items, meta }, null, 2)
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
