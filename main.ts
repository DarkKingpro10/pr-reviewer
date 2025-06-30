import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import fetchPR from "./githubIntegration";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// 1. Crear el servidor
const server = new McpServer({
	name: "pr-docs",
	version: "1.0.0",
});

// 2. Definir las herramientas
server.registerTool(
	"fetch-pr-from-URL",
	{
		title: "Fetch PR Tool",
		description: "Fetch a Pull Request from Github",
		inputSchema: {
			repoOwner: z.string().describe("Owner of the repo"),
			repoName: z.string().describe("Name of the repository"),
			PRNumber: z.number().describe("Number of the Pull Request"),
		},
	},
	async ({ repoOwner, repoName, PRNumber }) => {
		try {
			const { metadata, fileChanged } = await fetchPR(
				repoOwner,
				repoName,
				PRNumber
			);

			return {
				content: [
					{
						type: "text",
						data: JSON.stringify(metadata),
						text: "Metadata of the Pull Request",
					},
					{
						type: "text",
						data: JSON.stringify(fileChanged),
						text: "Files changed from the Pull Request",
					},
				],
			};
		} catch (error) {
			return {
				content: [
					{
						type: "text",
						role: "tool",
						text: `❌ Error al obtener la Pull Request ${
							(error as Error).message
						}`,
					},
				],
			};
		}
	}
);

const transport = new StdioServerTransport();
await server.connect(transport);
