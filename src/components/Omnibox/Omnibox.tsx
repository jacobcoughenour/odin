import * as React from "react";
import clsx from "clsx";
import { useEffect } from "react";
import { IconButton } from "..";
import { Lock, Star } from "react-feather";

export type OmniboxProps = {
	focus: boolean;
	currentURL: string;
	onFocusLost?: React.FocusEventHandler<HTMLInputElement>;
	onURLInputKeyPressed?: (url: string, event?: React.KeyboardEvent) => void;
	onURLSubmit?: (url: string) => void;
	className?: string;
};

const Omnibox: React.FC<OmniboxProps> = ({
	focus,
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
			onURLInputKeyPressed &&
				onURLInputKeyPressed(ref.current.value, event);
		}
	};

	useEffect(() => {
		if (focus) {
			ref.current.value = currentURL;
			// put the cursor inside the text input
			ref.current.focus();
			// highlight all the text
			ref.current.select();
		}
	}, [focus]);

	return (
		<div
			className={clsx(
				"flex-1",
				"flex",
				"stroke-current",
				"text-gray-900",
				"dark:text-white",
				"dark:bg-gray-800",
				"focus:outline-none",
				"w-full",
				"max-w-sm",
				"rounded-lg",
				"px-1",
				className
			)}
		>
			<IconButton icon={Lock} size={14} className={"rounded-full"} />
			<input
				ref={ref}
				type="text"
				defaultValue={currentURL}
				onKeyPress={onKeyPress}
				onBlur={onFocusLost}
				className={clsx(
					"flex-1",
					"stroke-current",
					"bg-transparent",
					"text-gray-900",
					"dark:text-white",
					"focus:outline-none",
					"px-2",
					className
				)}
			/>
			<IconButton icon={Star} size={14} className={"rounded-full"} />
		</div>
	);
};

export default Omnibox;
