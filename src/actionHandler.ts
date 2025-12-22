const supportedProtocols = new Set(["http:", "https:"]);

const normalizeHttpUrl = (rawUrl: string): string | undefined => {
	try {
		const parsedUrl = new URL(rawUrl);
		return supportedProtocols.has(parsedUrl.protocol)
			? parsedUrl.toString()
			: undefined;
	} catch {
		return undefined;
	}
};

export type HandlerDependencies = {
	getApiKey: () => Promise<string | undefined>;
	getWorkspaceId: () => Promise<string | undefined>;
	createBookmark: (
		url: string,
		apiKey: string,
		workspaceId: string,
	) => Promise<void>;
	showInProgress: () => Promise<void>;
	clearInProgress: () => Promise<void>;
	notifyMissingApiKey: () => Promise<void>;
	notifyMissingWorkspace: () => Promise<void>;
	notifySuccess: () => Promise<void>;
	notifyFailure: () => Promise<void>;
	openOptionsPage: () => Promise<void>;
};

type ClickedTab = {
	readonly url?: string | undefined;
};

export const handleActionClick = async (
	tab: ClickedTab,
	dependencies: HandlerDependencies,
): Promise<void> => {
	const tabUrl = tab.url;
	if (typeof tabUrl !== "string") {
		return;
	}
	const normalizedUrl = normalizeHttpUrl(tabUrl);
	if (!normalizedUrl) {
		return;
	}
	const apiKey = await dependencies.getApiKey();
	if (!apiKey) {
		await dependencies.notifyMissingApiKey();
		await dependencies.openOptionsPage();
		return;
	}
	const workspaceId = await dependencies.getWorkspaceId();
	if (!workspaceId) {
		await dependencies.notifyMissingWorkspace();
		await dependencies.openOptionsPage();
		return;
	}
	try {
		await dependencies.showInProgress();
		await dependencies.createBookmark(normalizedUrl, apiKey, workspaceId);
		await dependencies.notifySuccess();
	} catch (error) {
		console.error("Failed to save bookmark:", error);
		await dependencies.notifyFailure();
	}
};
