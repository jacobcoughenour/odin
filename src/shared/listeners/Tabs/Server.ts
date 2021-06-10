import { BrowserView, BrowserWindow, ipcMain } from "electron";
import { createAndAddBrowserView } from "../../ViewService";
import { Listener } from "../Listener";
import { destroyBrowserView } from "../../ViewService";
import normalizeUrl from "normalize-url";
import isUrl from "is-url";
import { TabView, TabStatePayload } from "../../TabView";

/**
 * The payload sent on the tab-list channel.
 */
export type TabListPayload = {
	tabs: { [key: string]: TabStatePayload };
	tab_order: string[];
	active_tab_id: string;
};

// todo put the hydration stuff in it's own class

/**
 * The payload sent in response to the "hydrate" call.
 */
export type HydratePayload = {
	window_mode: "normal" | "maximized" | "fullscreen";
} & TabListPayload;

/**
 * Holds different IPC events that the main process
 * listens for.
 */
export class ServerListeners extends Listener {
	/**
	 * @returns TabListPayload for the current store.
	 */
	createTabListPayload(): TabListPayload {
		return {
			tabs: this.store.views.getKeys().reduce((tabs, id) => {
				const tab: TabView = this.store.getBrowserView(id);
				if (tab) tabs[id] = tab.createTabStatePayload();
				return tabs;
			}, {} as { [key: string]: TabStatePayload }),
			tab_order: this.store.views.getKeys(),
			active_tab_id: this.store.activeViewID,
		};
	}

	/**
	 * Send an updated tab-list payload to the window.
	 * Call this after you have made all your changes to the tabs state.
	 */
	sendTabsState() {
		this.mainWindow.webContents.send(
			"tab-list",
			this.createTabListPayload()
		);
	}

	sendTabState(id: string) {
		const view = this.store.views.get(id);

		view &&
			this.mainWindow.webContents.send("tab-update", {
				uuid: id,
				...view.createTabStatePayload(),
			});
	}

	getWindowMode() {
		if (this.mainWindow) {
			if (this.mainWindow.isFullScreen()) return "fullscreen";
			if (this.mainWindow.isMaximized()) return "maximized";
		}
		return "normal";
	}

	sendWindowModeUpdate() {
		this.mainWindow &&
			this.mainWindow.webContents &&
			this.mainWindow.webContents.send("window-mode-update", {
				window_mode: this.getWindowMode(),
			});
	}

	// todo should switchActiveTabID() and createTab() be here?

	/**
	 * Switches to the given tab ID. This swaps the the BrowserViews.
	 * You need to call sendTabsState() separately to inform the front-end.
	 * @param active_tab_id
	 */
	switchActiveTabID(active_tab_id: string): void {
		const next = this.store.getBrowserView(active_tab_id);
		if (!next) {
			console.error(
				"tried to set active tab to invalid id: " + active_tab_id
			);
			return;
		}

		// hide active view if one is active
		if (this.store.activeViewID) {
			const prev = this.store.getActiveView();
			prev && this.mainWindow.removeBrowserView(prev);
		}

		this.store.activeViewID = active_tab_id;
		this.mainWindow.addBrowserView(next);
	}

	createTab(): string {
		const tab = createAndAddBrowserView(
			this.mainWindow,
			"https://www.duckduckgo.com"
		);

		// register tab in store
		this.store.views.push(tab.uuid, tab.view);

		// todo we shouldn't make it active if it was opened with middle-click.

		this.switchActiveTabID(tab.uuid);
		return tab.uuid;
	}

	registerHandlers() {
		ipcMain.handle(
			"hydrate",
			(): HydratePayload => {
				return {
					window_mode: this.getWindowMode(),
					...this.createTabListPayload(),
				};
			}
		);
	}

	registerListeners() {
		ipcMain.on("set-active-tab-url", (_event, { url }) => {
			// get the active tab
			const active = this.store.getActiveView();

			try {
				if (!isUrl(normalizeUrl(url))) {
					url = `https://duckduckgo.com/?q=${url}`;
				}
			} catch (error) {
				url = `https://duckduckgo.com/?q=${url}`;
			}

			active &&
				active.webContents.loadURL(normalizeUrl(url), {
					// userAgent: "Chrome",
				});
		});

		ipcMain.on("navigate-back", () => {
			const active = this.store.getActiveView();
			active && active.webContents.goBack();
		});

		ipcMain.on("navigate-forward", () => {
			const active = this.store.getActiveView();
			active && active.webContents.goForward();
		});

		ipcMain.on("refresh-active-tab", () => {
			const active = this.store.getActiveView();
			active && active.webContents.reload();
		});

		ipcMain.on("stop-navigation", () => {
			const active = this.store.getActiveView();
			active && active.webContents.stop();
		});

		ipcMain.on("set-active-tab", (_event, args) => {
			this.switchActiveTabID(args.uuid);
			this.sendTabsState();
		});

		ipcMain.on("new-tab", () => {
			this.createTab();
			// send new state
			this.sendTabsState();
		});

		ipcMain.on("close-tab", (_event, args) => {
			let uuidIndex: number = this.store.getTabOrderIndex(args.uuid);
			const view = this.store.getBrowserView(args.uuid);

			// unregister from view lists
			this.store.views.remove(args.uuid);

			// Destroys all listeners attached to the window
			destroyBrowserView(view);

			// close window if last tab
			if (this.store.views.length === 0) {
				this.app.quit();
				return;
			}

			// Gets next available tab
			uuidIndex = Math.min(uuidIndex, this.store.views.length - 1);

			// updates activeViewID to become the tab that
			// is active after one is closed
			this.store.activeViewID = this.store.views.getByIndex(uuidIndex);

			// Switch to next tab
			this.switchActiveTabID(this.store.views.getByIndex(uuidIndex));

			// Send new tab list
			this.sendTabsState();
		});

		ipcMain.on("minimize-window", () => this.mainWindow.minimize());
		ipcMain.on("maximize-window", () => this.mainWindow.maximize());
		ipcMain.on("restore-window", () => this.mainWindow.restore());
		ipcMain.on("close-window", () => this.mainWindow.close());
		this.mainWindow.on("minimize", () => this.sendWindowModeUpdate());
		this.mainWindow.on("maximize", () => this.sendWindowModeUpdate());
		this.mainWindow.on("restore", () => this.sendWindowModeUpdate());
		this.mainWindow.on("enter-full-screen", () =>
			this.sendWindowModeUpdate()
		);
		this.mainWindow.on("leave-full-screen", () =>
			this.sendWindowModeUpdate()
		);

		ipcMain.on("update-browser-view-bounds", (event, args) => {
			// get the window we received the event from
			const window = BrowserWindow.fromWebContents(event.sender);

			var views = window.getBrowserViews();

			// Default BrowserView if none exists
			if (views.length === 0) {
				// First BrowserView, so overwrite default value from client
				args.id = this.createTab();
				this.sendTabsState();
			}

			const { id, x, y, w, h } = args;

			// Resize active one first
			if (id in this.store.views.getMap()) {
				// update view bounds
				this.store.views
					.get(id)
					.setBounds({ x, y, width: w, height: h });
			} else {
				console.error("invalid view id received: " + id);
			}

			this.store.views.getKeys().map((key) => {
				if (key === id) return;
				else {
					this.store.views.get(key).setBounds({
						x,
						y,
						width: w,
						height: h,
					});
				}
			});
		});
	}
}
