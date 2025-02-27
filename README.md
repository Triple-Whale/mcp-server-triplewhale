# Triplewhale MCP Server

[![npm version](https://img.shields.io/npm/v/@triplewhale/mcp-server-triplewhale)](https://www.npmjs.com/package/@triplewhale/mcp-server-triplewhale)
[![npm downloads](https://img.shields.io/npm/dt/@triplewhale/mcp-server-triplewhale)](https://www.npmjs.com/package/@triplewhale/mcp-server-triplewhale)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![smithery badge](https://smithery.ai/badge/triplewhale)](https://smithery.ai/server/triplewhale)

Model Context Protocol (MCP) is a [new, standardized protocol](https://modelcontextprotocol.io/introduction) for managing context between large language models (LLMs) and external systems. In this repository, we provide an installer as well as an MCP Server for [Triplewhale](https://triplewhale.com).

This lets you use Claude Desktop, or any MCP Client, to use natural language to accomplish things with Triplewhale, e.g.:

- `Was my net profit positive last month?.`
- `Rank countries by order revenue and new users for the last quarter..`
- `Give me ads ROAS over the last 7 days and break it out by attribution model?`

# Claude Setup

### Installing via Smithery

To install Triplewhale MCP Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/triplewhale):

```bash
npx -y @smithery/cli install triplewhale --client claude
```

## Requirements

- Node.js >= v18.0.0
- Claude Desktop
- Triplewhale API key - you can generate one through the Triplewhale console. [Learn more](https://kb.triplewhale.com/en/articles/8116412-creating-and-managing-api-keys) or [click here](https://app.triplewhale.com/api-keys) for quick access.

## How to use locally

1. Run `npx -y @triplewhale/mcp-server-triplewhale init $TRIPLEWHALE_API_KEY`
2. Restart Claude Desktop
3. You should now be able to try a simple command such as `what's my meta spend in the last 7 days?`

[//]: # (## Guides)

[//]: # ()
[//]: # (- [Claude Desktop with Triplewhale MCP Server]&#40;https://triplewhale.tech/guides/triplewhale-mcp-server&#41;)

[//]: # (- [Cline with Triplewhale MCP Server]&#40;https://triplewhale.tech/guides/cline-mcp-triplewhale&#41;)

[//]: # (- [Windsurf with Triplewhale MCP Server]&#40;https://triplewhale.tech/guides/windsurf-mcp-triplewhale&#41;)


## Supported Tools

- `moby`

[//]: # (## Development with MCP CLI Client)

[//]: # ()
[//]: # (The easiest way to iterate on the MCP Server is using the `mcp-client/`. Learn more in `mcp-client/README.md`.)

[//]: # ()
[//]: # (```bash)

[//]: # (npm install)

[//]: # (npm run build)

[//]: # (npm run watch # You can keep this open.)

[//]: # (cd mcp-client/ && TRIPLEWHALE_API_KEY=... npm run start:mcp-server-triplewhale)

[//]: # (```)

## Development with Claude Desktop

```bash
npm install
npm run build
npm run watch # You can keep this open.
node dist/index.js init $TRIPLEWHALE_API_KEY
```

Then, **restart Claude** each time you want to test changes.

# Testing

To run the tests you need to setup the `.env` file according to the `.env.example` file.

```bash
npm run test
```
