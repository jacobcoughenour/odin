import { BrowserView, BrowserWindow } from "electron";
import { v4 as uuid } from "uuid";
import { ServerListeners } from "./listeners";
import { TabView } from "./TabView";
/**
 * Responsible for managing actions in the main process
 * such as creating and destroying browser views
 */

// todo move this to TabView?

export function createAndAddBrowserView(
	mainWindow: BrowserWindow,
	url: string
) {
	const view = new TabView({});

	mainWindow.addBrowserView(view);

	const id = uuid();
	subscribeBrowserView(id, view, mainWindow);

	view.webContents.loadURL(url);

	return {
		uuid: id,
		url: view.webContents.getURL,
		title: view.webContents.getTitle(),
		view: view,
	};
}

function subscribeBrowserView(
	uuid: string,
	view: TabView,
	mainWindow: BrowserWindow
) {
	const sendTabState = () => {
		mainWindow.webContents.send("tab-update", {
			uuid,
			...view.createTabStatePayload,
		});
	};

	const sendMediaUpdate = () => {
		// todo
	};

	view.webContents
		.on("will-navigate", sendTabState)
		.on("will-redirect", sendTabState)
		.on("did-navigate", sendTabState)
		.on("did-start-navigation", sendTabState)
		.on("did-redirect-navigation", sendTabState)
		.on("page-title-updated", sendTabState)
		.on("did-fail-load", sendTabState)
		.on("did-fail-provisional-load", sendTabState)
		.on("did-stop-loading", sendTabState)
		.on("did-start-loading", sendTabState)
		.on("did-start-loading", sendTabState)
		.on("media-paused", sendMediaUpdate)
		.on("media-started-playing", sendMediaUpdate)
		.on("update-target-url", (_event, url) => {
			// todo
			// this is when you hover over a link.
			// it should give a tooltip in the bottom left of the link url.
		})
		.on("page-favicon-updated", (_event, favicons) => {
			view.favicons = favicons;
			sendTabState();
		})
		.on("did-change-theme-color", (_event, color) => {
			view.theme_color = color;
			sendTabState();
		})
		.on("before-input-event", (event, input) => {
			// devtool shortcuts

			if (input.control && input.shift) {
				// toggle devtools
				if (input.key === "I" || input.key === "J") {
					// toggle developer tools within this tab.
					view.webContents.toggleDevTools();
					// prevent renderer devtools from toggling.
					event.preventDefault();
				}
				// Ctrl+Shift+c = devtools inspect element
				else if (input.key === "C") {
					// todo get mouse position relative to the page
					view.webContents.inspectElement(0, 0);
				}
			} else {
				// toggle devtools
				if (input.key === "F12") {
					// toggle developer tools within this tab.
					view.webContents.toggleDevTools();
					// prevent renderer devtools from toggling.
					event.preventDefault();
				}
			}
		});
}

export function destroyBrowserView(view: TabView) {
	let pid: number = view.webContents.getOSProcessId();
	process.kill(pid);
}
