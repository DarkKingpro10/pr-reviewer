import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
	GITHUB_TOKEN: z.string(),
	NOTION_API_KEY: z.string(),
	NOTION_PAGE_ID: z.string(),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
	throw new Error(
		`Faltan variables de entorno:\n${JSON.stringify(
			env.error.format(),
			null,
			2
		)}`
	);
}

export const { GITHUB_TOKEN, NOTION_API_KEY, NOTION_PAGE_ID } = env.data;
