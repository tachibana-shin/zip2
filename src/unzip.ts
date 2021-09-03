import JSZip from "jszip";
import { dirname, join } from "path-cross";

import { ENOTDIR } from "./errors";
import { Fs } from "./types/fs";
import { chunksFilepaths, isVerifyPath, renderFS } from "./utils";

type UnzipOptions = {
  readonly fs: Fs;
  readonly extractTo: string;
  //   readonly path: string; // or
  //   readonly data: ArrayBuffer;
  readonly filepaths?: readonly string[];
  readonly filter?: (filepath: string) => boolean;
  readonly onProgress?: (event: {
    readonly filename: string;
    readonly isDirectory: boolean;
    readonly loaded: number;
    readonly total: number;
  }) => void | Promise<void>;
};

async function unzip(
  options: UnzipOptions & {
    readonly path: string;
  }
): Promise<void>;
async function unzip(
  options: UnzipOptions & {
    readonly data: ArrayBuffer | Uint8Array;
  }
): Promise<void>;

async function unzip({
  fs: _fs,
  extractTo,
  filepaths = ["."],
  filter = () => true,
  onProgress,
  data,
  path,
}: UnzipOptions & {
  readonly path?: string | null;
  readonly data?: ArrayBuffer | Uint8Array;
}): Promise<void> {
  const fs = renderFS(_fs);

  if (path) {
    data = await fs.promises.readFile(path);
  }

  if (data instanceof Uint8Array) {
    data = data.buffer;
  }

  const zip = await JSZip.loadAsync(data);
  const total = Object.keys(zip).length;

  // * checking folder extractTo
  try {
    const stat = await fs.promises.stat(extractTo);

    if (stat.isDirectory() === false) {
      // eslint-disable-next-line functional/no-throw-statement
      throw new ENOTDIR(extractTo, "Can't unzip to a file.");
    }
  } catch (err) {
    if (err.code !== "ENOENT") {
      // eslint-disable-next-line functional/no-throw-statement
      throw err;
    } else {
      await fs.promises.mkdir(extractTo, {
        recursive: true,
      });
    }
  }

  //*

  const rules = chunksFilepaths(filepaths);

  const tasks = Object.values(zip.files)
    .filter(
      ({ name: filename }) => isVerifyPath(filename, rules) && filter(filename)
    )
    .map(async (file, index) => {
      const filepath = join(extractTo, file.name);

      if (onProgress) {
        onProgress({
          filename: file.name,
          isDirectory: file.dir,
          loaded: index + 1,
          total,
        });
      }

      if (file.dir) {
        return fs.promises.mkdir(filepath, {
          recursive: true,
        });
      }

      const dispatch = dirname(filepath);
      try {
        await fs.promises.stat(dispatch);
      } catch {
        await fs.promises.mkdir(dispatch, {
          recursive: true,
        });
      }

      return fs.promises.writeFile(filepath, await file.async("uint8array"));
    });

  await Promise.all(tasks);
  // * done
}

export default unzip;
