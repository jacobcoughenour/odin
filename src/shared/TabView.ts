import { BrowserView } from "electron";
import { BrowserViewConstructorOptions } from "electron/main";

export type TabStatePayload = {
	url: string;
	title: string;
	is_loading: boolean;
	can_go_back: boolean;
	can_go_forward: boolean;
	theme_color: string;
	favicons: string[];
};

export type TabUpdatePayload = {
	uuid: string;
} & TabStatePayload;

export class TabView extends BrowserView {
	public favicons: string[] = [];
	public theme_color: string = "";

	constructor(options?: BrowserViewConstructorOptions) {
		super(options);

		// apply the prototype since we are inheriting a build-in type.
		// https://www.typescriptlang.org/docs/handbook/2/classes.html#inheriting-built-in-types
		Object.setPrototypeOf(this, TabView.prototype);
	}

	createTabStatePayload(): TabStatePayload {
		return {
			url: this.webContents.getURL(),
			title: this.webContents.getTitle(),
			is_loading: this.webContents.isLoading(),
			can_go_back: this.webContents.canGoBack(),
			can_go_forward: this.webContents.canGoForward(),
			theme_color: this.theme_color,
			favicons: this.favicons,
		};
	}
}
