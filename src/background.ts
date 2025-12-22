import { type HandlerDependencies, handleActionClick } from "./actionHandler";

const BOOKMARK_API_ENDPOINT =
	"https://api.pokke.femto-cloud.com/api/v1/bookmarks.create";

const showBadge = async (
	text: string,
	color: [number, number, number, number],
): Promise<void> => {
	try {
		await globalThis.chrome.action.setBadgeBackgroundColor({ color });
		await globalThis.chrome.action.setBadgeText({ text });
		globalThis.setTimeout(() => {
			globalThis.chrome.action
				.setBadgeText({ text: "" })
				.catch(() => undefined);
		}, 2000);
	} catch (error) {
		console.error("Failed to show badge:", error);
		// Ignore badge rendering errors in environments without the action API
	}
};

const setBadge = async (
	text: string,
	color: [number, number, number, number],
): Promise<void> => {
	try {
		await globalThis.chrome.action.setBadgeBackgroundColor({ color });
		await globalThis.chrome.action.setBadgeText({ text });
	} catch (error) {
		console.error("Failed to set badge:", error);
	}
};

const readTrimmedString = (value: unknown): string | undefined => {
	if (typeof value !== "string") {
		return undefined;
	}
	const trimmedValue = value.trim();
	return trimmedValue.length === 0 ? undefined : trimmedValue;
};

const createDependencies = (): HandlerDependencies => ({
	getApiKey: async () => {
		try {
			const result = await globalThis.chrome.storage.sync.get("apiKey");
			return readTrimmedString(result.apiKey);
		} catch (error) {
			console.error("Failed to retrieve API key from storage:", error);
			return undefined;
		}
	},
	getWorkspaceId: async () => {
		try {
			const result = await globalThis.chrome.storage.sync.get("workspaceId");
			return readTrimmedString(result.workspaceId);
		} catch (error) {
			console.error("Failed to retrieve workspace ID from storage:", error);
			return undefined;
		}
	},
	createBookmark: async (url, apiKey, workspaceId) => {
		try {
			const response = await globalThis.fetch(BOOKMARK_API_ENDPOINT, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${apiKey}`,
				},
				body: JSON.stringify({
					url,
					workspaceId,
				}),
			});
			if (!response.ok) {
				console.error(
					"API request failed:",
					response.status,
					response.statusText,
				);
				throw new Error("Failed to create bookmark");
			}
		} catch (error) {
			console.error("An error occurred during fetch:", error);
			if (error instanceof Error) {
				throw error;
			}
			throw new Error("Failed to create bookmark");
		}
	},
	showInProgress: async () => setBadge("…", [59, 130, 246, 255]),
	clearInProgress: async () => setBadge("", [59, 130, 246, 0]),
	notifyMissingApiKey: () => showBadge("KEY", [234, 179, 8, 255]),
	notifyMissingWorkspace: () => showBadge("WS", [234, 179, 8, 255]),
	notifySuccess: () => showBadge("OK", [16, 185, 129, 255]),
	notifyFailure: () => showBadge("ERR", [239, 68, 68, 255]),
	openOptionsPage: async () => {
		try {
			await globalThis.chrome.runtime.openOptionsPage();
		} catch (error) {
			console.error("Failed to open options page:", error);
		}
	},
});

const defaultDependencies = createDependencies();

globalThis.chrome.action.onClicked.addListener((tab) => {
	handleActionClick(tab, defaultDependencies).catch(() => undefined);
});
