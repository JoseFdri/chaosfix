import { type ReactElement } from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBarItem } from "./StatusBarItem.atom";

describe("StatusBarItem", () => {
  const TestIcon = (): ReactElement => <span data-testid="test-icon">icon</span>;

  it("should render icon and label correctly", () => {
    render(<StatusBarItem icon={<TestIcon />} label="Test Label" />);

    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const { container } = render(
      <StatusBarItem icon={<TestIcon />} label="Test" className="custom-class" />
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("custom-class");
  });

  it("should have aria-hidden on the icon wrapper", () => {
    const { container } = render(<StatusBarItem icon={<TestIcon />} label="Test Label" />);

    const iconWrapper = container.querySelector('[aria-hidden="true"]');
    expect(iconWrapper).toBeInTheDocument();
    expect(iconWrapper).toContainElement(screen.getByTestId("test-icon"));
  });

  it("should apply flex layout styling", () => {
    const { container } = render(<StatusBarItem icon={<TestIcon />} label="Test" />);

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("flex", "items-center", "gap-1.5");
  });

  it("should render label with correct text styling", () => {
    render(<StatusBarItem icon={<TestIcon />} label="Styled Label" />);

    const label = screen.getByText("Styled Label");
    expect(label).toHaveClass("text-xs", "text-text-muted");
  });
});
