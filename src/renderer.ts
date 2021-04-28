/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 */

import "./index.css";
import "normalize-url";
import normalizeUrl from "normalize-url";

function select<T extends HTMLElement>(selector: string): T {
	return document.querySelector(selector) as T;
}

const HOMEPAGE = "https://duckduckgo.com";

const nav_back_button = select<HTMLButtonElement>("#nav-back-button");
const nav_forward_button = select<HTMLButtonElement>("#nav-forward-button");
const nav_refresh_button = select<HTMLButtonElement>("#nav-refresh-button");
const url_input = select<HTMLInputElement>("#url-input");
const main_webview = select<Electron.WebviewTag>("#main-webview");

function navigateTo(url: string) {
	// normalize url (like add https and www stuff)
	url = normalizeUrl(url, { forceHttps: true });

	// update input field
	url_input.value = url;

	// update webview
	main_webview.src = url;
}

// setup input listeners

// todo
nav_back_button.addEventListener("click", () => {});
nav_forward_button.addEventListener("click", () => {});

nav_refresh_button.addEventListener("click", () => {
	// just navigate again for now
	// todo
	navigateTo(url_input.value);
});

url_input.addEventListener("keydown", (event) => {
	if (event.code === "Enter") {
		navigateTo(url_input.value);
	}
});

// go to the homepage on startup
navigateTo(HOMEPAGE);
