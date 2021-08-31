# Welcome to zip2 👋
![Version](https://img.shields.io/badge/version-0.0.1-blue.svg?cacheSeconds=2592000) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)

> [jszip](https://npmjs.org/jszip) based library that works on both node.js, browser and other cross platform.

**Good compatibility with [CapacitorJS](https://capacitorjs.com/) via plugin [capacitor-fs](https://npmjs.org/package/capacitor-fs)**


## Installation

``` bash
yarn add zip2
```
## Usage

### Zip2.zip(options)

``` ts
import fs from "fs"
import { zip } from "zip2"

await zip({
   fs,
   path: "folder-zip",
   filepaths: ["."],
   filter: (filepath: string) => filepath.startsWith("dist/") === false,
   onProgress: (event) => console.log(event),
   return: "folder-zip.zip"
})

console.log("Zipped done")
```


Options object:

| Param           | Type [= default]   | Description                                                                                                                                                                                |
| --------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `fs`          | LikeFs  | An object that has the same functions as the `fs` module. Example `capacitor-fs`                                                                                          |
| `path`           | string | The parent folder contains files and subfolders that need zip compression.                                                                                                            |
| `filepaths`       | string[] = ["."]    | The files and folders that need zip compression will be listed here. If you want to select all use `["."]`, if you want to unzip a certain file or folder use `["!.git/"]`.  |
| `filter` | (filepath) => boolean = () => true | function to filter files. Note this function has lower priority than `options.filepaths` | 
| `onProgress` | (event)? => void \| Promise<void> | This function will be called every time a file or directory is added to the zip. View type [object event](./src/zip.ts#L13) |
| `return` | false \| string? | zip2 will return in any fashion. If `options.return = false` `Zip2.zip()` will return a `Promise<ArrayBuffer>`, if it is `string` `Zip2.zip()` will return a `Promise<void>` and save the zip file to `options.return `

**Important note `options.filepaths` filters absolute paths. If you want to select a folder, you must have a `/` after it, otherwise Zip2 will understand that you want to select the file.**

### Zip2.unzip(options)


``` ts
import fs from "fs"
import { unzip } from "unzip"

await unzip({
   fs,
   extractTo: "folder-extract-zip",
   filepaths: ["."],
   filter: (filepath: string) => filepath.startsWith("dist/") === false,
   onProgress: (event) => console.log(event),
   path: "folder-zip.zip"
})
```


Options object:

| Param           | Type [= default]   | Description                                                                                                                                                                                |
| --------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `fs`          | LikeFs  | An object that has the same functions as the `fs` module. Example `capacitor-fs`                                                                                          |
| `extractTo`           | string | Unzipped folder to                                                                                      |
| `filepaths`       | string[] = ["."]    | The files and folders that need zip compression will be listed here. If you want to select all use `["."]`, if you want to unzip a certain file or folder use `["!.git/"]`.  |
| `filter` | (filepath) => boolean = () => true | function to filter files. Note this function has lower priority than `options.filepaths` | 
| `onProgress` | (event)? => void \| Promise<void> | This function will be called every time a file or directory is added to the zip. View type [object event](./src/zip.ts#L13) |
| `data` | ArrayBuffer \| Uint8Array? | Buffer of file zip. **Required this option or `options.path`** |
| `path` | string? | Path to zip file. **Required this option or `options.data`** |

**Important note `options.filepaths` filters absolute paths. If you want to select a folder, you must have a `/` after it, otherwise Zip2 will understand that you want to select the file.**
## License
[MIT](./LICENSE) (c) 2021 Tachibana Shin