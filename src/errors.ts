function Err(name: string) {
  // eslint-disable-next-line functional/no-class
  return class extends Error {
    public readonly code: string = name;

    constructor(err: string, message?: string) {
      super(err);
      // eslint-disable-next-line functional/no-this-expression
      this.message = message || this.message;
      // eslint-disable-next-line functional/no-this-expression
      if (this.message) {
        // eslint-disable-next-line functional/no-this-expression
        this.message = name + ": " + this.message;
      } else {
        // eslint-disable-next-line functional/no-this-expression
        this.message = name;
      }
    }
  };
}

export const EEXIST = Err("EEXIST");
export const ENOENT = Err("ENOENT");
export const ENOTDIR = Err("ENOTDIR");
export const ENOTEMPTY = Err("ENOTEMPTY");
export const ETIMEDOUT = Err("ETIMEDOUT");
export const EISDIR = Err("EISDIR");
export const EPERM = Err("EPERM");
