import { forwardRef, Fragment, useImperativeHandle, useState } from "react";
import { FaTimes } from "react-icons/fa";

export type ModalType = {
  toggle: Function;
};

type ModalProps = {
  children?: JSX.Element;
  title?: string;
};

const Modal = forwardRef(({ children, title }: ModalProps, ref) => {
  const [show, setShow] = useState(false);

  useImperativeHandle(
    ref,
    () =>
      ({
        toggle: () => setShow((value) => !value),
      } as ModalType),
    []
  );

  return (
    <Fragment>
      <div
        className={`bg-black bg-opacity-50 fixed top-0 left-0 w-full h-full z-30 ${
          show ? "block" : "hidden"
        }`}
        onClick={() => setShow(false)}
      />
      <div
        className={`fixed top-0 left-0 w-full h-full z-30 flex justify-center items-center p-5 transform ${
          show ? "translate-y-0" : "-translate-y-full"
        } transition-all pointer-events-none`}
      >
        <div
          className={`bg-white w-full lg:w-1/2 rounded-sm pointer-events-auto max-h-full flex flex-col`}
        >
          <div className="flex items-center p-5 border-b">
            <div className="flex-1 text-gray-800 font-bold text-lg">
              {title}
            </div>
            <button
              type="button"
              className="py-2 px-5 -mr-5"
              onClick={() => setShow(false)}
            >
              <FaTimes />
            </button>
          </div>
          <div className="p-5 flex-1 overflow-auto">{children}</div>
        </div>
      </div>
    </Fragment>
  );
});

export default Modal;
