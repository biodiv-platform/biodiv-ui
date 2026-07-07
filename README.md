# Biodiv UI

Next Generation UI for Biodiversity Informatics Platform

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![typed with TypeScript](https://badgen.net/badge/icon/typescript?icon=typescript&label)](https://www.typescriptlang.org)
[![framework: nextjs](https://badgen.net/badge/framework/next.js)](https://nextjs.org)

### 📦 Getting Started

```sh
pnpm install
cp src/configs/site-config.example.js src/configs/site-config.js  # setup with appropriate properties
pnpm dev # will start development server on port 3000
```

### 👷 Production Build

```sh
pnpm build
pnpm serve           # will start production server
```

### 📝 Generate TS Interfaces from Swagger UI

For end to end typesafe models this grately reduces chances of typos and amazing autocomplete ✨

```sh
./typegen.sh         # To regenerate modal(s) from microservices endpoints
```

### 🔧 Configuration

Code quality checks are done with `prettier` and `eslint`.

### 📄 License

Apache-2.0 &copy; [Strand Life Sciences](https://github.com/strandls)
