import { App, BrowserWindow } from "electron";
import { Store } from "../Store";

/**
 * Used to keep instances hold instance of store, main window, and app
 *  for child listeners to use.
 */
export abstract class Listener {
	mainWindow: BrowserWindow = null;
	store: Store = null;
	app: App = null;

	constructor(mainWindow: BrowserWindow, app: App) {
		this.mainWindow = mainWindow;
		this.app = app;
		this.store = new Store();
	}

	registerListeners(): void {}
	registerHandlers(): void {}
}
