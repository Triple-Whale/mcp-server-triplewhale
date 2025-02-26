#!/usr/bin/env node

import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';
import {ToolHandler, TRIPLEWHALE_HANDLERS, TRIPLEWHALE_TOOLS} from './tools.js';
import {handleInit, parseArgs} from './initConfig.js';
import './polyfills.js';
import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';

const commands = ['init', 'start'] as const;
const {command, triplewhaleApiKey, executablePath} = parseArgs();
if (!commands.includes(command as (typeof commands)[number])) {
    console.error(`Invalid command: ${command}`);
    process.exit(1);
}

if (command === 'init') {
    await handleInit({
        executablePath,
        triplewhaleApiKey,
    });
    process.exit(0);
}

export const TRIPLEWHALE_API_KEY = triplewhaleApiKey

// "start" command from here

export const server = new McpServer(
    {
        name: 'mcp-server-triplewhale',
        version: '0.1.0',
    },
);

TRIPLEWHALE_TOOLS.forEach((tool) => {
    const handler = TRIPLEWHALE_HANDLERS[tool.name];
    if (!handler) {
        throw new Error(`Handler for tool ${tool.name} not found`);
    }

    server.tool(
        tool.name,
        tool.description,
        {params: tool.inputSchema},
        handler as ToolHandler<typeof tool.name>
    );
});



/**
 * Start the server using stdio transport.
 * This allows the server to communicate via standard input/output streams.
 */
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
});
