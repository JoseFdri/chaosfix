import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WorkspaceStatusBar } from "./WorkspaceStatusBar.molecule";

describe("WorkspaceStatusBar", () => {
  it("should render children inside the component", () => {
    render(
      <WorkspaceStatusBar>
        <span data-testid="child-element">Child Content</span>
      </WorkspaceStatusBar>
    );

    expect(screen.getByTestId("child-element")).toBeInTheDocument();
    expect(screen.getByText("Child Content")).toBeInTheDocument();
  });

  it("should render multiple children", () => {
    render(
      <WorkspaceStatusBar>
        <span data-testid="child-1">First</span>
        <span data-testid="child-2">Second</span>
        <span data-testid="child-3">Third</span>
      </WorkspaceStatusBar>
    );

    expect(screen.getByTestId("child-1")).toBeInTheDocument();
    expect(screen.getByTestId("child-2")).toBeInTheDocument();
    expect(screen.getByTestId("child-3")).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const { container } = render(
      <WorkspaceStatusBar className="custom-class">
        <span>Child</span>
      </WorkspaceStatusBar>
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("custom-class");
  });

  it("should have basic styling classes", () => {
    const { container } = render(
      <WorkspaceStatusBar>
        <span>Child</span>
      </WorkspaceStatusBar>
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("flex", "items-center");
    expect(wrapper).toHaveClass("bg-surface-secondary");
    expect(wrapper).toHaveClass("border-b", "border-border-default");
  });

  it("should have proper padding and height", () => {
    const { container } = render(
      <WorkspaceStatusBar>
        <span>Child</span>
      </WorkspaceStatusBar>
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("min-h-[24px]", "px-3", "py-1");
  });
});
