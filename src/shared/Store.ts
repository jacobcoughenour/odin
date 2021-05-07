import { BrowserView } from "electron";

interface Bundle {
	[key: string]: string[];
}

export class Store {
	bundles: Bundle = null;

	// todo maybe we create a "registry" class to keep views and viewIndex in sync?
	views: { [key: string]: BrowserView } = null;
	viewIndex: string[] = null;

	activeViewID: string;

	constructor() {
		this.views = {};
		this.bundles = {};
		this.viewIndex = [];
	}

	getBrowserView(uuid: string) {
		return this.views[uuid];
	}

	getTabOrderIndex(uuid: string) {
		return this.viewIndex.indexOf(uuid);
	}
}
