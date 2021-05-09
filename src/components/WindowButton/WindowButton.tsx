import * as React from "react";
import clsx from "clsx";
import { ButtonBase } from "..";
import { Icon } from "react-feather";

export type WindowButtonProps = {
	icon: Icon;
} & React.DetailedHTMLProps<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
>;

const WindowButton: React.FC<WindowButtonProps> = (props) => {
	const IconComp = props.icon;

	return (
		<ButtonBase
			{...props}
			className={clsx(
				"stroke-current",
				"text-gray-900",
				"dark:text-white",
				// todo make this size configurable via prop?
				"h-7",
				"w-7",
				"focus:bg-transparent",
				"overflow-hidden",
				props.className
			)}
		>
			<IconComp
				size={18}
				color={props.color}
				className={clsx("inline", "pointer-events-none")}
			/>
		</ButtonBase>
	);
};

export default WindowButton;
