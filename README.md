# Volath marketplace

The official plugins for [Volath](https://github.com/riftwebdev/volath-source). Every folder in this repository is one plugin; the folder name is the plugin id.

You never *need* the marketplace: any plugin is a zip with a `plugin.json` and can be installed from **Settings › Plugins** (or built with the [Volath SDK](https://github.com/volath/sdk)). This repository is where the plugins made by the Volath team live.

## Install a plugin

1. Download `<plugin>.zip` from the latest release (or build it yourself: `npx @volath/sdk pack <folder>`).
2. In Volath, open **Settings › Plugins**, choose **Install a plugin** and pick the zip.
3. Read what it asks for on the install screen. A plugin stays off until you accept its permissions.

## The plugins

| Plugin | What it does | Needs |
|---|---|---|
| [`hello-dashboard`](hello-dashboard) | A small page that lists tickets, with settings and storage | tickets, storage, network |
| [`project-bootstrap`](project-bootstrap) | Adds developers and custom fields to every new project | developers, custom fields |
| [`project-workflow`](project-workflow) | Gives every new project a local workflow | workflows |
| [`ticket-mirror`](ticket-mirror) | Posts every new ticket to another system over HTTP | network |
| [`ticket-triage`](ticket-triage) | Labels, assigns and comments on new tickets | tickets, developers, notifications |
| [`ui-slots`](ui-slots) | Shows where a plugin can add buttons, widgets and tabs | tickets |

These are also the best starting points for your own plugin.

## Rules for official plugins

- One folder per plugin, named like its `id`, with a valid `plugin.json` at its root.
- Ask for the least access that works. Everything a plugin creates in Volath is shown with a "from plugin X" badge, so name it clearly.
- No minified or generated code: the source in the folder is what runs.
- `npm run validate` must pass (CI runs it on every change).

## Working on this repository

```
npm run validate     # checks every folder like Volath does
npm run build        # writes dist/<id>.zip for every plugin and dist/index.json
```

Both need the [SDK](https://github.com/volath/sdk) next to this repository (`../sdk`) or installed as `@volath/sdk`.

See [CONTRIBUTING.md](CONTRIBUTING.md) to add a plugin.

## License

[MIT](LICENSE). Plugins in this repository are MIT too unless a folder says otherwise.
