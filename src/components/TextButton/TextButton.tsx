import * as React from "react";
import clsx from "clsx";
import { ButtonBase } from "..";

export type TextButtonProps = {
}
	& React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

const TextButton: React.FC<TextButtonProps> = (props) => {
	return (
		<ButtonBase
			{...props}
			className={clsx(
				"stroke-current",
				"text-gray-900",
				"dark:text-white",
				// todo make this size configurable via prop?
				"h-8",
				"px-4",
				props.className
			)}>
			{props.children}
		</ButtonBase>
	);
};


export default TextButton;
