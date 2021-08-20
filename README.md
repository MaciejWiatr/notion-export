<h1 align="center">Welcome to notion-export 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://twitter.com/maciej_wiatr" target="_blank">
    <img alt="Twitter: maciej_wiatr" src="https://img.shields.io/twitter/follow/maciej\_wiatr.svg?style=social" />
  </a>
</p>

> Simple notion utility that allows you to export notion pages programatically

## Install

```sh
yarn install
```

## CLI Usage

Simplest way to use notion-export is npx

```sh
npx notion-export
```
It will run series of prompts that will guide you through the process of exporting your notion page

## Programmatic usage
```js
import { exportPage } from "notion-export/core"

exportPage(<page_url>, <destination_path>, <notion_v2_token>, <exportType>)
```
Supported export types are:
- markdown
- pdf
- html

## Author

* Website: mwiatr.live
* Twitter: [@maciej_wiatr](https://twitter.com/maciej\_wiatr)
* Github: [@MaciejWiatr](https://github.com/MaciejWiatr)

## Show your support

Give a ⭐️ if this project helped you!

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
