import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ArrowLeft, ArrowRight, RotateCw } from "react-feather";
import normalizeUrl from "normalize-url";
import { WebviewTag } from 'electron';
import "./index.css";


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
			<div className={`divide-y divide-purple-500 border-purple-500 flex flex-col h-full border`}>
				<div className={`region-drag flex-none flex pt-6 pb-2 px-4 bg-current space-x-2`}>
					{/* todo turn these buttons into an "icon button" component */}
					<button className={`stroke-current text-gray-900 dark:text-white`}><ArrowLeft/></button>
					<button className={`stroke-current text-gray-900 dark:text-white`}><ArrowRight/></button>
					<button className={`stroke-current text-gray-900 dark:text-white`}><RotateCw/></button>
					<input className={`flex-1 stroke-current text-gray-900 dark:text-white dark:bg-gray-800`} ref={this.urlInputRef} type="text" defaultValue={url} onKeyPress={(e) => this.onUrlInputKeyDown(e)} />
				</div>
				<webview ref={this.webviewRef} className={`flex-1`} src={url}></webview>
			</div>
		);
	}
}

ReactDOM.render(<App/>, document.body);