import type { IpcRendererEvent } from "electron";

/**
 * Handler type for IPC renderer events
 */
export type IpcEventHandler<T> = (event: IpcRendererEvent, data: T) => void;
