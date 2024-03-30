import { useEffect, useRef } from "react";

type ICallbackFunction = (...args: any[]) => void;

export const useDebouncedFunction = <CallbackType extends ICallbackFunction>(
	callback: CallbackType,
	delay: number
): CallbackType => {
	const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const clearTimer = () => {
		if (!timeoutIdRef.current) return;
		clearTimeout(timeoutIdRef.current);
		timeoutIdRef.current = null;
	};

	const call = (...args: any[]) => {
		clearTimer();
		timeoutIdRef.current = setTimeout(() => callback(...args), delay);
	};

	useEffect(() => {
		return clearTimer();
	}, []);

	return call as CallbackType;
};
