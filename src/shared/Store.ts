import { BrowserView } from "electron";


interface Bundle {
	[key: string]: string[]
}

export class Store {
	views: {[key: string]: BrowserView } = null;
	bundles: Bundle = null;

	constructor() {
		this.views = {};
		this.bundles = {};
	}

	getBrowserView(uuid : string) {
		return this.views[uuid];
	}


}