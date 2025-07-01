import { Client } from "@notionhq/client";
import { NOTION_API_KEY, NOTION_PAGE_ID } from "./config";

const notion = new Client({ auth: NOTION_API_KEY });

export async function createNotionPage(title: string, content: string) {
	await notion.pages.create({
		parent: {
			type: "page_id",
			page_id: NOTION_PAGE_ID,
		},
		properties: {
			title: {
				title: [
					{
						text: {
							content: title,
						},
					},
				],
			},
		},
		children: [
			{
				object: "block",
				heading_2: {
					rich_text: [
						{
							text: {
								content,
							},
						},
					],
				},
			},
		],
	});
}
