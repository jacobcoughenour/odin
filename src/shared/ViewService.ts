import { BrowserView, BrowserWindow } from "electron";
import { v4 as uuid } from "uuid";
/**
 * Responsible for managing actions in the main process
 * such as creating and destroying browser views
 */

export function createAndAddBrowserView(
	mainWindow: BrowserWindow,
	url: string
) {
	const view = new BrowserView({});

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
	view: BrowserView,
	mainWindow: BrowserWindow
) {
	const sendURLUpdate = () => {
		mainWindow.webContents.send("url-update", {
			uuid: uuid,
			url: view.webContents.getURL(),
			title: view.webContents.getTitle(),
		});
	};
	view.webContents.on("will-navigate", sendURLUpdate);
	view.webContents.on("did-navigate", sendURLUpdate);
	view.webContents.on("page-title-updated", sendURLUpdate);

	view.webContents.on("before-input-event", (event, input) => {
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

export function destroyBrowserView(view: BrowserView) {
	let pid: number = view.webContents.getOSProcessId();
	process.kill(pid);
}
