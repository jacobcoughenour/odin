import { OrderedMap } from "./OrderedMap";
import { TabView } from "./TabView";

interface Bundle {
	[key: string]: string[];
}

export class Store {
	bundles: Bundle = null;

	views: OrderedMap<TabView> = null;

	activeViewID: string;

	constructor() {
		// this.views = {};
		this.bundles = {};
		// this.viewIndex = [];
		this.views = new OrderedMap<TabView>();
	}

	getBrowserView(uuid: string) {
		return this.views.get(uuid);
	}

	getTabOrderIndex(uuid: string) {
		return this.views.getLocationOfKey(uuid);
	}

	getActiveView() {
		const active = this.views.get(this.activeViewID);
		if (!active) {
			console.error("active view id is invalid: " + this.activeViewID);
			return null;
		}
		return active;
	}
}
