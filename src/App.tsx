import * as React from 'react';
import * as ReactDOM from 'react-dom';

import normalizeUrl from "normalize-url";

import "./index.css";
import { WebviewTag } from 'electron';


type AppProps = {};

type AppState = {
	url: string
	homepage: string
}

export class App extends React.Component<AppProps, AppState> {

	urlInputRef: React.RefObject<HTMLInputElement>;
	webviewRef: React.RefObject<WebviewTag>;

	constructor(props: AppProps) {
		super(props);

		this.state = {
			url: "about:blank",
			homepage: normalizeUrl("duckduckgo.com")
		};

		this.urlInputRef = React.createRef();
		this.webviewRef = React.createRef();
	}

	componentDidMount() {
		this.navigateTo(this.state.homepage);

		const view = this.webviewRef.current;

		view.addEventListener("did-navigate", (event: Electron.DidNavigateEvent) => {
			// todo this isn't working
			this.setState({ url: event.url });
		});
	}

	componentWillUnmount() {
		// todo should remove the event listeners we added
	}
	
	navigateTo(url: string) {
		this.setState({ url: normalizeUrl(url) });
	}

	onUrlInputKeyDown = (event: React.KeyboardEvent) => {
		if (event.code === "Enter") {
			this.navigateTo(this.urlInputRef.current.value);
		}
	}

	render() {

		const { url } = this.state;

		return (
			<>
				<div id="omnibox">
					<button id="nav-back-button">⬅️</button>
					<button id="nav-forward-button">➡️</button>
					<button id="nav-refresh-button">↩️</button>
					<input ref={this.urlInputRef} id="url-input" type="text" defaultValue={url} onKeyPress={(e) => this.onUrlInputKeyDown(e)} />
				</div>
				<webview ref={this.webviewRef} id="main-webview" src={url}></webview>
			</>
		);
	}
}

ReactDOM.render(<App/>, document.body);