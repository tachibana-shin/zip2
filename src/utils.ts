import { resolve } from "path-cross";

import { Fs } from "./types/fs";

export type Rules = {
  readonly filepaths: readonly string[];
  readonly ignores: readonly string[];
};

export function resolveCustom(path: string): string {
  return resolve(path) + (path.endsWith("/") ? "/" : "");
}

export function isVerifyPath(
  path: string,
  { filepaths, ignores }: Rules
): boolean {
  const verifyDir = path.endsWith("/");

  const pathResolved = resolveCustom(path);

  const verifyFilepaths = filepaths.some((filepath) => {
    if (filepath == null || filepath === "." || filepath === "") {
      return true;
    }

    if (verifyDir) {
      return resolveCustom(filepath).startsWith(pathResolved);
    }

    return resolveCustom(filepath) === pathResolved;
  });
  const verifyIgnores = ignores.every((filepath) => {
    if (filepath == null || filepath === "." || filepath === "") {
      return true;
    }

    if (verifyDir) {
      return resolveCustom(filepath).startsWith(pathResolved);
    }

    return resolveCustom(filepath) !== pathResolved;
  });

  return verifyFilepaths && verifyIgnores;
}

export function chunksFilepaths(filepaths: readonly string[]): Rules {
  const _filepaths = [];
  const ignores = [];

  filepaths.forEach((filepath) => {
    if (filepath.startsWith("!")) {
      // eslint-disable-next-line functional/immutable-data
      ignores.push(filepath.slice(1));
    } else {
      // eslint-disable-next-line functional/immutable-data
      _filepaths.push(filepath);
    }
  });

  return {
    filepaths: _filepaths,
    ignores,
  };
}

export function renderFS(fs: Fs): Fs {
  if ("promises" in fs === false) {
    return {
      promises: fs,
    } as unknown as Fs;
  }

  return fs;
}
