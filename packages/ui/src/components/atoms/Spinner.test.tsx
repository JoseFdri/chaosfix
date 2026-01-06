import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Spinner } from "./Spinner.atom";

describe("Spinner", () => {
  it("should render with default size", () => {
    render(<Spinner />);
    const spinner = screen.getByRole("status");

    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("w-4", "h-4");
  });

  it("should render with xs size", () => {
    render(<Spinner size="xs" />);
    const spinner = screen.getByRole("status");

    expect(spinner).toHaveClass("w-3", "h-3");
  });

  it("should render with sm size", () => {
    render(<Spinner size="sm" />);
    const spinner = screen.getByRole("status");

    expect(spinner).toHaveClass("w-4", "h-4");
  });

  it("should render with md size", () => {
    render(<Spinner size="md" />);
    const spinner = screen.getByRole("status");

    expect(spinner).toHaveClass("w-5", "h-5");
  });

  it("should apply custom className", () => {
    render(<Spinner className="custom-class" />);
    const spinner = screen.getByRole("status");

    expect(spinner).toHaveClass("custom-class");
  });

  it("should have accessibility attributes", () => {
    render(<Spinner />);
    const spinner = screen.getByRole("status");

    expect(spinner).toHaveAttribute("role", "status");
    expect(spinner).toHaveAttribute("aria-label", "Loading");
  });

  it("should include animation class", () => {
    render(<Spinner />);
    const spinner = screen.getByRole("status");

    expect(spinner).toHaveClass("animate-spin");
  });
});
