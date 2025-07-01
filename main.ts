import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import fetchPR from "./githubIntegration";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createNotionPage } from "./notionIntegration";

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

server.registerTool(
	"create-notion-page",
	{
		title: "Create Notion Page",
		description: "Create a Notion Page",
		inputSchema: {
			title: z.string().describe("Title of the page"),
			content: z.string().describe("Content of the page"),
		},
	},
	async ({ title, content }) => {
		try {
			const page = await createNotionPage(title, content);
			return {
				content: [
					{
						type: "text",
						role: "tool",
						text: `✅ Notion Page created: ${title}`,
					},
					{
						type: "text",
						text: `New page created: ${JSON.stringify(page)}`,
					},
				],
			};
		} catch (error) {
			return {
				content: [
					{
						type: "text",
						role: "tool",
						text: `❌ Error al crear la Notion Page ${
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
