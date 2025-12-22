import { vi } from "vitest";

const addListener = vi.fn<(callback: (tab: chrome.tabs.Tab) => void) => void>();
const setBadgeBackgroundColor = vi.fn<
	(details: chrome.action.BadgeBackgroundColorDetails) => Promise<void>
>(() => Promise.resolve());
const setBadgeText = vi.fn<
	(details: chrome.action.BadgeTextDetails) => Promise<void>
>(() => Promise.resolve());
const storageGet = vi.fn<
	(
		keys?: string | string[] | chrome.storage.StorageSyncGetFilter,
	) => Promise<Record<string, unknown>>
>(() => Promise.resolve({}));
const storageSet = vi.fn<(items: Record<string, unknown>) => Promise<void>>(
	() => Promise.resolve(),
);
const openOptionsPage = vi.fn<[], Promise<void>>(() => Promise.resolve());

const stubbedChrome = {
	action: {
		onClicked: {
			addListener,
		},
		setBadgeBackgroundColor,
		setBadgeText,
	},
	storage: {
		sync: {
			get: storageGet,
			set: storageSet,
		},
	},
	runtime: {
		openOptionsPage,
	},
} satisfies Partial<typeof chrome>;

vi.stubGlobal("chrome", stubbedChrome);
