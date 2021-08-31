type CallbackFs = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  readonly readFile: Function;
  // eslint-disable-next-line @typescript-eslint/ban-types
  readonly writeFile: Function;
  // eslint-disable-next-line @typescript-eslint/ban-types
  readonly unlink: Function;
  // eslint-disable-next-line @typescript-eslint/ban-types
  readonly readdir: Function;
  // eslint-disable-next-line @typescript-eslint/ban-types
  readonly mkdir: Function;
  // eslint-disable-next-line @typescript-eslint/ban-types
  readonly rmdir: Function;
  // eslint-disable-next-line @typescript-eslint/ban-types
  readonly stat: Function;
  // eslint-disable-next-line @typescript-eslint/ban-types
  readonly lstat: Function;
  // eslint-disable-next-line @typescript-eslint/ban-types
  readonly readlink?: Function;
  // eslint-disable-next-line @typescript-eslint/ban-types
  readonly symlink?: Function;
  // eslint-disable-next-line @typescript-eslint/ban-types
  readonly chmod?: Function;
};
type PromiseFs = {
  readonly promises: CallbackFs;
};

export type Fs = CallbackFs & PromiseFs;
