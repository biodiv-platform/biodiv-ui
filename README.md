# Biodiv UI

Next Generation UI for Biodiversity Informatics Platform

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![typed with TypeScript](https://badgen.net/badge/icon/typescript?icon=typescript&label)](https://www.typescriptlang.org)
[![framework: nextjs](https://badgen.net/badge/framework/next.js)](https://nextjs.org)

### 📦 Getting Started

```sh
yarn install
cp example.env .env  # setup .env with appropriate properties
yarn start           # will start development server on port 3000
```

### 👷 Production Build

```sh
yarn build
yarn serve           # will start production server
```

### 📝 Generate TS Interfaces from Swagger UI

For end to end typesafe models this grately reduces chances of typos and amazing autocomplete ✨

```sh
./typegen.js         # To regenerate modal(s) from microservices endpoints
```

### 🔧 Configuration

Code quality checks are done with `prettier`, `eslint` and `husky`.

### 📄 License

Apache-2.0 &copy; [Strand Life Sciences](https://github.com/strandls)
