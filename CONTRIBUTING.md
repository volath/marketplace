# Adding a plugin

1. Create a folder named like the plugin id (`a-z`, `0-9`, `-`) with a `plugin.json` at its root. Start from `ticket-triage` (code) or `ticket-mirror` (no code, only declarative actions).
2. Write the plugin. The SDK documents every `ctx` function, event and manifest field: <https://github.com/volath/sdk>. You can give `docs/AI_GUIDE.md` from the SDK to an AI assistant and ask it to write the plugin.
3. Run `npm run validate`, then try it for real with `npx @volath/sdk test <folder>`.
4. Open a pull request. Describe what the plugin does and why each permission is needed.

A plugin that asks for `projects: "admin"`, `users: "admin"`, `workflows: "write"`, `actions`, `prompts`, `webhooks` or inbound `webhooks` needs a short justification in its README, because it can change a lot.

Every plugin needs a logo: `"logo": "logo.svg"` in `plugin.json` (a .svg, .png, .jpg or .webp up to 512 KB, square, readable on a light and a dark background). The marketplace shows it on the plugin card.

Bump `version` in `plugin.json` for every change that is released.

## What is not accepted

A plugin that reimplements a feature of a paid Volath plan (the modules and tools a plan unlocks: analytics, memory, project planner, self-improve, design-to-code, reviews, releases, New Relic, SonarCloud, dependabot, packages, api tokens...) is rejected, however it gets its data. Calls that use those features through `ctx` are refused by Volath when the plan lacks them; a plugin may not work around that. The MIT license covers this repository and the SDK, not the Volath application or its plans.
