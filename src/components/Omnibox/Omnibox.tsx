import * as React from "react";
import clsx from "clsx";

export type OmniboxProps = {
	onClose?: Function
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

const Omnibox: React.FC<OmniboxProps> = React.forwardRef((props, ref) => (
	<input
		ref={ref}
		type="text"
		{...props}
		className={clsx(
			"flex-1",
			"stroke-current",
			"text-gray-900",
			"dark:text-white",
			"dark:bg-gray-800",
			"focus:outline-none",
			"focus:ring",
			"focus:border-current",
			props.className
		)}
	/>
));

export default Omnibox;
