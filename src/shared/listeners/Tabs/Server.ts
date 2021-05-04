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

			this.store.views[data.uuid] = data.view;
			this.mainWindow.setTopBrowserView(data.view);

			this.mainWindow.webContents.send('updateViewId', {
				viewid: data.uuid
			});

			const payload = Object.keys(this.store.views).map(key => {
				return {
					uuid: key,
					title: key
				}
			});

			this.mainWindow.webContents.send('tab-list', {
				tabs: payload
			});

		});

		ipcMain.on('close-tab', (event, args) => {
			delete this.store.views[args.uuid];

			this.mainWindow.webContents.send('tab-list', {
				tabs: Object.keys(this.store.views).map(key => {
					return {
						uuid: key,
						title: key
					};
				}),
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

				this.mainWindow.webContents.send('tab-list', {
					tabs: Object.keys(this.store.views).map(key => {
						return {
							uuid: key,
							title: key
						};
					}),
				});

			}

			const { id, x, y, w, h } = args;

			if ( (id in this.store.views) ) {
				// update view bounds
				this.store.views[id].setBounds({ x, y, width: w, height: h });
			} else {
				console.error("invalid view id received: " + id);
			}
		});

		ipcMain.on("render-existing", (event, args) => {
			this.mainWindow.setTopBrowserView(this.store.views[args.uuid]);
		});

		// todo tabs on start up
		// ipcMain.on("startup", (event, args) => {
		// 	const data = createBrowserView(this.mainWindow);
		// 	this.store.views[data.uuid] = data.view;
		// 	// First BrowserView, so overwrite default value from client
		// 	args.id = data.uuid;

		// 	this.mainWindow.webContents.send('updateViewId', {
		// 		viewid: data.uuid
		// 	})
		// 	this.mainWindow.webContents.send('tab-list', {
		// 		tabs: Object.keys(this.store.views).map(key => {
		// 			return {
		// 				uuid: key,
		// 				title: key
		// 			};
		// 		}),
		// 	});


		// });


	}

	registerListeners(){
		this.registerTabListeners();
	}
}