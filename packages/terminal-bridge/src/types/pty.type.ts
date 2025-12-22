export interface PTYCreateOptions {
  id: string;
  cwd: string;
  env?: Record<string, string>;
  shell?: string;
  cols?: number;
  rows?: number;
}

export interface PTYInstance {
  id: string;
  pid: number;
  write: (data: string) => void;
  resize: (cols: number, rows: number) => void;
  kill: () => void;
  onData: (callback: (data: string) => void) => void;
  onExit: (callback: (exitCode: number, signal?: number) => void) => void;
}
