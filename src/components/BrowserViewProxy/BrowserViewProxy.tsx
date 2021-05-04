import * as React from "react";
import clsx from "clsx";
import { ipcRenderer } from "electron";

export type BrowserViewProxyProps = {
	viewid: string;
} & React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLDivElement>,
	HTMLDivElement
>;
export type BrowserViewProxyState = {};

class BrowserViewProxy extends React.Component<
	BrowserViewProxyProps,
	BrowserViewProxyState
> {
	divRef: React.RefObject<HTMLDivElement>;
	resizeObserver: ResizeObserver;

	constructor(props: BrowserViewProxyProps) {
		super(props);
		this.divRef = React.createRef();
	}

	componentDidUpdate() {
		this.sendBounds(this.divRef.current);
	}

	componentDidMount() {
		this.resizeObserver = new ResizeObserver(this.onResizeEvent);
		this.resizeObserver.observe(this.divRef.current);
	}

	componentWillUnmount() {
		this.resizeObserver.unobserve(this.divRef.current);
	}

	onResizeEvent: ResizeObserverCallback = (
		entries: ResizeObserverEntry[]
	) => {
		this.sendBounds(entries[0].target);
	};

	sendBounds(target: Element) {
		const rect = target.getBoundingClientRect();
		if (this.props.viewid)
			ipcRenderer.send("update-browser-view-bounds", {
				id: this.props.viewid,
				x: rect.x,
				y: rect.y,
				w: rect.width,
				h: rect.height,
			});
	}

	render() {
		return <div ref={this.divRef} {...this.props} />;
	}
}

export default BrowserViewProxy;
