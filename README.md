# Cloudflare Workers PR Preview

[![CI status][github-action-image]][github-action-url]

[github-action-image]: https://github.com/shidil/cloudflare-workers-preview/workflows/build-test/badge.svg
[github-action-url]: https://github.com/shidil/cloudflare-workers-preview/actions?query=workflow%3Abuild-test

A GitHub action that previews cloudflare workers in [workers.dev](https://workers.dev/) for your pull requests.

<img width="800" alt="image" src="https://user-images.githubusercontent.com/507615/90243810-2230b480-de62-11ea-9a2c-9e869a2067dd.png">

### Pros

Compare to Netlify/Vercel?

- It is **free**.
- It supports multiple preview jobs.

### Usage

Add a workflow (`.github/workflows/preview.yml`):

```yaml
name: Workers PR Preview

on: [pull_request]

jobs:
  preview_app1:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: shidil/cloudflare-workers-preview@v1
        id: preview_step
        with:
          cf_token: ${{ secrets.CF_API_TOKEN }}
          cf_account: ${{ secrets.CF_ACCOUNT_ID }}
          github_token: ${{ secrets.GITHUB_TOKEN }}
          domain: shidil.workers.dev
          project_path: apps/app1
          build: |
            npm install
            npm run build
      - name: Get the preview_url
        run: echo "url => ${{ steps.preview_step.outputs.preview_url }}"
```

The preview website url will be `https://{{job.name}}-pr-{{pr.number}}.{{domain}}`.

#### Multiple Jobs

```yaml
name: Workers PR Preview

on: [pull_request]

jobs:
  preview-job-1:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: shidil/cloudflare-workers-preview@v1
        with:
          cf_token: ${{ secrets.CF_API_TOKEN }}
          cf_account: ${{ secrets.CF_ACCOUNT_ID }}
          github_token: ${{ secrets.GITHUB_TOKEN }}
          domain: shidil.workers.dev
          project_path: apps/app1
          build: |
            npm install
            npm run build
  preview-job-2:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: shidil/cloudflare-workers-preview@v1
        with:
          cf_token: ${{ secrets.CF_API_TOKEN }}
          cf_account: ${{ secrets.CF_ACCOUNT_ID }}
          github_token: ${{ secrets.GITHUB_TOKEN }}
          domain: shidil.workers.dev
          project_path: apps/app1
          build: |
            npm install
            npm run build
```

The preview website urls will be:

- `https://preview-job-1-pr-{{pr.number}}.shidil.workers.dev`
- `https://preview-job-2-pr-{{pr.number}}.shidil.workers.dev`

### Teardown

When a pull request is closed and teardown is set to 'true', then the workers script will be destroyed.

```yaml
name: Workers PR Preview

on:
  pull_request:
    # when using teardown: 'true', add default event types + closed event type
    types: [opened, synchronize, reopened, closed]
  push:

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: shidil/cloudflare-workers-preview@v1
        with:
          cf_token: ${{ secrets.CF_API_TOKEN }}
          cf_account: ${{ secrets.CF_ACCOUNT_ID }}
          github_token: ${{ secrets.GITHUB_TOKEN }}
          domain: shidil.workers.dev
          teardown: 'true'
          build: |
            npm install
            npm run build
```

### Inputs

- `cf_token`: [Getting your token](https://developers.cloudflare.com/workers/cli-wrangler/authentication#generate-tokens).
- `cf_account`: `Your Cloudflare account Id`.
- `github_token`: `secrets.GITHUB_TOKEN`.
- `domain`: domain name configured for your Workers account.
- `build`: build scripts to run before deploy.
- `project_path`: wrangler project path.
- `failOnError`: Set `failed` if a deployment throws error, defaults to `false`.
- `teardown`: Determines if the preview instance will be torn down on PR close, defaults to `false`.

### Outputs

- `preview_url`: The url for the related PR preview

### Thanks to

- [afc163/surge-preview](https://github.com/afc163/surge-preview)
