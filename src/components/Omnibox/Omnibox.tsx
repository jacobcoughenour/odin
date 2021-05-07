import * as React from "react";
import clsx from "clsx";

export type OmniboxProps = {
	currentURL: string;
	onFocusLost?: React.FocusEventHandler<HTMLInputElement>;
	onURLInputKeyPressed?: (url: string, event?: React.KeyboardEvent) => void;
	onURLSubmit?: (url: string) => void;
	className?: string;
};

const Omnibox: React.FC<OmniboxProps> = ({
	currentURL,
	onFocusLost,
	onURLInputKeyPressed,
	onURLSubmit,
	className,
}) => {
	let ref = React.useRef<HTMLInputElement>();

	let onKeyPress = (event: React.KeyboardEvent) => {
		if (event.code === "Enter") {
			onURLSubmit && onURLSubmit(ref.current.value);
		} else {
			onURLInputKeyPressed(ref.current.value, event);
		}
	};

	return (
		<input
			ref={ref}
			type="text"
			defaultValue={currentURL}
			onKeyPress={onKeyPress}
			onBlur={onFocusLost}
			className={clsx(
				"flex-1",
				"stroke-current",
				"text-gray-900",
				"dark:text-white",
				"dark:bg-gray-800",
				"focus:outline-none",
				"focus:ring",
				"focus:border-current",
				className
			)}
		/>
	);
};

export default Omnibox;
