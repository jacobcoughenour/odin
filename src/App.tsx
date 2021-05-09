import * as React from "react";
import * as ReactDOM from "react-dom";
import {
	ArrowLeft,
	ArrowRight,
	RotateCw,
	Plus,
	MoreVertical,
	User,
	X,
	ChevronDown,
	ChevronUp,
	Music,
	Minimize2,
} from "react-feather";
import {
	IconButton,
	Omnibox,
	BrowserViewProxy,
	TabButton,
	WindowButton,
} from "./components";
import { ipcRenderer } from "electron";
import "./index.css";
import clsx from "clsx";

type AppProps = {};

/**
 * This is the top-most state for our App component.
 */
type AppState = {
	window_mode: "normal" | "maximized" | "fullscreen";
	title_bar_style: "full" | "compact" | "extra-compact";
	/**
	 * The info for each tab stored by their ID. Use tab_order to get the order
	 * they are rendered in.
	 */
	tabs: { [key: string]: { title: string; url: string } };
	/**
	 * The order that the tabs are shown along the top of the window.
	 * This is a flat array with just the tab IDs. Use tabs to get the info for
	 * each tab.
	 */
	tab_order: string[];
	/**
	 * The ID of the active tab. The "active" tab is the one who's content is
	 * currently being rendered to the window.
	 */
	active_tab_id?: string;
	/**
	 * This is a visual toggle for showing or hiding the omnibox component.
	 */
	show_omnibox: boolean;
};

export class App extends React.Component<AppProps, AppState> {
	constructor(props: AppProps) {
		super(props);

		/**
		 * We use fake/defaults for our initial render. We will "hydrate" the
		 * state with it's real values from the main process after mount.
		 *
		 * Why:
		 * We need to fetch the real state from the main process. We would have
		 * to wait for the response if we did that now, slowing down our initial
		 * load time. We can't fetch it async since it would need to use
		 * setState() with the response and we can't call that before initial
		 * render.
		 **/
		this.state = {
			window_mode: "normal",
			title_bar_style: "compact",
			tabs: {},
			tab_order: [],
			show_omnibox: false,
		};
	}

	componentDidMount() {
		// register ipc event listeners
		ipcRenderer
			.on("active-tab-id", (_event, { active_tab_id }) => {
				this.setState({ active_tab_id });
			})
			.on("tab-list", (_event, { tabs, tab_order, active_tab_id }) => {
				this.setState({ tabs, tab_order, active_tab_id });
			})
			.on("url-update", (_event, { uuid, title, url }) => {
				this.setState((state) => {
					state.tabs[uuid].title = title;
					state.tabs[uuid].url = url;
					return state;
				});
			})
			.on("window-mode-update", (_event, { window_mode }) => {
				this.setState({ window_mode });
			});

		// now that we have rendered once and have our listeners setup, we get
		// the _entire_ state from the main process.
		ipcRenderer
			.invoke("hydrate")
			.then(({ tabs, tab_order, active_tab_id, window_mode }) => {
				this.setState({
					window_mode,
					tabs,
					tab_order,
					active_tab_id,
				});
			});
	}

	componentWillUnmount() {
		// todo should remove the event listeners we added
		// We'll want to remove them with ipcRenderer.removeListener() but
		// we need to store the listeners as their named methods to do that.
	}

