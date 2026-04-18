# Portfolio Explorer

Central landing page that lists and links to hosted project pages for **bobdude247**.

## How it works

- [`app.js`](app.js) calls the GitHub API for public repositories.
- It builds a hosted app link for each repository using:
  - `homepage` (if set), otherwise
  - GitHub Pages convention: `https://<username>.github.io/<repo>/` when `has_pages` is true.
- The page renders cards with:
  - **Open App** (hosted page)
  - **View Repo** (GitHub repository)

## Local preview

Open [`index.html`](index.html) directly in your browser.

## Deploy to GitHub Pages

1. Commit and push this repo to GitHub.
2. In GitHub, open repository **Settings → Pages**.
3. Under **Build and deployment**, choose:
   - **Source:** Deploy from a branch
   - **Branch:** `main`
   - **Folder:** `/ (root)`
4. Save and wait for deployment.

Your central navigation page will be available at:

`https://bobdude247.github.io/portfolio-explorer/`

## Notes

- Only public repositories can be discovered through this page.
- Repositories without a valid `homepage` and without GitHub Pages enabled are not shown.
