import { useCallback, useEffect, useRef } from "react";

type Callback = () => void | any;

export const useInterval = (callback: Callback, delay: number) => {
    const savedCallback = useRef<Callback>();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            if (savedCallback.current) {
                savedCallback.current();
            }
        }

        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
};

export const useInit = (callback: Callback) => {
    const ref = useRef(false);
    useEffect(() => {
        if (!ref.current) {
            ref.current = true;
            callback();
        }
    });
};

export const useOnKeyboard = (key: string, callback?: () => void) => {
    const handleKeyPress = useCallback((event) => {
        if (key === `${event.key}`) {
            if (callback) {
                callback();
            }
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", handleKeyPress);
        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [handleKeyPress]);
};
