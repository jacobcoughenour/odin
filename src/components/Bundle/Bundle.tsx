import * as React from 'react';
import BrowserViewProxy from '../BrowserViewProxy'

export type BundleProps = React.DetailedHTMLProps<React.HtmlHTMLAttributes<HTMLDivElement>, HTMLDivElement> & {

}

export type BundleState = {
	active: boolean,
	tabs: JSX.Element[]
}

class Bundle extends React.Component<BundleProps, BundleState> {
	constructor(props : BundleProps) {
		super(props);
		this.state = {
			active : true,
			tabs: [<BrowserViewProxy className={`flex-1`}  key={0} />]
		}
	}
// todo Will need to consider what we do with multiple browser views in terms of rendering them
	render () {
		return (
			<div className={`flex flex-1`}>
				{this.state.tabs[0]}
			</div>
		)
	}
}

export default Bundle;