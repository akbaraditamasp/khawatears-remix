import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { GoAlert, GoCheck } from "react-icons/go";

export type FancyAlertAction = {
  toggle: Function;
};

type FancyAlertProps = {
  title?: string;
  message?: string;
  type: string;
  footer: any;
};

const FancyAlert = forwardRef(
  ({ title, message, type, footer }: FancyAlertProps, ref) => {
    const [show, setShow] = useState(false);
    const [showOpacity, setShowOpacity] = useState(false);

    useEffect(() => {
      let timeout: ReturnType<typeof setTimeout>;
      if (show) {
        timeout = setTimeout(() => {
          setShowOpacity(true);
        }, 100);
      }

      return () => {
        clearTimeout(timeout);
      };
    }, [show]);

    useEffect(() => {
      let timeout: ReturnType<typeof setTimeout>;
      if (!showOpacity) {
        timeout = setTimeout(() => {
          setShow(false);
        }, 300);
      }

      return () => {
        clearTimeout(timeout);
      };
    }, [showOpacity]);

    useImperativeHandle(
      ref,
      () =>
        ({
          toggle: () => {
            if (show) {
              setShowOpacity(false);
            } else {
              setShow(true);
            }
          },
        } as FancyAlertAction)
    );

    return show ? (
      <div
        className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-30 p-5"
        onClick={() => setShowOpacity(false)}
      >
        <div
          className={`w-full lg:w-96 bg-white rounded-sm transition-all duration-300 ${
            showOpacity ? "opacity-100" : "opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-center -mt-16">
            <div
              className={
                "rounded-full h-32 w-32 border-4 border-white flex justify-center items-center text-white " +
                (type === "success" ? "bg-green-600" : "bg-red-600")
              }
            >
              {type === "success" ? (
                <GoCheck size={76} />
              ) : (
                <GoAlert size={64} />
              )}
            </div>
          </div>
          <div className="monsterrat font-bold text-gray-700 px-5 pt-5 text-center text-2xl">
            {title}
          </div>
          <div className="px-5 text-center">{message}</div>
          {footer}
        </div>
      </div>
    ) : null;
  }
);

export default FancyAlert;
