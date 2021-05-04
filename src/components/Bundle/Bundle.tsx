import * as React from "react";
import BrowserViewProxy from "../BrowserViewProxy";

export type BundleProps = React.DetailedHTMLProps<
	React.HtmlHTMLAttributes<HTMLDivElement>,
	HTMLDivElement
> & {};

export type BundleState = {
	active: boolean;
};

class Bundle extends React.Component<BundleProps, BundleState> {
	constructor(props: BundleProps) {
		super(props);
		this.state = {
			active: true,
		};
	}
	// todo Will need to consider what we do with multiple browser views in terms of rendering them
	render() {
		return <div className={`flex flex-1`}></div>;
	}
}

export default Bundle;
