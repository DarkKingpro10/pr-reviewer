import { Octokit } from "octokit";
import { GITHUB_TOKEN } from "./config";
import { PRFileChangedInfo } from "./types";

const octoKit = new Octokit({
	auth: GITHUB_TOKEN,
});

async function fetchPRMetadata(
	repoOwner: string,
	repoName: string,
	PRNumber: number
) {
	try {
		const { data } = await octoKit.rest.pulls.get({
			owner: repoOwner,
			repo: repoName,
			pull_number: PRNumber,
		});

		return data;
	} catch (error) {
		throw new Error("Error al obtener la metadata de la PR");
	}
}

async function fetchPRFiles(
	repoOwner: string,
	repoName: string,
	PRNumber: number
) {
	try {
		const files = await octoKit.paginate(
			"GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
			{
				owner: repoOwner,
				repo: repoName,
				pull_number: PRNumber,
				per_page: 100,
			},
			(response) => response.data
		);

		return files.map((file) => ({
			fileName: file.filename,
			additions: file.additions,
			changes: file.changes,
			contentsURL: file.contents_url,
			deletions: file.deletions,
			patch: file.patch,
			rawURL: file.raw_url,
			status: file.status,
		}));

		// let files: PRFileChangedInfo[] = [];
		// Con iterator si en algún punto se desea agregar un filtro especifico

		// const iterator = octoKit.paginate.iterator(octoKit.rest.pulls.listFiles, {
		// 	owner: repoOwner,
		// 	repo: repoName,
		// 	pull_number: PRNumber,
		// 	per_page: 100,
		// });

		// for await (const { data } of iterator) {
		// 	for (const fileChanged of data) {
		// 		const file: PRFileChangedInfo = {
		// 			fileName: fileChanged.filename,
		// 			additions: fileChanged.additions,
		// 			changes: fileChanged.changes,
		// 			contentsURL: fileChanged.contents_url,
		// 			deletions: fileChanged.deletions,
		// 			patch: fileChanged.patch,
		// 			rawURL: fileChanged.raw_url,
		// 			status: fileChanged.status,
		// 		};
		// 		files.push(file);
		// 	}
		// }
		// return files;
	} catch (error) {
		throw error;
	}
}

export default async function fetchPR(
	repoOwner: string,
	repoName: string,
	PRNumber: number
) {
	try {
		const [prMetadata, prFiles] = await Promise.all([
			fetchPRMetadata(repoOwner, repoName, PRNumber),
			fetchPRFiles(repoOwner, repoName, PRNumber),
		]);

		return {
			metadata: prMetadata,
			fileChanged: prFiles,
		};
	} catch (error) {
		throw new Error(error);
	}
}
