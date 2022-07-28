import { ComponentProps, forwardRef, LegacyRef } from "react";

type TextInputProps = {
  containerClassName?: string;
  className?: string;
  label?: string;
  left?: JSX.Element;
};

const TextInput = forwardRef(
  (
    {
      containerClassName,
      className,
      label,
      left,
      ...props
    }: TextInputProps & ComponentProps<"input">,
    ref: LegacyRef<HTMLInputElement>
  ) => (
    <div className={containerClassName}>
      {label && <label>{label}</label>}
      <div className="mt-1 flex">
        {left}
        <input
          ref={ref}
          className={"px-2 flex-1 bg-white border rounded-sm h-10 " + className}
          {...props}
        />
      </div>
    </div>
  )
);

export default TextInput;
