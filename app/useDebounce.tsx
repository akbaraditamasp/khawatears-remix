import { useCallback } from "react";

type Props = {
  callback: Function;
  seconds?: number;
};

function debounce({ callback = (text: string) => {}, seconds = 1000 }: Props) {
  let timeout: any;

  return (text: string) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      callback(text);
    }, seconds);
  };
}

const useDebounce = ({ ...props }: Props) =>
  useCallback(debounce({ ...props }), []);

export default useDebounce;
