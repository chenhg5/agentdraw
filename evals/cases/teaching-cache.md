# Teaching Note: Why One Prompt Change Breaks a Cache

Imagine a model request as a row of tokens:

`system rules -> project context -> user task -> generated answer`

A prefix cache can reuse work only while the beginning of the request stays identical. If the same
system rules and project context appear again, the model can skip recomputing that prefix.

The surprising part is that one small early change can invalidate everything after it. If a timestamp,
random ID, or changing instruction appears near the beginning, then the following tokens no longer
share the same prefix. Even if most of the prompt looks familiar to a human, the cache sees a
different sequence.

This creates a practical rule: put stable content first and variable content later. Stable system
rules, repo summaries, tool instructions, and reusable context should come before task-specific
details. Changing data, timestamps, user-specific requests, and generated scratch notes should come
after the shared prefix.

Common mistake: adding "current time", "latest run id", or dynamic metadata near the top of a prompt.
That makes the shared prefix unstable and reduces cache hits.

Rule of thumb: keep the prefix boring, stable, and reusable.

