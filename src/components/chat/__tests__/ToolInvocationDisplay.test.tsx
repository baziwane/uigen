import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationDisplay } from "../ToolInvocationDisplay";

afterEach(() => {
  cleanup();
});

test("shows 'Creating' message for str_replace_editor create command", () => {
  render(
    <ToolInvocationDisplay
      toolInvocation={{
        toolName: "str_replace_editor",
        args: { command: "create", path: "/components/Button.jsx" },
        state: "result",
        result: "Success",
      }}
    />
  );

  expect(screen.getByText("Creating /components/Button.jsx")).toBeDefined();
});

test("shows 'Editing' message for str_replace_editor str_replace command", () => {
  render(
    <ToolInvocationDisplay
      toolInvocation={{
        toolName: "str_replace_editor",
        args: { command: "str_replace", path: "/App.jsx" },
        state: "result",
        result: "Success",
      }}
    />
  );

  expect(screen.getByText("Editing /App.jsx")).toBeDefined();
});

test("shows 'Editing' message for str_replace_editor insert command", () => {
  render(
    <ToolInvocationDisplay
      toolInvocation={{
        toolName: "str_replace_editor",
        args: { command: "insert", path: "/utils/helpers.ts" },
        state: "result",
        result: "Success",
      }}
    />
  );

  expect(screen.getByText("Editing /utils/helpers.ts")).toBeDefined();
});

test("shows 'Reading' message for str_replace_editor view command", () => {
  render(
    <ToolInvocationDisplay
      toolInvocation={{
        toolName: "str_replace_editor",
        args: { command: "view", path: "/README.md" },
        state: "result",
        result: "file content",
      }}
    />
  );

  expect(screen.getByText("Reading /README.md")).toBeDefined();
});

test("shows 'Renaming' message for file_manager rename command", () => {
  render(
    <ToolInvocationDisplay
      toolInvocation={{
        toolName: "file_manager",
        args: { command: "rename", path: "/old.jsx", new_path: "/new.jsx" },
        state: "result",
        result: { success: true },
      }}
    />
  );

  expect(screen.getByText("Renaming /old.jsx")).toBeDefined();
});

test("shows 'Deleting' message for file_manager delete command", () => {
  render(
    <ToolInvocationDisplay
      toolInvocation={{
        toolName: "file_manager",
        args: { command: "delete", path: "/temp.txt" },
        state: "result",
        result: { success: true },
      }}
    />
  );

  expect(screen.getByText("Deleting /temp.txt")).toBeDefined();
});

test("falls back to tool name for unknown tool", () => {
  render(
    <ToolInvocationDisplay
      toolInvocation={{
        toolName: "unknown_tool",
        args: {},
        state: "result",
        result: "done",
      }}
    />
  );

  expect(screen.getByText("unknown_tool")).toBeDefined();
});

test("falls back to tool name for unknown command", () => {
  render(
    <ToolInvocationDisplay
      toolInvocation={{
        toolName: "str_replace_editor",
        args: { command: "unknown_command" },
        state: "result",
        result: "done",
      }}
    />
  );

  expect(screen.getByText("str_replace_editor")).toBeDefined();
});

test("shows green dot when state is 'result' with result", () => {
  const { container } = render(
    <ToolInvocationDisplay
      toolInvocation={{
        toolName: "str_replace_editor",
        args: { command: "create", path: "/test.jsx" },
        state: "result",
        result: "Success",
      }}
    />
  );

  const greenDot = container.querySelector(".bg-emerald-500");
  expect(greenDot).toBeDefined();
});

test("shows spinner when state is not 'result'", () => {
  const { container } = render(
    <ToolInvocationDisplay
      toolInvocation={{
        toolName: "str_replace_editor",
        args: { command: "create", path: "/test.jsx" },
        state: "pending",
      }}
    />
  );

  const spinner = container.querySelector(".animate-spin");
  expect(spinner).toBeDefined();
});

test("shows spinner when state is 'result' but no result value", () => {
  const { container } = render(
    <ToolInvocationDisplay
      toolInvocation={{
        toolName: "str_replace_editor",
        args: { command: "create", path: "/test.jsx" },
        state: "result",
        result: undefined,
      }}
    />
  );

  const spinner = container.querySelector(".animate-spin");
  expect(spinner).toBeDefined();
});

test("handles missing args gracefully", () => {
  render(
    <ToolInvocationDisplay
      toolInvocation={{
        toolName: "str_replace_editor",
        args: {},
        state: "result",
        result: "done",
      }}
    />
  );

  // Should fall back to tool name when no command
  expect(screen.getByText("str_replace_editor")).toBeDefined();
});
