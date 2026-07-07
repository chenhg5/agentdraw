# Agent Cache Operations Cheatsheet

Goal: give engineers one memory-aid board for deciding when to reuse local agent cache, when to
invalidate it, and what commands to run during an incident.

Core rule: cache is a speed feature, not a source of truth.

Sections:

- Identify: check cache key, model version, prompt bundle version, tool schema hash, and source
  document fingerprint.
- Reuse: allow reuse when all fingerprints match and the cached answer passed the last validation.
- Refresh: force refresh when source content, tool contract, model family, or safety policy changed.
- Diagnose: compare cached output timestamp, source diff, validation report, and downstream error.
- Repair: delete only the affected namespace first; avoid wiping the whole cache unless the schema
  changed globally.

Commands:

```bash
agent-cache inspect --key <key>
agent-cache diff --source docs/spec.md --cache <key>
agent-cache invalidate --namespace review-assets --reason schema-change
agent-cache validate --key <key> --strict
```

Gotchas:

- stale cache often looks like a reasoning error;
- partial invalidation is safer than global deletion;
- cache hit rate is meaningless if validation quality drops;
- every manual invalidation should write a short reason.

Recommended default path: inspect -> diff -> validate -> targeted invalidate.
