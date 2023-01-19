export default function (branch: string, siteId: string): string {
  // Keep in sync with crawler code in /netlify/crawl
  const cleanBranch = branch
    .trim()
    .replace(/[^\p{L}\p{N}_.-]+/gu, "-")
    .replace(/-{2,}/g, "-")
    .toLocaleLowerCase();
  return `netlify_${siteId}_${cleanBranch}_all`;
}
