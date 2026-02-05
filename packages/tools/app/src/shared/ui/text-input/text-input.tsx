import type { InputHTMLAttributes } from "react";
import clsx from "clsx";
import styles from "./text-input.module.css";

type TextInputProps = InputHTMLAttributes<HTMLInputElement>;

export const TextInput = ({ className, ...props }: TextInputProps) => {
  return (
    <input
      {...props}
      className={clsx(styles.input, className)}
    />
  );
};
