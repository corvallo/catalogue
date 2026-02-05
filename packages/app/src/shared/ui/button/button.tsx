import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import styles from "./button.module.css";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "ghost" | "solid";
};

export const Button = ({ variant = "solid", className, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className={clsx(styles.button, styles[variant], className)}
    />
  );
};
