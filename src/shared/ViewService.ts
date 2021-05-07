import { BrowserView, BrowserWindow, systemPreferences } from "electron";
import { uuid } from 'uuidv4';
/**
 * Responsible for managing acitons in the main process
 * such as creating and destorying brower views
 */

export function createBrowserView(mainWindow : BrowserWindow) {
	const view = new BrowserView({});

	mainWindow.addBrowserView(view);

	view.webContents.loadURL('https://duckduckgo.com');

	subscribeBrowserView(view, mainWindow);

	return {
		uuid: uuid(),
		url: view.webContents.getURL,
		title: view.webContents.getTitle(),
		view: view
	}
}

function subscribeBrowserView(view : BrowserView, mainWindow : BrowserWindow){
	view.webContents.on("will-navigate", (e, url) => {

		mainWindow.webContents.send('url-update', {
			url: url,
			title: view.webContents.getTitle()
		});
	});
}

export function destoryBrowserView(view: BrowserView) {

	let pid : number = view.webContents.getOSProcessId();

	view = null;

	process.kill(pid);
}