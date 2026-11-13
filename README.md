# Tyler Bateman — Personal Site

A single-page resume and portfolio site. It is static HTML and CSS only, so it can be hosted for free on GitHub Pages. No build step or framework is required.

The public site lives at:

**`https://YOUR-GITHUB-USERNAME.github.io`**

That is the address people often remember as “something.github.io.”

## What’s in this folder

- `index.html` — the site
- `style.css` — styles
- `README.md` — these hosting steps

## How to publish on GitHub Pages

### 1. Create a GitHub account (if you don’t have one)

Go to [https://github.com/signup](https://github.com/signup) and create an account. Your username becomes part of the site URL.

### 2. Create a repository named after your username

1. Sign in and click **New repository**.
2. Name the repository exactly:

   `YOUR-GITHUB-USERNAME.github.io`

   Example: if your username is `tylerbateman`, the repo must be named `tylerbateman.github.io`.
3. Leave it **Public**.
4. You can skip adding a README, since this project already has one.
5. Click **Create repository**.

A repo with that exact name is a *user site*. GitHub publishes it at `https://YOUR-GITHUB-USERNAME.github.io`.

### 3. Upload these files

On the new, empty repository page:

1. Click **uploading an existing file**.
2. Add `index.html`, `style.css`, and optionally this `README.md`.
3. Click **Commit changes**.

Or, from a terminal with [Git](https://git-scm.com/) installed:

```bash
git clone https://github.com/YOUR-GITHUB-USERNAME/YOUR-GITHUB-USERNAME.github.io.git
cd YOUR-GITHUB-USERNAME.github.io
# copy index.html, style.css, and README.md into this folder
git add index.html style.css README.md
git commit -m "Add personal site"
git push
```

### 4. Turn on GitHub Pages

1. Open the repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Set the branch to **main** (or **master**) and the folder to **/ (root)**.
5. Click **Save**.

GitHub usually enables this automatically for `username.github.io` repositories. The site can take one or two minutes to go live.

Visit: **https://YOUR-GITHUB-USERNAME.github.io**

If you see a 404, wait a minute and refresh, or confirm `index.html` is in the root of the default branch.

## Alternative: project site

If you already use `YOUR-GITHUB-USERNAME.github.io` for something else, put these files in any public repository and enable Pages the same way. The site will then be at:

`https://YOUR-GITHUB-USERNAME.github.io/REPOSITORY-NAME`

## Optional: custom domain

In **Settings → Pages**, you can add a custom domain (for example, `tylerbateman.com`) and follow GitHub’s DNS instructions. This is not required for the free `.github.io` URL.

## Local preview

Open `index.html` in a browser, or from this folder run:

```bash
python3 -m http.server 8080
```

Then visit http://localhost:8080
