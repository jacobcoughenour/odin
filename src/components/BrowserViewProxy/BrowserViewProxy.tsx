import * as React from "react";
import clsx from "clsx";
import { ipcRenderer } from 'electron';

export type BrowserViewProxyProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
};
export type BrowserViewProxyState = {
	viewid: string;
}

class BrowserViewProxy extends React.Component<BrowserViewProxyProps, BrowserViewProxyState> {

	divRef: React.RefObject<HTMLDivElement>;
	resizeObserver: ResizeObserver;

	constructor(props: BrowserViewProxyProps) {
		super(props);
		this.divRef = React.createRef();

		this.state = {
			viewid: ''
		};
	}

	componentDidMount() {
		this.resizeObserver = new ResizeObserver(this.onResizeEvent);
		this.resizeObserver.observe(this.divRef.current);

		ipcRenderer.on('updateViewId', (event, args) => {
			this.setState({
				viewid: args.viewid
			});

			this.sendBounds(this.divRef.current);
		})
	}

	componentWillUnmount() {
		this.resizeObserver.unobserve(this.divRef.current);
	}

	onResizeEvent: ResizeObserverCallback = (entries: ResizeObserverEntry[]) => {
		this.sendBounds(entries[0].target);
	}

	sendBounds(target: Element) {
		const rect = target.getBoundingClientRect();
		ipcRenderer.send('update-browser-view-bounds', {
			id: this.state.viewid,
			x: rect.x,
			y: rect.y,
			w: rect.width,
			h: rect.height
		});
	}

	render() {
		return (<div
			ref={this.divRef}
			{...this.props}
		/>);
	}
}


export default BrowserViewProxy;
