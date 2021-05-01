import { app, BrowserWindow, BrowserView, Rectangle } from "electron";

import { ipcMain } from "electron";

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
	// eslint-disable-line global-require
	app.quit();
}

var mainWindow: BrowserWindow = null;

const createWindow = (): void => {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		height: 600,
		width: 800,
		frame: false,
		webPreferences: {
			plugins: true,
			nodeIntegration: true,
			contextIsolation: false,
			enableRemoteModule: true,
		},
		backgroundColor: "#333333",
	});

	// and load the index.html of the app.
	mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

	// Open the DevTools.
	if (process.env.NODE_ENV === "development")
		mainWindow.webContents.openDevTools();
};

ipcMain.on("new-tab", (event, args) => {
	const view = new BrowserView({});

	// todo maybe this should be addBrowserView?
	mainWindow.addBrowserView(view);

	// x is temp
	// view.setBounds({
	// 	x: 0,
	// 	y: 60,
	// 	width: args.width,
	// 	height: args.height,
	// });
	view.webContents.loadURL(args.url);

ipcMain.on('refresh', () => {
	mainWindow.reload()
})

ipcMain.on("update-browser-view-bounds", (event, args) => {
	// get the window we received the event from
	const window = BrowserWindow.fromWebContents(event.sender);
	const views = window.getBrowserViews();

	// todo this doesn't work

	const { id, x, y, w, h } = args;

	if (id >= 0 && id < views.length) {
		// update view bounds
		views[id].setBounds({ x, y, width: w, height: h });
	} else {
		console.error("invalid view id received");
	}
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
