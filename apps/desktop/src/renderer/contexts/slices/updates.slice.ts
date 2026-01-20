import type { Slice } from "./types";

// Types
export interface UpdateInfo {
  version: string;
  releaseNotes?: string;
}

export interface DownloadProgress {
  percent: number;
  bytesPerSecond: number;
}

export type UpdateStatus = "idle" | "checking" | "available" | "downloading" | "ready" | "error";

// State
export interface UpdatesState {
  status: UpdateStatus;
  updateInfo: UpdateInfo | null;
  downloadProgress: DownloadProgress | null;
  error: string | null;
}

// Actions
export type UpdatesAction =
  | { type: "updates/setChecking" }
  | { type: "updates/setAvailable"; payload: UpdateInfo }
  | { type: "updates/setNotAvailable" }
  | { type: "updates/setDownloading" }
  | { type: "updates/setProgress"; payload: DownloadProgress }
  | { type: "updates/setReady" }
  | { type: "updates/setError"; payload: string }
  | { type: "updates/reset" };

// Initial state
const initialState: UpdatesState = {
  status: "idle",
  updateInfo: null,
  downloadProgress: null,
  error: null,
};

// Reducer
function reducer(state: UpdatesState, action: UpdatesAction): UpdatesState {
  switch (action.type) {
    case "updates/setChecking": {
      return { ...state, status: "checking", error: null };
    }

    case "updates/setAvailable": {
      return { ...state, status: "available", updateInfo: action.payload, error: null };
    }

    case "updates/setNotAvailable": {
      return { ...state, status: "idle", error: null };
    }

    case "updates/setDownloading": {
      return {
        ...state,
        status: "downloading",
        downloadProgress: { percent: 0, bytesPerSecond: 0 },
      };
    }

    case "updates/setProgress": {
      return { ...state, downloadProgress: action.payload };
    }

    case "updates/setReady": {
      return { ...state, status: "ready", downloadProgress: null };
    }

    case "updates/setError": {
      return { ...state, status: "error", error: action.payload };
    }

    case "updates/reset": {
      return initialState;
    }

    default: {
      return state;
    }
  }
}

// Slice export
export const updatesSlice: Slice<UpdatesState, UpdatesAction> = {
  name: "updates",
  initialState,
  reducer,
};

// Action creators
export const updatesActions = {
  setChecking: (): UpdatesAction => ({
    type: "updates/setChecking",
  }),

  setAvailable: (payload: UpdateInfo): UpdatesAction => ({
    type: "updates/setAvailable",
    payload,
  }),

  setNotAvailable: (): UpdatesAction => ({
    type: "updates/setNotAvailable",
  }),

  setDownloading: (): UpdatesAction => ({
    type: "updates/setDownloading",
  }),

  setProgress: (payload: DownloadProgress): UpdatesAction => ({
    type: "updates/setProgress",
    payload,
  }),

  setReady: (): UpdatesAction => ({
    type: "updates/setReady",
  }),

  setError: (payload: string): UpdatesAction => ({
    type: "updates/setError",
    payload,
  }),

  reset: (): UpdatesAction => ({
    type: "updates/reset",
  }),
};
