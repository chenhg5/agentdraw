# npm Release Notes

AgentDraw is prepared as one public npm package:

- `@chg80333/agentdraw`: user-facing CLI with bundled scene validation, local server, and web editor assets.

Build and create local tarballs:

```bash
pnpm npm:pack
```

Publish:

```bash
pnpm --filter @chg80333/agentdraw publish --access public
```

Smoke-test the packed CLI tarball:

```bash
npm install -g ./npm/chg80333-agentdraw-0.1.0.tgz
agentdraw open examples/getting-started.agentdraw.json --no-open
```

Before publishing, ensure the public version is bumped in:

- `packages/cli/package.json`

The internal workspace packages `@agentdraw/scene` and `@agentdraw/server` stay private and are bundled into the `agentdraw` tarball.
