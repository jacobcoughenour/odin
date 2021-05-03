import { BrowserView, BrowserWindow } from "electron";
import { uuid } from 'uuidv4';
/**
 * Responsible for managing acitons in the main process
 * such as creating and destorying brower views
 */

export function createBrowserView(mainWindow : BrowserWindow) {
	const view = new BrowserView({});

	mainWindow.addBrowserView(view);

	view.webContents.loadURL('https://duckduckgo.com');

	return {
		uuid: uuid(),
		view: view
	}
}