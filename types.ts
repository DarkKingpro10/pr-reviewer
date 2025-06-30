export type PRFileChangedInfo = {
  fileName: string,
  status: string,
  additions: number,
  deletions: number,
  changes: number,
  patch: string | undefined | null,
  rawURL: string,
  contentsURL: string
}