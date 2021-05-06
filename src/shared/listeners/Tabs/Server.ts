import { App, BrowserWindow, ipcMain } from 'electron';
import { createBrowserView } from '../../ViewService';
import { Listener } from '../Listener';

/**
 * Holds different IPC events that the main process
 * listens for
 */
export class ServerListeners extends Listener {

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
					title: this.store.views[key].webContents.getTitle(),
					url: this.store.views[key].webContents.getURL()
				}
			});

			this.mainWindow.webContents.send('tab-list', {
				tabs: payload
			});

		});

		ipcMain.on('close-tab', (event, args) => {
			// Destroys all listeners attached to the window
			this.store.views[args.uuid] = null;

			delete this.store.views[args.uuid];

			this.mainWindow.webContents.send('tab-list', {
				tabs: Object.keys(this.store.views).map(key => {
					return {
						uuid: key,
						title: this.store.views[key].webContents.getTitle(),
						url: this.store.views[key].webContents.getURL()
					};
				}),
			})

			if (Object.keys(this.store.views).length === 0) {
				this.app.quit();
			}

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
							title: this.store.views[key].webContents.getTitle(),
							url: this.store.views[key].webContents.getURL()
						};
					}),
				});

			}

			const { id, x, y, w, h } = args;

			// Resize active one first
			if ( (id in this.store.views) ) {
				// update view bounds
				this.store.views[id].setBounds({ x, y, width: w, height: h });
			} else {
				console.error("invalid view id received: " + id);
			}

			Object.keys(this.store.views).map(key => {
				if (key === id) return;
				else {
					this.store.views[key].setBounds({
						x,
						y,
						width: w,
						height:h
					});
				}
			});
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