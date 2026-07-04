# npm Release

AgentDraw publishes one public package:

- `@aidraw/agentdraw`: CLI, scene validation, local server, bundled web editor, and bundled design guides.

## Safe Publish Command

Use the scripted release path. It creates a temporary `.npmrc`, reads the token from `NPM_TOKEN`, publishes the packed tarball, verifies `latest`, and removes the temporary auth file.

```bash
NPM_TOKEN="$(shrike get NPM_TOKEN --reveal)" pnpm npm:publish
```

The token must never be committed, echoed into tracked files, or stored in `package.json`.

## Dry Run

```bash
NPM_TOKEN="$(shrike get NPM_TOKEN --reveal)" pnpm npm:publish -- --dry-run
```

## What the Script Does

1. Reads `packages/cli/package.json` for the package name and version.
2. Runs `pnpm npm:pack`, which rebuilds the workspace and writes `npm/aidraw-agentdraw-<version>.tgz`.
3. Writes a temporary npm config outside the repo with:
   - `registry=https://registry.npmjs.org/`
   - `//registry.npmjs.org/:_authToken=${NPM_TOKEN}`
4. Runs `npm whoami` with that temporary config.
5. Refuses to publish if the exact version already exists.
6. Runs `npm publish npm/aidraw-agentdraw-<version>.tgz --access public`.
7. Verifies `npm view @aidraw/agentdraw@latest version` equals the package version.
8. Deletes the temporary npm config.

## Manual Fallback

Only use this if the script needs debugging:

```bash
pnpm npm:pack
tmp_npmrc="$(mktemp)"
chmod 600 "$tmp_npmrc"
printf '%s\n' \
  'registry=https://registry.npmjs.org/' \
  "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" \
  > "$tmp_npmrc"
NPM_CONFIG_USERCONFIG="$tmp_npmrc" npm publish ./npm/aidraw-agentdraw-<version>.tgz --access public
rm -f "$tmp_npmrc"
```

Do not rely on bare `pnpm --filter @aidraw/agentdraw publish` for this repo. It can pick up the wrong auth source and has caused false permission errors.

## Version Checklist

Before publishing:

- Bump `packages/cli/package.json`.
- Run `pnpm typecheck`.
- Run `pnpm npm:pack` or let `pnpm npm:publish` run it.
- After publish, install from the registry on the Mac test host:

```bash
ssh -p 2222 chicken@localhost 'zsh -lc "npm install -g @aidraw/agentdraw@latest && agentdraw version"'
```

The workspace packages `@agentdraw/scene`, `@agentdraw/server`, and `@agentdraw/styles` are bundled into the public CLI package; they are not published separately.
