import { type FC, type ReactNode } from "react";
import {
  WelcomeScreen,
  ActionCard,
  ActionCardGroup,
  DocumentTextIcon,
  GlobeAltIcon,
} from "@chaosfix/ui";
import type { Tab } from "@chaosfix/core";
import type { WorkspaceWithTabs } from "../contexts/app-context";
import { TerminalContainer } from "./TerminalContainer";
import { SplitResizeOverlay } from "./SplitResizeOverlay";
import { calculateTerminalBounds } from "../libs";
import { HOMEPAGE_FEATURES } from "../../constants";

/**
 * Handlers for terminal operations.
 */
interface TerminalHandlers {
  onTerminalExit: (terminalId: string, exitCode: number) => void;
  onPaneClick: (terminalId: string) => void;
  onSplit: (direction: "horizontal" | "vertical") => void;
  onClosePane: (terminalId: string) => void;
  onTabClose: (tabId: string) => void;
}

/**
 * Handlers for resize operations.
 */
interface ResizeHandlers {
  onResizePanes: (splitId: string, sizes: number[]) => void;
}

/**
 * Handlers for welcome screen actions.
 */
interface WelcomeScreenHandlers {
  onAddRepository: () => void;
  onCloneFromUrl: () => void;
}

/**
 * Props for the WorkspaceTerminalArea component.
 */
export interface WorkspaceTerminalAreaProps {
  allWorkspaces: WorkspaceWithTabs[];
  activeWorkspaceId: string | null;
  activeTab: Tab | null;
  canSplit: boolean;
  terminalHandlers: TerminalHandlers;
  resizeHandlers: ResizeHandlers;
  welcomeScreenHandlers: WelcomeScreenHandlers;
}

/**
 * Renders the welcome screen with action cards.
 */
function WelcomeScreenContent({
  onAddRepository,
  onCloneFromUrl,
}: WelcomeScreenHandlers): ReactNode {
  return (
    <WelcomeScreen title="CHAOSFIX" features={HOMEPAGE_FEATURES}>
      <ActionCardGroup>
        <ActionCard
          icon={<DocumentTextIcon className="w-8 h-8" />}
          label="Open project"
          onClick={onAddRepository}
        />
        <ActionCard
          icon={<GlobeAltIcon className="w-8 h-8" />}
          label="Clone from URL"
          onClick={onCloneFromUrl}
        />
      </ActionCardGroup>
    </WelcomeScreen>
  );
}

/**
 * Renders all terminals from all tabs across all workspaces.
 */
function AllWorkspaceTerminals({
  allWorkspaces,
  activeWorkspaceId,
  canSplit,
  terminalHandlers,
}: {
  allWorkspaces: WorkspaceWithTabs[];
  activeWorkspaceId: string | null;
  canSplit: boolean;
  terminalHandlers: TerminalHandlers;
}): ReactNode {
  return (
    <>
      {allWorkspaces.flatMap((workspace) => {
        const isActiveWorkspace = workspace.id === activeWorkspaceId;

        return workspace.tabs.flatMap((tab) => {
          const isActiveTab = isActiveWorkspace && tab.id === workspace.activeTabId;

          // Calculate bounds for terminals in split layout (only for active tab)
          const boundsMap =
            isActiveTab && tab.splitLayout ? calculateTerminalBounds(tab.splitLayout) : null;

          return tab.terminals.map((terminal) => {
            const bounds = boundsMap?.get(terminal.id) ?? null;
            // Terminal is in split only if it has bounds (is part of the split layout)
            const isInSplit = bounds !== null;

            // Terminal is active (visible) if:
            // - Workspace is active AND
            // - Tab is active AND
            // - Either: it's in a split (has bounds), OR it's the only terminal
            const isActive = isActiveTab && (isInSplit || tab.terminals.length === 1);

            return (
              <TerminalContainer
                key={terminal.id}
                terminalId={terminal.id}
                worktreePath={workspace.worktreePath}
                isActive={isActive}
                bounds={bounds}
                isFocused={isActiveTab && terminal.id === tab.focusedTerminalId}
                onClick={
                  isInSplit ? (): void => terminalHandlers.onPaneClick(terminal.id) : undefined
                }
                onExit={terminalHandlers.onTerminalExit}
                onSplit={
                  isActiveTab && canSplit
                    ? (): void => terminalHandlers.onSplit("horizontal")
                    : undefined
                }
                onClose={
                  isActiveTab
                    ? (): void => {
                        if (tab.terminals.length > 1) {
                          // If tab has multiple terminals (split), close just this pane
                          terminalHandlers.onClosePane(terminal.id);
                        } else {
                          // If tab has only one terminal, close the entire tab
                          terminalHandlers.onTabClose(tab.id);
                        }
                      }
                    : undefined
                }
              />
            );
          });
        });
      })}
    </>
  );
}

/**
 * WorkspaceTerminalArea renders the main terminal area with all workspace terminals.
 *
 * This component is purely presentational - all state and handlers are passed as props.
 *
 * Contents:
 * - SplitResizeOverlay for active tab split layout resize handles
 * - All terminals from all tabs across all workspaces (via flatMap rendering)
 * - WelcomeScreen fallback when no active tab exists
 */
export const WorkspaceTerminalArea: FC<WorkspaceTerminalAreaProps> = ({
  allWorkspaces,
  activeWorkspaceId,
  activeTab,
  canSplit,
  terminalHandlers,
  resizeHandlers,
  welcomeScreenHandlers,
}) => {
  const activeWorkspace = allWorkspaces.find((w) => w.id === activeWorkspaceId);
  const hasActiveTab = Boolean(activeWorkspace?.activeTabId);

  return (
    <div className="flex-1 bg-surface-primary relative">
      {/* Resize handles overlay for split layouts - now from active tab */}
      {activeTab?.splitLayout && (
        <SplitResizeOverlay
          paneNode={activeTab.splitLayout}
          onResizePanes={resizeHandlers.onResizePanes}
        />
      )}

      {/* Render all terminals from all tabs across all workspaces */}
      <AllWorkspaceTerminals
        allWorkspaces={allWorkspaces}
        activeWorkspaceId={activeWorkspaceId}
        canSplit={canSplit}
        terminalHandlers={terminalHandlers}
      />

      {/* Welcome screen fallback when no active tab */}
      {!hasActiveTab && (
        <WelcomeScreenContent
          onAddRepository={welcomeScreenHandlers.onAddRepository}
          onCloneFromUrl={welcomeScreenHandlers.onCloneFromUrl}
        />
      )}
    </div>
  );
};
