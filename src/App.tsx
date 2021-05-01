import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ArrowLeft, ArrowRight, RotateCw, Plus } from "react-feather";
import { IconButton, Omnibox, Bundle } from "./components";
import normalizeUrl from "normalize-url";
import { ipcRenderer } from 'electron';
import "./index.css";


type AppProps = {};

type AppState = {
	url: string
	homepage: string
}

export class App extends React.Component<AppProps, AppState> {

	urlInputRef: React.RefObject<HTMLInputElement>;
	// browserViewProxyRef: React.RefObject<BrowserViewProxy>;

	constructor(props: AppProps) {
		super(props);

		this.state = {
			url: "about:blank",
			homepage: normalizeUrl("duckduckgo.com")
		};

		this.urlInputRef = React.createRef();
		// this.browserViewProxyRef = React.createRef();
	}

	componentDidMount() {
		this.navigateTo(this.state.homepage);

		// const view = this.browserViewProxyRef.current;

		// view.addEventListener("did-navigate", (event: Electron.DidNavigateEvent) => {
		// 	// todo this isn't working
		// 	this.setState({ url: event.url });
		// });
	}

	componentWillUnmount() {
		// todo should remove the event listeners we added
	}
	
	navigateTo(url: string) {
		this.setState({ url: normalizeUrl(url) });
	}

	// todo move some of this stuff to the Omnibox component
	onUrlInputKeyDown = (event: React.KeyboardEvent) => {
		if (event.code === "Enter") {
			this.navigateTo(this.urlInputRef.current.value);
		}
	}

	createTab = () => {
		const url = normalizeUrl('duckduckgo.com');
		// ipcRenderer.send('new-tab', {
		// 	url: url,
		// 	height: this.browserViewProxyRef.current.clientHeight,
		// 	width: this.browserViewProxyRef.current.clientWidth,
		// });
	}

	refresh = () => {
		ipcRenderer.send('refresh');
	}

	render() {
		const { url } = this.state;

		return (
			<div className={`divide-y divide-purple-500 border-purple-500 flex flex-col h-full border`}>
				<div className={`region-drag flex-none flex pt-6 pb-2 px-4 bg-current space-x-2`}>
					<IconButton><ArrowLeft/></IconButton>
					<IconButton><ArrowRight/></IconButton>
					<IconButton onClick={() => this.refresh()}><RotateCw /></IconButton>
					<IconButton onClick={() => this.createTab()}><Plus/></IconButton>
					<Omnibox ref={this.urlInputRef} defaultValue={url} onKeyPress={(e) => this.onUrlInputKeyDown(e)} />
				</div>
				<Bundle className={`flex flex-1`}/>
			</div>
		);
	}
}

ReactDOM.render(<App/>, document.getElementById("react-root"));