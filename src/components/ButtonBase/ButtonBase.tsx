import * as React from "react";
import clsx from "clsx";

export type ButtonBaseProps = {
	disabled?: boolean;
	className?: string;
};

export function getStyle<T>(props: ButtonBaseProps & T): string {
	return clsx(
		"bg-transparent",
		"rounded-md",
		"focus:outline-none",
		"focus:bg-gray-700",
		!props.disabled && "hover:bg-gray-700",
		props.disabled && "opacity-50",
		props.className
	);
}

type HTMLButtonProps = React.DetailedHTMLProps<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
>;

const ButtonBase: React.FC<ButtonBaseProps & HTMLButtonProps> = (props) => (
	<button {...props} className={getStyle<HTMLButtonProps>(props)}>
		{props.children}
	</button>
);

type HTMLAnchorProps = React.DetailedHTMLProps<
	React.AnchorHTMLAttributes<HTMLAnchorElement>,
	HTMLAnchorElement
>;

export const ButtonBaseAnchor: React.FC<ButtonBaseProps & HTMLAnchorProps> = (
	props
) => (
	<a {...props} className={getStyle<HTMLAnchorProps>(props)}>
		{props.children}
	</a>
);

export default ButtonBase;
