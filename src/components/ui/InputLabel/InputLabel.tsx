import React, { forwardRef, ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InputWithLabelProps {
  label: ReactNode;
  defaultValue?: string;
  value?: string; // controlled value
  disabled?: boolean;
  type?: "text" | "number" | "password";
  suffix?: ReactNode;
  id?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const InputWithLabel = forwardRef<HTMLInputElement, InputWithLabelProps>(
  (
    {
      label,
      defaultValue,
      value,
      disabled = false,
      type = "text",
      suffix,
      id,
      placeholder,
      onChange,
      className,
    },
    ref
  ) => {
    return (
      <div className={`grid w-full items-center gap-3 ${className ?? ""}`}>
        <Label htmlFor={id}>{label}</Label>

        <div className="flex items-center gap-2">
          <Input
            id={id}
            ref={ref}
            type={type}
            placeholder={placeholder}
            defaultValue={defaultValue}
            value={value}
            disabled={disabled}
            onChange={onChange}
            className="flex-1"
          />

          {suffix ? <div className="ml-2">{suffix}</div> : null}
        </div>
      </div>
    );
  }
);

InputWithLabel.displayName = "InputWithLabel";

export default InputWithLabel;
