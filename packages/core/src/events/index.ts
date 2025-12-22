// Event types for the central event bus

export type EventType =
  // Workspace events
  | "workspace:created"
  | "workspace:deleted"
  | "workspace:updated"
  | "workspace:activated"
  // Terminal events
  | "terminal:created"
  | "terminal:closed"
  | "terminal:output"
  | "terminal:input"
  | "terminal:resized"
  | "terminal:titleChanged"
  // Application events
  | "app:ready"
  | "app:beforeQuit"
  | "app:error";

export interface BaseEvent {
  type: EventType;
  timestamp: number;
}

// Workspace Events
export interface WorkspaceCreatedEvent extends BaseEvent {
  type: "workspace:created";
  workspaceId: string;
}

export interface WorkspaceDeletedEvent extends BaseEvent {
  type: "workspace:deleted";
  workspaceId: string;
}

export interface WorkspaceUpdatedEvent extends BaseEvent {
  type: "workspace:updated";
  workspaceId: string;
  changes: Record<string, unknown>;
}

export interface WorkspaceActivatedEvent extends BaseEvent {
  type: "workspace:activated";
  workspaceId: string;
  previousWorkspaceId: string | null;
}

// Terminal Events
export interface TerminalCreatedEvent extends BaseEvent {
  type: "terminal:created";
  terminalId: string;
  workspaceId: string;
}

export interface TerminalClosedEvent extends BaseEvent {
  type: "terminal:closed";
  terminalId: string;
}

export interface TerminalOutputEvent extends BaseEvent {
  type: "terminal:output";
  terminalId: string;
  data: string;
}

export interface TerminalInputEvent extends BaseEvent {
  type: "terminal:input";
  terminalId: string;
  data: string;
}

export interface TerminalResizedEvent extends BaseEvent {
  type: "terminal:resized";
  terminalId: string;
  cols: number;
  rows: number;
}

export interface TerminalTitleChangedEvent extends BaseEvent {
  type: "terminal:titleChanged";
  terminalId: string;
  title: string;
}

// Application Events
export interface AppReadyEvent extends BaseEvent {
  type: "app:ready";
}

export interface AppBeforeQuitEvent extends BaseEvent {
  type: "app:beforeQuit";
}

export interface AppErrorEvent extends BaseEvent {
  type: "app:error";
  error: string;
  stack?: string;
}

// Union type for all events
export type AppEvent =
  | WorkspaceCreatedEvent
  | WorkspaceDeletedEvent
  | WorkspaceUpdatedEvent
  | WorkspaceActivatedEvent
  | TerminalCreatedEvent
  | TerminalClosedEvent
  | TerminalOutputEvent
  | TerminalInputEvent
  | TerminalResizedEvent
  | TerminalTitleChangedEvent
  | AppReadyEvent
  | AppBeforeQuitEvent
  | AppErrorEvent;
