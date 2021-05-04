import * as React from "react";
import * as ReactDOM from "react-dom";
import { ArrowLeft, ArrowRight, RotateCw, Plus } from "react-feather";
import {
	IconButton,
	Omnibox,
	BrowserViewProxy,
	TabButton,
	TabButtonProps,
} from "./components";
import normalizeUrl from "normalize-url";
import { BrowserView, ipcRenderer } from "electron";
import "./index.css";
import clsx from "clsx";

type AppProps = {};

type AppState = {
	url: string;
	homepage: string;
	tabs: { uuid: string; title: string }[];
	active_tab_id?: string;
	show_omnibox: boolean;
};

export class App extends React.Component<AppProps, AppState> {
	urlInputRef: React.RefObject<HTMLInputElement>;
	// browserViewProxyRef: React.RefObject<BrowserViewProxy>;

	constructor(props: AppProps) {
		super(props);

		this.state = {
			url: "about:blank",
			homepage: normalizeUrl("duckduckgo.com"),
			tabs: [],
			show_omnibox: false,
		};

		this.urlInputRef = React.createRef();
		// this.browserViewProxyRef = React.createRef();
	}

	componentDidMount() {
		this.navigateTo(this.state.homepage);

		ipcRenderer.on("updateViewId", (event, args) => {
			this.setState({
				active_tab_id: args.viewid,
			});
		});

		ipcRenderer.on("tab-list", (event, args) => {
			this.setState({
				tabs: args.tabs,
			});
		});
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
	};

	createTab = () => {
		const url = normalizeUrl("duckduckgo.com");

		ipcRenderer.send("new-tab", {});
	};

	refresh = () => {
		ipcRenderer.send("refresh");
	};

	render() {
		const { url, tabs, active_tab_id, show_omnibox } = this.state;

		return (
			<div className={`border-purple-500 flex flex-col h-full border`}>
				<div
					className={`region-drag flex-none flex border-purple-500 border-b pt-6 pb-2 px-4 bg-current space-x-0`}
				>
					<IconButton icon={ArrowLeft} size={22} />
					<IconButton disabled icon={ArrowRight} size={22} />
					<IconButton
						onClick={() => this.refresh()}
						icon={RotateCw}
						size={16}
						iconprops={{ strokeWidth: 2.2 }}
					/>
					<div className={"block h-8 px-2"}>
						<div
							className={clsx(
								"absolute",
								// "bg-green-800",
								"h-12",
								show_omnibox && "hidden"
							)}
						>
							{tabs.map((e) => (
								<TabButton
									uuid={e.uuid}
									title={e.uuid}
									key={e.uuid}
									active={active_tab_id === e.uuid}
									onInactiveClick={() => {
										ipcRenderer.send("render-existing", {
											uuid: e.uuid,
										});

										this.setState({
											active_tab_id: e.uuid,
										});
									}}
									onActiveClick={() => {
										this.setState({ show_omnibox: true });
									}}
									onCloseClick={() => {
										ipcRenderer.send("close-tab", {
											uuid: e.uuid,
										});
									}}
								/>
							))}
							<IconButton
								onClick={() => this.createTab()}
								icon={Plus}
								size={20}
							/>
						</div>
						<div
							className={clsx(
								"absolute",
								!show_omnibox && "hidden"
							)}
						>
							<Omnibox
								onBlur={() => {
									this.setState({ show_omnibox: false });
								}}
							/>
						</div>
					</div>
				</div>
				<BrowserViewProxy
					viewid={this.state.active_tab_id}
					className={`flex flex-1`}
				/>
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById("react-root"));
