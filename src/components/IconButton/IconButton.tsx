import * as React from "react";
import clsx from "clsx";

export type IconButtonProps = {

} & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

const IconButton: React.FC<IconButtonProps> = (props) => (
	<button
		className={clsx(
			"stroke-current",
			"text-gray-900",
			"dark:text-white",
			props.className
		)}
		{...props}
	>{props.children}</button>
)

export default IconButton;
