import * as React from "react";
import clsx from "clsx";
import { MouseEventHandler } from "react";
import { X } from "react-feather";
import omit from "object.omit";

export type TabButtonProps = {
	uuid: string;
	icon?: string;
	title: string;
	url: string;
	active: boolean;
	onInactiveClick?: MouseEventHandler<HTMLButtonElement>;
	onActiveClick?: MouseEventHandler<HTMLButtonElement>;
	onCloseClick?: MouseEventHandler<HTMLButtonElement>;
	className?: string;
};

const TabButton: React.FC<TabButtonProps> = (props) => {
	let onTabClick = (e: React.MouseEvent<any, MouseEvent>) => {
		if (props.active) props.onActiveClick && props.onActiveClick(e);
		else props.onInactiveClick && props.onInactiveClick(e);
	};

	let onTabAuxClick = (e: React.MouseEvent<any, MouseEvent>) => {
		// close on middle click
		if (e.button === 1) props.onCloseClick && props.onCloseClick(e);
	};

	let onTabCloseClick = (e: React.MouseEvent<any, MouseEvent>) => {
		props.onCloseClick && props.onCloseClick(e);
		e.stopPropagation();
	};

	return (
		<button
			{...omit(props, [
				"onInactiveClick",
				"onActiveClick",
				"onCloseClick",
				"active",
			])}
			title={`${props.title}\n${props.url}`}
			onClick={onTabClick}
			onAuxClick={onTabAuxClick}
			className={clsx(
				"focus:outline-none",
				// "focus:bg-gray-700",
				// "hover:bg-gray-000",
				"stroke-current",
				"inline-flex",
				"px-2",
				"py-2",
				"box-content",
				"border",
				"rounded-t-lg",
				"border-b-0",
				"border-transparent",
				props.active
					? [
							"bg-black",
							"text-black",
							"dark:text-white",
							"border-purple-500",
					  ]
					: [
							"bg-transparent",
							"text-gray-900",
							"dark:text-gray-400",
							"hover:border-purple-600",
					  ],
				props.className
			)}
			style={{ marginLeft: -1 }}
		>
			{/* todo put favicon here */}
			<span
				className={clsx(
					"ml-2",
					"cursor-pointer",
					"overflow-clip",
					"whitespace-nowrap",
					"overflow-hidden",
					"text-left"
				)}
				style={{
					maxWidth: 160,
					width: 160,
					// this adds that fading out when the tab title is truncated
					WebkitMaskImage:
						"-webkit-gradient(linear, 80% 0%, 100% 0%, from(rgb(0, 0, 0)), to(rgba(0, 0, 0, 0)))",
				}}
			>
				{props.title}
			</span>
			{props.onCloseClick && (
				<span className={clsx("cursor-pointer")}>
					<X
						onClick={onTabCloseClick}
						size={18}
						fontWeight={2.0}
						className={clsx(
							"inline",
							"hover:bg-gray-700",
							"rounded-full",
							"p-0.5",
							"cursor-pointer"
						)}
					/>
				</span>
			)}
		</button>
	);
};

export default TabButton;
