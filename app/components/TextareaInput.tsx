import { ComponentProps, forwardRef, LegacyRef } from "react";

type TextareaInputProps = {
  containerClassName?: string;
  className?: string;
  label?: string;
};

const TextareaInput = forwardRef(
  (
    {
      containerClassName,
      className,
      label,
      ...props
    }: TextareaInputProps & ComponentProps<"textarea">,
    ref: LegacyRef<HTMLTextAreaElement>
  ) => (
    <div className={containerClassName}>
      {label && <label>{label}</label>}
      <textarea
        ref={ref}
        className={"mt-1 bg-white border rounded-sm w-full p-2 " + className}
        {...props}
      />
    </div>
  )
);

export default TextareaInput;
