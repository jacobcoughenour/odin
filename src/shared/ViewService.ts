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
}

export function destroyBrowserView(view: BrowserView) {
	let pid: number = view.webContents.getOSProcessId();
	process.kill(pid);
}
