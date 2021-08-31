import JSZip from "jszip";
import { join } from "path-cross";

import { ENOTDIR } from "./errors";
import type { Fs } from "./types/fs";
import { chunksFilepaths, isVerifyPath, renderFS } from "./utils";

type ZipOptions = {
  readonly fs: Fs;
  readonly path: string;
  readonly filepaths?: readonly string[];
  readonly filter?: (filename: string) => boolean;
  readonly onProgress?: (event: {
    readonly filename: string;
    readonly isDirectory: boolean;
    readonly loaded: number;
    readonly total: number;
  }) => void | Promise<void>;
};

async function zip(
  options: ZipOptions & {
    readonly return?: false;
  }
): Promise<ArrayBuffer>;
async function zip(
  options: ZipOptions & {
    readonly return: string;
  }
): Promise<void>;
async function zip(
  options: ZipOptions & {
    readonly return?: false | string;
  }
): Promise<void | ArrayBuffer>;
async function zip({
  fs: _fs,
  path,
  filepaths = ["."],
  filter = () => true,
  onProgress,
  return: _return = false,
}: ZipOptions & {
  readonly return?: false | string;
}): Promise<void | ArrayBuffer> {
  const fs = renderFS(_fs);

  const rules = chunksFilepaths(filepaths);

  // * checking folder path
  try {
    const stat = await fs.promises.stat(path);

    if (stat.isDirectory() === false) {
      // eslint-disable-next-line functional/no-throw-statement
      throw new ENOTDIR(
        path,
        "Can't zip a file. If you need to zip a file please use the filepaths option."
      );
    }
  } catch (err) {
    if (err.code === "ENOENT") {
      // eslint-disable-next-line functional/no-throw-statement
      throw err;
    }
  }
  //*

  // scan file(s)

  async function globby(pathStart: string): Promise<readonly string[]> {
    const list: readonly string[] = await fs.promises
      .readdir(join(path, pathStart))
      .then((names) => names.map((item) => join(pathStart, item)))
      .then((filenames) => {
        // globby
        return Promise.all(
          filenames.map(async (filename) => {
            try {
              const children = await globby(filename);

              return [`${filename}/`, ...children];
            } catch {
              // filepath is not dir
              return [filename];
            }
          })
        );
      })
      .then((outlines) => outlines.flat(1))
      .then((filenames) =>
        filenames.filter(
          (filename) => isVerifyPath(filename, rules) && filter(filename)
        )
      );
    return list;
  }

  const listPaths = await globby("");

  const zip = new JSZip();

  const tasks = listPaths.map(async (filename, index) => {
    const isDir = path.endsWith("/");

    if (onProgress) {
      onProgress({
        filename,
        isDirectory: isDir,
        loaded: index + 1,
        total: listPaths.length,
      });
    }

    if (isDir) {
      zip.folder(filename);
    } else {
      zip.file(filename, await fs.promises.readFile(join(path, filename)));
    }
  });

  await Promise.all(tasks);

  const buffer = await zip.generateAsync({
    type: "uint8array",
  });

  if (_return) {
    // save
    await fs.promises.writeFile(_return, buffer);
    return void 0;
  }

  return buffer;
}

export default zip;
