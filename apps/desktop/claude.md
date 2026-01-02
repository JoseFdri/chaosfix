# Desktop App Instructions

## Documentation References

When the user prompt includes any of the following keywords, read the corresponding documentation file before proceeding.

### Tabs Documentation

Read docs/tabs-architecture.md when the prompt includes:

| Category   | Keywords                                                                                                 |
| ---------- | -------------------------------------------------------------------------------------------------------- |
| Components | tab, tabs, TabBar, TabItem, tab bar                                                                      |
| State      | activeTerminalId, active terminal, terminal session, TerminalSession                                     |
| Hooks      | useWorkspaceTabs, workspace tabs                                                                         |
| Actions    | addTerminal, removeTerminal, setActiveTerminal, tab selection, select tab, close tab, new tab, tab close |
| Concepts   | tab rendering, tab state, tab lifecycle, tab creation, tab switching                                     |

### Terminal Documentation

Read docs/terminal-architecture.md when the prompt includes:

| Category   | Keywords                                                                                            |
| ---------- | --------------------------------------------------------------------------------------------------- |
| Packages   | terminal-bridge, node-pty, xterm.js, xterm                                                          |
| Components | TerminalView, terminal-view, terminal component                                                     |
| Services   | PTYManager, ptyManager, pty-manager, PTY service                                                    |
| Types      | TerminalAPI, TerminalController, PTY options, pty.types, terminal.types, ipc.types                  |
| Hooks      | useTerminal, use-terminal, terminal hook                                                            |
| IPC        | terminal IPC, TERMINAL_IPC_CHANNELS, terminal handlers, preload terminal                            |
| Actions    | create terminal, write terminal, resize terminal, destroy terminal, terminal input, terminal output |
| Concepts   | terminal architecture, terminal lifecycle, PTY lifecycle, terminal data flow, terminal factory      |
| Libraries  | FitAddon, terminal addons, terminal factory                                                         |
