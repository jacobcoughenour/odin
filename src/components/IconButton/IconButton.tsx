import * as React from "react";
import clsx from "clsx";
import { ButtonBase } from "..";
import { Icon, IconProps } from "react-feather";

export type IconButtonProps = {
	icon: Icon;
	iconprops?: React.SVGAttributes<SVGElement>;
} & IconProps &
	React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	>;

const IconButton: React.FC<IconButtonProps> = (props) => {
	const IconComp = props.icon;

	return (
		<ButtonBase
			{...props}
			className={clsx(
				"stroke-current",
				"text-gray-900",
				"dark:text-white",
				// todo make this size configurable via prop?
				"h-8",
				"w-8",
				props.className
			)}
		>
			<IconComp
				size={props.size}
				color={props.color}
				className={clsx(
					"inline",
					"pointer-events-none",
					props.iconprops?.className
				)}
			/>
		</ButtonBase>
	);
};

export default IconButton;