	render() {
		const {
			tabs,
			tab_order,
			active_tab_id,
			show_omnibox,
			window_mode,
			title_bar_style,
		} = this.state;

		// get the current tab info but fallback to defaults if we need to.
		const current_tab = tabs[active_tab_id] || { url: "" };

		const is_maximized = window_mode === "maximized";
		const is_fullscreen = !is_maximized && window_mode === "fullscreen";

		const show_window_buttons = true;
		const window_buttons_left_side = false;
		const show_window_frame_border = false;

		const compact = is_fullscreen || title_bar_style !== "full";
		const extra_compact =
			is_fullscreen || title_bar_style === "extra-compact";

		const top_window_padding = !compact || extra_compact ? 0 : 16;

		const tap_height_offset = 4;

		return (
			<div
				className={clsx(
					"flex",
					"flex-col",
					"h-full",
					"border",
					show_window_frame_border
						? "border-purple-500"
						: "border-black",
					"rounded-sm",
					"overflow-hidden"
				)}
			>
				{/* Window Header */}
				<div
					className={clsx(
						"bg-current",
						"space-x-0",
						"flex",
						"border-b",
						"border-purple-500",
						compact
							? window_buttons_left_side
								? "flex-row-reverse"
								: "flex-row"
							: "flex-col-reverse"
					)}
				>
					<div
						className={clsx(
							"region-drag",
							"flex",
							"flex-1",
							show_window_buttons && compact
								? [
										"pt-4",
										window_buttons_left_side
											? "pl-0 pr-2"
											: "pl-2 pr-0",
								  ]
								: ["pt-2", "px-2"],
							"pb-0",
							"space-x-0"
						)}
						style={{
							paddingTop: tap_height_offset + top_window_padding,
						}}
					>
						{/* Nav buttons */}
						<IconButton icon={ArrowLeft} size={22} />
						<IconButton disabled icon={ArrowRight} size={22} />
						<IconButton
							onClick={() => {
								ipcRenderer.send("refresh-active-tab");
							}}
							icon={RotateCw}
							size={16}
							iconprops={{ strokeWidth: 2.2 }}
						/>
						{/* We wrap the tabs list and omnibox in this container so
						they share the same space and we toggle between them. */}
						<div
							className={clsx(
								"region-drag",
								"block",
								"relative",
								"h-10",
								"px-2",
								"flex-1"
							)}
							style={{
								marginTop: -tap_height_offset,
							}}
						>
							{/* Tabs list */}
							<div
								className={clsx(
									"region-drag",
									// show_omnibox && "opacity-50",
									show_omnibox && "hidden",
									"absolute",
									"flex",
									"w-full"
								)}
								style={{
									height: "calc(100% + 1px)",
								}}
							>
								{tab_order.map((id) => (
									<TabButton
										key={id}
										uuid={id}
										title={tabs[id].title}
										url={tabs[id].url}
										active={active_tab_id === id}
										onInactiveClick={() => {
											// tell main to switch to this tab
											ipcRenderer.send("set-active-tab", {
												uuid: id,
											});
										}}
										onActiveClick={() => {
											// We don't send anything to main
											// since this is visual only for now.
											// todo should we handle this in main?
											this.setState({
												show_omnibox: true,
											});
										}}
										onCloseClick={() => {
											// Tell main to close this tab.
											ipcRenderer.send("close-tab", {
												uuid: id,
											});
										}}
									/>
								))}
								{/* New-Tab button at the end of the list. */}
								<IconButton
									className={clsx(
										"ml-2",
										"mt-0.5",
										"mr-4",
										"flex-none"
									)}
									title="Create New Tab"
									onClick={() => {
										// Tell main to make a new tab.
										ipcRenderer.send("new-tab", {});
									}}
									icon={Plus}
									size={20}
								/>
							</div>
							{/* Omnibox container */}
							<div
								className={clsx(
									"absolute",
									"w-full",
									"flex",
									"justify-center",
									"mt-1",
									!show_omnibox && "hidden",
									"overflow-hidden"
								)}
							>
								<Omnibox
									focus={show_omnibox}
									currentURL={current_tab.url}
									onFocusLost={() => {
										// Hide the omnibox when the user is no
										// longer typing in it.
										this.setState({ show_omnibox: false });
									}}
									onURLSubmit={(url) => {
										this.setState({ show_omnibox: false });
										ipcRenderer.send("set-active-tab-url", {
											url,
										});
									}}
								/>
							</div>
						</div>
						<IconButton icon={Music} size={18} />
						<IconButton icon={User} size={18} />
						<IconButton
							icon={MoreVertical}
							size={18}
							onClick={() => {
								this.setState({
									title_bar_style:
										title_bar_style === "full"
											? "compact"
											: title_bar_style === "compact"
											? "extra-compact"
											: "full",
								});
							}}
						/>
					</div>
					<div
						className={clsx(
							"region-drag",
							"overflow-hidden",
							!show_window_buttons && "hidden",
							"p-1",
							"pb-0",
							"-mb-0.5",
							"flex",
							!window_buttons_left_side && "justify-end"
						)}
					>
						<WindowButton
							icon={ChevronDown}
							onClick={() => {
								ipcRenderer.send("minimize-window");
							}}
						/>
						<WindowButton
							icon={is_maximized ? Minimize2 : ChevronUp}
							onClick={() => {
								is_maximized
									? ipcRenderer.send("restore-window")
									: ipcRenderer.send("maximize-window");
							}}
						/>
						<WindowButton
							icon={X}
							className={"hover:bg-red-700"}
							onClick={() => {
								ipcRenderer.send("close-window");
							}}
						/>
					</div>
				</div>
				{/* We use a proxy to tell main where the tab's BrowserView 
					should be rendered relative to the DOM. */}
				<BrowserViewProxy
					viewid={active_tab_id}
					className={`flex flex-1`}
				/>
			</div>
		);
	}
}

// Attach the app component to the DOM.
ReactDOM.render(<App />, document.getElementById("react-root"));
