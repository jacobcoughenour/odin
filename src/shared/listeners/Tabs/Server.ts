import { BrowserWindow, ipcMain } from 'electron';
import { Store } from '../../Store';
import { createBrowserView } from '../../ViewService';

/**
 * Holds different IPC events that the main process
 * listens for
 */
export class ServerListeners {
	mainWindow: BrowserWindow = null;
	store: Store = null;

	constructor(mainWindow: BrowserWindow) {
		this.mainWindow = mainWindow;
		this.store = new Store();
	}
	// todo Move stuff out / helper functions ex:for creating new tab
	registerTabListeners(){

		ipcMain.on('refresh', () => {
			this.mainWindow.reload()
		})

		ipcMain.on('new-tab', () => {
			const data = createBrowserView(this.mainWindow);
			console.log(data)
			this.store.views[data.uuid] = data.view;
			this.mainWindow.setTopBrowserView(data.view);

			this.mainWindow.webContents.send('updateViewId', {
				viewid: data.uuid
			})
		});

		ipcMain.on("update-browser-view-bounds", (event, args) => {
			// get the window we received the event from
			const window = BrowserWindow.fromWebContents(event.sender);

			var views = window.getBrowserViews();

			// Default browserview if none exist
			if (views.length === 0) {

				const data = createBrowserView(this.mainWindow);
				this.store.views[data.uuid] = data.view;
				// First BrowserView, so overwrite default value from client
				args.id = data.uuid;

				this.mainWindow.webContents.send('updateViewId', {
					viewid: data.uuid
				})

			}

			const { id, x, y, w, h } = args;

			if ( (id in this.store.views) ) {
				// update view bounds
				this.store.views[id].setBounds({ x, y, width: w, height: h });
			} else {
				console.error("invalid view id received");
			}
		});

	}

	registerListeners(){
		this.registerTabListeners();
	}
}