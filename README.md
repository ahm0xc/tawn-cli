## tawn-cli

Run any command and play a cross-platform notification sound when it finishes.

### Features

- Cross-platform sound with bundled MP3 and graceful fallbacks
- Zero-config wrapper around any command
- Forwards stdio; works with long-running tasks

### Requirements

- Node.js >= 18 (runtime for the CLI)
- Bun (to build from source)

### Installation

```bash
npm install -g tawn-cli
```

This installs the `tawn` binary globally.

### Usage

```bash
# general
tawn <command> [args...]

# examples
tawn bun run build
tawn bun test
tawn node script.js
```

If run without arguments, `tawn` prints usage information.

### In project scripts

```json
{
  "scripts": {
    "build": "tawn bun run build",
    "test": "tawn bun test"
  }
}
```

### How it works

- Spawns your command and forwards stdio
- Tries to play `notification-sound.mp3`
- Falls back to OS tools (macOS `afplay`/`osascript`, Windows PowerShell beep, Linux `canberra-gtk-play`/`aplay`/etc.)
- Last resort: terminal bell

### Development

```bash
bun install
bun run build
```

Link for local testing:

```bash
bun link
# then
# run from anywhere
tawn
```

Or run directly after build:

```bash
./dist/index.js <command> [args...]
```

### License

MIT
