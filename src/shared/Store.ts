import { BrowserView } from "electron";


interface Bundle {
	[key: string]: string[]
}

export class Store {
	views: {[key: string]: BrowserView } = null;
	bundles: Bundle = null;
	viewIndex: string[] = null;

	constructor() {
		this.views = {};
		this.bundles = {};
		this.viewIndex = [];
	}

	getBrowserView(uuid : string) {
		return this.views[uuid];
	}

	getViewIndex(uuid: string) {
		return this.viewIndex.indexOf(uuid);
	}


}