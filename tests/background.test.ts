/// <reference types="vitest" />

import { beforeEach, describe, expect, test, vi } from "vitest";

import {
  type HandlerDependencies,
  handleActionClick,
} from "../src/actionHandler";

const createMockDependencies = (
  overrides: Partial<HandlerDependencies> = {}
): HandlerDependencies => {
  const defaults = {
    getApiKey: vi.fn(async (): Promise<string | undefined> => "api-key"),
    getWorkspaceId: vi.fn(
      async (): Promise<string | undefined> => "workspace-id"
    ),
    createBookmark: vi.fn(
      async (
        _url: string,
        _apiKey: string,
        _workspaceId: string
      ): Promise<void> => undefined
    ),
    showInProgress: vi.fn(async (): Promise<void> => undefined),
    clearInProgress: vi.fn(async (): Promise<void> => undefined),
    notifyMissingApiKey: vi.fn(async (): Promise<void> => undefined),
    notifyMissingWorkspace: vi.fn(async (): Promise<void> => undefined),
    notifySuccess: vi.fn(async (): Promise<void> => undefined),
    notifyFailure: vi.fn(async (): Promise<void> => undefined),
    openOptionsPage: vi.fn(async (): Promise<void> => undefined),
  } satisfies HandlerDependencies;

  return {
    ...defaults,
    ...overrides,
  } satisfies HandlerDependencies;
};

describe("handleActionClick", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("ignores tabs without a URL", async () => {
    const dependencies = createMockDependencies();
    const tab: Parameters<typeof handleActionClick>[0] = {};

    await handleActionClick(tab, dependencies);

    expect(dependencies.getApiKey).not.toHaveBeenCalled();
  });

  test("ignores unsupported URL protocols", async () => {
    const dependencies = createMockDependencies();
    const tab: Parameters<typeof handleActionClick>[0] = {
      url: "chrome://extensions",
    };

    await handleActionClick(tab, dependencies);

    expect(dependencies.getApiKey).not.toHaveBeenCalled();
  });

  test("opens the options page when API key is missing", async () => {
    const notifyMissingApiKey = vi.fn(async (): Promise<void> => undefined);
    const openOptionsPage = vi.fn(async (): Promise<void> => undefined);
    const dependencies = createMockDependencies({
      getApiKey: vi.fn(async (): Promise<string | undefined> => undefined),
      notifyMissingApiKey,
      openOptionsPage,
    });
    const tab: Parameters<typeof handleActionClick>[0] = {
      url: "https://example.com/path",
    };

    await handleActionClick(tab, dependencies);

    expect(notifyMissingApiKey).toHaveBeenCalledTimes(1);
    expect(openOptionsPage).toHaveBeenCalledTimes(1);
    expect(dependencies.createBookmark).not.toHaveBeenCalled();
  });

  test("opens the options page when workspace ID is missing", async () => {
    const notifyMissingWorkspace = vi.fn(async (): Promise<void> => undefined);
    const openOptionsPage = vi.fn(async (): Promise<void> => undefined);
    const dependencies = createMockDependencies({
      getWorkspaceId: vi.fn(async (): Promise<string | undefined> => undefined),
      notifyMissingWorkspace,
      openOptionsPage,
    });
    const tab: Parameters<typeof handleActionClick>[0] = {
      url: "https://example.com/path",
    };

    await handleActionClick(tab, dependencies);

    expect(notifyMissingWorkspace).toHaveBeenCalledTimes(1);
    expect(openOptionsPage).toHaveBeenCalledTimes(1);
    expect(dependencies.createBookmark).not.toHaveBeenCalled();
  });

  test("creates a bookmark and notifies success", async () => {
    const createBookmark = vi.fn(async (): Promise<void> => undefined);
    const notifySuccess = vi.fn(async (): Promise<void> => undefined);
    const dependencies = createMockDependencies({
      createBookmark,
      notifySuccess,
    });
    const tab: Parameters<typeof handleActionClick>[0] = {
      url: "https://example.com/path",
    };

    await handleActionClick(tab, dependencies);

    expect(createBookmark).toHaveBeenCalledWith(
      "https://example.com/path",
      "api-key",
      "workspace-id"
    );
    expect(notifySuccess).toHaveBeenCalledTimes(1);
    expect(dependencies.notifyFailure).not.toHaveBeenCalled();
  });

  test("notifies failure when bookmark creation fails", async () => {
    const notifyFailure = vi.fn(async (): Promise<void> => undefined);
    const dependencies = createMockDependencies({
      createBookmark: vi.fn(async () => Promise.reject(new Error("failure"))),
      notifyFailure,
    });
    const tab: Parameters<typeof handleActionClick>[0] = {
      url: "https://example.com/path",
    };

    await handleActionClick(tab, dependencies);

    expect(notifyFailure).toHaveBeenCalledTimes(1);
    expect(dependencies.notifySuccess).not.toHaveBeenCalled();
  });
});
