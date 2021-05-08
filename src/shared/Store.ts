import { BrowserView } from "electron";
import { OrderedMap } from './OrderedMap';

interface Bundle {
	[key: string]: string[];
}

export class Store {

	bundles: Bundle = null;

	views: OrderedMap = null;

	activeViewID: string;

	constructor() {
		// this.views = {};
		this.bundles = {};
		// this.viewIndex = [];
		this.views = new OrderedMap();
	}

	getBrowserView(uuid: string) {
		return this.views.get(uuid);
	}

	getTabOrderIndex(uuid: string) {
		return this.views.getLocationOfKey(uuid);
	}
}
